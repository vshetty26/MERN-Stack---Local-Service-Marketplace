import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, DollarSign, Calendar, Clock, Star, MessageCircle } from 'lucide-react';

const ServiceDetails = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [bookingDate, setBookingDate] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await api.get(`/services/${id}`);
                setService(res.data);
            } catch (error) {
                console.error('Error fetching service:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const res = await api.get(`/reviews/${id}`);
                setReviews(res.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchService();
        fetchReviews();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await api.post('/reviews', {
                serviceId: id,
                rating: newReview.rating,
                comment: newReview.comment
            }, config);

            setReviews([...reviews, res.data]);
            setNewReview({ rating: 5, comment: '' });
            alert('Review added successfully!');
        } catch (error) {
            console.error('Error adding review:', error);
            alert('Failed to add review.');
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            await api.post('/bookings', { serviceId: id, date: bookingDate }, config);
            alert('Booking successful!');
            navigate('/bookings');
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Booking failed. Please try again.');
        }
    };

    if (!service) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-brand-yellow">
                    <div className="mb-6 rounded-lg overflow-hidden h-64">
                        <img src={service.image || '/default-service.png'} alt={service.title} className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-grey mb-2">{service.title}</h1>
                    <span className="bg-slate-100 text-brand-grey text-sm font-bold px-3 py-1 rounded uppercase inline-block mb-4">{service.category}</span>

                    <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>

                    <div className="flex items-center text-gray-600 mb-2">
                        <MapPin size={20} className="mr-2 text-brand-yellow" />
                        <span>{service.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                        <DollarSign size={20} className="mr-2 text-brand-yellow" />
                        <span className="text-xl font-bold">₹{service.price}</span>
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-bold text-gray-700 mb-2">Provider Details</h3>
                        <p className="text-gray-600">Name: {service.provider?.name}</p>
                        <p className="text-gray-600">Email: {service.provider?.email}</p>
                        {user && user.id !== service.provider?._id && (
                            <button
                                onClick={() => navigate('/chat', { state: { recipientId: service.provider._id, recipientName: service.provider.name } })}
                                className="mt-4 flex items-center gap-2 text-brand-grey font-bold hover:text-brand-yellow transition-colors"
                            >
                                <MessageCircle size={20} />
                                Message Provider
                            </button>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                    <h2 className="text-2xl font-bold text-brand-grey mb-6">Reviews</h2>

                    {/* Review List */}
                    <div className="space-y-6 mb-8">
                        {reviews.length === 0 ? (
                            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                        ) : (
                            reviews.map(review => (
                                <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-gray-800">{review.user?.name || 'Anonymous'}</span>
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-yellow-500" : "text-gray-300"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                    <span className="text-xs text-gray-400 block mt-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add Review Form */}
                    {user && (
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Rating</label>
                                    <select
                                        value={newReview.rating}
                                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="3">3 - Good</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="1">1 - Poor</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Comment</label>
                                    <textarea
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        rows="3"
                                        required
                                        placeholder="Share your experience..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="bg-brand-grey text-white px-4 py-2 rounded hover:bg-black transition-colors">
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <div className="md:w-1/3">
                {user?.role === 'provider' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center sticky top-24">
                        <h3 className="font-bold text-gray-800 mb-2">Provider View</h3>
                        <p className="text-gray-500 text-sm">Service Providers cannot book other services.</p>
                        {user.id === service.provider?._id && (
                            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-sm font-bold rounded">
                                This is your service listing.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-brand-yellow sticky top-24">
                        <h2 className="text-xl font-bold text-brand-grey mb-4">Book This Service</h2>
                        <form onSubmit={handleBooking}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2 flex items-center">
                                    <Calendar size={18} className="mr-2" />
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-brand-yellow"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-brand-yellow text-brand-grey font-bold py-3 px-4 rounded hover:bg-yellow-500 transition-colors">
                                Confirm Booking
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceDetails;
