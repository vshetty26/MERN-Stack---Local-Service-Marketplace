const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
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

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search, location } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        const services = await Service.find(query).populate('provider', ['name', 'email']);
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('provider', ['name', 'email']);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        res.json(service);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Service not found' });
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/services
// @desc    Create a new service
// @access  Private (Provider only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'provider' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Providers only' });
    }

    const { title, description, category, price, location, image } = req.body;

    try {
        const newService = new Service({
            provider: req.user.id,
            title,
            description,
            category,
            price,
            location,
            image
        });

        const service = await newService.save();
        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
