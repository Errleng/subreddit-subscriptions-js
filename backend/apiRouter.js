const express = require('express');

const router = express.Router();
const reddit = require('./reddit');

router.get('/test', (req, res) => {
  res.json({ data: 'Hello world!' });
});

router.get('/subreddit/:subredditName', (req, res) => {
  reddit
    .getSubreddit(req.params.subredditName)
    .getTop({ time: 'day' })
    .then((data) => res.send(data));
});

module.exports = router;
