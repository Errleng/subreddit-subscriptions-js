const fs = require('fs');

let config = null;
try {
    config = JSON.parse(fs.readFileSync('./config.json'));
} catch (err) {
    if (err.code !== 'ENOENT') {
        console.error('Error when reading config file', err);
    }
}
module.exports = config;
