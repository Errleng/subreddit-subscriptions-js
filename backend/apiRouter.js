const express = require('express');

const router = express.Router();
const reddit = require('./reddit');

router.get('/test', (req, res) => {
  res.json({ data: 'Hello world!' });
});

router.get(
  '/subreddit/:subredditName/:sortType/:sortTime/:numSubmissions',
  (req, res) => {
    const { sortType, sortTime } = req.params;
    const numSubmissions = parseInt(req.params.numSubmissions, 10);
    const subreddit = reddit.getSubreddit(req.params.subredditName);

    let sortFunction = null;
    switch (sortType) {
      case 'hot':
        sortFunction = subreddit.getHot.bind(subreddit);
        break;
      case 'new':
        sortFunction = subreddit.getNew.bind(subreddit);
        break;
      case 'top':
        sortFunction = subreddit.getTop.bind(subreddit);
        break;
      case 'rising':
        sortFunction = subreddit.getRising.bind(subreddit);
        break;
      case 'controversial':
        sortFunction = subreddit.getControversial.bind(subreddit);
        break;
      default:
        throw new Error(`Invalid sort type: ${sortType}`);
    }

    if (!['day', 'month', 'year', 'all'].includes(sortTime)) {
      throw new Error(`Invalid sort time: ${sortTime}`);
    }

    sortFunction({ time: sortTime, limit: numSubmissions }).then((data) => {
      res.send(data);
    });
  }
);

module.exports = router;
