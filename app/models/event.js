const mongoose = require('mongoose')

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
    type: Date,
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
    types: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
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
