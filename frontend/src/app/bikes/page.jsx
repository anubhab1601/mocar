'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

const heroFallback = '/assets/images/hero-bg/hero-1.png';

export default function BikesPage() {
  const { isAdmin } = useAuth();
  const { bikes, addBike, updateBike, deleteBike } = useData();
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditStart = (bike) => {
    setEditId(bike.id);
    setEditForm({
      name: bike.name,
      badge: bike.badge,
      img: bike.img,
      specs: bike.specs.join(', '),
      '6h': bike.prices['6h'] || '',
      '12h': bike.prices['12h'] || '',
      '24h': bike.prices['24h'] || '',
    });
  };

  const handleEditSave = async (id) => {
    const specs = editForm.specs.split(',').map((s) => s.trim());
    const prices = {};
    if (editForm['6h']) prices['6h'] = parseInt(editForm['6h']);
    if (editForm['12h']) prices['12h'] = parseInt(editForm['12h']);
    if (editForm['24h']) prices['24h'] = parseInt(editForm['24h']);

    await updateBike(id, {
      name: editForm.name,
      badge: editForm.badge,
      img: editForm.img,
      specs,
      prices,
    });
    setEditId(null);
  };

  const handleAddBike = async () => {
    const specs = (editForm.specs || '').split(',').map((s) => s.trim()).filter(Boolean);
    const prices = {};
    if (editForm['6h']) prices['6h'] = parseInt(editForm['6h']);
    if (editForm['12h']) prices['12h'] = parseInt(editForm['12h']);
    if (editForm['24h']) prices['24h'] = parseInt(editForm['24h']);

    await addBike({
      name: editForm.name,
      badge: editForm.badge,
      img: editForm.img,
      specs,
      prices,
    });
    setEditForm({});
    setShowAddForm(false);
  };

  return (
    <>
      <section className="section section-alt" style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ position: 'relative' }}>
            <div className="section-header">
              <h1>Self Drive Bikes in Bhubaneswar</h1>
              <p>Choose from scooters, cruisers, and sports bikes with hourly rental options.</p>
            </div>
            {mounted && isAdmin && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40, marginTop: -30 }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <i className="fas fa-plus" /> Add Bike
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {mounted && isAdmin && showAddForm && (
        <section className="section" style={{ backgroundColor: '#f9f9f9' }}>
          <div className="container">
            <h3>Add New Bike</h3>
            <AdminBikeForm
              form={editForm}
              onChange={setEditForm}
              onSave={handleAddBike}
              onCancel={() => { setShowAddForm(false); setEditForm({}); }}
            />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="vehicles-grid">
            {bikes.map((bike) => (
              <div key={bike.id} style={{ position: 'relative' }}>
                {mounted && isAdmin && editId !== bike.id && (
                  <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEditStart(bike)}
                      style={{ marginRight: 5, fontSize: '0.8rem' }}
                    >
                      <i className="fas fa-edit" /> Edit
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => deleteBike(bike.id)}
                      style={{ fontSize: '0.8rem', backgroundColor: '#dc3545' }}
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                )}

                {editId === bike.id ? (
                  <AdminBikeForm
                    form={editForm}
                    onChange={setEditForm}
                    onSave={() => handleEditSave(bike.id)}
                    onCancel={() => setEditId(null)}
                    isCard
                  />
                ) : (
                  <VehicleCard {...bike} fallback={heroFallback} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container text-center">
          <h2 style={{ marginBottom: 20 }}>Need Help Choosing?</h2>
          <p style={{ fontSize: '1.05rem', marginBottom: 28, maxWidth: 720, marginInline: 'auto' }}>
            Not sure which bike is right for you? Contact us for personalized recommendations.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+919090610116" className="btn btn-primary btn-lg">
              <i className="fas fa-phone" /> Call Now
            </a>
            <a href="/contact" className="btn btn-secondary btn-lg">
              <i className="fas fa-envelope" /> Send Inquiry
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function VehicleCard({ badge, name, img, specs, prices, fallback }) {
  const safeImg = img || fallback;
  return (
    <div className="vehicle-card">
      <div className="vehicle-image">
        <img src={safeImg} alt={name} onError={(e) => (e.currentTarget.src = fallback)} />
        {badge && <span className="vehicle-badge">{badge}</span>}
      </div>
      <div className="vehicle-info">
        <h3 className="vehicle-name">{name}</h3>
        <div className="vehicle-specs">
          {specs.map((s) => (
            <span className="spec-item" key={s}>
              <i className="fas fa-check" /> {s}
            </span>
          ))}
        </div>
        <div className="vehicle-pricing">
          {prices['6h'] && (
            <div className="pricing-row">
              <span className="pricing-label">6 Hours:</span>
              <span className="pricing-value">Rs {prices['6h']}</span>
            </div>
          )}
          {prices['12h'] && (
            <div className="pricing-row">
              <span className="pricing-label">12 Hours:</span>
              <span className="pricing-value">Rs {prices['12h']}</span>
            </div>
          )}
          {prices['24h'] && (
            <div className="pricing-row">
              <span className="pricing-label">24 Hours:</span>
              <span className="pricing-value">Rs {prices['24h']}</span>
            </div>
          )}
        </div>
        <div className="vehicle-actions">
          <a href="/contact" className="btn btn-primary" style={{ width: '100%' }}>
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}

function AdminBikeForm({ form, onChange, onSave, onCancel }) {
  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: 20,
      borderRadius: 8,
      border: '2px solid #FFD700',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 15, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Bike Name"
          value={form.name || ''}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          style={{ padding: '10px', borderRadius: 5, border: '1px solid #ddd', boxSizing: 'border-box', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Badge (e.g., Popular)"
          value={form.badge || ''}
          onChange={(e) => onChange({ ...form, badge: e.target.value })}
          style={{ padding: '10px', borderRadius: 5, border: '1px solid #ddd', boxSizing: 'border-box', width: '100%' }}
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem', color: '#666' }}>Bike Image (Required)</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <label
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--primary-yellow)',
                color: 'var(--black)',
                borderRadius: 5,
                cursor: 'pointer',
                fontWeight: 600,
                display: 'inline-block'
              }}
            >
              <i className="fas fa-upload" style={{ marginRight: 8 }} />
              {form.img ? 'Change Photo' : 'Upload Photo'}
              <input
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append('file', file);
                  try {
                    const token = localStorage.getItem('mo_car_admin_token');
                    if (!token) {
                      alert('You are not logged in!');
                      return;
                    }
                    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5500/api';
                    const res = await fetch(`${API_BASE}/upload`, {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${token}` },
                      body: formData
                    });
                    const data = await res.json();
                    if (data.success) {
                      onChange({ ...form, img: data.url });
                    } else {
                      alert('Upload failed: ' + data.message);
                    }
                  } catch (err) {
                    alert('Upload error');
                  }
                }}
              />
            </label>
            {form.img && (
              <span style={{ color: 'green', fontSize: '0.9rem' }}>
                <i className="fas fa-check-circle" /> Image Uploaded
              </span>
            )}
          </div>
        </div>
        <input
          type="text"
          placeholder="Specs (comma separated)"
          value={form.specs || ''}
          onChange={(e) => onChange({ ...form, specs: e.target.value })}
          style={{ padding: '10px', borderRadius: 5, border: '1px solid #ddd', boxSizing: 'border-box', width: '100%', gridColumn: '1 / -1' }}
        />
        <input
          type="number"
          placeholder="6 Hour Price"
          value={form['6h'] || ''}
          onChange={(e) => onChange({ ...form, '6h': e.target.value })}
          style={{ padding: '10px', borderRadius: 5, border: '1px solid #ddd', boxSizing: 'border-box', width: '100%' }}
        />
        <input
          type="number"
          placeholder="12 Hour Price"
          value={form['12h'] || ''}
          onChange={(e) => onChange({ ...form, '12h': e.target.value })}
          style={{ padding: '10px', borderRadius: 5, border: '1px solid #ddd', boxSizing: 'border-box', width: '100%' }}
        />
        <input
          type="number"
          placeholder="24 Hour Price"
          value={form['24h'] || ''}
          onChange={(e) => onChange({ ...form, '24h': e.target.value })}
          style={{ padding: '10px', borderRadius: 5, border: '1px solid #ddd', boxSizing: 'border-box', width: '100%' }}
        />
      </div>
      {onSave && (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-start' }}>
          <button
            onClick={onSave}
            className="btn btn-primary"
          >
            Save Bike
          </button>
          <button
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
