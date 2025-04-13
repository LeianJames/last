const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Create a new database connection
const db = new sqlite3.Database('library.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
        return;
    }
    console.log('Connected to the SQLite database');
});

// Function to update user passwords
async function updatePasswords() {
    try {
        // ===========================================
        // TO CHANGE ADMIN PASSWORD:
        // Modify the password in the admins array below
        // Format: { username: 'admin', password: 'your_password' }
        // ===========================================
        const admins = [
            { username: 'admin', password: 'cupofjoe' }
        ];

        for (const admin of admins) {
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            await new Promise((resolve, reject) => {
                db.run(
                    'UPDATE users SET password = ? WHERE username = ? AND role = ?',
                    [hashedPassword, admin.username, 'admin'],
                    (err) => {
                        if (err) reject(err);
                        else {
                            console.log(`Updated admin password: ${admin.username}`);
                            resolve();
                        }
                    }
                );
            });
        }

        // ===========================================
        // TO CHANGE STUDENT PASSWORDS:
        // Modify the passwords in the students array below
        // Format: { student_id: 'ID', password: 'password' }
        // Example: { student_id: '2023001', password: 'studentpass' }
        // ===========================================
        const students = [
            { student_id: '2023001', password: 'newpass' },
            { student_id: '2023002', password: 'james' },
            { student_id: '2023003', password: 'santos' }
        ];

        for (const student of students) {
            const hashedPassword = await bcrypt.hash(student.password, 10);
            await new Promise((resolve, reject) => {
                db.run(
                    'UPDATE users SET password = ? WHERE student_id = ? AND role = ?',
                    [hashedPassword, student.student_id, 'student'],
                    (err) => {
                        if (err) reject(err);
                        else {
                            console.log(`Updated student password: ${student.student_id}`);
                            resolve();
                        }
                    }
                );
            });
        }

        console.log('All passwords updated successfully');
    } catch (error) {
        console.error('Error updating passwords:', error);
    }
}

// Initialize the database
async function initializeDatabase() {
    try {
        // Drop existing tables to start fresh
        await new Promise((resolve, reject) => {
            db.run('DROP TABLE IF EXISTS users', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Create users table
        await new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT,
                    student_id TEXT UNIQUE,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Create books table
        await new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS books (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    author TEXT NOT NULL,
                    category TEXT NOT NULL,
                    is_available INTEGER DEFAULT 1
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // ===========================================
        // TO ADD/CHANGE ADMIN ACCOUNTS:
        // Modify the admins array below
        // Format: { username: 'username', password: 'password' }
        // To add more admins, add more objects to the array
        // ===========================================
        const admins = [
            { username: 'admin', password: 'cupofjoe' }
        ];

        for (const admin of admins) {
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT OR REPLACE INTO users (username, password, role) VALUES (?, ?, ?)',
                    [admin.username, hashedPassword, 'admin'],
                    (err) => {
                        if (err) reject(err);
                        else {
                            console.log(`Created admin user: ${admin.username}`);
                            resolve();
                        }
                    }
                );
            });
        }

        // ===========================================
        // TO ADD/CHANGE STUDENT ACCOUNTS:
        // Modify the students array below
        // Format: { student_id: 'ID', password: 'password' }
        // To add more students, add more objects to the array
        // Example: { student_id: '2023004', password: 'newstudent' }
        // ===========================================
        const students = [
            { student_id: '2023001', password: 'newpass' },
            { student_id: '2023002', password: 'james' },
            { student_id: '2023003', password: 'santos' }
        ];

        for (const student of students) {
            const hashedPassword = await bcrypt.hash(student.password, 10);
            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT OR REPLACE INTO users (student_id, password, role) VALUES (?, ?, ?)',
                    [student.student_id, hashedPassword, 'student'],
                    (err) => {
                        if (err) reject(err);
                        else {
                            console.log(`Created student user: ${student.student_id}`);
                            resolve();
                        }
                    }
                );
            });
        }

        // Add sample books
        const books = [
            { title: 'Introduction to Computer Science', author: 'John Doe', category: 'Technology' },
            { title: 'Criminal Law Basics', author: 'Jane Smith', category: 'Criminology' },
            { title: 'Financial Management', author: 'Robert Johnson', category: 'Financial' }
        ];

        for (const book of books) {
            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT OR REPLACE INTO books (title, author, category) VALUES (?, ?, ?)',
                    [book.title, book.author, book.category],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Function to run both initialization and password update
async function setupDatabase() {
    await initializeDatabase();
    await updatePasswords();
    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
    });
}

// Run the setup
setupDatabase(); 