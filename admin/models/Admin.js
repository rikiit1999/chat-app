const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: String,
    online: Boolean
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;