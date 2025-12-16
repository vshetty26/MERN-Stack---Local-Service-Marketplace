const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const Dispute = require('./models/Dispute');

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const userCount = await User.countDocuments();
        const serviceCount = await Service.countDocuments();
        const bookingCount = await Booking.countDocuments();
        const disputeCount = await Dispute.countDocuments();

        console.log(`Users: ${userCount}`);
        console.log(`Services: ${serviceCount}`);
        console.log(`Bookings: ${bookingCount}`);
        console.log(`Disputes: ${disputeCount}`);

        const admin = await User.findOne({ email: 'admin@example.com' });
        if (admin) {
            console.log('Admin User Found:', admin.role, admin.email, admin._id);
        } else {
            console.log('Admin User NOT Found');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyData();
