const snoowrap = require('snoowrap');
const fs = require('fs');

const secretsPath = './secrets.json';
let secrets = null;
try {
  secrets = fs.readFileSync(secretsPath);
} catch (err) {
  if (err.code !== 'ENOENT') {
    console.error('Error when reading secrets file', err);
  }
}

if (secrets === null) {
  secrets = {
    clientId: process.env.REDDIT_CLIENT,
    clientSecret: process.env.REDDIT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
  };
} else {
  secrets = JSON.parse(secrets);
}

const reddit = new snoowrap({
  userAgent: 'subreddit subscriptions app deployed v1.0',
  clientId: secrets.clientId,
  clientSecret: secrets.clientSecret,
  refreshToken: secrets.refreshToken,
});
reddit.config({ requestDelay: 1000 });

module.exports = reddit;
