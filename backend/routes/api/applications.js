const express = require('express');
const Router = express.Router();

const Listing = require('../../models/Listing');
const Application = require('../../models/Application');

// @route GET api/applications/app/:applicantID
// @desc Get the applications that corresponds to a particular applicant
// @access Private
Router.get('/app/:applicantID', async (req, res) => {
    console.log(req.data);
    try {
        await Application.find({ applicantID: req.params.applicantID }, (err, applications) => {
            if (!err) {
                res.status(200).json(applications);
            } else {
                res.status(500).json({ error: err });
            }
        });
    } catch {
        console.log(err);
    }
});

// @route POST api/applications/get
// @desc Get application by ID
// @access Public
Router.post('/get', async (req, res) => {
    try {
        await Application.find({_id: req.body.id}, (err, application) => {
            if(!err)
                res.status(200).json(application);
            else
                res.status(500).json({error: err});
        })
    } catch {
        console.log(err);
    }
})

// @route GET api/applications/listing/:listingID
// @desc Get a list of all applications for a particular listing ID
// @access Public
Router.get('/listing/:listingID', (req, res) => {
    Application.find({ listingID: req.params.listingID }, (err, applications) => {
        if (!err) {
            res.status(200).json(applications);
        } else {
            res.status(500).json({ error: err });
        }
    });
});

// @route POST api/applications/apply
// @desc Allow user to send application
// @access Public
Router.post('/apply', (req, res) => {
    Application.findOne({applicantID: req.body.applicantID, listingID: req.body.listingID})
               .then(app => {
                   if(app) {
                       console.log(app);
                       res.status(500).json({err: "Application already submitted"});
                        return;
                    } else {
                        const newApp = new Application(req.body);
                        newApp.save();
                        Listing.findById(req.body.listingID)
                               .then(async (listing) => {
                                   listing.appFilled += 1;
                                   await Listing.findByIdAndUpdate(req.body.listingID, {appFilled: listing.appFilled})
                               })

                    }
               })
});


// @route POST api/applications/accept
// @desc Accept an application
// @access Recruiter only
Router.post('/accept', async(req, res) => {
    try {
        console.log(req.body.applicantID);
        await Application.updateMany({ applicantID: req.body.applicantID, status: 'Pending' }, { status: 'Rejected' });
        await Application.updateMany({ applicantID: req.body.applicantID, status: 'Shortlisted' }, { status: 'Rejected' });
        await Application.updateOne({ _id: req.body.applicationID }, { status: 'Accepted', joinDate: new Date() });
        Listing.findById(req.body.listingID).then(async(listing) => {
            listing.posFilled += 1;
            await Listing.updateOne({ _id: req.body.listingID }, listing);

            if (listing.posFilled === listing.posCap) {
                await Application.updateMany({ listingID: listing._id, status: 'Pending' }, { status: 'Rejected' });
                await Application.updateMany({ _listingID: listing._id, status: 'Shortlisted' }, { status: 'Rejected' });
            }
        });
    } catch {
        console.log("Failed to accept application");
        res.status(500).json({ error: "Unable to accept application" });
    }
});

// @route POST api/applications/reject
// @desc Reject an application
// @acess Recruiter only
Router.post('/reject', async(req, res) => {
    try {
        await Application.update({ _id: req.body.id}, { status: 'Rejected' });
        res.status(200).json({ rejected: "Application rejected" });
        console.log(`Rejected ${req.body.id}`);
    } catch {
        res.status(500).json({ error: "Unable to reject application" });
    }
});

// @route POST api/applications/shortlist
// @desc Shortlist an application
// @access Recruiter only
Router.post('/shortlist', async(req, res) => {
    try {
        await Application.update({_id: req.body.id}, { status: 'Shortlisted' });
        res.status(200).json({ shortlisted: "Application shortlisted" });
    } catch {
        res.status(500).json({ error: "Unable to shortlist application" });
    }
});

module.exports = Router;