import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

const MyServices = () => {
    const [services, setServices] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        const fetchMyServices = async () => {
            // In a real app we would have an endpoint filter by provider, 
            // or filtered on client side from all services if small scale.
            // For now, let's fetch all and filter by provider user.id
            try {
                const res = await axios.get('http://localhost:5001/api/services');
                if (user) {
                    const myServices = res.data.filter(s => s.provider._id === user.id || s.provider === user.id);
                    setServices(myServices);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        if (user) fetchMyServices();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const newService = { title, description, category, price, location };

            const res = await axios.post('http://localhost:5001/api/services', newService, config);
            setServices([...services, res.data]);
            setShowForm(false);
            // Reset form
            setTitle(''); setDescription(''); setCategory(''); setPrice(''); setLocation('');
        } catch (error) {
            console.error('Error creating service:', error);
            alert('Failed to create service');
        }
    };

    if (!user || user.role !== 'provider') {
        return <div className="text-center mt-10">Access Denied. Providers only.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8 border-b-4 border-brand-yellow pb-2">
                <h1 className="text-3xl font-bold text-brand-grey">My Services</h1>
                <button onClick={() => setShowForm(!showForm)} className="bg-brand-yellow text-brand-grey px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-yellow-500 transition-colors">
                    <Plus size={20} />
                    {showForm ? 'Cancel' : 'Add New Service'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-brand-yellow">
                    <h2 className="text-xl font-bold mb-4">Add New Service</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Service Title" value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 border rounded" required />
                        <input type="text" placeholder="Category (e.g. Plumbing)" value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded" required />
                        <input type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} className="p-2 border rounded" required />
                        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="p-2 border rounded" required />
                        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 border rounded md:col-span-2" rows="3" required></textarea>
                        <button type="submit" className="bg-brand-grey text-white py-2 rounded font-bold md:col-span-2 hover:bg-black transition-colors">Create Service</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div key={service._id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-brand-grey">
                        <h2 className="text-xl font-bold text-gray-800">{service.title}</h2>
                        <span className="text-xs font-bold text-gray-500 uppercase">{service.category}</span>
                        <p className="text-gray-600 my-2 text-sm">{service.description.substring(0, 100)}...</p>
                        <div className="font-bold text-brand-yellow text-xl">₹{service.price}</div>
                    </div>
                ))}
            </div>

            {services.length === 0 && !showForm && (
                <div className="text-center text-gray-500 py-10">
                    You haven't listed any services yet.
                </div>
            )}
        </div>
    );
};

export default MyServices;
