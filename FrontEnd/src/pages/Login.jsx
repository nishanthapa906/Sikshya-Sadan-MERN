import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaEnvelope, FaExclamationCircle } from 'react-icons/fa';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(location.state?.message || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (result.success) {
            const dashboardPath = result.user.role === 'admin' ? '/admin/dashboard' :
                result.user.role === 'instructor' ? '/instructor/dashboard' :
                    '/student/dashboard';
            navigate(dashboardPath);
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="section flex-center min-h-screen">
            <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="text-center mb-10">
                    <h3 className="italic mb-2">Welcome Back</h3>
                    <p className="badge badge-info">Secure Access</p>
                </div>

                {error && (
                    <div className="form-error bg-red-50 p-4 rounded-lg flex items-center gap-3 mb-6">
                        <FaExclamationCircle /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                className="form-input"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="flex-between mb-2">
                            <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                            <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary-600">Forgot?</Link>
                        </div>
                        <input
                            type="password"
                            required
                            className="form-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-block"
                    >
                        {loading ? 'Authorizing...' : 'Sign In Now'}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-gray-500 font-medium">
                        New here? <Link to="/register" className="text-primary-600 font-bold hover:underline">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
