const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = 3001; // Port for user service

// Connect to MongoDB
mongoose.connect('mongodb+srv://itrikiatt:itrikiatt@cluster0.jsi3wz1.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0', 
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const userSchema = new mongoose.Schema({
    username: String,
    online: Boolean
});

const User = mongoose.model('User', userSchema);

app.use(express.json());

app.get('/user/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    res.json(user);
});

app.post('/user', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.json(newUser);
});

app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
