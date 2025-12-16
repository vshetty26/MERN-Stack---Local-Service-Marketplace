const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Dispute = require('../models/Dispute');

// @route   POST /api/disputes
// @desc    File a dispute
// @access  Private
router.post('/', auth, async (req, res) => {
    const { reportedUser, reason } = req.body;
    try {
        const newDispute = new Dispute({
            reporter: req.user.id,
            reportedUser,
            reason
        });

        const dispute = await newDispute.save();
        res.json(dispute);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/disputes
// @desc    Get all disputes
// @access  Private/Admin
router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const disputes = await Dispute.find()
            .populate('reporter', 'name email')
            .populate('reportedUser', 'name email')
            .sort({ createdAt: -1 });
        res.json(disputes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/disputes/:id/status
// @desc    Update dispute status
// @access  Private/Admin
router.put('/:id/status', auth, adminAuth, async (req, res) => {
    const { status } = req.body;
    try {
        const dispute = await Dispute.findById(req.params.id);
        if (!dispute) {
            return res.status(404).json({ msg: 'Dispute not found' });
        }

        dispute.status = status;
        await dispute.save();

        res.json(dispute);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
