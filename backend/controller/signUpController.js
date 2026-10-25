// Controller for user Signup page

const UserModel = require('../models/signUpModel')
const bcrypt = require('bcrypt')
const UserOtpVerificationModel = require('../models//userOtpVerificationModel')
const nodemailer = require('nodemailer')

// Masking Email
const maskEmail = async (email) => {
  const atIndex = email.indexOf('@')
  if (atIndex <= 1) {
    return email // If the "@" symbol is at index 0 or 1, return the original email as it cannot be masked.
  }
  const emailFront = email.substring(0, atIndex)

  const maskedUsername =
    emailFront.substring(0, 1) +
    '*'.repeat(emailFront.length - 3) +
    emailFront.slice(-2)

  const domain = email.substring(atIndex)

  const result = maskedUsername + domain

  return result
}

// OTP Code Hasher
const generateOtp = async (otp_Code) => {
  const hashed_otpCode = await bcrypt.hash(String(otp_Code), 10)
  return hashed_otpCode
}

// Mail SENDER - Create a transporter with Gmail SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Function to send an email
const sendEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject: 'Verify Email ! Library Management System',
      html: `<p>Your OTP Code is <strong>${otp}</strong>. This will expire in 60 seconds!</p>`,
    }

    const info = await transporter.sendMail(mailOptions)
    // console.log('Email sent:', info.envelope)
    // console.log('Email sent:', info)
  } catch (error) {
    console.error('Error:', error)
    return false
  }

  return true
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const postUserSignup = async (req, res) => {
  const { username, phone, userType, password } = req.body
  const email = typeof req.body.email === 'string'
    ? req.body.email.trim().toLowerCase()
    : ''

  // Alphanumeric password validation with Special character
  const alphanumericRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

  if (typeof password !== 'string' || !password.match(alphanumericRegex)) {
    return res.status(400).json({
      success: false,
      message:
        'Password must be alphanumeric and contain at least one special character.',
    })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required.',
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // Check if user already registered
  const checkPrevUser = await UserModel.findOne({
    email: new RegExp(`^${escapeRegExp(email)}$`, 'i'),
  }).select('-password')

  if (checkPrevUser) {
    if (!checkPrevUser.emailVerified) {
      await UserModel.findByIdAndUpdate(checkPrevUser.id, {
        emailVerified: true,
      })
    }
    return res.status(200).json({
      success: true,
      message: `Account already Exists, Goto Login`,
      GOTO_LOGIN: true,
    })
  }

  await UserModel.create({
    username,
    email,
    password: hashedPassword,
    phone,
    userType,
    emailVerified: true,
  })

  return res.status(201).json({
    success: true,
    message: 'Account created successfully. You can now log in.',
  })
}

const verifyEmail = async (req, res) => {
  const userInputOtp = req.body.otpCode

  const userId = req.cookies['otp-cookie']

  if (!userId || !userInputOtp) {
    return res
      .status(400)
      .json({ success: false, message: `Please enter your OTP Code` })
  }

  const UserOtpData = await UserOtpVerificationModel.findOne({ userId })

  if (!UserOtpData) {
    return res.status(400).json({
      success: false,
      message: 'No active verification code was found. Request a new code.',
    })
  }

  if (new Date() > UserOtpData.expiresAt) {
    return res.status(400).json({ success: false, message: `Otp Code Expired` })
  }

  const validateOtp = await bcrypt.compare(userInputOtp, UserOtpData.otpCode)

  if (!validateOtp) {
    return res.status(400).json({ success: false, message: `Invalid Otp Code` })
  }

  await UserModel.findByIdAndUpdate(userId, { emailVerified: true })

  return res
    .status(200)
    .json({ success: true, message: `Email Verified Successfully` })
}

const resendOtpCode = async (req, res) => {
  const userId = req.cookies['otp-cookie']

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'Signup session not found. Please sign up again.',
    })
  }

  const getUserData = await UserModel.findById({ _id: userId })

  if (!getUserData) {
    return res.status(404).json({
      success: false,
      message: 'Account not found. Please sign up again.',
    })
  }

  if (getUserData.emailVerified == true) {
    return res.status(200).json({
      success: true,
      message: `Email already Verified ! Goto LOGIN`,
      ENTER_OTP: true,
    })
  }

  const getTokenData = await UserOtpVerificationModel.findOne({ userId })

  if (!getTokenData) {
    const otp_Code = Math.floor(Math.random() * 9000 + 1000)
    const hashed_otpCode = await generateOtp(otp_Code)
    await UserOtpVerificationModel.create({
      userId,
      userEmail: getUserData.email,
      otpCode: hashed_otpCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60),
    })
    const maskedEmail = await maskEmail(getUserData.email)
    const emailSent = await sendEmail(getUserData.email, otp_Code)
    if (!emailSent) {
      return res.status(503).json({
        success: false,
        message: 'The verification email could not be sent. Please try again.',
      })
    }

    res.status(200).json({
      success: true,
      message: `OTP Verification code re-sent to email ${maskedEmail}`,
      ENTER_OTP: true,
    })
    return
  }

  // OTP Code isnt Expired yet so , dont send another OTP (Handle SPAMS)
  if (new Date() < getTokenData.expiresAt) {
    return res.status(200).json({
      success: true,
      message: `OTP Code Already Sended !`,
      ENTER_OTP: true,
    })
  }

  const otp_Code = Math.floor(Math.random() * 9000 + 1000)
  const hashed_otpCode = await generateOtp(otp_Code)

  await UserOtpVerificationModel.findOneAndUpdate(
    { userId: userId },
    {
      otpCode: hashed_otpCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60),
    }
  )

  const { email } = getUserData
  const maskedEmail = await maskEmail(email)

  const emailSent = await sendEmail(email, otp_Code)
  if (!emailSent) {
    return res.status(503).json({
      success: false,
      message: 'The verification email could not be sent. Please try again.',
    })
  }

  res.status(200).json({
    success: true,
    message: `OTP Verification code re-sended to email ${maskedEmail}`,
    ENTER_OTP: true,
  })
}

module.exports = {
  postUserSignup,
  verifyEmail,
  resendOtpCode,
  sendEmail,
  generateOtp,
  maskEmail,
}
