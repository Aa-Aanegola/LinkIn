const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    recruiterEmail: {
        type: String,
        required: true,
    },
    appCap: {
        type: Number,
        required: true
    },
    posCap: {
        type: Number,
        required: true
    },
    postDate: {
        type: Date,
        required: true
    },
    closeDate: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Part-time', 'Full-time', 'Work from home']
    },
    salary: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required : true
    },
    posFilled: {
        type: Number,
        required: true
    },
    appFilled: {
        type: Number,
        required: true
    },
    requiredSkills: {
        type: String
    },
    rating: {
        type: Array
    }
});

module.exports = User = mongoose.model('listing', ListingSchema);