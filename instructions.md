Can you build me a backend using Node.js, Express, and SQLite for a library system?

Requirements:

Users log in via page1.html (frontend), with roles: student or admin.

After login, redirect to page1.5.html.

If user is a student, they can view books in academics books, criminology books, fiction, filipiniana books, financial books, religion books, selfgrowth books, technology books (no admin buttons).

If user is an admin, they can:

Add new books

Edit book availability

Delete books

Use express-session for session handling and bcrypt for password hashing.

Use cors to allow frontend from http://127.0.0.1:5500.

Use SQLite and give me a separate script like init-database.js to create sample users and books.

Please put everything in one backend file: server.js, and make sure it supports the above functions with API routes like /api/login, /api/books, etc.