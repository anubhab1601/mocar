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

    useEffect(() => {
        // Redirect if not admin (client-side protection)
        // We add a small delay to allow AuthContext to resolve
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
                setError('Failed to fetch messages. Ensure you are logged in as admin.');
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

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                <h1>Admin Inquiries</h1>
                <button
                    onClick={() => router.push('/')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        background: 'rgba(0, 0, 0, 0.1)', // Little dark but transparent
                        color: 'black', // Text visible (black)
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Back to Home
                </button>
            </div>

            {loading ? (
                <p>Loading messages...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <div style={{ overflowX: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 8 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                        <thead style={{ background: '#222', color: '#FFD700' }}>
                            <tr>
                                <th style={{ padding: 15, textAlign: 'left' }}>Date</th>
                                <th style={{ padding: 15, textAlign: 'left' }}>Name</th>
                                <th style={{ padding: 15, textAlign: 'left' }}>Contact</th>
                                <th style={{ padding: 15, textAlign: 'left' }}>Inquiry Type</th>
                                <th style={{ padding: 15, textAlign: 'left', width: '40%' }}>Message</th>
                                <th style={{ padding: 15, textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: 30, textAlign: 'center' }}>No messages found.</td>
                                </tr>
                            ) : (
                                messages.map(m => (
                                    <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: 15 }}>{new Date(m.created_at || Date.now()).toLocaleDateString()} {new Date(m.created_at || Date.now()).toLocaleTimeString()}</td>
                                        <td style={{ padding: 15 }}><strong>{m.name}</strong></td>
                                        <td style={{ padding: 15 }}>
                                            <div>{m.phone}</div>
                                            <div style={{ color: '#666', fontSize: '0.9em' }}>{m.email}</div>
                                        </td>
                                        <td style={{ padding: 15 }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: 4,
                                                background: m.inquiry_type === 'Booking' ? '#e3f2fd' : '#fff3e0',
                                                color: '#333',
                                                fontSize: '0.85em'
                                            }}>
                                                {m.inquiry_type}
                                            </span>
                                        </td>
                                        <td style={{ padding: 15, whiteSpace: 'pre-wrap' }}>{m.message}</td>
                                        <td style={{ padding: 15, textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleDelete(m.id)}
                                                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
                                                title="Delete Message"
                                            >
                                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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
    );
}
