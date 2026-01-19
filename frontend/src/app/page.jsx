'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import Testimonials from '@/components/Testimonials';
import CallToAction from '@/components/CallToAction';

const heroSlides = [
  '/assets/images/hero-bg/hero-1.png',
  '/assets/images/hero-bg/hero-2.png',
  '/assets/images/hero-bg/hero-3.png',
];

const featured = [
  {
    badge: 'Popular',
    name: 'Swift Dzire',
    img: heroSlides[0],
    specs: ['A/C', 'Manual', 'Petrol', '5 Seats'],
    prices: [
      ['6 Hours', 'Rs 1,200'],
      ['12 Hours', 'Rs 1,300'],
      ['24 Hours', 'Rs 1,600'],
    ],
  },
  {
    badge: 'Budget',
    name: 'Maruti Alto',
    img: heroSlides[1],
    specs: ['A/C', 'Manual', 'Petrol', '4 Seats'],
    prices: [
      ['6 Hours', 'Rs 800'],
      ['12 Hours', 'Rs 1,020'],
      ['24 Hours', 'Rs 1,320'],
    ],
  },
  {
    badge: 'Premium',
    name: 'Royal Enfield Bullet 350',
    img: heroSlides[2],
    specs: ['Cruiser', '350cc', 'Petrol'],
    prices: [
      ['12 Hours', 'Rs 800'],
      ['24 Hours', 'Rs 1,100'],
    ],
  },
  {
    badge: 'Adventure',
    name: 'Mahindra Thar',
    img: heroSlides[0],
    specs: ['A/C', 'Manual', 'Diesel', '4 Seats'],
    prices: [
      ['12 Hours', 'Rs 3,000'],
      ['24 Hours', 'Rs 3,500'],
    ],
  },
  {
    badge: 'Economy',
    name: 'Honda Activa 4G',
    img: heroSlides[1],
    specs: ['Scooter', '110cc', 'Petrol'],
    prices: [
      ['12 Hours', 'Rs 400'],
      ['24 Hours', 'Rs 500'],
    ],
  },
  {
    badge: 'Sports',
    name: 'KTM RC 200',
    img: heroSlides[2],
    specs: ['Sports', '200cc', 'Petrol'],
    prices: [
      ['12 Hours', 'Rs 1,000'],
      ['24 Hours', 'Rs 1,400'],
    ],
  },
];

const whyChoose = [
  ['Instant Booking', 'fas fa-bolt', 'Book quickly and easily online.', 'Instant confirmations for your bookings.'],
  ['Price Match Guarantee', 'fas fa-tag', 'Best rental prices guaranteed.', 'Luxury, economy, and family rentals.'],
  ['24 Hour Assistance', 'fas fa-headset', 'Call us anytime for support.', 'Free transfer or replacement car available.'],
  ['Great Service', 'fas fa-smile', 'Fast without compromising quality.', 'Top-tier customer service for every trip.'],
  ['Knowledgeable Staff', 'fas fa-user-tie', 'Local experts ready to help.', 'Answers and solutions along your journey.'],
  ['No Vehicle Over 12 Months Old', 'fas fa-car', 'Modern, clean, reliable fleet.', 'Choose modern hatchbacks, sedans, crossovers.'],
];

const articles = [
  {
    day: '19',
    month: 'Aug',
    title: 'Safety Tips for Driving',
    text: 'Wearing your seat belt is essential. Avoid fines and protect yourself.',
  },
  {
    day: '30',
    month: 'Aug',
    title: 'Wear a Helmet While Driving a Bike',
    text: 'Helmets greatly increase survival in accidents. Always wear one.',
  },
];



export default function HomePage() {
  const [slideIndex, setSlideIndex] = useState(0);
  /* New Lightbox Logic */
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [mounted, setMounted] = useState(false);

  // Change Username Logic
  const [changeUserForm, setChangeUserForm] = useState({ currentPassword: '', newUsername: '' });
  const [changeUserMsg, setChangeUserMsg] = useState({ type: '', text: '' });

  // Messages Logic
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('mo_car_admin_token');
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5500/api';
      const res = await fetch(`${API_BASE}/contact`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  useEffect(() => {
    if (showAdminPanel && showMessages) {
      fetchMessages();
    }
  }, [showAdminPanel, showMessages]);

  const handleDeleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const token = localStorage.getItem('mo_car_admin_token');
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5500/api';
      await fetch(`${API_BASE}/contact/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages(messages.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete message', err);
    }
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    setChangeUserMsg({ type: '', text: '' });

    try {
      const token = localStorage.getItem('mo_car_admin_token');
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5500/api';
      const res = await fetch(`${API_BASE}/auth/change-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(changeUserForm)
      });
      const data = await res.json();
      if (data.success) {
        setChangeUserMsg({ type: 'success', text: 'Username updated successfully' });
        setChangeUserForm({ currentPassword: '', newUsername: '' });
      } else {
        setChangeUserMsg({ type: 'error', text: data.message || 'Failed to update username' });
      }
    } catch (err) {
      setChangeUserMsg({ type: 'error', text: 'Network error' });
    }
  };

  const { isAdmin } = useAuth();
  const {
    cities, locations, heroImages, gallery,
    addCity, removeCity, addLocation, removeLocation,
    addHeroImage, removeHeroImage
  } = useData();

  // Dynamically use gallery from DB
  const displayGallery = gallery || [];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === -1) return;
      if (e.key === 'Escape') setLightboxIndex(-1);
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const showNext = (e) => {
    if (e) e.stopPropagation();
    if (displayGallery.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % displayGallery.length);
  };

  const showPrev = (e) => {
    if (e) e.stopPropagation();
    if (displayGallery.length === 0) return;
    setLightboxIndex((prev) => (prev - 1 + displayGallery.length) % displayGallery.length);
  };

  const currentImage = lightboxIndex !== -1 ? displayGallery[lightboxIndex] : '';
  /* End New Lightbox Logic */

  // If DB has hero images, use them. Otherwise fallback to static default.
  // heroImages from DB is array of { id, url }.
  // We make sure we have at least 1 image to avoid index errors.
  const displayHeroImages = useMemo(() => {
    if (heroImages && heroImages.length > 0) {
      return heroImages.map(h => h.url);
    }
    return heroSlides;
  }, [heroImages]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Safety check
    if (displayHeroImages.length === 0) return;

    // We strictly use the Carousel for images now, which handles smooth transitions.
    // The background-image on the section caused hard repaints (lag).

    const slideTimer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % displayHeroImages.length);
    }, 4000); // 4 seconds per slide
    return () => {
      clearInterval(slideTimer);
    };
  }, [displayHeroImages]);

  return (
    <>
      <section
        className="hero"
        // Removed dynamic url() to prevent lag. The carousel handles the images.
        // We keep the gradient as a base or rely on CSS.
        style={{ position: 'relative' }}
      >
        <div className="hero-carousel">
          {displayHeroImages.map((src, idx) => (
            <div className={`hero-slide ${idx === slideIndex ? 'active' : ''}`} key={src + idx}>
              <img src={src} alt="Hero" />
            </div>
          ))}
        </div>

        <div className="container">
          <div className="hero-content">
            <div>
              <h1>
                Rent Cars & Bikes Easily in <span>Bhubaneswar</span> - Self Drive!
              </h1>
              <p>Affordable, Instant Booking, Flexible Time Slots (6 hr / 12 hr / 24 hr)</p>

              <div className="hero-cta">
                <a href="#booking" className="btn btn-primary btn-lg">Book Now</a>
                <a href="/cars" className="btn btn-outline btn-lg">View Fleet</a>
                {mounted && isAdmin && (
                  <button
                    onClick={() => window.location.href = '/admin/messages'}
                    className="btn btn-secondary btn-lg"
                    style={{ marginLeft: 10, background: '#222', border: '1px solid #ffd700' }}
                  >
                    View Inquiries
                  </button>
                )}
              </div>
            </div>

            <div className="booking-form" id="booking">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3>Find Your Perfect Vehicle</h3>
                {mounted && isAdmin && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAdminPanel(!showAdminPanel)}
                    style={{ fontSize: '0.9rem' }}
                  >
                    <i className="fas fa-cog" /> Manage Content
                  </button>
                )}
              </div>

              {mounted && isAdmin && showAdminPanel && (
                <div style={{
                  backgroundColor: '#f5f5f5',
                  padding: 20,
                  borderRadius: 8,
                  marginBottom: 20,
                  border: '2px solid #FFD700',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Admin Panel</h4>
                  </div>

                  {showMessages && (
                    <div style={{ marginTop: 20, marginBottom: 20, padding: 10, background: '#fff', borderRadius: 8, border: '1px solid #ddd' }}>
                      <h5>Recent Inquiries</h5>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                          <thead>
                            <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
                              <th style={{ padding: 8 }}>Date</th>
                              <th style={{ padding: 8 }}>Name</th>
                              <th style={{ padding: 8 }}>Contact</th>
                              <th style={{ padding: 8 }}>Message</th>
                              <th style={{ padding: 8 }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {messages.length === 0 ? (
                              <tr><td colSpan="5" style={{ padding: 20, textAlign: 'center' }}>No inquiries found.</td></tr>
                            ) : (
                              messages.map(m => (
                                <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                                  <td style={{ padding: 8 }}>{new Date(m.created_at || Date.now()).toLocaleDateString()}</td>
                                  <td style={{ padding: 8 }}>{m.name}<br /><small>{m.inquiry_type}</small></td>
                                  <td style={{ padding: 8 }}>{m.phone}<br /><small>{m.email}</small></td>
                                  <td style={{ padding: 8 }}>{m.message}</td>
                                  <td style={{ padding: 8 }}>
                                    <button onClick={() => handleDeleteMessage(m.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}



                  {/* Hero Images Section */}
                  <div style={{ marginTop: 20, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #ccc' }}>
                    <h5>Hero Images (Background Slider)</h5>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                      {heroImages.map((h) => (
                        <div key={h.id} style={{ position: 'relative', width: 100, height: 60 }}>
                          <img src={h.url} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                          <button
                            onClick={() => removeHeroImage(h.id)}
                            style={{
                              position: 'absolute', top: -5, right: -5,
                              background: 'red', color: 'white', border: 'none',
                              borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 12
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <label
                      className="btn btn-primary btn-sm"
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                    >
                      <i className="fas fa-upload" /> Upload Hero Image
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
                            if (!token) { alert('Not logged in!'); return; }

                            const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5500/api';
                            const res = await fetch(`${API_BASE}/upload`, {
                              method: 'POST',
                              headers: { 'Authorization': `Bearer ${token}` },
                              body: formData
                            });
                            const data = await res.json();
                            if (data.success) {
                              await addHeroImage(data.url);
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

                  <div style={{ marginTop: 15 }}>
                    <h5>Cities</h5>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                      <input
                        type="text"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="Add new city"
                        style={{ flex: 1, padding: '8px', borderRadius: 5, border: '1px solid #ddd' }}
                      />
                      <button
                        onClick={async () => {
                          if (!newCity.trim()) return;
                          const ok = await addCity(newCity.trim());
                          if (ok) setNewCity('');
                        }}
                        className="btn btn-primary"
                        style={{ fontSize: '0.85rem' }}
                      >
                        <i className="fas fa-plus" /> Add
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {cities.map((city) => (
                        <span key={city} style={{
                          backgroundColor: '#FFD700',
                          color: '#000',
                          padding: '6px 12px',
                          borderRadius: 20,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}>
                          {city}
                          <button
                            onClick={async () => { await removeCity(city); }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#000',
                              cursor: 'pointer',
                              fontSize: '16px'
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 15 }}>
                    <h5>Pickup/Drop Locations</h5>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                      <input
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="Add new location"
                        style={{ flex: 1, padding: '8px', borderRadius: 5, border: '1px solid #ddd' }}
                      />
                      <button
                        onClick={async () => {
                          if (!newLocation.trim()) return;
                          const ok = await addLocation(newLocation.trim());
                          if (ok) setNewLocation('');
                        }}
                        className="btn btn-primary"
                        style={{ fontSize: '0.85rem' }}
                      >
                        <i className="fas fa-plus" /> Add
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {locations.map((loc) => (
                        <span key={loc} style={{
                          backgroundColor: '#FFD700',
                          color: '#000',
                          padding: '6px 12px',
                          borderRadius: 20,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}>
                          {loc}
                          <button
                            onClick={async () => { await removeLocation(loc); }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#000',
                              cursor: 'pointer',
                              fontSize: '16px'
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Account Settings Toggle (Moved) */}
                  <div style={{ marginTop: 20, marginBottom: 20, borderTop: '1px solid #ccc', paddingTop: 20 }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowAccountSettings(!showAccountSettings)}
                      style={{ fontSize: '0.9rem', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span><i className="fas fa-user-cog" style={{ marginRight: 8 }} /> Account Settings (Change Username)</span>
                      <i className={`fas fa-chevron-${showAccountSettings ? 'up' : 'down'}`} />
                    </button>

                    {showAccountSettings && (
                      <div style={{ marginTop: 20, padding: 15, background: '#fff', borderRadius: 8, border: '1px solid #ddd' }}>
                        <h5>Change Username</h5>
                        <form onSubmit={handleChangeUsername} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: 200 }}>
                            <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Current Password</label>
                            <input
                              type="password"
                              value={changeUserForm.currentPassword}
                              onChange={(e) => setChangeUserForm({ ...changeUserForm, currentPassword: e.target.value })}
                              required
                              style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ddd' }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 200 }}>
                            <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>New Username</label>
                            <input
                              type="text"
                              value={changeUserForm.newUsername}
                              onChange={(e) => setChangeUserForm({ ...changeUserForm, newUsername: e.target.value })}
                              required
                              style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ddd' }}
                            />
                          </div>
                          <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                            Update
                          </button>
                        </form>
                        {changeUserMsg.text && (
                          <div style={{ marginTop: 10, color: changeUserMsg.type === 'success' ? 'green' : 'red', fontSize: '0.9rem' }}>
                            {changeUserMsg.text}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {bookingError && (
                <div style={{
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  padding: '12px 16px',
                  borderRadius: 8,
                  marginBottom: 20,
                  border: '1px solid #ef5350',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  <i className="fas fa-exclamation-triangle" />
                  <span>{bookingError}</span>
                </div>
              )}

              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <select id="city" name="city" defaultValue={cities[0] || 'Bhubaneswar'}>
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="pickupLocation">Pickup/Drop Location</label>
                    <select id="pickupLocation" name="pickupLocation">
                      <option value="">Select Location</option>
                      {locations.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startTime">Start Date &amp; Time</label>
                    <input type="datetime-local" id="startTime" name="startTime" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">End Date &amp; Time</label>
                    <input type="datetime-local" id="endTime" name="endTime" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="vehicleType">Vehicle Type</label>
                    <select id="vehicleType" name="vehicleType">
                      <option value="">Select Vehicle Type</option>
                      <option value="car">Car</option>
                      <option value="bike">Bike</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number (India)</label>
                    <div className="input-group">
                      <span className="input-prefix">+91</span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Enter 10-digit number"
                        pattern="[0-9]{10}"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    const form = e.target.closest('form');
                    const city = form.city.value;
                    const pickupLocation = form.pickupLocation.value;
                    const startTime = form.startTime.value;
                    const endTime = form.endTime.value;
                    const vehicleType = form.vehicleType.value;
                    const phone = form.phone.value;

                    setBookingError('');

                    if (!city) {
                      setBookingError('Please select a city');
                      return;
                    }
                    if (!pickupLocation) {
                      setBookingError('Please select a pickup/drop location');
                      return;
                    }
                    if (!startTime) {
                      setBookingError('Please select start date & time');
                      return;
                    }
                    if (!endTime) {
                      setBookingError('Please select end date & time');
                      return;
                    }
                    if (!vehicleType) {
                      setBookingError('Please select a vehicle type (Car or Bike)');
                      return;
                    }
                    if (!phone || phone.length !== 10) {
                      setBookingError('Please enter a valid 10-digit phone number');
                      return;
                    }

                    // Validation passed - redirect to contact or show success
                    window.location.href = `/contact?city=${city}&location=${pickupLocation}&start=${startTime}&end=${endTime}&type=${vehicleType}&phone=${phone}`;
                  }}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <i className="fas fa-search" /> Book Vehicle
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Featured Vehicles</h2>
            <p>Check out our most popular cars and bikes available for self-drive rental</p>
          </div>

          <div className="vehicles-grid">
            {featured.map((item) => (
              <VehicleCard key={item.name} {...item} />
            ))}
          </div>

          <div className="text-center mt-5">
            <a href="/cars" className="btn btn-primary btn-lg">View All Vehicles</a>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose MoCar?</h2>
            <p>Explore the reasons that make us Bhubaneswar's leading self-drive rental service</p>
          </div>

          <div className="why-choose-grid">
            {whyChoose.map(([title, icon, desc, detail]) => (
              <div className="why-choose-card" key={title}>
                <div className="why-choose-icon">
                  <i className={icon} />
                </div>
                <h3>{title}</h3>
                <p className="card-desc">{desc}</p>
                <p className="card-detail">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Tips and Articles</h2>
            <p>Learn important safety tips and best practices for driving</p>
          </div>

          <div className="articles-grid">
            {articles.map((a) => (
              <ArticleCard key={a.title} {...a} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Gallery</h2>
            <p>See our fleet and happy customers enjoying their journeys</p>
          </div>

          <div className="gallery-grid">
            {displayGallery.slice(0, 12).map((src, index) => (
              <div className="gallery-item" key={src + index} onClick={() => setLightboxIndex(index)}>
                <img src={src} alt="Gallery" />
                <div className="gallery-overlay">
                  <i className="fas fa-search-plus" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <a href="/gallery" className="btn btn-primary btn-lg">View Full Gallery</a>
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
            {lightboxIndex + 1} / {displayGallery.length}
          </div>
        </div>
      )}

      <Testimonials />

      <CallToAction />

      <button
        className="scroll-to-top active"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <i className="fas fa-arrow-up" />
      </button>
    </>
  );
}

function VehicleCard({ badge, name, img, specs, prices }) {
  return (
    <div className="vehicle-card">
      <div className="vehicle-image">
        <img src={img} alt={name} />
        <span className="vehicle-badge">{badge}</span>
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
          {prices.map(([label, value]) => (
            <div className="pricing-row" key={label}>
              <span className="pricing-label">{label}:</span>
              <span className="pricing-value">{value}</span>
            </div>
          ))}
        </div>
        <div className="vehicle-actions">
          <a href="/cars" className="btn btn-outline-black btn-sm">View Details</a>
          <a href="/contact" className="btn btn-primary btn-sm">Book Now</a>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ day, month, title, text }) {
  return (
    <div className="article-card">
      <div className="article-date">
        <span className="date-day">{day}</span>
        <span className="date-month">{month}</span>
      </div>
      <div className="article-content">
        <h3>{title}</h3>
        <p>{text}</p>
        <a href="#" className="read-more">Read More <i className="fas fa-arrow-right" /></a>
      </div>
    </div>
  );
}
