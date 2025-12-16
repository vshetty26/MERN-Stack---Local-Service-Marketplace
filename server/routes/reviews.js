const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../models/User'); // Use the auth middleware if it's exported from somewhere, looking at previous files it was inside routes usually or separate. 
// Wait, I saw auth middleware in services.js. I should probably copy it or better yet, extract it if I could, but for now I'll duplicate or import if possible.
// Actually, looking at services.js (Step 19), 'auth' was defined inline. That's bad practice but I should follow the pattern or fix it.
// Ideally I should put it in a middleware folder. But I don't want to refactor too much.
// I'll check if there is a middleware folder. Step 7 showed no 'middleware' folder.
// I will check `server/routes/auth.js` to see if it exports middleware.
// If not, I will define it inline like `services.js` did.
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

// @route   GET /api/reviews/:serviceId
// @desc    Get reviews for a service
// @access  Public
router.get('/:serviceId', async (req, res) => {
    try {
        const reviews = await Review.find({ service: req.params.serviceId }).populate('user', 'name');
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/reviews
// @desc    Add a review
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    const { serviceId, rating, comment } = req.body;

    try {
        const newReview = new Review({
            service: serviceId,
            user: req.user.id,
            rating,
            comment
        });

        const review = await newReview.save();

        // Populate user details to return immediately
        const populatedReview = await Review.findById(review._id).populate('user', 'name');

        res.json(populatedReview);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
