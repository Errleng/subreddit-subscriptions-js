const express = require('express');

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ data: 'Hello world!' });
});

module.exports = router;
