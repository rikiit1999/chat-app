const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Message, User, Admin } = require('./models/Message');  // Import models

const app = express();
const PORT = 3003;

// Connect to MongoDB
mongoose.connect('mongodb+srv://itrikiatt:itrikiatt@cluster0.jsi3wz1.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0', 
    { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(cors());
app.use(express.json());

app.post('/messages', async (req, res) => {
    const { sender, recipient, message } = req.body;

    // Check sender's online status
    const senderUser = await User.findOne({ username: sender });
    if (!senderUser || !senderUser.online) {
        return res.status(400).json({ error: 'Sender is not online or not exists' });
    }

    // Check recipient's online status
    const recipientUser = await User.findOne({ username: recipient });
    const recipientAdmin = await Admin.findOne({ username: recipient });

    if ((!recipientUser || !recipientUser.online) && (!recipientAdmin || !recipientAdmin.online)) {
        return res.status(400).json({ error: 'Recipient is not online' });
    }

    const newMessage = new Message({ sender, recipient, message });
    await newMessage.save();
    res.status(201).json(newMessage);
});

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