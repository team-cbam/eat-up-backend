// ImageUpload Model Routes
const express = require('express')

const router = express.Router()
const multer = require('multer')
const upload = multer()
const uploadImage = require('../../lib/s3UploadApi')
const ImageUpload = require('../models/image_upload')

// Basic POST Routes
router.post('/image-uploads', upload.single('image'), (res, req, next) => {
  console.log(req.image)
  uploadImage(req.image)
    .then(awsRes => {
      console.log(awsRes)
      return ImageUpload.create({
        url: awsRes.Location,
        name: awsRes.Key,
        type: req.image.mimetype
      })
    })
    .then(data => res.sendStatus.json({
      imageUpload: data.toObject()
    }))
    .catch(next)
})

module.exports = router
