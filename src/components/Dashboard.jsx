import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../api/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login');
            return;
        }

        const userObj = JSON.parse(user);
        if (!userObj.auth) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const storedUserData = localStorage.getItem('userData');
                if (storedUserData) {
                    setUserData(JSON.parse(storedUserData));
                } else {
                    const data = await getUserById(1, userObj.auth);
                    setUserData(data);
                    localStorage.setItem('userData', JSON.stringify(data));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userData');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <h2>👋 Welcome!</h2>
                <p className="welcome-text">You are now signed in</p>

                {userData && (
                    <div className="user-info">
                        <p><strong>Username:</strong> {userData.username}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Full Name:</strong> {userData.fullName}</p>
                        <p><strong>User ID:</strong> {userData.id}</p>
                    </div>
                )}

                <button onClick={handleLogout} className="btn-danger">
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Dashboard;