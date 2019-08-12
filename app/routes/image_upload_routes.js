// ImageUpload Model Routes
const express = require('express')

const router = express.Router()
const multer = require('multer')
const upload = multer()
const uploadImage = require('../../lib/s3UploadApi')
const ImageUpload = require('../models/image_upload')

// Basic POST Routes
router.post('/image-uploads', upload.single('file'), (req, res, next) => {
  uploadImage(req.file)
    .then(awsRes => {
      return ImageUpload.create({
        url: awsRes.Location,
        name: awsRes.Key,
        type: req.file.mimetype
      })
    })
    .then(data => res.status(201).json({
      imageUpload: data.toObject()
    }))
    .catch(next)
})

module.exports = router
