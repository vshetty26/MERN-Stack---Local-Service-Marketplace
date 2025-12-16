const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Category = require('./models/Category');
const Message = require('./models/Message');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await User.deleteMany({});
        await Service.deleteMany({});
        await Booking.deleteMany({});
        await Review.deleteMany({});
        await Message.deleteMany({});
        console.log('Old data cleared');

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const provider1 = new User({
            name: 'Ramu',
            email: 'provider1@example.com',
            password: hashedPassword,
            role: 'provider'
        });

        const provider2 = new User({
            name: 'Shamu',
            email: 'provider2@example.com',
            password: hashedPassword,
            role: 'provider'
        });

        const customer = new User({
            name: 'Vamshi',
            email: 'customer@example.com',
            password: hashedPassword,
            role: 'customer'
        });

        const admin = new User({
            name: 'Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });

        await provider1.save();
        await provider2.save();
        await customer.save();
        await admin.save();
        console.log('Users created');

        // Create Categories
        const cat1 = new Category({ name: 'Plumbing' });
        const cat2 = new Category({ name: 'Cleaning' });
        const cat3 = new Category({ name: 'Electrical' });
        await cat1.save();
        await cat2.save();
        await cat3.save();
        console.log('Categories created');

        // Create Services
        const service1 = new Service({
            provider: provider1._id,
            title: 'Expert Plumbing Repair',
            description: 'Fixing leaks, clogged drains, and pipe installations. 10 years experience.',
            category: 'Plumbing',
            price: 500,
            location: 'Mumbai, MH',
            image: ''
        });

        const service2 = new Service({
            provider: provider1._id,
            title: 'Water Heater Installation',
            description: 'Professional installation of tankless and traditional water heaters.',
            category: 'Plumbing',
            price: 1500,
            location: 'Bangalore, KA',
            image: ''
        });

        const service3 = new Service({
            provider: provider2._id,
            title: 'Deep House Cleaning',
            description: 'Full house deep cleaning including carpets and windows.',
            category: 'Cleaning',
            price: 1200,
            location: 'Delhi, DL',
            image: ''
        });

        await service1.save();
        await service2.save();
        await service3.save();
        console.log('Services created');

        // Create Reviews
        const review1 = new Review({
            service: service1._id,
            user: customer._id,
            rating: 5,
            comment: 'Ramu fixed my leak in 20 minutes. Highly recommended!'
        });

        const review2 = new Review({
            service: service3._id,
            user: customer._id,
            rating: 4,
            comment: 'Great cleaning, but arrived slightly late.'
        });

        await review1.save();
        await review2.save();
        console.log('Reviews created');

        // Create Sample Messages
        const msg1 = new Message({
            sender: customer._id,
            recipient: provider1._id,
            content: 'Hi, are you available tomorrow?',
            createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
        });

        const msg2 = new Message({
            sender: provider1._id,
            recipient: customer._id,
            content: 'Yes, I can come around 2 PM. Does that work?',
            createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
        });

        await msg1.save();
        await msg2.save();
        console.log('Sample messages created');

        // Create Sample Booking
        const booking = new Booking({
            customer: customer._id,
            service: service1._id,
            date: new Date(),
            status: 'confirmed',
            paymentStatus: 'unpaid'
        });
        await booking.save();
        console.log('Sample booking created');

        console.log('-------- SEEDING COMPLETE --------');
        console.log('Login as Customer: customer@example.com / password123');
        console.log('Login as Provider: provider1@example.com / password123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
