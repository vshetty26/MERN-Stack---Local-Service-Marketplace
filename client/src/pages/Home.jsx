import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { MapPin, Search, Calendar, Smile, ArrowRight, ClipboardList, TrendingUp, Users, Clock, CheckCircle, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user, loading: authLoading } = useAuth();
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    // Provider State
    const [providerBookings, setProviderBookings] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, active: 0, completed: 0 });

    // Customer State
    const [customerBookings, setCustomerBookings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading) return;

            if (user?.role === 'provider') {
                try {
                    const res = await api.get('/bookings', {
                        headers: { 'x-auth-token': localStorage.getItem('token') }
                    });
                    const bookings = res.data;
                    setProviderBookings(bookings);

                    // Calculate Stats
                    const revenue = bookings
                        .filter(b => b.status === 'confirmed' || b.status === 'completed')
                        .reduce((acc, curr) => acc + (curr.service?.price || 0), 0);
                    const active = bookings.filter(b => b.status === 'confirmed').length;
                    const completed = bookings.filter(b => b.status === 'completed').length;

                    setStats({ revenue, active, completed });
                } catch (error) {
                    console.error("Error fetching provider data", error);
                }
            } else {
                // Fetch Services (Public & Customer)
                fetchServices();

                // Fetch Customer Bookings if logged in
                if (user?.role === 'customer') {
                    try {
                        const res = await api.get('/bookings', {
                            headers: { 'x-auth-token': localStorage.getItem('token') }
                        });
                        setCustomerBookings(res.data);
                    } catch (error) {
                        console.error("Error fetching customer bookings", error);
                    }
                }
            }
        };

        fetchData();
    }, [user, authLoading]);

    const fetchServices = async (search = '', location = '') => {
        try {
            const res = await api.get(`/services?search=${search}&location=${location}`);
            setServices(res.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchServices(searchTerm, locationFilter);
    };

    if (authLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    // --- PROVIDER VIEW ---
    if (user?.role === 'provider') {
        const pendingRequests = providerBookings.filter(b => b.status === 'pending');

        return (
            <div className="bg-white min-h-screen">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <header className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user.name}</h1>
                        <p className="text-gray-500 text-lg">Manage your services and bookings efficiently.</p>
                    </header>

                    {/* Dashboard Stats - Truvista Style Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-slate-50 p-8 rounded-3xl group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <TrendingUp size={24} className="text-gray-800" />
                            </div>
                            <h3 className="text-gray-800 text-xl font-bold mb-2">Total Revenue</h3>
                            <p className="text-gray-500 mb-4 text-sm">Earnings from completed jobs.</p>
                            <div className="text-4xl font-bold text-gray-900">₹{stats.revenue}</div>
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl group-hover:bg-yellow-400/20 transition-colors"></div>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <Calendar size={24} className="text-gray-800" />
                            </div>
                            <h3 className="text-gray-800 text-xl font-bold mb-2">Active Bookings</h3>
                            <p className="text-gray-500 mb-4 text-sm">Jobs currently in progress.</p>
                            <div className="text-4xl font-bold text-gray-900">{stats.active}</div>
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl group-hover:bg-blue-400/20 transition-colors"></div>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <CheckCircle size={24} className="text-gray-800" />
                            </div>
                            <h3 className="text-gray-800 text-xl font-bold mb-2">Completed Jobs</h3>
                            <p className="text-gray-500 mb-4 text-sm">Successfully delivered services.</p>
                            <div className="text-4xl font-bold text-gray-900">{stats.completed}</div>
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-green-400/10 rounded-full blur-2xl group-hover:bg-green-400/20 transition-colors"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Incoming Requests Feed */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Incoming Requests</h2>
                                <Link to="/bookings" className="text-gray-900 font-bold hover:underline flex items-center gap-2">
                                    View All <ArrowRight size={16} />
                                </Link>
                            </div>

                            {pendingRequests.length === 0 ? (
                                <div className="bg-slate-50 rounded-3xl p-12 text-center">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <ClipboardList size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">No pending requests</h3>
                                    <p className="text-gray-500">New bookings will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingRequests.map(booking => (
                                        <div key={booking._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition-shadow group">
                                            <div className="mb-4 md:mb-0">
                                                <h4 className="font-bold text-xl text-gray-900 group-hover:text-yellow-500 transition-colors">{booking.service?.title}</h4>
                                                <div className="flex items-center text-gray-500 mt-2 gap-4 text-sm">
                                                    <span className="flex items-center gap-1"><Users size={14} /> {booking.customer?.name}</span>
                                                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(booking.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="font-bold text-2xl text-gray-900">₹{booking.service?.price}</div>
                                                <Link to="/bookings" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
                                                    <ArrowRight size={20} />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <div className="bg-gray-900 text-white rounded-3xl p-8 sticky top-24">
                                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                                <div className="space-y-4">
                                    <Link to="/my-services" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl flex items-center transition-all group">
                                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                            <ClipboardList size={20} />
                                        </div>
                                        <span className="font-bold">Manage My Services</span>
                                    </Link>
                                    <Link to="/bookings" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl flex items-center transition-all group">
                                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                            <Calendar size={20} />
                                        </div>
                                        <span className="font-bold">View All Bookings</span>
                                    </Link>
                                </div>
                                <div className="mt-12 pt-8 border-t border-white/10">
                                    <p className="text-gray-400 text-sm mb-2">Need help?</p>
                                    <a href="#" className="text-white font-bold hover:text-yellow-400 transition-colors">Contact Support &rarr;</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- CUSTOMER & GUEST VIEW ---
    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero Section - Truvista Split Style */}
            <section className="bg-slate-50 pt-20 pb-20 px-4 md:px-0 rounded-b-[3rem] relative overflow-hidden">
                <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-12 relative z-10">
                    {/* Left Content */}
                    <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="px-3 py-1 bg-white rounded-full text-xs font-bold uppercase tracking-wider text-gray-500 shadow-sm border border-gray-100">Home / Service</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-[1.1]">
                            Powering Progress <br />
                            Through <span className="text-gray-500">Service.</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
                            We provide innovative, secure, and scalable services that solve real problems and drive measurable results for your daily needs.
                        </p>

                        {/* Search Bar - Modern & Pill Shaped */}
                        <form onSubmit={handleSearch} className="bg-white p-2 rounded-full shadow-lg flex items-center max-w-xl border border-gray-100">
                            <div className="pl-6 text-gray-400">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="What service do you need?"
                                className="flex-1 px-4 py-3 text-gray-700 bg-transparent focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
                            <input
                                type="text"
                                placeholder="Location"
                                className="w-32 px-4 py-3 text-gray-700 bg-transparent focus:outline-none hidden md:block"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            />
                            <button type="submit" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Right Content - Visual Collage */}
                    <div className="flex-1 relative h-[500px] w-full hidden md:block">
                        {/* Main Professionals Image */}
                        <div className="absolute top-0 right-0 w-4/5 h-4/5 bg-gray-200 rounded-[2rem] overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2670&auto=format&fit=crop" alt="Professionals" className="w-full h-full object-cover" />
                        </div>

                        {/* Floating Stat Card */}
                        <div className="absolute top-1/2 left-0 w-64 bg-[#dbeafe] p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
                            <h4 className="font-bold text-gray-900 mb-2">Satisfied Customers</h4>
                            <div className="text-4xl font-bold text-gray-900 mb-4">200k+</div>
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-red-400 border-2 border-green-100"></div>
                                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-green-100"></div>
                                <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-green-100"></div>
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold border-2 border-green-100">+</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Active Bookings (If logged in) */}
            {user?.role === 'customer' && customerBookings.length > 0 && (
                <section className="container mx-auto px-4 -mt-10 relative z-20 mb-12 max-w-7xl">
                    <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold flex items-center">
                                <Clock className="mr-3 text-yellow-400" /> Your Active Bookings
                            </h2>
                            <Link to="/bookings" className="text-sm font-bold hover:text-yellow-400 transition-colors">View All &rarr;</Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {customerBookings.slice(0, 3).map(booking => (
                                <div key={booking._id} className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm flex justify-between items-center hover:bg-white/20 transition-colors cursor-pointer" onClick={() => window.location.href = '/bookings'}>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{booking.service?.title}</h4>
                                        <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                                            booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-500/20 text-gray-300'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* "Comprehensive Solutions" - Services Grid */}
            <section id="services" className="py-24 container mx-auto px-4 max-w-7xl">
                <div className="mb-16">
                    <h3 className="text-gray-500 font-bold uppercase tracking-wider mb-2">Our Services</h3>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
                        Comprehensive <br /> Solutions, All in One Place
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={service._id} className="bg-slate-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                            {/* Icon/Category */}
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-8 shadow-sm text-gray-900 group-hover:scale-110 transition-transform">
                                {/* Use icon based on category or default */}
                                {service.category === 'Plumbing' ? <span className="text-xl">🚿</span> :
                                    service.category === 'Cleaning' ? <span className="text-xl">🧹</span> :
                                        <ClipboardList size={20} />}
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4 pr-12">{service.title}</h3>
                            <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed">
                                {service.description}
                            </p>

                            <Link to={`/service/${service._id}`} className="flex items-center gap-3 font-bold text-gray-900 group-hover:gap-4 transition-all">
                                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-lg shadow-lg group-hover:bg-yellow-500 transition-colors">+</span>
                                Read More
                            </Link>

                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl"></div>
                        </div>
                    ))}
                </div>

                {services.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl">
                        <p className="text-gray-500 text-lg">No services listed yet.</p>
                    </div>
                )}
            </section>

            {/* Reviews Section - Truvista Style */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <h3 className="text-gray-500 font-bold uppercase tracking-wider mb-2">Testimonials</h3>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Reviews That Speak Volumes</h2>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-gray-500 max-w-sm ml-auto">Hear how our services have transformed homes and businesses, improving efficiency and driving satisfaction.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-slate-50 p-8 rounded-3xl border border-gray-100">
                                <div className="flex text-yellow-400 mb-6 space-x-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-700 mb-8 leading-relaxed text-sm">
                                    "The team exceeded our expectations in every way. The service was fast, professional, and the results were outstanding. I highly recommend them to anyone."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">Alex Johnson</div>
                                        <div className="text-gray-400 text-xs uppercase font-bold">Manager, TechCorp</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-[#d1dce5] relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center md:text-left md:flex justify-between items-center">
                    <div className="mb-8 md:mb-0 max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
                        <p className="text-lg text-gray-700">Connect with top-rated professionals today and get your job done right.</p>
                    </div>
                    <Link to="/" className="bg-black text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors shadow-xl">
                        Find a Pro
                    </Link>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent"></div>
            </section>
        </div>
    );
};

export default Home;

