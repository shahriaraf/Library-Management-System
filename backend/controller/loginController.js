// controlling login Methods

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

// SignUp model ma vako scheme use garera login credentials CrossCheck
const UserModels = require('../models/signUpModel')

const postUserLogin = async (req, res) => {
  // Normalize the email before looking it up in the database.
  const email = typeof req.body.email === 'string'
    ? req.body.email.trim().toLowerCase()
    : ''

  const result = await UserModels.findOne({
    email: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
  }).select('+password')

  if (!result) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: `Invalid email or password` })
  }

  const validate_password = await bcrypt.compare(
    req.body.password,
    result.password
  )
  if (!validate_password) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Invalid email or password' })
  }

  if (!result.emailVerified) {
    await UserModels.findByIdAndUpdate(result._id, { emailVerified: true })
  }

  // Generating json web token on success login
  const jwt_token = await jwt.sign(
    {
      id: result._id,
      username: result.username,
      email,
      userType: result.userType,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFE,
    }
  )

  res.cookie('access-cookie', jwt_token, {
    path: '/',
    //1000ms * sec * min * hr ->
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    httpOnly: true,

    // allows get request from same site or external site but , POST from external sites cookie wont be sent
    sameSite: 'lax',
  })

  // Generating Refresh Token
  const refresh_token = await jwt.sign(
    {
      id: result._id,
      username: result.username,
      email,
      userType: result.userType,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_LIFE,
    }
  )

  res.cookie('refresh-cookie', refresh_token, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), //365days Cookie Expiry
    httpOnly: true,
    sameSite: 'lax',
  })

  return res.status(StatusCodes.OK).json({
    success: true,
    userType: result.userType,
  })
}

module.exports = postUserLogin
