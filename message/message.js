const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import models
const { Message, User, Admin } = require('./models/Message');

const app = express();
const PORT = 3003;
//app.use(bodyParser.json());

// Access MongoDB using this connection string
const connection_url = process.env.CONNECTION_URL;

// Connect to MongoDB
mongoose.connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

// Track online admins
let onlineAdmins = [];

// Update online admins list
async function updateOnlineAdmins() {
    try {
        const admins = await Admin.find({ online: true });
        onlineAdmins = admins.map(admin => admin.username);
    } catch (error) {
        console.error('Error updating online admins:', error);
    }
}

// Periodically update the list of online admins
updateOnlineAdmins();
setInterval(updateOnlineAdmins, 60000); // Update every minute

// Route messages to an available admin
async function routeMessageToAdmin(sender, messageContent) {
    if (onlineAdmins.length === 0) {
        throw new Error('No admins available');
    }

    // Round-robin approach to select an admin
    const recipient = onlineAdmins.shift(); // Get the first admin in the list
    onlineAdmins.push(recipient); // Add them back to the end of the list

    const newMessage = new Message({ sender, recipient, message: messageContent });
    await newMessage.save();
    return newMessage;
}

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