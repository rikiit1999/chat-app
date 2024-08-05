const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = 3002; // Port for admin service

// Connect to MongoDB
mongoose.connect('mongodb+srv://itrikiatt:itrikiatt@cluster0.jsi3wz1.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0', 
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const adminSchema = new mongoose.Schema({
    username: String,
    online: Boolean
});

const Admin = mongoose.model('Admin', adminSchema);

app.use(express.json());

app.get('/admin/:username', async (req, res) => {
    const admin = await Admin.findOne({ username: req.params.username });
    res.json(admin);
});

app.post('/admin', async (req, res) => {
    const newAdmin = new Admin(req.body);
    await newAdmin.save();
    res.json(newAdmin);
});

app.listen(PORT, () => console.log(`Admin service running on port ${PORT}`));