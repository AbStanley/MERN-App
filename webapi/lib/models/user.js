// models/user.js
const mongoose = require('../db');

// Create a model from the schema
const User = mongoose.model('User', {
    username:  { type: String, required: true },
    password:  { type: String, required: true }
});

module.exports = User;