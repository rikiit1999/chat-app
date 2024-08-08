const mongoose = require('mongoose');

// Define a User model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    online: Boolean
});

const User = mongoose.model('User', userSchema);

module.exports = User;