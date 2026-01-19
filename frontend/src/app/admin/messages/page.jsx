'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminMessagesPage() {
    const { user, isAdmin } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters State
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'
    const [vehicleFilter, setVehicleFilter] = useState('All'); // 'All', 'Car', 'Bike'

    useEffect(() => {
        const timer = setTimeout(() => {
            const token = localStorage.getItem('mo_car_admin_token');
            if (!token) {
                router.push('/');
            } else {
                fetchMessages();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('mo_car_admin_token');
            const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5500/api';

            const res = await fetch(`${API_BASE}/contact`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            } else {
                setError('Failed to fetch messages.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error fetching messages.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this message?')) return;
        try {
            const token = localStorage.getItem('mo_car_admin_token');
            const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5500/api';
            await fetch(`${API_BASE}/contact/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            alert('Failed to delete message');
        }
    };

    const handleReset = () => {
        setSortOrder('newest');
        setVehicleFilter('All');
    };

    const filteredMessages = messages
        .filter(m => {
            if (vehicleFilter === 'All') return true;
            // Check if message content contains the vehicle type
            // The message format is "Vehicle Type: Car" or "Vehicle Type: Bike"
            return m.message.toLowerCase().includes(`vehicle type: ${vehicleFilter.toLowerCase()}`);
        })
        .sort((a, b) => {
            const dateA = new Date(a.created_at || 0);
            const dateB = new Date(b.created_at || 0);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    // Helper to format message body compact
    const formatMessage = (msg) => {
        // 1. Ensure "Details:" gets its own line
        // 2. Ensure bullets get newlines, but NOT double newlines if they are already there
        let formatted = msg.replace(/ Details:/g, "\nDetails:");

        // Split by bullets and rejoin to normalize spacing
        // This regex splits by bullet but keeps the delimiter in the result (if we captured it), 
        // but easier: just replace bullet with newline+bullet, then collapse multiple newlines

        formatted = formatted.replace(/•/g, "\n•");

        // Collapse multiple spaces/newlines into single structure
        // We want single lines for bullets.
        // Step 1: Replace multiple newlines with single newline
        formatted = formatted.replace(/\n\s*\n/g, "\n");

        return formatted.trim();
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>

            <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>

                {/* Header & Controls Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 }}>
                    <div>
                        <h1 style={{ margin: '0 0 15px 0', fontSize: '2rem', letterSpacing: '1px', color: '#1a1a1a' }}>
                            <i className="fas fa-envelope-open-text" style={{ marginRight: 10, color: '#FFD700' }}></i>
                            Admin Inquiries
                        </h1>

                        {/* Advanced Filters */}
                        <div style={{ display: 'flex', gap: 15, alignItems: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={handleReset}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    border: '1px solid #ddd',
                                    background: (vehicleFilter === 'All' && sortOrder === 'newest') ? '#222' : '#fff',
                                    color: (vehicleFilter === 'All' && sortOrder === 'newest') ? '#FFD700' : '#555',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                All (Reset)
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontWeight: 'bold', color: '#666', fontSize: '0.9rem' }}>Date:</span>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer' }}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontWeight: 'bold', color: '#666', fontSize: '0.9rem' }}>Vehicle Type:</span>
                                <select
                                    value={vehicleFilter}
                                    onChange={(e) => setVehicleFilter(e.target.value)}
                                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer' }}
                                >
                                    <option value="All">All Types</option>
                                    <option value="Car">Car</option>
                                    <option value="Bike">Bike</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        style={{
                            padding: '10px 25px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#222',
                            color: '#FFD700',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        <i className="fas fa-arrow-left" style={{ marginRight: 8 }}></i> Back to Home
                    </button>
                </div>

                <div style={{ marginBottom: 15, textAlign: 'right', color: '#666', fontSize: '0.9rem' }}>
                    Showing {filteredMessages.length} messages
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 50, color: '#666' }}>
                        <i className="fas fa-spinner fa-spin fa-2x"></i>
                        <p style={{ marginTop: 10 }}>Loading...</p>
                    </div>
                ) : error ? (
                    <div style={{ color: 'red', textAlign: 'center', padding: 30, background: '#fff', borderRadius: 8 }}>{error}</div>
                ) : (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #eee'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#222', color: '#fff' }}>
                                <tr>
                                    <th style={{ padding: '18px 25px', fontWeight: '600', fontSize: '0.95rem' }}>DATE</th>
                                    <th style={{ padding: '18px 25px', fontWeight: '600', fontSize: '0.95rem' }}>NAME</th>
                                    <th style={{ padding: '18px 25px', fontWeight: '600', fontSize: '0.95rem' }}>CONTACT INFO</th>
                                    <th style={{ padding: '18px 25px', fontWeight: '600', fontSize: '0.95rem' }}>TYPE</th>
                                    <th style={{ padding: '18px 25px', fontWeight: '600', fontSize: '0.95rem', width: '35%' }}>MESSAGE</th>
                                    <th style={{ padding: '18px 25px', fontWeight: '600', fontSize: '0.95rem', textAlign: 'center' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMessages.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: 50, textAlign: 'center', color: '#888' }}>
                                            <i className="fas fa-inbox fa-3x" style={{ marginBottom: 15, opacity: 0.3 }}></i>
                                            <p>No messages found matching your filters.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMessages.map((m, idx) => (
                                        <tr key={m.id} style={{
                                            borderBottom: '1px solid #f0f0f0',
                                            background: idx % 2 === 0 ? '#fff' : '#fafafa'
                                        }} className="hover-row">
                                            <td style={{ padding: '20px 25px', color: '#555', fontSize: '0.9rem' }}>
                                                {new Date(m.created_at || Date.now()).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                                <br />
                                                <small style={{ opacity: 0.7 }}>
                                                    {new Date(m.created_at || Date.now()).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </small>
                                            </td>
                                            <td style={{ padding: '20px 25px', fontWeight: 'bold', color: '#333' }}>{m.name}</td>
                                            <td style={{ padding: '20px 25px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                    <span style={{ fontSize: '0.9rem' }}><i className="fas fa-phone-alt" style={{ width: 20, color: '#FFD700' }}></i> {m.phone}</span>
                                                    <a href={`mailto:${m.email}`} style={{ fontSize: '0.9rem', color: '#666', textDecoration: 'none' }}>
                                                        <i className="fas fa-envelope" style={{ width: 20, color: '#FFD700' }}></i> {m.email}
                                                    </a>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 25px' }}>
                                                <span style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    background: m.inquiry_type === 'Booking' ? '#e3f2fd' : '#fff3e0',
                                                    color: m.inquiry_type === 'Booking' ? '#1565c0' : '#ef6c00',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600'
                                                }}>
                                                    {m.inquiry_type}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px 25px', color: '#444', lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                                                {formatMessage(m.message)}
                                            </td>
                                            <td style={{ padding: '20px 25px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleDelete(m.id)}
                                                    style={{
                                                        color: '#ff4444',
                                                        background: '#fff0f0',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: 35,
                                                        height: 35,
                                                        cursor: 'pointer',
                                                    }}
                                                    title="Delete Message"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
