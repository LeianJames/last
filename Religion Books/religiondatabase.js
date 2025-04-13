// This file contains all the book data for the e-library
const books = [
    {
      id: 1,
      title: "Daily Gospel",
      author: "No author.",
      description: "No pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 2,
      title: "Handbook of Prayers",
      author: "hCarles Belmonte, James Socias, author.",
      description: "Book - 376 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 3,
      title: "Moments",
      author: "Fr. Jenry M. Orbos.",
      description: "Book - 101 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 4,
      title: "In love with God ",
      author: "de Mesa Jose, Rebecca Cacho, author.",
      description: "Book - 180 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 5,
      title: "Church of Sacraments",
      author: "Victoria D., Corral, Fides Maria , author.",
      description: "Book - 330 pages;",
      location: "Nova Schola Main Library"
    },

    {
        id: 6,
        title: "Mama Mary, and Her Children",
        author: "Reuter, James B. , author.",
        description: "Book - 150 pages;",
        location: "Nova Schola Main Library"
      },

      {
        id: 7,
        title: "Living Water",
        author: "N/A , author.",
        description: "Book - N/A pages;",
        location: "Nova Schola Main Library"
      },

      {
        id: 8,
        title: "Interpreting the new Testament",
        author: "Daniel J. Harrington , author.",
        description: "Book - 150 pages;",
        location: "Nova Schola Main Library"
      },

  ];

  // Function to save books data (for admin updates)
  function saveBooks() {
    localStorage.setItem('libraryBooks', JSON.stringify(books));
  }
  
  // Function to load books data (for admin updates)
  function loadBooks() {
    const savedBooks = localStorage.getItem('libraryBooks');
    if (savedBooks) {
      // Merge saved availability status with our books array
      const parsedBooks = JSON.parse(savedBooks);
      parsedBooks.forEach(savedBook => {
        const bookIndex = books.findIndex(book => book.id === savedBook.id);
        if (bookIndex !== -1) {
          books[bookIndex].available = savedBook.available;
        }
      });
    }
  }
  
  // Load any saved availability data when page loads
  loadBooks();