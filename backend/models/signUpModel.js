// This is the User's Module
const mongoose = require('mongoose')

const signUpScheme = mongoose.Schema({
  username: {
    type: String,
    minlength: 5,
    maxlength: 20,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: [true, 'email already exists'],

    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      },
      message: 'Invalid email format.',
    },
  },

  emailVerified: {
    type: Boolean,
    default: true,
  },

  phone: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 11,
    validate: {
      validator: function (value) {
        return /^01[3-9]\d{8}$/.test(value)
      },
      message: 'Enter a valid 11-digit Bangladesh mobile number.',
    },
  },
  userType: {
    type: String,
    default: 'normal_user',
  },
  totalRequestedBooks: {
    type: Number,
    default: 0,
  },
  totalAcceptedBooks: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
})

// Pre-save hook to convert input values to lowercase/uppercase
signUpScheme.pre('save', function (next) {
  this.username = this.username.toLowerCase()

  // Normalize the email domain.
  const emailParts = this.email.split('@')
  const firstEmailPart = emailParts[0]
  const secondEmailPart = emailParts[1].toLowerCase()

  this.email = firstEmailPart + '@' + secondEmailPart

  next()
})

module.exports = mongoose.model('UserDetails', signUpScheme)
