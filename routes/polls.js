const express = require('express');
const pollRouter = express.Router();
const Polls = require('../models/polls');

pollRouter.route('/')
  // Return all polls
  .get(function(req, res, next) {
    Polls.find({}, function(err, polls) {
      if (err) throw err;
      res.json(polls);
    });
  })
  // Create a new Poll
  .post(function(req, res, next) {
    Polls.create(req.body, function(err, poll) {
      if (err) throw err;
      res.json(poll);
    });
  });

pollRouter.route('/:pollId')
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
  // Delete a Poll, Verify Admin or User Posesion
  .delete(function(req, res, next) {
    Polls.findByIdAndRemove(req.params.pollId, function(err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  });

module.exports = pollRouter;
