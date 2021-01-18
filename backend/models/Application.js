const mongoose = require('mongoose');

const ApplicationSchema = ({
    applicantID: {
        type: String,
        required: true
    },
    listingID: {
        type: String,
        required: true
    },
    SOP: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Accepted', 'Rejected', 'Shortlisted', 'Deleted'],
        default: 'Pending'
    },
    applicationDate: {
        type: Date, 
    },
    joinDate: {
        type: Date
    }
});

module.exports = mongoose.model('application', ApplicationSchema);