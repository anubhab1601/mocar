export default function CallToAction() {
    return (
        <section className="section" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', color: '#fff' }}>
            <div className="container text-center">
                <h2 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '20px' }}>
                    Ready to Hit the Road?
                </h2>
                <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '30px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
                    Book your vehicle now and experience the freedom of self-drive rentals in Bhubaneswar
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="/contact" className="btn btn-primary btn-lg">
                        <i className="fas fa-phone" /> Contact Us Now
                    </a>
                    <a href="/cars" className="btn btn-outline btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>
                        <i className="fas fa-car" /> Browse Vehicles
                    </a>
                </div>
            </div>
        </section>
    );
}
