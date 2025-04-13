const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5501'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(session({
    secret: 'library-system-secret',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        httpOnly: true
    }
}));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Debug middleware to log session state
app.use((req, res, next) => {
    console.log('Session state:', req.session);
    next();
});

// Database connection with error handling
let db;
try {
    db = new sqlite3.Database('library.db', (err) => {
        if (err) {
            console.error('Error opening database:', err);
            process.exit(1);
        }
        console.log('Connected to the SQLite database');
    });
} catch (err) {
    console.error('Error creating database connection:', err);
    process.exit(1);
}

// Handle database errors
db.on('error', (err) => {
    console.error('Database error:', err);
});

// Handle process termination
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        }
        console.log('Database connection closed');
        process.exit(0);
    });
});

// Authentication middleware
const authenticateUser = (req, res, next) => {
    console.log('Authenticating user:', req.session.user);
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const authenticateAdmin = (req, res, next) => {
    console.log('Authenticating admin:', req.session.user);
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        console.log('Admin auth failed:', req.session.user);
        res.status(403).json({ error: 'Forbidden - Admin access required' });
    }
};

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password, role } = req.body;
    console.log('Login attempt:', { username, role });

    try {
        if (role === 'student') {
            // For students, username is their student ID
            const student = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE student_id = ? AND role = ?', [username, 'student'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (!student) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Compare the provided password with the hashed password
            const passwordMatch = await new Promise((resolve, reject) => {
                bcrypt.compare(password, student.password, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            if (!passwordMatch) {
                console.log('Password mismatch for student:', student.student_id);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            req.session.user = {
                id: student.id,
                username: student.student_id,
                role: 'student'
            };
            console.log('Student login successful:', student.student_id);
            res.json({ 
                success: true, 
                user: { 
                    id: student.id, 
                    username: student.student_id, 
                    role: 'student' 
                } 
            });
        } else if (role === 'admin') {
            // For admins, username is their username
            const admin = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE username = ? AND role = ?', [username, 'admin'], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (!admin) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Compare the provided password with the hashed password
            const passwordMatch = await new Promise((resolve, reject) => {
                bcrypt.compare(password, admin.password, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            if (!passwordMatch) {
                console.log('Password mismatch for admin:', admin.username);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            req.session.user = {
                id: admin.id,
                username: admin.username,
                role: 'admin'
            };
            console.log('Admin login successful:', admin.username);
            res.json({ 
                success: true, 
                user: { 
                    id: admin.id, 
                    username: admin.username, 
                    role: 'admin' 
                } 
            });
        } else {
            res.status(400).json({ error: 'Invalid role' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

// Get all books
app.get('/api/books', authenticateUser, (req, res) => {
    db.all('SELECT * FROM books', (err, books) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(books);
    });
});

// Get books by category
app.get('/api/books/category/:category', authenticateUser, (req, res) => {
    const { category } = req.params;
    db.all('SELECT * FROM books WHERE category = ?', [category], (err, books) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(books);
    });
});

// Admin routes
// Add new book
app.post('/api/books', authenticateAdmin, async (req, res) => {
    try {
        const { title, author, category } = req.body;

        if (!title || !author || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const stmt = db.prepare('INSERT INTO books (title, author, category, is_available) VALUES (?, ?, ?, ?)');
        stmt.run(title, author, category, true);
        stmt.finalize();

        res.json({ success: true, message: 'Book added successfully' });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Failed to add book' });
    }
});

// Update book availability
app.put('/api/books/:id/availability', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { is_available } = req.body;

        const stmt = db.prepare('UPDATE books SET is_available = ? WHERE id = ?');
        stmt.run(is_available, id);
        stmt.finalize();

        res.json({ success: true, message: 'Book availability updated successfully' });
    } catch (error) {
        console.error('Error updating book availability:', error);
        res.status(500).json({ error: 'Failed to update book availability' });
    }
});

// Delete book
app.delete('/api/books/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const stmt = db.prepare('DELETE FROM books WHERE id = ?');
        stmt.run(id);
        stmt.finalize();

        res.json({ success: true, message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// Get all accounts
app.get('/api/accounts', authenticateAdmin, async (req, res) => {
    try {
        // Get all users with their roles
        const users = await db.all(`
            SELECT id, username, student_id, role 
            FROM users 
            WHERE role IN ('student', 'admin')
        `);
        
        // Separate students and admins
        const students = users.filter(user => user.role === 'student');
        const admins = users.filter(user => user.role === 'admin');
        
        res.json({ students, admins });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});

// Add new student account
app.post('/api/accounts/student', authenticateAdmin, async (req, res) => {
    try {
        const { student_id, password } = req.body;
        
        // Check if student ID already exists
        const existingStudent = await db.get(
            'SELECT * FROM users WHERE student_id = ? AND role = ?', 
            [student_id, 'student']
        );
        
        if (existingStudent) {
            return res.status(400).json({ error: 'Student ID already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new student
        await db.run(
            'INSERT INTO users (student_id, password, role) VALUES (?, ?, ?)', 
            [student_id, hashedPassword, 'student']
        );
        
        res.status(201).json({ message: 'Student account created successfully' });
    } catch (error) {
        console.error('Error creating student account:', error);
        res.status(500).json({ error: 'Failed to create student account' });
    }
});

// Add new admin account
app.post('/api/accounts/admin', authenticateAdmin, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if admin username already exists
        const existingAdmin = await db.get(
            'SELECT * FROM users WHERE username = ? AND role = ?', 
            [username, 'admin']
        );
        
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new admin
        await db.run(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
            [username, hashedPassword, 'admin']
        );
        
        res.status(201).json({ message: 'Admin account created successfully' });
    } catch (error) {
        console.error('Error creating admin account:', error);
        res.status(500).json({ error: 'Failed to create admin account' });
    }
});

// Delete account
app.delete('/api/accounts/:type/:id', authenticateAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        
        if (!['student', 'admin'].includes(type)) {
            return res.status(400).json({ error: 'Invalid account type' });
        }

        // Delete the user
        await db.run(
            'DELETE FROM users WHERE id = ? AND role = ?', 
            [id, type]
        );
        
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// Add session check endpoint
app.get('/api/check-session', (req, res) => {
    console.log('Checking session:', req.session);
    if (req.session.user) {
        res.json({ 
            isAuthenticated: true, 
            user: req.session.user 
        });
    } else {
        res.json({ isAuthenticated: false });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 