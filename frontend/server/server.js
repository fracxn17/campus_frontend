import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new Database(join(__dirname, 'campuslegacy.db'));

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    password TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    batch TEXT DEFAULT '',
    department TEXT DEFAULT '',
    degree TEXT DEFAULT '',
    location TEXT DEFAULT '',
    rollNumber TEXT DEFAULT '',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add role column if it doesn't exist (for existing databases)
try {
  db.exec(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'student'`);
  console.log('✅ Added role column to users table');
} catch (e) {
  // Column already exists, ignore
}

console.log('✅ Database initialized');

// ─── REGISTER ───────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full Name, Email, and Password are required.' });
    }

    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists. Please login instead.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user with default empty strings for optional student profile fields
    const userRole = role === 'alumni' ? 'alumni' : 'student';

    const stmt = db.prepare(`
      INSERT INTO users (fullName, email, phone, password, role, batch, department, degree, location, rollNumber)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(fullName, email, '', hashedPassword, userRole, '', '', '', '', '');

    const newUser = db.prepare('SELECT id, fullName, email, phone, role, batch, department, degree, location, rollNumber, createdAt FROM users WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: newUser,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─── LOGIN ──────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find user by email
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found! Create a new account to get started.',
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    // Return user data without password
    const { password: _, ...userData } = user;
    res.json({
      success: true,
      message: 'Login successful!',
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─── UPDATE USER ─────────────────────────────────────────────
app.post('/api/user/update', (req, res) => {
  try {
    const { id, fullName, phone, batch, department, degree, location, rollNumber } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    const stmt = db.prepare(`
      UPDATE users 
      SET fullName = ?, phone = ?, batch = ?, department = ?, degree = ?, location = ?, rollNumber = ?
      WHERE id = ?
    `);

    stmt.run(fullName || '', phone || '', batch || '', department || '', degree || '', location || '', rollNumber || '', id);

    const updatedUser = db.prepare('SELECT id, fullName, email, phone, role, batch, department, degree, location, rollNumber, createdAt FROM users WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─── GET USER PROFILE BY ID ───────────────────────────────────
app.get('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare('SELECT id, fullName, email, phone, role, batch, department, degree, location, rollNumber, createdAt FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CampusLegacy API server running on http://localhost:${PORT}`);
});
