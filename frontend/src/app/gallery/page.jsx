'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

export default function GalleryPage() {
  const { isAdmin } = useAuth();
  const { gallery, addGalleryImage, removeGalleryImage } = useData();
  const [lightbox, setLightbox] = useState({ open: false, src: '' });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  /* New Lightbox Logic */
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === -1) return;
      if (e.key === 'Escape') setLightboxIndex(-1);
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, gallery]);

  const showNext = (e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % gallery.length);
  };

  const showPrev = (e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const currentImage = lightboxIndex !== -1 ? gallery[lightboxIndex] : '';

  /* End New Lightbox Logic */

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) return;
    const ok = await addGalleryImage(newImageUrl.trim());
    if (ok) setNewImageUrl('');
  };

  return (
    <>
      <section className="section section-alt" style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ position: 'relative' }}>
            <div className="section-header">
              <h1>Our Gallery</h1>
              <p>Explore our fleet and happy customers</p>
            </div>
            {mounted && isAdmin && (
              <div style={{ backgroundColor: '#f5f5f5', padding: 20, borderRadius: 8, maxWidth: 500, margin: '0 auto 40px auto', marginTop: -30 }}>
                <h4 style={{ textAlign: 'center', marginBottom: 15 }}>Add Photo</h4>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <label
                    className="btn btn-primary"
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <i className="fas fa-upload" /> {newImageUrl ? 'Photo Selected' : 'Upload Photo'}
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        // Optional: Clear previous if any

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
                            // Immediately Add to Gallery
                            await addGalleryImage(data.url);
                            alert('Photo added!');
                          } else {
                            alert('Upload failed: ' + data.message);
                          }
                        } catch (err) {
                          alert('Upload error');
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="gallery-grid">
            {gallery.map((src, index) => (
              <div key={src} style={{ position: 'relative' }}>
                {mounted && isAdmin && (
                  <button
                    onClick={async () => { await removeGalleryImage(src); }}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: '#dc3545',
                      border: 'none',
                      color: 'white',
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: 20,
                      zIndex: 10,
                    }}
                  >
                    ×
                  </button>
                )}
                <div className="gallery-item" onClick={() => setLightboxIndex(index)}>
                  <img src={src} alt="Gallery" />
                  <div className="gallery-overlay">
                    <i className="fas fa-search-plus" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container text-center">
          <h2 style={{ marginBottom: 16 }}>Like What You See?</h2>
          <p style={{ fontSize: '1.05rem', marginBottom: 24, maxWidth: 720, marginInline: 'auto' }}>
            Pick your favorite vehicle and book instantly.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/cars" className="btn btn-primary btn-lg">
              <i className="fas fa-car" /> View Cars
            </a>
            <a href="/bikes" className="btn btn-secondary btn-lg">
              <i className="fas fa-motorcycle" /> View Bikes
            </a>
          </div>
        </div>
      </section>

      {lightboxIndex !== -1 && (
        <div
          className="lightbox"
          onClick={() => setLightboxIndex(-1)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <span
            className="lightbox-close"
            style={{
              position: 'absolute',
              top: 30,
              right: 30,
              color: 'white',
              fontSize: 40,
              cursor: 'pointer',
              zIndex: 10001
            }}
          >
            &times;
          </span>

          <button
            onClick={showPrev}
            style={{
              position: 'absolute',
              left: 20,
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: 40,
              cursor: 'pointer',
              zIndex: 10001,
              padding: 20
            }}
          >
            &#10094;
          </button>

          <img
            className="lightbox-content"
            src={currentImage}
            alt="Gallery"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: '90vh',
              maxWidth: '90vw',
              objectFit: 'contain',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }}
          />

          <button
            onClick={showNext}
            style={{
              position: 'absolute',
              right: 20,
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: 40,
              cursor: 'pointer',
              zIndex: 10001,
              padding: 20
            }}
          >
            &#10095;
          </button>

          <div style={{
            position: 'absolute',
            bottom: 20,
            color: 'white',
            fontSize: '1rem'
          }}>
            {lightboxIndex + 1} / {gallery.length}
          </div>
        </div>
      )}
    </>
  );
}
