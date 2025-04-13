// Variables to track pagination state
let currentPage = 1;
let itemsPerPage = 10; // Default items per page
let isAdmin = false; // Flag to check if admin mode is active

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

  // Add admin login button to the page
  const adminButton = document.createElement('button');
  adminButton.innerHTML = 'Admin Login';
  adminButton.className = 'admin-button';
  adminButton.addEventListener('click', toggleAdminMode);
  document.querySelector('.results-controls').appendChild(adminButton);

  // Create popup container
  const popupContainer = document.createElement('div');
  popupContainer.id = 'availabilityPopup';
  popupContainer.className = 'availability-popup';
  popupContainer.style.display = 'none';
  document.body.appendChild(popupContainer);
});

// Function to toggle admin mode
function toggleAdminMode() {
  // In a real application, you would have authentication
  // For demo purposes, we'll just toggle the admin mode
  isAdmin = !isAdmin;
  
  const adminButton = document.querySelector('.admin-button');
  if (isAdmin) {
    adminButton.innerHTML = 'Exit Admin Mode';
    adminButton.classList.add('active');
    alert('Admin mode activated. You can now update book availability.');
  } else {
    adminButton.innerHTML = 'Admin Login';
    adminButton.classList.remove('active');
    alert('Exited admin mode.');
  }
  
  renderBooks(); // Re-render to update buttons
}

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
  // Clear current results
  bookResultsContainer.innerHTML = '';
  
  // Calculate start and end indices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, books.length);
  
  // Generate HTML for each book in the current page
  for (let i = startIndex; i < endIndex; i++) {
    const book = books[i];
    const bookElement = document.createElement('div');
    bookElement.className = 'result-item';
    
    let actionsHtml = '';
    if (isAdmin) {
      // If in admin mode, show toggle button
      actionsHtml = `
        <button class="toggle-availability" data-book-id="${book.id}">
          ${book.available ? 'Mark as Unavailable' : 'Mark as Available'}
        </button>
        <span class="library-location">${book.location}</span>
      `;
    } else {
      // Regular user view
      actionsHtml = `
        <button class="check-availability" data-book-id="${book.id}">Check availability</button>
        <span class="library-location">${book.location}</span>
      `;
    }
    
    bookElement.innerHTML = `
      <div class="result-number">${i + 1}</div>
      <div class="result-details">
        <h3 class="result-title">${book.title}</h3>
        <p class="result-author">${book.author}</p>
        ${book.publication ? `<p class="result-publication">${book.publication}</p>` : ''}
        <p class="result-description">${book.description}</p>
        <div class="result-actions">
          ${actionsHtml}
        </div>
      </div>
    `;
    
    bookResultsContainer.appendChild(bookElement);
  }
  
  // Add event listeners for buttons
  if (isAdmin) {
    document.querySelectorAll('.toggle-availability').forEach(button => {
      button.addEventListener('click', function() {
        const bookId = parseInt(this.getAttribute('data-book-id'));
        toggleAvailability(bookId);
      });
    });
  } else {
    document.querySelectorAll('.check-availability').forEach(button => {
      button.addEventListener('click', function() {
        const bookId = parseInt(this.getAttribute('data-book-id'));
        const book = books.find(b => b.id === bookId);
        if (book) {
          showAvailabilityPopup(book);
        }
      });
    });
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