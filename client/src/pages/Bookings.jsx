import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Check, X, DollarSign } from 'lucide-react';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'x-auth-token': token
                    }
                };
                const res = await api.get('/bookings', config);
                setBookings(res.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (bookingId, status) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await api.patch(`/bookings/${bookingId}/status`, { status }, config);

            // Update local state
            setBookings(bookings.map(b => b._id === bookingId ? res.data : b));
        } catch (error) {
            console.error('Status update failed:', error);
            alert('Failed to update status.');
        }
    };

    const handlePayment = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await api.patch(`/bookings/${bookingId}/pay`, {}, config);

            // Update local state
            setBookings(bookings.map(b => b._id === bookingId ? res.data : b));
            alert('Payment successful!');
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed.');
        }
    };

    const handleChat = (booking) => {
        let recipient;
        if (user.role === 'provider') {
            recipient = booking.customer;
        } else {
            recipient = booking.service?.provider;
        }

        if (recipient) {
            navigate('/chat', { state: { recipientId: recipient._id, recipientName: recipient.name } });
        } else {
            alert('Cannot start chat: User details missing.');
        }
    };

    if (!user) {
        return <div className="text-center mt-10">Please login to view bookings.</div>;
    }

    return (
        <div className="container mx-auto p-4 min-h-screen bg-slate-50">
            <h1 className="text-3xl font-bold text-brand-grey mb-8 border-b-4 border-brand-yellow inline-block">
                {user.role === 'provider' ? 'Manage Bookings' : 'My Bookings'}
            </h1>

            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded shadow border border-gray-100">
                    <p className="text-gray-500 mb-4">You have no bookings yet.</p>
                    {user.role === 'customer' && (
                        <Link to="/" className="text-brand-yellow font-bold hover:underline">Browse Services</Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 border-brand-yellow gap-4">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-800">{booking.service?.title}</h2>
                                <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {user.role === 'provider' ? (
                                        <span className="flex items-center gap-1">User: <span className="font-semibold text-gray-700">{booking.customer?.name}</span></span>
                                    ) : (
                                        <span className="flex items-center gap-1">Provider: <span className="font-semibold text-gray-700">{booking.service?.provider?.name}</span></span>
                                    )}
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded text-sm font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {booking.status}
                                    </span>
                                    {booking.paymentStatus === 'paid' && (
                                        <span className="px-3 py-1 rounded text-sm font-bold uppercase bg-green-600 text-white">
                                            PAID
                                        </span>
                                    )}
                                    <span className="font-bold text-lg text-brand-grey">₹{booking.service?.price}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {/* Provider Actions for Pending */}
                                    {user.role === 'provider' && booking.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-1 hover:bg-green-700 text-sm font-bold"
                                                title="Accept Booking"
                                            >
                                                <Check size={16} /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                className="bg-red-500 text-white px-3 py-2 rounded flex items-center gap-1 hover:bg-red-600 text-sm font-bold"
                                                title="Decline Booking"
                                            >
                                                <X size={16} /> Decline
                                            </button>
                                        </>
                                    )}

                                    {/* Pay Button for Customer */}
                                    {user.role === 'customer' && booking.status === 'confirmed' && booking.paymentStatus !== 'paid' && (
                                        <button
                                            onClick={() => handlePayment(booking._id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 transition-colors text-sm font-bold shadow-sm"
                                        >
                                            <DollarSign size={16} /> Pay Now
                                        </button>
                                    )}

                                    {/* Chat Action for Confirmed */}
                                    {booking.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleChat(booking)}
                                            className="bg-brand-grey text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-black transition-colors text-sm font-bold"
                                        >
                                            <MessageSquare size={16} /> Chat
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookings;
