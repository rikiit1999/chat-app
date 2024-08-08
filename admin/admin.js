const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const PORT = 3002; // Port for admin service

// Access mongodb using this connection string
const connection_url = process.env.MONGODB_CONNECTION_URL;

// Connect to MongoDB
mongoose.connect(connection_url, 
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const Admin = require('./models/Admin');

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

// Update admin status
app.patch('/admins/:username', async (req, res) => {
    const { online } = req.body;
    const user = await Admin.findOneAndUpdate(
        { username: req.params.username },
        { online },
        { new: true }
    );
    res.json(user);
});

app.listen(PORT, () => console.log(`Admin service running on port ${PORT}`));