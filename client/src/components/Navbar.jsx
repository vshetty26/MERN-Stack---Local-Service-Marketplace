import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="bg-brand-grey text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="LocalServe" className="h-16 w-auto" />
                    {/* <span className="text-2xl font-bold"><span className="text-brand-yellow">Local</span>Serve</span> */}
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                    {user && user.role === 'admin' ? (
                        /* Admin View */
                        <>
                            <Link to="/admin" className="hover:text-brand-yellow transition-colors">Admin Dashboard</Link>
                            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-600">
                                <span className="text-brand-yellow text-sm font-semibold">{user.name}</span>
                                <button onClick={logout} className="text-gray-300 hover:text-white" title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Regular User / Guest View */
                        <>
                            <Link to="/" className="hover:text-brand-yellow transition-colors">Home</Link>
                            {user ? (
                                <>
                                    {user.role === 'provider' && (
                                        <Link to="/my-services" className="hover:text-brand-yellow transition-colors">My Services</Link>
                                    )}
                                    <Link to="/bookings" className="hover:text-brand-yellow transition-colors">Bookings</Link>
                                    <Link to="/chat" className="hover:text-brand-yellow transition-colors">Messages</Link>
                                    <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-600">
                                        <span className="text-brand-yellow text-sm font-semibold">{user.name}</span>
                                        <button onClick={logout} className="text-gray-300 hover:text-white" title="Logout">
                                            <LogOut size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="hover:text-brand-yellow transition-colors">Login</Link>
                                    <Link to="/register" className="bg-brand-yellow text-brand-grey px-4 py-2 rounded font-bold hover:bg-yellow-400 transition-colors">
                                        Join Now
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    <Menu />
                </button>
            </div>

            {/* Mobile Menu */}
            {
                isOpen && (
                    <div className="md:hidden bg-gray-800 p-4">
                        {user && user.role === 'admin' ? (
                            <>
                                <Link to="/admin" className="block py-2 hover:text-brand-yellow">
                                    Admin Dashboard
                                </Link>
                                <button onClick={logout} className="block w-full text-left py-2 text-red-400">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="block py-2 hover:text-brand-yellow">Home</Link>
                                {user ? (
                                    <>
                                        {user.role === 'provider' && (
                                            <Link to="/my-services" className="block py-2 hover:text-brand-yellow">My Services</Link>
                                        )}
                                        <Link to="/bookings" className="block py-2 hover:text-brand-yellow">Bookings</Link>
                                        <Link to="/chat" className="block py-2 hover:text-brand-yellow">Messages</Link>
                                        <button onClick={logout} className="block w-full text-left py-2 text-red-400">Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="block py-2 hover:text-brand-yellow">Login</Link>
                                        <Link to="/register" className="block py-2 hover:text-brand-yellow">Register</Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
