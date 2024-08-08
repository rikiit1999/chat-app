const mongoose = require('mongoose');

// Message Schema and Model
const messageSchema = new mongoose.Schema({
    sender: String,
    recipient: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// User Schema and Model
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    online: Boolean
}));

// Admin Schema and Model
const Admin = mongoose.model('Admin', new mongoose.Schema({
    username: String,
    online: Boolean
}));

module.exports = { Message, User, Admin };