document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is logged in
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
        window.location.href = 'page1.html';
        return;
    }

    // Show manage accounts button for admin users
    if (userRole === 'admin') {
        document.getElementById('manageAccountsBtn').style.display = 'block';
    }

    // Add smooth scrolling for sidebar links
    document.querySelectorAll('.sidebar a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Load and display books
    await loadBooks();
});

async function loadBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/books', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to load books');
        }
        
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
        alert('Failed to load books');
    }
}

function displayBooks(books) {
    const container = document.getElementById('books-container');
    container.innerHTML = '';
    
    // Group books by category
    const booksByCategory = {};
    books.forEach(book => {
        if (!booksByCategory[book.category]) {
            booksByCategory[book.category] = [];
        }
        booksByCategory[book.category].push(book);
    });

    // Create sections for each category
    Object.entries(booksByCategory).forEach(([category, categoryBooks]) => {
        const categorySection = document.createElement('div');
        categorySection.className = 'book-category';
        categorySection.id = category.toLowerCase().replace(/\s+/g, '-');
        
        categorySection.innerHTML = `
            <h2 class="category-title">${category}</h2>
            <div class="row" id="books-${category.replace(/\s+/g, '-')}"></div>
        `;
        container.appendChild(categorySection);

        const booksContainer = document.getElementById(`books-${category.replace(/\s+/g, '-')}`);
        categoryBooks.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'col-md-4 mb-4';
            bookCard.innerHTML = `
                <div class="card book-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
                        <p class="card-text">
                            <span class="badge ${book.is_available ? 'bg-success' : 'bg-danger'}">
                                ${book.is_available ? 'Available' : 'Not Available'}
                            </span>
                        </p>
                        ${localStorage.getItem('userRole') === 'admin' ? `
                            <div class="admin-controls">
                                <button class="btn btn-warning btn-sm" onclick="toggleAvailability(${book.id}, ${!book.is_available})">
                                    ${book.is_available ? 'Mark as Unavailable' : 'Mark as Available'}
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Delete</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            booksContainer.appendChild(bookCard);
        });

        // Add "Add Book" form for admins at the end of each category
        if (localStorage.getItem('userRole') === 'admin') {
            const addBookForm = document.createElement('div');
            addBookForm.className = 'add-book-form';
            addBookForm.innerHTML = `
                <button class="btn btn-primary" onclick="showAddBookForm('${category}')">Add New Book to ${category}</button>
                <div id="addBookForm-${category.replace(/\s+/g, '-')}" style="display: none;" class="mt-3">
                    <form onsubmit="addBook(event, '${category}')">
                        <div class="mb-3">
                            <input type="text" class="form-control" id="bookTitle-${category.replace(/\s+/g, '-')}" placeholder="Book Title" required>
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control" id="bookAuthor-${category.replace(/\s+/g, '-')}" placeholder="Author" required>
                        </div>
                        <button type="submit" class="btn btn-success">Add Book</button>
                    </form>
                </div>
            `;
            categorySection.appendChild(addBookForm);
        }
    });
}

function showAddBookForm(category) {
    document.getElementById(`addBookForm-${category.replace(/\s+/g, '-')}`).style.display = 'block';
}

async function addBook(event, category) {
    event.preventDefault();
    
    const title = document.getElementById(`bookTitle-${category.replace(/\s+/g, '-')}`).value;
    const author = document.getElementById(`bookAuthor-${category.replace(/\s+/g, '-')}`).value;

    try {
        const response = await fetch('http://localhost:3000/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ title, author, category })
        });

        if (!response.ok) {
            throw new Error('Failed to add book');
        }

        // Clear form and hide it
        document.getElementById(`addBookForm-${category.replace(/\s+/g, '-')}`).style.display = 'none';
        document.getElementById(`bookTitle-${category.replace(/\s+/g, '-')}`).value = '';
        document.getElementById(`bookAuthor-${category.replace(/\s+/g, '-')}`).value = '';

        // Reload books
        await loadBooks();
    } catch (error) {
        console.error('Error adding book:', error);
        alert('Failed to add book');
    }
}

async function toggleAvailability(bookId, isAvailable) {
    try {
        const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ is_available: isAvailable })
        });

        if (!response.ok) {
            throw new Error('Failed to update book availability');
        }

        // Reload books
        await loadBooks();
    } catch (error) {
        console.error('Error updating book availability:', error);
        alert('Failed to update book availability');
    }
}

async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to delete book');
        }

        // Reload books
        await loadBooks();
    } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book');
    }
}

// Add logout function
function logout() {
    // Clear user session data
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    
    // Redirect to login page
    window.location.href = 'page1.html';
} 