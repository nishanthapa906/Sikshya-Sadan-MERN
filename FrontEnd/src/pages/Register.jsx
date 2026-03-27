import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FaUser, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await authAPI.register(formData);
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section flex-center min-h-screen">
            <div className="card container" style={{ maxWidth: '900px', display: 'grid', gridTemplateColumns: '1fr 1fr', padding: 0, overflow: 'hidden' }}>
                {/* LEFT SIDE: BANNER */}
                <div className="bg-primary-900 text-white p-12 hidden md:flex flex-col justify-between">
                    <div>
                        <div className="mb-8 p-4 bg-white/10 rounded-xl inline-block">
                            <FaUser size={30} className="text-primary-300" />
                        </div>
                        <h2 className="text-white mb-6 italic">Join the Tech Elite</h2>
                        <p className="opacity-80 leading-relaxed font-light">
                            Unlock premium courses, expert mentorship, and global job placements in Nepal's leading IT ecosystem.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-emerald-400 font-bold">
                            <FaCheckCircle /> Lifetime Community Access
                        </div>
                        <div className="flex items-center gap-3 text-sm text-emerald-400 font-bold">
                            <FaCheckCircle /> Hands-on Project Learning
                        </div>
                        <div className="flex items-center gap-3 text-sm text-emerald-400 font-bold">
                            <FaCheckCircle /> Verified Certifications
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: FORM */}
                <div className="p-10 space-y-8">
                    <div className="text-center md:text-left">
                        <h3 className="italic mb-2">Create Account</h3>
                        <p className="badge badge-primary">Student Profile</p>
                    </div>

                    {error && (
                        <div className="form-error bg-red-50 p-4 rounded-lg flex items-center gap-3">
                            <FaExclamationCircle /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="form-input"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    required
                                    className="form-input"
                                    placeholder="98XXXXXXXX"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="form-input"
                                placeholder="name@email.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-block"
                        >
                            {loading ? 'Processing...' : 'Complete Registration'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-500 font-medium">
                            Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
