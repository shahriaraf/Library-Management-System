const express = require('express')
const booksRouter = express.Router()

const os = require('os')
const multer = require('multer')

// Vercel's filesystem is read-only except /tmp.
// Locally, keep using the 'uploads/' folder as before.
const uploadDir = process.env.VERCEL ? os.tmpdir() : 'uploads/'
const upload = multer({ dest: uploadDir })

const {
  getAllBooks,
  postBook,
  getSingleBook,
  patchBook,
  deleteBook,
} = require('../controller/booksController')

// Middlewares
const verifyToken = require('../middleware/verifyToken')
const adminAuthorization = require('../middleware/adminAuth')
const updateBookImage = require('../controller/bookImageUpdateController')

booksRouter
  .route('/')
  .get(getAllBooks)
  .post(verifyToken, adminAuthorization, upload.single('image'), postBook)

booksRouter
  .route('/:id')
  .get(getSingleBook)
  .patch(verifyToken, adminAuthorization, patchBook)
  .delete(verifyToken, adminAuthorization, deleteBook)

// Updating book Image
// Old Image File location replaced with new image file location and old image file is deleted from 'uploads' folder
booksRouter
  .route('/updateImage/:id')
  .patch(
    verifyToken,
    adminAuthorization,
    upload.single('image'),
    updateBookImage
  )

module.exports = booksRouter