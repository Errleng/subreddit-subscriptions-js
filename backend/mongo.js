const { MongoClient } = require('mongodb');

const mongoConnectionString = 'mongodb+srv://SubscriptionsAdmin:CxPeLkJ2Hz8GZm@submissionsdata.r9zuj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let connection;
module.exports = {
    connectToMongo(callback) {
        client.connect((err, db) => {
            if (err || !db) {
                console.log('MongoDB connection error', err);
                return callback(err);
            }
            connection = db.db('SubmissionsData');
            return callback();
        });
    },
    getDb() { return connection; },
};
