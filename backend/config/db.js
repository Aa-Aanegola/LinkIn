// Database config and connection
const mongoose = require('mongoose');

const db = require('./keys.js').mongoURI;
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('bad juju ${err}'))

const InitiateMongo = async() => {
    try {
        await mongoose.connect(db, {
            userNewUrlParser: true
        });
        console.log('Connected to MongoDB successfully!');
    } catch (err) {
        console.log('Failed to connect \n error : ${err}');
        throw err;
    }
};

module.exports = InitiateMongo;