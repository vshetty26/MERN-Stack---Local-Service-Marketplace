import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-slate-100">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md border-t-4 border-brand-yellow">
                <h2 className="text-2xl font-bold mb-6 text-center text-brand-grey">Login to LocalServe</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-brand-yellow" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-brand-yellow" required />
                    </div>
                    <button type="submit" className="w-full bg-brand-yellow text-brand-grey font-bold py-2 px-4 rounded hover:bg-yellow-500 transition-colors">
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">Don't have an account? <Link to="/register" className="text-brand-yellow font-bold hover:underline">Register</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
