const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const InitiateMongo = require('./config/db');
const passport = require('passport');

const users = require('./routes/api/users');
const applications = require('./routes/api/applications');
const listings = require('./routes/api/listings');
const mail = require('./routes/api/mail');

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/api/users', users);
app.use('/api/listings', listings);
app.use('/api/applications', applications);
app.use('/api/mail', mail);

// Initiate the server
InitiateMongo();

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);


// Recognize the port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));