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
    const [filterType, setFilterType] = useState('All'); // All, Booking, Contact

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

    const filteredMessages = filterType === 'All'
        ? messages
        : messages.filter(m => m.inquiry_type === filterType);

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            {/* Premium Header */}
            <div style={{
                background: '#1a1a1a',
                color: '#FFD700',
                padding: '20px 40px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '1px' }}>
                    <i className="fas fa-envelope-open-text" style={{ marginRight: 10 }}></i>
                    Admin Inquiries
                </h1>
                <button
                    onClick={() => router.push('/')}
                    style={{
                        padding: '10px 25px',
                        borderRadius: '30px',
                        border: '2px solid #FFD700',
                        background: 'transparent',
                        color: '#FFD700',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={e => { e.target.style.background = '#FFD700'; e.target.style.color = '#000'; }}
                    onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#FFD700'; }}
                >
                    <i className="fas fa-home" style={{ marginRight: 8 }}></i> Back to Home
                </button>
            </div>

            <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>

                {/* Controls & Filter */}
                <div style={{ display: 'flex', gap: 15, marginBottom: 30, alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>Filter By:</span>
                    {['All', 'Booking', 'Contact', 'Support'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '20px',
                                border: 'none',
                                background: filterType === type ? '#FFD700' : '#e0e0e0',
                                color: filterType === type ? '#000' : '#555',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: filterType === type ? '0 2px 8px rgba(255, 215, 0, 0.4)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            {type}
                        </button>
                    ))}
                    <div style={{ marginLeft: 'auto', color: '#666' }}>
                        Showing {filteredMessages.length} messages
                    </div>
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
                                            <p>No messages found in this category.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMessages.map((m, idx) => (
                                        <tr key={m.id} style={{
                                            borderBottom: '1px solid #f0f0f0',
                                            background: idx % 2 === 0 ? '#fff' : '#fafafa',
                                            transition: 'background 0.2s'
                                        }} className="hover-row">
                                            <td style={{ padding: '20px 25px', color: '#555', fontSize: '0.9rem' }}>
                                                {new Date(m.created_at || Date.now()).toLocaleDateString()}
                                                <br />
                                                <small style={{ opacity: 0.7 }}>{new Date(m.created_at || Date.now()).toLocaleTimeString()}</small>
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
                                            <td style={{ padding: '20px 25px', color: '#444', lineHeight: '1.5', fontSize: '0.95rem' }}>{m.message}</td>
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
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s'
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
