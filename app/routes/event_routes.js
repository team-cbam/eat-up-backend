// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for events
const Event = require('../models/event')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { event: { title: '', text: 'foo' } } -> { event: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /events
router.get('/events', (req, res, next) => {
  Event.find()
    .populate('rsvp')
    .then(events => {
      // `events` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return events.map(event => event.toObject())
    })
    // respond with status 200 and JSON of the events
    .then(events => res.status(200).json({ events: events }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /events/5a7db6c74d55bc51bdf39793
router.get('/events/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Event.findById(req.params.id)
    .populate('rsvp')
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "event" JSON
    .then(event => res.status(200).json({ event: event.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /events
router.post('/events', requireToken, (req, res, next) => {
  // set owner of new event to be current user
  req.body.event.owner = req.user

  Event.create(req.body.event)
    // respond to succesful `create` with status 201 and JSON of new "event"
    .then(event => {
      res.status(201).json({ event: event.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /events/5a7db6c74d55bc51bdf39793
router.patch('/events/:id', removeBlanks, (req, res, next) => {
  delete req.body.event.owner

  Event.findById(req.params.id)
    .then(handle404)
    .then(event => {
      console.log('THIS EVENT', event)
      // pass the result of Mongoose's `.update` to the next `.then`
      return event.update(req.body.event)
    })
    .then(() => Event.findById(req.params.id))
    .then((event) => res.json({ event }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /events/5a7db6c74d55bc51bdf39793
router.delete('/events/:id', requireToken, (req, res, next) => {
  Event.findById(req.params.id)
    .then(handle404)
    .then(event => {
      // throw an error if current user doesn't own `event`
      requireOwnership(req, event)
      // delete the event ONLY IF the above didn't throw
      event.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
