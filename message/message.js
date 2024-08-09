const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { routeMessageToAdmin } = require('./handleMessage.js');

// Import models
const { Message, User } = require('./models/Message');

const app = express();
const PORT = 3003;
//app.use(bodyParser.json());

// Access MongoDB using this connection string
const connection_url = process.env.CONNECTION_URL;

// Connect to MongoDB
mongoose.connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

// Handle sending messages
app.post('/messages', async (req, res) => {
    const { sender, message } = req.body;

    try {
        // Check sender's online status
        const senderUser = await User.findOne({ username: sender });
        if (!senderUser || !senderUser.online) {
            return res.status(400).json({ error: 'Sender is not online or does not exist' });
        }

        // Route message to available admins
        const newMessage = await routeMessageToAdmin(sender, message);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error handling message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Retrieve messages between two users or user and admin
app.get('/messages/:sender/:recipient', async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.params.sender, recipient: req.params.recipient },
                { sender: req.params.recipient, recipient: req.params.sender }
            ]
        });
        res.json(messages);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).send('Error retrieving messages');
    }
});

app.listen(PORT, () => console.log(`Message service running on port ${PORT}`));