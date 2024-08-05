const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const PORT = 3003; 

// Connect to MongoDB
mongoose.connect('mongodb+srv://itrikiatt:itrikiatt@cluster0.jsi3wz1.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0', 
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const messageSchema = new mongoose.Schema({
    sender: String,
    recipient: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

app.use(cors());
app.use(express.json());

app.post('/messages', async (req, res) => {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.json(newMessage);
});

app.get('/messages/:sender/:recipient', async (req, res) => {
    const messages = await Message.find({
        $or: [
            { sender: req.params.sender, recipient: req.params.recipient },
            { sender: req.params.recipient, recipient: req.params.sender }
        ]
    });
    res.json(messages);
});

app.listen(PORT, () => console.log(`Message service running on port ${PORT}`));
