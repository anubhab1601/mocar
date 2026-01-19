'use client';



const features = [
  ['24/7 Customer Support', 'fas fa-shield-alt', 'Always-on support during your rental.'],
  ['Latest Fleet', 'fas fa-car-side', 'New, well-maintained cars and bikes.'],
  ['Transparent Pricing', 'fas fa-hand-holding-dollar', 'Clear pricing, no hidden charges.'],
  ['Flexible Timings', 'fas fa-clock', '6h, 12h, or 24h slots to fit your plan.'],
  ['Easy Booking', 'fas fa-check-circle', 'Simple booking over phone or online.'],
  ['Convenient Location', 'fas fa-map-marked-alt', 'Nayapalli office, easy to reach.'],
];

export default function AboutPage() {
  return (
    <>
      <section className="section section-alt" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="section-header">
            <h1>About MoCar</h1>
            <p>Your trusted partner for self-drive rentals in Bhubaneswar</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row" style={{ alignItems: 'center', gap: 30 }}>
            <div className="col-md-12">
              <h2 style={{ marginBottom: 20 }}>Our Mission</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 18 }}>
                At MoCar, we keep rentals simple, affordable, and reliable. Enjoy flexible time slots, transparent prices, and a well-kept fleet of cars and bikes.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 18 }}>
                Travel with freedom—whether for a few hours, a full day, or longer. Book instantly and pick up at Nayapalli, Bhubaneswar.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
                Our team is local, responsive, and ready to help you stay on schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose MoCar?</h2>
            <p>Service, safety, and value in one place</p>
          </div>
          <div className="features-grid">
            {features.map(([title, icon, desc]) => (
              <div className="feature-card" key={title}>
                <div className="feature-icon">
                  <i className={icon} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Visit Our Location</h2>
            <p>Meet us at Nayapalli for bookings and pickups</p>
          </div>

          <div className="row" style={{ gap: 30, alignItems: 'stretch', justifyContent: 'center' }}>
            <div className="col-md-6" style={{ flex: '0 0 calc(50% - 15px)' }}>
              <div style={{ backgroundColor: 'var(--light-gray)', padding: 32, borderRadius: 10, height: '100%' }}>
                <h3 style={{ marginBottom: 24 }}>Contact Details</h3>
                <InfoRow icon="fas fa-map-marker-alt" title="Address">
                  Block N5/B2, ID Market, IRC Village, Nayapalli, Bhubaneswar, Odisha
                </InfoRow>
                <InfoRow icon="fas fa-phone" title="Phone Numbers">
                  <a href="tel:+919090610116" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>+91-9090610116</a>
                  <br />
                  <a href="tel:+917978624414" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>+91-7978624414</a>
                </InfoRow>
                <InfoRow icon="fas fa-envelope" title="Email">
                  <a href="mailto:info@mocar.co.in" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>info@mocar.co.in</a>
                </InfoRow>
                <InfoRow icon="fab fa-facebook" title="Follow Us">
                  <a
                    href="https://www.facebook.com/MoCar-Bike-and-Car-Rental"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-dark)', fontWeight: 600 }}
                  >
                    MoCar - Bike and Car Rental
                  </a>
                </InfoRow>
              </div>
            </div>

            <div className="col-md-6" style={{ flex: '0 0 calc(50% - 15px)' }}>
              <div style={{ borderRadius: 10, overflow: 'hidden', width: '100%', height: '100%' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.767!2d85.81483302082738!3d20.29431162962591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190a0d2e1234:0xabcd123456!2sMoCar%20Office!5e0!3m2!1sen!2sin!4v1642000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MoCar Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container text-center">
          <h2 style={{ marginBottom: 16 }}>Ready to Book Your Vehicle?</h2>
          <p style={{ fontSize: '1.05rem', marginBottom: 28, maxWidth: 700, marginInline: 'auto' }}>
            Experience simple self-drive rentals with MoCar. Call or message us to reserve your car or bike today.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contact" className="btn btn-primary btn-lg">
              <i className="fas fa-envelope" /> Contact Us
            </a>
            <a href="/cars" className="btn btn-secondary btn-lg">
              <i className="fas fa-car" /> View Vehicles
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({ icon, title, children }) {
  return (
    <div style={{ marginBottom: 20, display: 'flex', alignItems: 'start', gap: 14 }}>
      <i className={icon} style={{ color: 'var(--primary-yellow)', fontSize: '1.3rem', marginTop: 6 }} />
      <div>
        <h4 style={{ marginBottom: 8 }}>{title}</h4>
        <p style={{ margin: 0, lineHeight: 1.6 }}>{children}</p>
      </div>
    </div>
  );
}
