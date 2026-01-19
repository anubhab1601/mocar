const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const nodemailer = require('nodemailer');
const multer = require('multer');
require('dotenv').config();

const app = express();

// ----- Config -----
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'Admin@2026';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'local-admin-token';
const PORT = process.env.PORT || 5500;
const DB_FILE = path.join(__dirname, 'mocar.sqlite');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// SendGrid Config
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
// IMPORTANT: Use the verified email from SendGrid
const FROM_EMAIL = process.env.FROM_EMAIL || 'anubhabmishra2006@gmail.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'anubhabmishra2006@gmail.com';

// Determine allowed origins
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://mocar.vercel.app', // Your specific frontend
    'https://mocar-2026-dd09r58lh-anubhabs-projects-c17292d5.vercel.app', // Preview URL
    process.env.FRONTEND_URL,       // Env var fallback
    process.env.ADDITIONAL_ORIGIN  // Any other URL
].filter(Boolean); // Remove empty/undefined

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
    origin: function (origin, callback) {
        // PERMISSIVE CORS FOR DEBUGGING
        return callback(null, true);
    },
    credentials: true // Important for headers/cookies if needed
}));
// Explicitly handle OPTIONS preflight requests
app.options('*', cors());

app.use(express.json());
app.use(morgan('dev'));

// Simple Root Route for checking if server is up
app.get('/', (req, res) => {
    res.send('Mo Car Backend is Running!');
});

// Static serve uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// ... (Rest of code: Database Setup, Helpers, Seeding) ...

// ----- Database Setup (better-sqlite3) -----
const db = new Database(DB_FILE, { verbose: console.log });
db.pragma('journal_mode = WAL');

// Init Tables
db.exec(`
    CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        badge TEXT,
        img TEXT,
        specs TEXT,
        price6h INTEGER,
        price12h INTEGER,
        price24h INTEGER
    );
    CREATE TABLE IF NOT EXISTS bikes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        badge TEXT,
        img TEXT,
        specs TEXT,
        price6h INTEGER,
        price12h INTEGER,
        price24h INTEGER
    );
    CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        inquiry_type TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS gallery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS hero_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS about_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        img TEXT
    );
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );
`);

// Seed Admin
try {
    const adminRow = db.prepare('SELECT * FROM admins LIMIT 1').get();
    if (!adminRow) {
        db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run(ADMIN_USER, ADMIN_PASS);
        console.log(`Initialized admin user: ${ADMIN_USER}`);
    }
} catch (err) {
    console.error('Error seeding admin:', err);
}

// ----- Helpers -----
const requireAdmin = (req, res, next) => {
    const auth = req.headers.authorization || '';
    const token = auth.replace('Bearer ', '').trim();
    if (token === ADMIN_TOKEN) return next();
    return res.status(401).json({ success: false, message: 'Unauthorized' });
};

const parseSpecs = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return String(val).split(',').map((s) => s.trim()).filter(Boolean);
    }
};

const numOrNull = (v) => {
    if (v === undefined || v === null || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

// ... (Rest of Seeding and Route logic) ...

// Upload Route
app.post('/api/upload', requireAdmin, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Return the URL to access the file
    // Assumes server URL (need to configure or use relative)
    // For local dev, we return full path or relative path
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});

// ... (Existing routes) ...

// Seeding
const seedIfEmpty = (table, insertFn) => {
    const row = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
    if (row && row.count === 0) insertFn();
};

seedIfEmpty('cars', () => {
    const defaults = [
        { name: 'Swift Dzire', badge: 'Popular', img: '/assets/images/swift-dzire.jpg', specs: ['A/C', 'Manual', 'Petrol', '5 Seats'], prices: { '6h': 1200, '12h': 1300, '24h': 1600 } },
        { name: 'Maruti Alto', badge: 'Budget', img: '/assets/images/maruti-alto.jpg', specs: ['A/C', 'Manual', 'Petrol', '4 Seats'], prices: { '6h': 800, '12h': 1020, '24h': 1320 } },
        { name: 'Mahindra Thar', badge: 'Adventure', img: '/assets/images/mahindra-thar.jpg', specs: ['A/C', 'Manual', 'Diesel', '4 Seats'], prices: { '12h': 3000, '24h': 3500 } },
        { name: 'Honda City', badge: 'Premium', img: '/assets/images/honda-city.jpg', specs: ['A/C', 'Automatic', 'Petrol', '5 Seats'], prices: { '12h': 2500, '24h': 3000 } },
        { name: 'Hyundai Eon', badge: 'Economy', img: '/assets/images/hyundai-eon.jpg', specs: ['A/C', 'Manual', 'Petrol', '4 Seats'], prices: { '6h': 600, '12h': 800, '24h': 1000 } },
        { name: 'Kia Carens', badge: 'Family', img: '/assets/images/kia-carens.jpg', specs: ['A/C', 'Automatic', 'Petrol', '7 Seats'], prices: { '12h': 2800, '24h': 3200 } }
    ];
    const stmt = db.prepare(`INSERT INTO cars (name, badge, img, specs, price6h, price12h, price24h) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    defaults.forEach((c) => {
        stmt.run(c.name, c.badge, c.img, JSON.stringify(c.specs), c.prices['6h'] || null, c.prices['12h'] || null, c.prices['24h'] || null);
    });
});

seedIfEmpty('bikes', () => {
    const defaults = [
        { name: 'Royal Enfield Bullet 350', badge: 'Popular', img: '/assets/images/royal-enfield.jpg', specs: ['Cruiser', '350cc', 'Petrol'], prices: { '12h': 800, '24h': 1100 } },
        { name: 'Honda Activa 4G', badge: 'Economy', img: '/assets/images/honda-activa.jpg', specs: ['Scooter', '110cc', 'Petrol'], prices: { '12h': 400, '24h': 500 } },
        { name: 'KTM RC 200', badge: 'Sports', img: '/assets/images/ktm-rc200.jpg', specs: ['Sports', '200cc', 'Petrol'], prices: { '12h': 1000, '24h': 1400 } },
        { name: 'Bajaj Pulsar 150', badge: 'Cruiser', img: '/assets/images/bajaj-pulsar.jpg', specs: ['Cruiser', '150cc', 'Petrol'], prices: { '12h': 600, '24h': 900 } },
        { name: 'TVS Apache RTR 160', badge: 'Adventure', img: '/assets/images/tvs-apache.jpg', specs: ['Street', '160cc', 'Petrol'], prices: { '12h': 700, '24h': 1000 } },
        { name: 'Hero Splendor', badge: 'Commuter', img: '/assets/images/hero-splendor.jpg', specs: ['Commuter', '100cc', 'Petrol'], prices: { '12h': 350, '24h': 450 } }
    ];
    const stmt = db.prepare(`INSERT INTO bikes (name, badge, img, specs, price6h, price12h, price24h) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    defaults.forEach((b) => {
        stmt.run(b.name, b.badge, b.img, JSON.stringify(b.specs), b.prices['6h'] || null, b.prices['12h'] || null, b.prices['24h'] || null);
    });
});

seedIfEmpty('cities', () => {
    const stmt = db.prepare('INSERT INTO cities (name) VALUES (?)');
    ['Bhubaneswar', 'Cuttack', 'Puri', 'Other'].forEach((c) => stmt.run(c));
});

seedIfEmpty('locations', () => {
    const stmt = db.prepare('INSERT INTO locations (name) VALUES (?)');
    ['Nayapalli', 'Airport', 'Railway Station', 'Bus Stand'].forEach((l) => stmt.run(l));
});

seedIfEmpty('gallery', () => {
    const stmt = db.prepare('INSERT INTO gallery (url) VALUES (?)');
    [
        '/assets/images/gallery-1.png',
        '/assets/images/gallery-2.png',
        '/assets/images/hero-bg/hero-1.png',
        '/assets/images/hero-bg/hero-2.png',
        '/assets/images/hero-bg/hero-3.png'
    ].forEach((g) => stmt.run(g));
});

seedIfEmpty('hero_images', () => {
    const stmt = db.prepare('INSERT INTO hero_images (url) VALUES (?)');
    [
        '/assets/images/hero-bg/hero-1.png',
        '/assets/images/hero-bg/hero-2.png',
        '/assets/images/hero-bg/hero-3.png'
    ].forEach((h) => stmt.run(h));
});

// Hero Images API
app.get('/api/hero', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM hero_images ORDER BY id').all();
        res.json(rows);
    } catch (e) {
        res.json([]);
    }
});

app.post('/api/hero', requireAdmin, (req, res) => {
    const { url } = req.body || {};
    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });
    const info = db.prepare('INSERT INTO hero_images (url) VALUES (?)').run(url);
    res.status(201).json({ id: info.lastInsertRowid, url });
});

app.delete('/api/hero/:id', requireAdmin, (req, res) => {
    db.prepare('DELETE FROM hero_images WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// About Image API
app.get('/api/about/image', (req, res) => {
    const row = db.prepare('SELECT img FROM about_info LIMIT 1').get();
    res.json({ img: row ? row.img : null });
});

app.post('/api/about/image', requireAdmin, (req, res) => {
    const { img } = req.body; // URL or path
    db.prepare('DELETE FROM about_info').run(); // Ensure only one
    db.prepare('INSERT INTO about_info (img) VALUES (?)').run(img);
    res.json({ success: true, img });
});

app.delete('/api/about/image', requireAdmin, (req, res) => {
    db.prepare('DELETE FROM about_info').run();
    res.json({ success: true });
});

const mapCar = (row) => ({
    id: row.id,
    name: row.name,
    badge: row.badge,
    img: row.img,
    specs: parseSpecs(row.specs),
    prices: {
        '6h': row.price6h ?? undefined,
        '12h': row.price12h ?? undefined,
        '24h': row.price24h ?? undefined
    }
});

const mapBike = (row) => ({
    id: row.id,
    name: row.name,
    badge: row.badge,
    img: row.img,
    specs: parseSpecs(row.specs),
    prices: {
        '6h': row.price6h ?? undefined,
        '12h': row.price12h ?? undefined,
        '24h': row.price24h ?? undefined
    }
});

// ----- Routes -----
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: 'better-sqlite3', uptime: process.uptime() });
});

// In-memory OTP store for simplicity
const otpStore = {}; // { email: { otp, expires } }

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body || {};
    try {
        const user = db.prepare('SELECT * FROM admins WHERE username = ? AND password = ?').get(username, password);
        if (user) {
            return res.json({ success: true, token: ADMIN_TOKEN });
        }
    } catch (err) {
        console.error('Login error:', err);
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (email !== ADMIN_EMAIL) {
        return res.status(400).json({ success: false, message: 'Email not registered' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = {
        otp,
        expires: Date.now() + 10 * 60 * 1000 // 10 mins
    };

    try {
        console.log('Attempting to send OTP email to:', email);
        console.log('Using SendGrid API Key:', SENDGRID_API_KEY ? 'Present' : 'MISSING');

        const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: email }] }],
                from: { email: FROM_EMAIL },
                subject: 'MoCar Admin Password Reset OTP',
                content: [{
                    type: 'text/html',
                    value: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`
                }]
            })
        });

        if (!sgRes.ok) {
            const errData = await sgRes.text();
            throw new Error(`SendGrid API Error: ${errData}`);
        }

        console.log('OTP email sent successfully via Resend');
        res.json({ success: true, message: 'OTP sent to your email' });
    } catch (err) {
        console.error('Email error in forgot-password:', err);
        res.status(500).json({ success: false, message: 'Failed to send email. Check logs.' });
    }
});

app.post('/api/auth/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Hardcoded check for admin email since we only support one admin
    if (email !== ADMIN_EMAIL) {
        return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    const record = otpStore[email];
    if (!record || record.otp !== otp || Date.now() > record.expires) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    try {
        // Update password for the first admin user found (since we assume single admin system primarily)
        // Or update by username if we had it, but here we are resetting global admin.
        // Better: We should probably map email to username, but for now we'll update ALL admins or the known one.
        // Let's assume we update the user "admin" or just any row in admins table.
        // SAFEST: Update the user where username matches the configured ADMIN_USER or just take the first one.
        // Given the requirement "admin can change password", let's update ALL rows? No, that's risky.
        // Let's Find the ID of the admin. For now, since we seeded with process.env.ADMIN_USER, we target that if it exists, or just the first row.

        // Actually, cleaner approach: The user has to know the username? No, this is forgot password.
        // We will update the password for the account that matches... well we don't store email in DB.
        // So we will just update the first admin record found.
        const admin = db.prepare('SELECT id FROM admins LIMIT 1').get();
        if (admin) {
            db.prepare('UPDATE admins SET password = ? WHERE id = ?').run(newPassword, admin.id);
            delete otpStore[email];
            res.json({ success: true, message: 'Password updated successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Admin account not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

app.post('/api/auth/change-username', requireAdmin, (req, res) => {
    const { currentPassword, newUsername } = req.body;
    if (!newUsername) return res.status(400).json({ success: false, message: 'New username required' });

    // We need to know WHICH admin is logged in. 
    // Since we use a shared token, we don't have user context in `req.user`.
    // But we require `currentPassword` to verify identity.
    // So we find an admin with that password.

    try {
        const admin = db.prepare('SELECT id FROM admins WHERE password = ? LIMIT 1').get(currentPassword);
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Incorrect current password' });
        }

        // Update username
        try {
            db.prepare('UPDATE admins SET username = ? WHERE id = ?').run(newUsername, admin.id);
            res.json({ success: true, message: 'Username updated successfully' });
        } catch (e) {
            if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(400).json({ success: false, message: 'Username already taken' });
            }
            throw e;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Cars
app.get('/api/cars', (req, res) => {
    const rows = db.prepare('SELECT * FROM cars ORDER BY id').all();
    res.json(rows.map(mapCar));
});

app.post('/api/cars', requireAdmin, (req, res) => {
    const { name, badge, img, specs = [], prices = {} } = req.body || {};
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    const stmt = db.prepare(`INSERT INTO cars (name, badge, img, specs, price6h, price12h, price24h) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    const info = stmt.run(name, badge || null, img || null, JSON.stringify(parseSpecs(specs)), numOrNull(prices['6h']), numOrNull(prices['12h']), numOrNull(prices['24h']));

    const row = db.prepare('SELECT * FROM cars WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(mapCar(row));
});

app.put('/api/cars/:id', requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const { name, badge, img, specs = [], prices = {} } = req.body || {};
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    const stmt = db.prepare(`UPDATE cars SET name=?, badge=?, img=?, specs=?, price6h=?, price12h=?, price24h=? WHERE id=?`);
    const info = stmt.run(name, badge || null, img || null, JSON.stringify(parseSpecs(specs)), numOrNull(prices['6h']), numOrNull(prices['12h']), numOrNull(prices['24h']), id);

    if (info.changes === 0) return res.status(404).json({ success: false, message: 'Not found' });

    const row = db.prepare('SELECT * FROM cars WHERE id = ?').get(id);
    res.json(mapCar(row));
});

app.delete('/api/cars/:id', requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    db.prepare('DELETE FROM cars WHERE id = ?').run(id);
    res.json({ success: true });
});

// Bikes
app.get('/api/bikes', (req, res) => {
    const rows = db.prepare('SELECT * FROM bikes ORDER BY id').all();
    res.json(rows.map(mapBike));
});

app.post('/api/bikes', requireAdmin, (req, res) => {
    const { name, badge, img, specs = [], prices = {} } = req.body || {};
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    const stmt = db.prepare(`INSERT INTO bikes (name, badge, img, specs, price6h, price12h, price24h) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    const info = stmt.run(name, badge || null, img || null, JSON.stringify(parseSpecs(specs)), numOrNull(prices['6h']), numOrNull(prices['12h']), numOrNull(prices['24h']));

    const row = db.prepare('SELECT * FROM bikes WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(mapBike(row));
});

app.put('/api/bikes/:id', requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const { name, badge, img, specs = [], prices = {} } = req.body || {};
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    const stmt = db.prepare(`UPDATE bikes SET name=?, badge=?, img=?, specs=?, price6h=?, price12h=?, price24h=? WHERE id=?`);
    const info = stmt.run(name, badge || null, img || null, JSON.stringify(parseSpecs(specs)), numOrNull(prices['6h']), numOrNull(prices['12h']), numOrNull(prices['24h']), id);

    if (info.changes === 0) return res.status(404).json({ success: false, message: 'Not found' });

    const row = db.prepare('SELECT * FROM bikes WHERE id = ?').get(id);
    res.json(mapBike(row));
});

app.delete('/api/bikes/:id', requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    db.prepare('DELETE FROM bikes WHERE id = ?').run(id);
    res.json({ success: true });
});

// Cities
app.get('/api/cities', (req, res) => {
    const rows = db.prepare('SELECT * FROM cities ORDER BY name').all();
    res.json(rows.map((r) => r.name));
});

app.post('/api/cities', requireAdmin, (req, res) => {
    const { name } = req.body || {};
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    try {
        db.prepare('INSERT INTO cities (name) VALUES (?)').run(name);
        res.status(201).json({ name });
    } catch (e) {
        return res.status(400).json({ success: false, message: 'City already exists' });
    }
});

app.delete('/api/cities/:name', requireAdmin, (req, res) => {
    const name = req.params.name;
    db.prepare('DELETE FROM cities WHERE name = ?').run(name);
    res.json({ success: true });
});

// Locations
app.get('/api/locations', (req, res) => {
    const rows = db.prepare('SELECT * FROM locations ORDER BY name').all();
    res.json(rows.map((r) => r.name));
});

app.post('/api/locations', requireAdmin, (req, res) => {
    const { name } = req.body || {};
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    try {
        db.prepare('INSERT INTO locations (name) VALUES (?)').run(name);
        res.status(201).json({ name });
    } catch (e) {
        return res.status(400).json({ success: false, message: 'Location already exists' });
    }
});

app.delete('/api/locations/:name', requireAdmin, (req, res) => {
    const name = req.params.name;
    db.prepare('DELETE FROM locations WHERE name = ?').run(name);
    res.json({ success: true });
});

// Gallery
app.get('/api/gallery', (req, res) => {
    const rows = db.prepare('SELECT * FROM gallery ORDER BY id').all();
    res.json(rows.map((r) => r.url));
});

app.post('/api/gallery', requireAdmin, (req, res) => {
    const { url } = req.body || {};
    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });
    db.prepare('INSERT INTO gallery (url) VALUES (?)').run(url);
    res.status(201).json({ url });
});

app.delete('/api/gallery', requireAdmin, (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });
    db.prepare('DELETE FROM gallery WHERE url = ?').run(url);
    res.json({ success: true });
});

// Contact
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, inquiryType, message } = req.body || {};
    if (!name || !phone || !message) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    try {
        db.prepare(`INSERT INTO messages (name, email, phone, inquiry_type, message) VALUES (?, ?, ?, ?, ?)`)
            .run(name, email, phone, inquiryType, message);
        console.log(`✓ Message saved to DB from ${name}`);
    } catch (e) {
        console.error('DB Error:', e);
        return res.status(500).json({ success: false, message: 'Failed to save message' });
    }

    // Send email notification via SendGrid
    if (SENDGRID_API_KEY) {
        console.log('Attempting to send email to:', ADMIN_EMAIL);

        try {
            const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    personalizations: [{ to: [{ email: ADMIN_EMAIL }] }],
                    from: { email: FROM_EMAIL },
                    subject: `New Inquiry from ${name} (${inquiryType})`,
                    content: [{
                        type: 'text/html',
                        value: `
                            <h3>New Inquiry Received</h3>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Phone:</strong> ${phone}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Type:</strong> ${inquiryType}</p>
                            <br/>
                            <p><strong>Message:</strong></p>
                            <p>${message}</p>
                        `
                    }]
                })
            });

            if (!sgRes.ok) {
                const errData = await sgRes.text();
                throw new Error(`SendGrid API Error: ${errData}`);
            }

            console.log('✓ Email sent successfully via SendGrid to', ADMIN_EMAIL);
            res.json({ success: true, message: 'Message sent successfully' });
        } catch (error) {
            console.error('Error sending contact email:', error);
            // Still return success since DB save worked
            res.status(202).json({ success: true, message: 'Message received (email pending verification)' });
        }
    } else {
        console.log('⚠ SENDGRID_API_KEY not set. Email notifications disabled.');
        res.json({ success: true, message: 'Message received (email disabled)' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 better - sqlite3 backend running on port ${PORT} `);
});
