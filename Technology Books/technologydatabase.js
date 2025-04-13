// This file contains all the book data for the e-library
const books = [
    {
      id: 1,
      title: "Database Management Systems",
      author: "Nikolay, Kovalev V., author .",
      description: "Book - 296 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 2,
      title: "JAVA Programming by Example 6th Edition",
      author: "de Jesus, Joy T., Abe, Lesley, M.S, Julius., author.",
      description: "Book - 130 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 3,
      title: "Programming and Databases",
      author: "de Jesus, Joy T., Abe, Lesley, M.S, Julius.,Magboo , Vincent Peter C.",
      description: "Book - 219 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 4,
      title: "Turbo C ",
      author: "Abante, Manuelo V., author.",
      description: "Book - 207 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 5,
      title: "Computer Fundamentals Information Technology",
      author: "Lopermicus, Pepito , author.",
      description: "Book - 316 pages;",
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