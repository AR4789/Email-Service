const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/emailDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define User schema and model
const userSchema = new mongoose.Schema({
    email: String,
});

const User = mongoose.model('User', userSchema);

// Endpoint to get email suggestions
app.get('/api/suggest-emails', async (req, res) => {
    const query = req.query.q || '';
    try {
        const suggestions = await User.find({
            email: { $regex: query, $options: 'i' },
        }).limit(10);
        res.json(suggestions.map(user => user.email));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suggestions' });
    }
});

// Setup route for sending emails
app.post('/send-email', (req, res) => {
    const { from, to, subject, description } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail', // Use Gmail or any other email service provider
        auth: {
            user: from, // Replace with your email
            pass: process.env.GMAIL_PASS, // Replace with your email password (use App Passwords)
        },
    });

    let mailOptions = {
        from: from,
        to: to,  // This should be a string of comma-separated emails
        subject: subject,
        text: description,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ status: 'error', message: error.toString() });
        }
        res.status(200).send({ status: 'success', message: 'Emails sent successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
