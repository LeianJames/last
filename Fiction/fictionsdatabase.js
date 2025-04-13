// This file contains all the book data for the e-library
const books = [
    {
      id: 1,
      title: "Regeneration",
      author: "Pat Barker,",
      description: "Book - 251 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 2,
      title: "ADVERBS: A Novel",
      author: "Daniel, Handler,",
      description: "Book - 272 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 3,
      title: "The Fountainhead",
      author: "AYN Rand.",
      description: "Book - 696 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 4,
      title: "Eden Burning ",
      author: "Belva Plain, author.",
      description: "Book - 476 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 5,
      title: "The road less travelled",
      author: "M. Scott Peck , author.",
      description: "Book - 342 pages;",
      location: "Nova Schola Main Library"
    },
  
    {
        id: 6,
        title: "James and the Giant Peach",
        author: "Roald Dahl, author.",
        description: "Book - 230 pages;",
        location: "Nova Schola Main Library"
      },
      
      {
        id: 7,
        title: "A Painted House",
        author: "Grisham John,",
        description: "Book - 456 pages;",
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