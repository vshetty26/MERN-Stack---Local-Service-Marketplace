const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private (Customer)
router.post('/', auth, async (req, res) => {
    const { serviceId, date } = req.body;

    try {
        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ message: 'Service not found' });

        const booking = new Booking({
            customer: req.user.id,
            service: serviceId,
            date,
            status: 'pending'
        });

        await booking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/bookings
// @desc    Get bookings for current user (Customer or Provider)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let bookings;
        if (req.user.role === 'provider') {
            // Find services by this provider
            const services = await Service.find({ provider: req.user.id });
            const serviceIds = services.map(s => s._id);
            // Find bookings for these services
            bookings = await Booking.find({ service: { $in: serviceIds } })
                .populate('customer', ['name', 'email'])
                .populate('service', ['title', 'price']);
        } else {
            // Find bookings made by this customer
            bookings = await Booking.find({ customer: req.user.id })
                .populate('service', ['title', 'price', 'provider'])
                .populate({
                    path: 'service',
                    populate: { path: 'provider', select: 'name' }
                });
        }
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PATCH /api/bookings/:id/pay
// @desc    Simulate payment for a booking
// @access  Private
router.patch('/:id/pay', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Check if user is the owner of the booking
        if (booking.customer.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        booking.paymentStatus = 'paid';
        booking.status = 'confirmed'; // Auto-confirm on payment
        await booking.save();

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status (Provider only)
// @access  Private
router.patch('/:id/status', auth, async (req, res) => {
    const { status } = req.body;

    try {
        const booking = await Booking.findById(req.params.id).populate('service');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Ensure user is the provider of the service
        // Service might be populated or not depending on previous queries, in this specific findById it is NOT populated unless we ask.
        // Wait, I put .populate('service') above.

        if (booking.service.provider.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Validate status
        const validStatuses = ['confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
