'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5500/api';

  useEffect(() => {
    const city = searchParams.get('city');
    const location = searchParams.get('location');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const type = searchParams.get('type');
    const phone = searchParams.get('phone');

    if (city || start) {
      const formattedStart = start ? new Date(start).toLocaleString() : 'N/A';
      const formattedEnd = end ? new Date(end).toLocaleString() : 'N/A';

      let msg = `Hello, I would like to book a vehicle.\n\n`;
      msg += `Details:\n`;
      msg += `• Vehicle Type: ${type === 'car' ? 'Car' : type === 'bike' ? 'Bike' : 'Vehicle'}\n`;
      msg += `• City: ${city || 'N/A'}\n`;
      msg += `• Pickup/Drop: ${location || 'N/A'}\n`;
      msg += `• Start Time: ${formattedStart}\n`;
      msg += `• End Time: ${formattedEnd}\n`;

      setFormData(prev => ({
        ...prev,
        phone: phone || '',
        inquiryType: type === 'bike' ? 'bike' : 'car',
        message: msg
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ name: '', email: '', phone: '', inquiryType: 'general', message: '' });
        setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
      } else {
        setStatus({ loading: false, success: false, error: data.message || 'Something went wrong' });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Failed to send message' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {status.success && (
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: 15, borderRadius: 5, marginBottom: 20 }}>
          ✅ Message sent successfully! We will contact you shortly.
        </div>
      )}
      {status.error && (
        <div style={{ backgroundColor: '#fcf8e3', color: '#856404', padding: 15, borderRadius: 5, marginBottom: 20 }}>
          ⚠️ {status.error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Your Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your full name"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="your@email.com"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="+91-XXXXXXXXXX"
          required
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="inquiryType">Inquiry Type *</label>
        <select
          id="inquiryType"
          name="inquiryType"
          required
          value={formData.inquiryType}
          onChange={handleChange}
        >
          <option value="general">General Inquiry</option>
          <option value="car">Car Rental</option>
          <option value="bike">Bike Rental</option>
          <option value="feedback">Feedback</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          rows={8}
          placeholder="Tell us about your requirements..."
          required
          value={formData.message}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-lg"
        style={{ width: '100%', opacity: status.loading ? 0.7 : 1 }}
        disabled={status.loading}
      >
        <i className="fas fa-paper-plane" /> {status.loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <section className="section section-alt" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="section-header">
            <h1>Contact Us</h1>
            <p>Bookings, inquiries, or assistance—reach us anytime</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row" style={{ display: 'flex', gap: 30, alignItems: 'stretch', justifyContent: 'center' }}>
            <div className="col-md-6" style={{ flex: '0 0 calc(50% - 15px)', width: 550 }}>
              <div style={{ backgroundColor: 'var(--light-gray)', padding: 32, borderRadius: 10, height: '100%' }}>
                <h2 style={{ marginBottom: 24 }}>Send Us a Message</h2>
                <Suspense fallback={<div>Loading form...</div>}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>

            <div className="col-md-6" style={{ flex: '0 0 calc(50% - 15px)', width: 550 }}>
              <div style={{ backgroundColor: 'var(--light-gray)', padding: 32, borderRadius: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ marginBottom: 24 }}>Contact Information</h2>

                  <InfoBlock icon="fas fa-phone" title="Phone Numbers">
                    <a href="tel:+919090610116" style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '1.05rem' }}>9090610116</a>
                    <br />
                    <a href="tel:+917978624414" style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '1.05rem' }}>7978624414</a>
                    <div style={{ marginTop: 8, color: 'var(--text-gray)', fontSize: '0.9rem' }}>Available 24/7</div>
                  </InfoBlock>

                  <InfoBlock icon="fas fa-envelope" title="Email Address">
                    <a href="mailto:info@mocar.co.in" style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '1.05rem' }}>info@mocar.co.in</a>
                    <div style={{ marginTop: 8, color: 'var(--text-gray)', fontSize: '0.9rem' }}>We respond within 24 hours</div>
                  </InfoBlock>

                  <InfoBlock icon="fas fa-map-marker-alt" title="Office Address">
                    <span style={{ fontWeight: 600 }}>
                      Block N5/B2, ID Market,
                      <br />
                      IRC Village, Nayapalli,
                      <br />
                      Bhubaneswar, Odisha
                    </span>
                  </InfoBlock>
                </div>

                <div style={{ marginTop: 30 }}>
                  <h4 style={{ marginBottom: 16 }}>Follow Us</h4>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <a
                      href="https://www.facebook.com/MoCar-Bike-and-Car-Rental"
                      target="_blank"
                      rel="noreferrer"
                      style={{ width: 48, height: 48, backgroundColor: 'var(--primary-yellow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="fab fa-facebook-f" style={{ color: 'var(--black)', fontSize: '1.2rem' }} />
                    </a>
                    <span style={{ width: 48, height: 48, backgroundColor: 'var(--primary-yellow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.35 }}>
                      <i className="fab fa-instagram" style={{ color: 'var(--black)', fontSize: '1.2rem' }} />
                    </span>
                    <span style={{ width: 48, height: 48, backgroundColor: 'var(--primary-yellow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.35 }}>
                      <i className="fab fa-whatsapp" style={{ color: 'var(--black)', fontSize: '1.2rem' }} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Find Us on Map</h2>
            <p>Visit our office at Nayapalli, Bhubaneswar</p>
          </div>
          <div style={{ borderRadius: 10, overflow: 'hidden', marginTop: 32, boxShadow: 'var(--shadow-hover)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.767!2d85.81483302082738!3d20.29431162962591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190a0d2e1234:0xabcd123456!2sMoCar%20Office!5e0!3m2!1sen!2sin!4v1642000000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MoCar Map"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container text-center">
          <h2 style={{ marginBottom: 16 }}>Need Immediate Assistance?</h2>
          <p style={{ fontSize: '1.05rem', marginBottom: 24, maxWidth: 720, marginInline: 'auto' }}>
            Our support team is available 24/7 to help with bookings and on-trip questions.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+919090610116" className="btn btn-primary btn-lg">
              <i className="fas fa-phone" /> Call Now
            </a>
            <a href="https://www.facebook.com/MoCar-Bike-and-Car-Rental" target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg">
              <i className="fab fa-facebook" /> Message on Facebook
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoBlock({ icon, title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'start', gap: 15 }}>
        <div
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'var(--primary-yellow)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <i className={icon} style={{ color: 'var(--black)', fontSize: '1.2rem' }} />
        </div>
        <div>
          <h4 style={{ marginBottom: 8 }}>{title}</h4>
          <div style={{ margin: 0, lineHeight: 1.6 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
