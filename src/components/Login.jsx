import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, getUserById } from '../api/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (!formData.username.trim()) errors.username = 'Username is required';
        if (!formData.password) errors.password = 'Password is required';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const loginResult = await loginUser(formData.username, formData.password);
            localStorage.setItem('user', JSON.stringify({
                username: formData.username,
                auth: loginResult.auth
            }));

            try {
                const userData = await getUserById(1, loginResult.auth);
                localStorage.setItem('userData', JSON.stringify(userData));
            } catch (err) {
                console.log('Could not fetch user details');
            }

            navigate('/dashboard');
        } catch (error) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p className="subtitle">Sign in to your account</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={validationErrors.username ? 'error' : ''}
                            placeholder="Enter your username"
                            disabled={loading}
                        />
                        {validationErrors.username && (
                            <span className="validation-error">{validationErrors.username}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={validationErrors.password ? 'error' : ''}
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                        {validationErrors.password && (
                            <span className="validation-error">{validationErrors.password}</span>
                        )}
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="auth-link">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;