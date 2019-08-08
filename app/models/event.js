const mongoose = require('mongoose')
const User = require('user')

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
  host: {
    type: mongoose.Schema.Type.ObjectId,
    ref: 'User',
    required: true
  },
  rsvp: {
    type: [User],
    default: []
  }
}, {
  timestamps: true
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
