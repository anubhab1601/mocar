const terms = {
  general: [
    'Renter must be 21+ with a valid car license (18+ with two-wheeler license for bikes).',
    'License must be held for at least 1 year.',
    'Government ID and local address proof required.',
    'Provide two references with valid contact numbers.',
  ],
  booking: [
    'Bookings allowed online, phone, or in-office; advance booking recommended.',
    'Security deposit is taken at pickup and refunded after inspection.',
    'Payment is due at pickup; accepted: Cash, UPI, Bank Transfer, Cards.',
    'All prices are in INR and can change without notice.',
  ],
  cancellation: [
    '24+ hours before pickup: full refund.',
    'Less than 24 hours: 50% charge.',
    'No-show/after pickup time: no refund.',
  ],
  permittedUse: [
    'Personal, non-commercial use only.',
    'Only the listed renter may drive.',
    'No racing, rally, or competitive events.',
    'No sub-letting of the vehicle.',
  ],
  geo: [
    'Use within Odisha unless written permission obtained.',
    'Interstate travel needs approval and may add charges.',
    'Hilly/restricted terrain requires prior approval.',
  ],
  prohibited: [
    'No driving under influence of alcohol/drugs.',
    'No smoking inside the vehicle.',
    'No illegal goods or hazardous materials.',
    'Do not exceed registered passenger capacity.',
  ],
  returnPolicy: [
    'Return at agreed time/location; late returns billed hourly.',
    '30-minute grace period; beyond 3 hours counts as a full day.',
    'Return vehicle in same condition and fuel level as pickup.',
    'Keep vehicle reasonably clean; excessive dirt incurs charges.',
  ],
  penalties: [
    'Traffic fines are renter’s responsibility; Rs 500 admin fee per violation if processed by MoCar.',
    'Damage: actual repair + handling (15–20%) depending on severity; downtime may apply.',
    'Lost keys: Rs 2,000–5,000; lost RC/insurance: Rs 5,000 + actual cost.',
    'Smoking in vehicle: Rs 2,000 cleaning; excessive dirt: Rs 500–2,000; fuel shortfall: fuel cost + Rs 500.',
  ],
  accident: [
    'Inform MoCar immediately; file FIR; stay at site until police arrive.',
    'Take photos and collect details; do not admit liability.',
    'Insurance is comprehensive; deductible is renter’s responsibility; misuse/reckless driving is excluded.',
  ],
  theft: [
    'Report immediately and file FIR within 24 hours.',
    'Negligence (keys left/unlocked) makes renter fully liable; otherwise insurance claim processed with deductible.',
  ],
  breakdown: [
    'Inform MoCar; do not repair with unauthorised mechanics.',
    'Mechanical failures covered; misuse-caused breakdowns are chargeable.',
    'Check oil, coolant, and tyre pressure; report warnings promptly.',
  ],
  fuel: [
    'Return with same fuel level as pickup.',
    'Wrong fuel type or discrepancy charges apply (fuel + Rs 500).',
  ],
  privacy: [
    'Personal data used only for rental and compliance.',
    'Contact info may be used for offers (opt-out available).',
    'Payments are processed securely; not stored on our servers.',
  ],
  disputes: [
    'Disputes resolved amicably; jurisdiction: Bhubaneswar courts.',
    'Terms governed by Indian law.',
  ],
  forceMajeure: [
    'We are not liable for delays/failures due to events beyond control (natural disasters, strikes, restrictions).',
    'We will work to reschedule or refund appropriately.',
  ],
};

export default function TermsPage() {
  return (
    <>
      <section className="section section-alt" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="section-header">
            <h1>Terms & Conditions</h1>
            <p>Please review these terms before renting a vehicle from MoCar</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="terms-content" style={{ maxWidth: 900, margin: '0 auto' }}>
            <ImportantNote>
              By renting from MoCar you agree to comply with all terms below. Read carefully before booking.
            </ImportantNote>

            <TermBlock title="1. General Terms" items={terms.general} />
            <TermBlock title="2. Booking & Payment" items={terms.booking} />
            <SubList title="Cancellation Policy" items={terms.cancellation} />

            <TermBlock title="3. Vehicle Usage & Restrictions" items={terms.permittedUse} />
            <SubList title="Geographical Restrictions" items={terms.geo} />
            <SubList title="Prohibited Activities" items={terms.prohibited} />

            <TermBlock title="4. Return Policy" items={terms.returnPolicy} />

            <TermBlock title="5. Penalties & Fines" items={terms.penalties} />

            <TermBlock title="6. Accident & Insurance" items={terms.accident} />

            <TermBlock title="7. Theft & Security" items={terms.theft} />

            <TermBlock title="8. Breakdown & Maintenance" items={terms.breakdown} />

            <TermBlock title="9. Fuel Policy" items={terms.fuel} />

            <TermBlock title="10. Privacy & Data" items={terms.privacy} />

            <TermBlock title="11. Dispute Resolution" items={terms.disputes} />

            <TermBlock title="12. Force Majeure" items={terms.forceMajeure} />

            <ImportantNote>
              Contact: 9090610116 / 7978624414 · info@mocar.co.in · Block N5/B2, ID Market, IRC Village, Nayapalli, Bhubaneswar, Odisha.
            </ImportantNote>

            <p style={{ textAlign: 'center', marginTop: 24, fontStyle: 'italic', color: 'var(--text-gray)' }}>
              Last Updated: January 11, 2026
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container text-center">
          <h2 style={{ marginBottom: 16 }}>Ready to Book?</h2>
          <p style={{ fontSize: '1.05rem', marginBottom: 24, maxWidth: 720, marginInline: 'auto' }}>
            Now that you know the terms, choose your vehicle and start your journey.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/#booking" className="btn btn-primary btn-lg">
              <i className="fas fa-calendar-check" /> Book Now
            </a>
            <a href="/contact" className="btn btn-secondary btn-lg">
              <i className="fas fa-question-circle" /> Have Questions?
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function TermBlock({ title, items }) {
  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ color: 'var(--black)', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid var(--primary-yellow)' }}>
        {title}
      </h3>
      <ul style={{ marginLeft: 24, marginBottom: 12 }}>
        {items.map((item) => (
          <li key={item} style={{ lineHeight: 1.8, color: 'var(--text-gray)', marginBottom: 10 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SubList({ title, items }) {
  return (
    <div style={{ marginTop: 12, marginLeft: 6 }}>
      <h4 style={{ color: 'var(--medium-gray)', marginBottom: 12 }}>{title}</h4>
      <ul style={{ marginLeft: 20, marginBottom: 12 }}>
        {items.map((item) => (
          <li key={item} style={{ lineHeight: 1.7, color: 'var(--text-gray)', marginBottom: 8 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ImportantNote({ children }) {
  return (
    <div
      style={{
        backgroundColor: '#fff3cd',
        borderLeft: '4px solid var(--primary-yellow)',
        padding: 18,
        margin: '24px 0',
        borderRadius: 6,
        lineHeight: 1.7,
      }}
    >
      <strong style={{ color: 'var(--black)' }}>
        <i className="fas fa-exclamation-triangle" /> Important:
      </strong>{' '}
      {children}
    </div>
  );
}
