const express = require("express");
const Router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load models
const User = require("../../models/User");
const Application = require('../../models/Application');
const Listing = require('../../models/Listing');

// @route GET api/listings/
// @desc Get a list of all jobs
// @access Public
Router.get('/',(req, res) => {
    Listing.find({}, (err, listings) => {
        res.status(200).json(listings);
    });
});

// @route POST api/listings/create
// @desc Create a new job
// @access Recruiter only
Router.post('/create', (req, res) => {
    
    const newListing = new Listing(req.body);
    newListing.save()
        .then(res.status(200).json({ create: "Job creation successful" }))
        .catch(res.status(500).json({ error: "Failed to create job" }));
});

// @route POST api/listings/edit
// @desc Edit an existing job
// @access Recruiter only
Router.post('/edit', async(req, res) => {
    try {
        if (req.posFilled > req.posCap) {
            res.status(500).json({ error: "Invalid update" });
        } else if (req.appFilled > req.appCap) {
            res.status(500).json({ error: "Invalid update" });
        }
        await Listing.findByIdAndUpdate(req.body._id, req.body);
        res.status(200).json({ edit: "Job edited successfully" });
    } catch {
        res.status(500).json({ error: "Failed to edit job" });
    }
});

// @route POST api/listings/delete
// @desc Deletes a listing
// @access Recruiter only
Router.post('/delete', async(req, res) => {
    try {
        console.log(req.body._id);
        Listing.findByIdAndDelete(req.body._id, async (err, got) => {
            console.log(err);
            res.status(200).json({delete : "deleted successfully"});
            await Application.updateMany({listingID: req.body._id, status: 'Pending'}, {status: 'Deleted'});
        })
    } catch {
        res.status(500).json({ error: "Failed to delete listing" });
    }
});

module.exports = Router;