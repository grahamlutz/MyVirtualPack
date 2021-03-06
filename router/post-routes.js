var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

/*
 * Posts routes
 */

/* GET all posts */
router.get('/', function(req, res, next) {
  Post.find(function(err, posts) {
    if (err) return next(err);
    res.json(posts);
  })
});

/* POST add new post */
router.post('/', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;

  post.save(function(err, post) {
    if (err) return next(err);
    res.json(post);
  })
});

/* preload post */
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function(err, post) {
    if(err) return next(err);
    if (!post) return next(new Error('can\'t find post'));

    req.post = post;
    return next();
  })
});

/* GET single post */
router.get('/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

/* PUT upvote a post */
router.put('/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post) {
    if (err) return next(err);
    res.json(post);
  })
});

/* PUT downvote a post */
router.put('/:post/downvote', auth, function(req, res, next) {
  req.post.downvote(function(err, post) {
    if (err) return next(err);
    res.json(post);
  })
});

module.exports = router;
