const express = require('express');
const pollsRouter = express.Router();
const Polls = require('../models/polls');
const isLoggedIn = require('../auth/isLoggedIn');

pollsRouter
  .route('/')
  .get(function(req, res, next) {
    // Return all polls
    Polls.find({}, function(err, polls) {
      if (err) throw err;
      res.json(polls);
    });
  })
  .post(isLoggedIn, function(req, res, next) {
    // Create a new Poll
    Polls.create(req.body, function(err, poll) {
      if (err) throw err;
      res.json(poll);
    });
  });

pollsRouter
  .route('/:pollId')
  // Return Specific Poll
  .get(function(req, res, next) {
    Polls.findById(req.params.pollId, function(err, poll) {
      if (err) throw err;
      res.json(poll);
    });
  })
  // Update a Poll
  .put(function(req, res, next) {
    Polls.findById(req.params.pollId, function(err, poll) {
      if (err) throw err;
      // Find out if option exists
      let hasOption = false;
      let indexOption;
      for (let i = 0, l = poll.options.length; i < l; i++) {
        if (poll.options[i].name === req.body.name) {
          hasOption = true;
          indexOption = i;
          break;
        }
      }

      if (hasOption) {
        // Add One Vote to the option
        poll.options[indexOption].votes++;
        poll.save(function(err, poll) {
          if (err) throw err;
          res.json(poll);
        });
      } else {
        // Create the option
        poll.options.push({
          name: req.body.name,
          votes: 1
        });
        poll.save(function(err, poll) {
          if (err) throw err;
          res.json(poll);
        });
      }
    });
  })
  .delete(function(req, res, next) {
    // Delete a Poll, Verify Admin or User Posesion
    Polls.findByIdAndRemove(req.params.pollId, function(err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  });

module.exports = pollsRouter;
