const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    const { recipientId, content } = req.body;

    try {
        const newMessage = new Message({
            sender: req.user.id,
            recipient: recipientId,
            content
        });

        const message = await newMessage.save();
        res.json(message);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/messages/conversations
// @desc    Get list of conversations (users chatted with)
// @access  Private
router.get('/conversations', authMiddleware, async (req, res) => {
    try {
        // Find all messages where user is sender or recipient
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { recipient: req.user.id }]
        }).populate('sender', ['name', 'email']).populate('recipient', ['name', 'email']).sort({ createdAt: -1 });

        // Extract unique conversation partners
        const partners = {};
        messages.forEach(msg => {
            const partner = msg.sender._id.toString() === req.user.id ? msg.recipient : msg.sender;
            if (!partners[partner._id]) {
                partners[partner._id] = {
                    user: partner,
                    lastMessage: msg.content,
                    date: msg.createdAt
                };
            }
        });

        res.json(Object.values(partners));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/messages/:userId
// @desc    Get conversation with a specific user
// @access  Private
router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user.id }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
