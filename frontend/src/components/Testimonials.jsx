'use client';

import { useState, useEffect } from 'react';

const testimonials = [
    {
        id: 1,
        text: "Excellent service! The booking process was smooth and the car was in perfect condition. Very professional team and affordable rates. Highly recommended for self-drive rentals in Bhubaneswar!",
        name: "Rajesh Kumar",
        type: "Swift Dzire Customer",
        initial: "R"
    },
    {
        id: 2,
        text: "Great experience renting a Royal Enfield from MoCar. The bike was well-maintained and perfect for my weekend trip. Customer support was available 24/7. Will definitely rent again!",
        name: "Priya Sharma",
        type: "Royal Enfield Customer",
        initial: "P"
    },
    {
        id: 3,
        text: "Best car rental service in Bhubaneswar! Transparent pricing with no hidden charges. The staff was very helpful in explaining all the terms. Very satisfied with the service!",
        name: "Amit Patel",
        type: "Tata Tiago Customer",
        initial: "A"
    },
    {
        id: 4,
        text: "I rented a scooter for local commuting. It was affordable and in great condition. The pickup and drop-off were hassle-free. Definitely my go-to choice now.",
        name: "Sneha Das",
        type: "Honda Activa Customer",
        initial: "S"
    },
    {
        id: 5,
        text: "Professional behavior and clean cars. Took a vehicle for a 3-day family trip and faced absolutely no issues. The deposit refund was also quick.",
        name: "Vikram Singh",
        type: "Innova Crysta Customer",
        initial: "V"
    }
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // We show 2 cards at a time.
    // So valid indices are from 0 to (length - 2).
    // If length is 5, indices: 0 (shows 1,2), 1 (shows 2,3), 2 (shows 3,4), 3 (shows 4,5)
    // Actually we can loop. To make it smooth, let's just reset to 0 for now.

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = testimonials.length - 2;
                // If we are at the end, go back to 0
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="section section-alt" style={{ overflow: 'hidden' }}>
            <div className="container">
                <div className="section-header">
                    <h2>What Our Customers Say</h2>
                    <p>Real reviews from satisfied customers</p>
                </div>

                <div
                    className="testimonials-viewport"
                    style={{
                        overflow: 'hidden',
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    <div
                        className="testimonials-track"
                        style={{
                            display: 'flex',
                            transition: 'transform 0.5s ease-in-out',
                            // Fix: The percentage is relative to the TRACK width.
                            // Track Width = (Count * 50) % of Container.
                            // 1 Item Width = 50% of Container.
                            // Ratio = 50 / (Count * 50) = 1 / Count.
                            // So we translate by (100 / Count)% per index.
                            transform: `translateX(-${currentIndex * (100 / testimonials.length)}%)`,
                            width: `${testimonials.length * 50}%`
                        }}
                    >
                        {testimonials.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    width: `${100 / testimonials.length}%`, // Each item is 1/N of the track
                                    padding: '0 15px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <div className="testimonial-card" style={{ height: '100%' }}>
                                    <div className="testimonial-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className="fas fa-star" />
                                        ))}
                                    </div>
                                    <p className="testimonial-text">
                                        "{item.text}"
                                    </p>
                                    <div className="testimonial-author">
                                        <div className="author-avatar">{item.initial}</div>
                                        <div className="author-info">
                                            <h4>{item.name}</h4>
                                            <p>{item.type}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots for navigation visibility */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, gap: 8 }}>
                    {Array.from({ length: testimonials.length - 1 }).map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: idx === currentIndex ? 'var(--primary-yellow)' : '#ccc',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
