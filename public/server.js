const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;
const JWT_SECRET = 'riki_jwt_secret';

// Access mongodb using this connection string
const connection_url = process.env.CONNECTION_URL;

// Connect to MongoDB
mongoose.connect(connection_url, 
    { useNewUrlParser: true, useUnifiedTopology: true }
);

// Define a User model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Middleware
//app.use(bodyParser.json());
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files from 'public'

var testThis = app.use(express.static('public'));
console.log("alo:        "+ testThis);

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        console.log('public, server.js');
        return res.status(400).json({ message: 'Username and password are required' });        
    }

    try {
        const user = await User.findOne({ username });
        
            if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
        console.log('ok roi nay.');
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Regist route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});