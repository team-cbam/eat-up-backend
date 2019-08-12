'use strict'
require('dotenv').config()

const AWS = require('aws-sdk')
const S3 = new AWS.S3()
// 4. put fs.readimage in it's own Promise function
// console.log(process.argv)
// const image = process.argv[2]

const uploadImage = function (image) {
  return new Promise((resolve, reject) => {
    var params = {
      Bucket: 'britneyseibucket',
      Key: `${Date.now()}_${image.originalname}`,
      Body: image.buffer,
      ContentType: image.mimetype,
      ACL: 'public-read'
    }
    S3.upload(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = uploadImage
