const express = require("express");
const Router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input authentication
const validateRegistration = require("../../authentication/register");
const validateLogin = require("../../authentication/login");

// Load User model
const User = require("../../models/User");
const { secretOrKey } = require("../../config/keys");

// @route POST api/users/register
// @desc Register user
// @access Public
Router.post("/register", (req, res) => {
    console.log('Here');

    console.log(req.body);

    // Validate the form 
    const { errors, valid } = validateRegistration(req.body);

    if (!valid) {
        return res.status(400).json(errors);
    }


    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User(req.body);

            // Hash the password and save
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err)
                        throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
Router.post("/login", (req, res) => {

    console.log(req.body);

    // Form validation
    const { errors, valid } = validateLogin(req.body);
    // Check validation
    if (!valid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user._id
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey, {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        console.log("Sending details back to client.");
                        res.status(200).json({
                            user : user,
                            token: token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password entered is incorrect" });
            }
        });
    });
});

// @route GET api/users/:userID
// @desc Display user information
// @access Private
Router.get('/user/:userID', async(req, res) => {
    try {
        const user = await User.findById(req.params.userID);
        if (!user) {
            res.status(800).send({ error: "User not found." });
        } else {
            res.status(200).json(user);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.get('/all', async (req, res) => {
    try {
        console.log("Hello");
        await User.find({}, (err, applicants) => 
            res.status(200).json(applicants))
    } catch {
        console.log("Failed to return applicants");
    }
})

// @route POST api/users/update
// @desc Update info that the user wants to change
// @access Private

Router.post('/update', (req, res) => {
    console.log(req.body);
    User.findById(req.body._id)
        .then(async(user) => {
            User.findOne({ email: req.body.email })
                .then(async(user) => {
                    if (user) {
                        await User.findByIdAndUpdate(req.body._id, req.body);
                        return res.status(200);
                    } else {
                        return res.status(800).json({ error: "Email belongs to another user." })
                    }
                })
        })
        .catch(err => console.log(err));
});

Router.post('/getuser', async (req, res) => {
    try {
        const {token} = req.body;
        const verified = jwt.verify(token, secretOrKey);
        if(!verified)
            return res.status(401).json({error : "Token verification failed"});
        
        const user = await User.findById(verified.id);
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({error : err.message});
    }
})


module.exports = Router;