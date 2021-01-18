const mongoose = require('mongoose');
const { UnavailableForLegalReasons } = require('http-errors');
const Schema = mongoose.Schema;

const instituteSchema = ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    startYear: {
        type: String,
        required: true
    },
    endYear: {
        type: String,
        required: false
    }
});

const RatingSchema = mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    }
});


const userSchema = ({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Applicant', 'Recruiter'],
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    education: {
        type: Array,
        required: false
    },
    skills: {
        type: Array,
        required: false,
    },
    contactNo: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    rating: {
        type: [RatingSchema]
    }
});


module.exports = User = mongoose.model('user', userSchema);