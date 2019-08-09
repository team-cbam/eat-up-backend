const mongoose = require('mongoose')
const DateOnly = require('mongoose-dateonly')(mongoose)

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: DateOnly,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImageUpload'
  },
  rsvps: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }]
}, {
  timestamps: true
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
