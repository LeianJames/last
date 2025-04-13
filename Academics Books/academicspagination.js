// Variables to track pagination state
let currentPage = 1;
let itemsPerPage = 10; // Default items per page

// DOM elements
const bookResultsContainer = document.getElementById('bookResults');
const paginationContainer = document.getElementById('paginationControls');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const totalResultsElement = document.getElementById('totalResults');

// Update total results count
totalResultsElement.textContent = books.length;

// Initialize with default settings
document.addEventListener('DOMContentLoaded', function() {
  // Set the default selected option for items per page
  itemsPerPageSelect.value = itemsPerPage;
  
  // Check user role and show/hide admin controls
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'admin') {
    const adminControls = document.createElement('div');
    adminControls.className = 'admin-controls';
    adminControls.innerHTML = `
      <button class="btn btn-primary" onclick="showAddBookForm()">Add New Book</button>
      <button class="btn btn-danger" onclick="showDeleteBookForm()">Delete Book</button>
    `;
    document.querySelector('.results-controls').appendChild(adminControls);
  }
  
  // Initial render
  renderBooks();
  renderPagination();
  
  // Add event listener for items per page change
  itemsPerPageSelect.addEventListener('change', function() {
    itemsPerPage = parseInt(this.value);
    currentPage = 1; // Reset to first page when changing items per page
    renderBooks();
    renderPagination();
  });

  // Load initial books
  loadBooks();
});

// Function to show availability popup
function showAvailabilityPopup(book) {
  const popup = document.getElementById('availabilityPopup');
  
  // Create popup content
  popup.innerHTML = `
    <div class="popup-content">
      <span class="close-popup">&times;</span>
      <h3>${book.title}</h3>
      <p><strong>Status:</strong> ${book.available ? 'Available' : 'Not Available'}</p>
      <p><strong>Location:</strong> ${book.location}</p>
      ${book.available ? 
        '<p>You can check out this book at the library desk.</p>' : 
        '<p>This book is currently checked out. Please check back later.</p>'}
    </div>
  `;
  
  // Add close button functionality
  popup.querySelector('.close-popup').addEventListener('click', function() {
    popup.style.display = 'none';
  });
  
  // Display the popup
  popup.style.display = 'block';
  
  // Close popup when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target == popup) {
      popup.style.display = 'none';
    }
  });
}

// Function to toggle book availability (admin only)
function toggleAvailability(bookId) {
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].available = !books[bookIndex].available;
    saveBooks(); // Save the updated availability status
    renderBooks(); // Re-render the books list
  }
}

// Function to display books based on current page and items per page
function renderBooks() {
  bookResultsContainer.innerHTML = '';
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, books.length);
  
  for (let i = startIndex; i < endIndex; i++) {
    const book = books[i];
    const bookElement = document.createElement('div');
    bookElement.className = 'result-item';
    
    const userRole = localStorage.getItem('userRole');
    let actionsHtml = '';
    
    if (userRole === 'admin') {
      actionsHtml = `
        <div class="result-actions">
          <button class="btn ${book.is_available ? 'btn-danger' : 'btn-success'}" 
                  onclick="toggleAvailability(${book.id}, ${!book.is_available})">
            ${book.is_available ? 'Mark as Unavailable' : 'Mark as Available'}
          </button>
        </div>
      `;
    } else {
      actionsHtml = `
        <div class="result-actions">
          <button class="btn btn-primary" onclick="checkAvailability(${book.id})">
            Check Availability
          </button>
        </div>
      `;
    }
    
    bookElement.innerHTML = `
      <div class="result-number">${i + 1}</div>
      <div class="result-details">
        <h3 class="result-title">${book.title}</h3>
        <p class="result-author">${book.author}</p>
        <p class="result-description">${book.description}</p>
        ${actionsHtml}
      </div>
    `;
    
    bookResultsContainer.appendChild(bookElement);
  }
}

// Function to render pagination controls
function renderPagination() {
  // Clear current pagination
  paginationContainer.innerHTML = '';
  
  // Calculate total pages
  const totalPages = Math.ceil(books.length / itemsPerPage);
  
  // Add previous button if not on first page
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '← Previous';
    prevButton.addEventListener('click', function() {
      currentPage--;
      renderBooks();
      renderPagination();
    });
    paginationContainer.appendChild(prevButton);
  }
  
  // Add page number buttons
  // For simplicity, show max 5 page numbers
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement('button');
    pageButton.innerHTML = i;
    
    if (i === currentPage) {
      pageButton.className = 'active';
    }
    
    pageButton.addEventListener('click', function() {
      currentPage = i;
      renderBooks();
      renderPagination();
    });
    
    paginationContainer.appendChild(pageButton);
  }
  
  // Add next button if not on last page
  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Next →';
    nextButton.addEventListener('click', function() {
      currentPage++;
      renderBooks();
      renderPagination();
    });
    paginationContainer.appendChild(nextButton);
  }
  
  // Add a simple text showing current range of items
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, books.length);
  
  const rangeInfo = document.createElement('span');
  rangeInfo.className = 'page-info';
  rangeInfo.innerHTML = `Showing ${startItem}-${endItem} of ${books.length}`;
  paginationContainer.appendChild(rangeInfo);
}

// Function to navigate to a specific page
function goToPage(pageNumber) {
  currentPage = pageNumber;
  renderBooks();
  renderPagination();
}

function searchBooks() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const books = [
    {
      id: 1,
      title: "Carbon Jargon: Making Sense of the life Science of Climate Change",
      author: "N/A",
      pages: 159,
      location: "Nova Schola Main Library",
      is_available: true
    },
    {
      id: 2,
      title: "General Ecology",
      author: "David T. Krohne",
      pages: 505,
      location: "Nova Schola Main Library",
      is_available: true
    },
    {
      id: 3,
      title: "Biology of the invertabrate",
      author: "Jan A. Pechenik",
      pages: 605,
      location: "Nova Schola Main Library",
      is_available: true
    },
    {
      id: 4,
      title: "Environmental Science",
      author: "American Geological Institute",
      pages: 324,
      location: "Nova Schola Main Library",
      is_available: true
    },
    {
      id: 5,
      title: "Sociological and Anthropology with family",
      author: "Dr. Manalo M Ariola",
      pages: 210,
      location: "Nova Schola Main Library",
      is_available: true
    },
    {
      id: 6,
      title: "Basic Calculus for Senior High School",
      author: "Perla Dela Cruz",
      pages: 309,
      location: "Nova Schola Main Library",
      is_available: true
    },
    {
      id: 7,
      title: "English for Academic and Professional Purpose",
      author: "Marikit Vychoco and Grace Sacteton",
      pages: 179,
      location: "Nova Schola Main Library",
      is_available: true
    },
    {
      id: 8,
      title: "Oral Communication in conetent",
      author: "Ramona S. Flores",
      pages: 183,
      location: "Nova Schola Main Library",
      is_available: true
    },
    {
      id: 9,
      title: "T.L.E. in the 21st Century",
      author: "Grisham John",
      pages: 456,
      location: "Nova Schola Main Library",
      is_available: true
    },
    {
      id: 10,
      title: "Plane and Spherical trigonometry with applications",
      author: "Hart",
      pages: 124,
      location: "Nova Schola Main Library",
      is_available: true
    },
    {
      id: 11,
      title: "Algebra for the viterly confused",
      author: "Stephens Henrry",
      pages: 201,
      location: "Nova Schola Main Library",
      is_available: true
    },
    {
      id: 12,
      title: "Geometry",
      author: "Prinami/ Caruso 2012",
      pages: 201,
      location: "Nova Schola Main Library",
      is_available: true
    },
    {
      id: 13,
      title: "California Pre-Algebra",
      author: "Charles Etal",
      pages: 760,
      location: "Nova Schola Main Library",
      is_available: true
    }
  ];
  
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm) || 
    book.author.toLowerCase().includes(searchTerm)
  );
  
  displayBooks(filteredBooks);
  updatePagination(filteredBooks);
}

function showAddBookForm() {
  const form = document.createElement('div');
  form.className = 'add-book-form';
  form.innerHTML = `
    <h3>Add New Book</h3>
    <form id="addBookForm">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" required>
      </div>
      <div class="form-group">
        <label for="author">Author</label>
        <input type="text" id="author" required>
      </div>
      <div class="form-group">
        <label for="pages">Book Pages</label>
        <input type="number" id="pages" required>
      </div>
      <div class="form-group">
        <label for="location">Location</label>
        <input type="text" id="location" required>
      </div>
      <button type="submit" class="btn btn-primary">Add Book</button>
      <button type="button" class="btn btn-secondary" onclick="hideAddBookForm()">Cancel</button>
    </form>
  `;
  
  document.body.appendChild(form);
  
  document.getElementById('addBookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addBook();
  });
}

function hideAddBookForm() {
  const form = document.querySelector('.add-book-form');
  if (form) {
    form.remove();
  }
}

function showDeleteBookForm() {
  document.getElementById('deleteBookForm').style.display = 'block';
}

function hideDeleteBookForm() {
  document.getElementById('deleteBookForm').style.display = 'none';
}

// Update the displayBooks function to show admin-specific controls
function displayBooks(books) {
  const container = document.getElementById('books-container');
  container.innerHTML = '';
  
  const isAdmin = localStorage.getItem('userRole') === 'admin';
  
  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'col-md-4 mb-4';
    bookCard.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text"><strong>Author:</strong> ${book.author}</p>
          <p class="card-text"><strong>Pages:</strong> ${book.pages || 'N/A'}</p>
          <p class="card-text"><strong>Location:</strong> ${book.location || 'N/A'}</p>
          <p class="card-text"><strong>Status:</strong> 
            <span class="badge ${book.is_available ? 'bg-success' : 'bg-danger'}">
              ${book.is_available ? 'Available' : 'Unavailable'}
            </span>
          </p>
          ${isAdmin ? `
            <div class="admin-controls mt-3">
              <button class="btn btn-sm ${book.is_available ? 'btn-danger' : 'btn-success'} me-2" 
                      onclick="toggleAvailability(${book.id}, ${!book.is_available})">
                ${book.is_available ? 'Mark as Unavailable' : 'Mark as Available'}
              </button>
              <button class="btn btn-sm btn-danger" onclick="deleteBook(${book.id})">
                Delete Book
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    container.appendChild(bookCard);
  });
}

// Update the addBook function
async function addBook() {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = document.getElementById('pages').value;
  const location = document.getElementById('location').value;
  
  try {
    const response = await fetch('http://localhost:3000/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, author, pages, location })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add book');
    }
    
    hideAddBookForm();
    loadBooks();
    alert('Book added successfully!');
  } catch (error) {
    console.error('Error adding book:', error);
    alert('Failed to add book. Please try again.');
  }
}

// Add these new functions for admin operations
async function toggleAvailability(bookId, isAvailable) {
  try {
    const response = await fetch(`http://localhost:3000/api/books/${bookId}/availability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_available: isAvailable }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to update book availability');
    }

    // Reload books after update
    loadBooks();
  } catch (error) {
    console.error('Error updating book availability:', error);
    alert('Failed to update book availability');
  }
}

async function deleteBook(event) {
  event.preventDefault();
  const bookId = document.getElementById('bookIdToDelete').value;

  try {
    const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }

    hideDeleteBookForm();
    loadBooks();
  } catch (error) {
    console.error('Error deleting book:', error);
    alert('Failed to delete book');
  }
}

// Function to load books from local database
function loadBooks() {
    const books = [
        {
            id: 1,
            title: "Carbon Jargon: Making Sense of the life Science of Climate Change",
            author: "N/A",
            pages: 159,
            location: "Nova Schola Main Library",
            is_available: true
        },
        {
            id: 2,
            title: "General Ecology",
            author: "David T. Krohne",
            pages: 505,
            location: "Nova Schola Main Library",
            is_available: true
        },
        {
            id: 3,
            title: "Biology of the invertabrate",
            author: "Jan A. Pechenik",
            pages: 605,
            location: "Nova Schola Main Library",
            is_available: true
        },
        {
            id: 4,
            title: "Environmental Science",
            author: "American Geological Institute",
            pages: 324,
            location: "Nova Schola Main Library",
            is_available: true
        },
        {
            id: 5,
            title: "Sociological and Anthropology with family",
            author: "Dr. Manalo M Ariola",
            pages: 210,
            location: "Nova Schola Main Library",
            is_available: true
        },
        {
            id: 6,
            title: "Basic Calculus for Senior High School",
            author: "Perla Dela Cruz",
            pages: 309,
            location: "Nova Schola Main Library",
            is_available: true
        },
        {
            id: 7,
            title: "English for Academic and Professional Purpose",
            author: "Marikit Vychoco and Grace Sacteton",
            pages: 179,
            location: "Nova Schola Main Library",
            is_available: true
        },
        {
            id: 8,
            title: "Oral Communication in conetent",
            author: "Ramona S. Flores",
            pages: 183,
            location: "Nova Schola Main Library",
            is_available: true
        },
        {
            id: 9,
            title: "T.L.E. in the 21st Century",
            author: "Grisham John",
            pages: 456,
            location: "Nova Schola Main Library",
            is_available: true
        },
        {
            id: 10,
            title: "Plane and Spherical trigonometry with applications",
            author: "Hart",
            pages: 124,
            location: "Nova Schola Main Library",
            is_available: true
        },
        {
            id: 11,
            title: "Algebra for the viterly confused",
            author: "Stephens Henrry",
            pages: 201,
            location: "Nova Schola Main Library",
            is_available: true
        },
        {
            id: 12,
            title: "Geometry",
            author: "Prinami/ Caruso 2012",
            pages: 201,
            location: "Nova Schola Main Library",
            is_available: true
        },
        {
            id: 13,
            title: "California Pre-Algebra",
            author: "Charles Etal",
            pages: 760,
            location: "Nova Schola Main Library",
            is_available: true
        }
    ];
    
    displayBooks(books);
}

// Function to search books
function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const books = [
        // ... same books array as above ...
    ];
    
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm)
    );
    
    displayBooks(filteredBooks);
}