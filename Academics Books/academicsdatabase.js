// This file contains all the book data for the e-library
const books = [
    {
      id: 1,
      title: "Carbon Jargon: Making Sense of the life Science of Climate Change",
      author: "N/A,",
      description: "Book - 159 pages;",
      location: "Nova Schola Main Library",
      available: true
    },
    {
      id: 2,
      title: "General Ecology",
      author: "David T. Krohne, author.",
      description: "Book - 505 pages;",
      location: "Nova Schola Main Library",
      available: true
    },
    {
      id: 3,
      title: "Biology of the invertabrate",
      author: "Jan A. Pechenik.",
      description: "Book - 605 pages;",
      location: "Nova Schola Main Library",
      available: true
    },
    {
      id: 4,
      title: "Environmental Science ",
      author: "American Geological Institute.",
      description: "Book - 324 pages;",
      location: "Nova Schola Main Library",
      available: true
    },
    {
      id: 5,
      title: "Sociological and Anthropology with family",
      author: "Dr. Manalo M Ariola.",
      description: "Book - 210 pages;",
      location: "Nova Schola Main Library",
      available: true
    },
    {
      id: 6,
      title: "Basic Calculus for Senior High School",
      author: "Perla Dela Cruz .",
      description: "Book - 309 pages;",
      location: "Nova Schola Main Library",
      available: true
    },
    {
      id: 7,
      title: " English for Academic and Professional Purpose",
      author: "Marikit Vychoco and Grace Sacteton,",
      description: "Book - 179 pages;",
      location: "Nova Schola Main Library",
      available: true
    },

    {
        id: 8,
        title: "Oral Communication in conetent",
        author: "Ramona S. Flores,",
        description: "Book - 183 pages;",
        location: "Nova Schola Main Library",
        available: true
      },


      {
        id: 9,
        title: "T.L.E. in the 21st Century",
        author: "Grisham John,",
        description: "Book - 456 pages;",
        location: "Nova Schola Main Library",
        available: true
      },


      {
        id: 10,
        title: "Plane and Spherical trigonometry with applications",
        author: "Hart,",
        description: "Book - 124 pages;",
        location: "Nova Schola Main Library",
        available: true
      },


      {
        id: 11,
        title: "Algebra for the viterly confused",
        author: "Stephens Henrry,",
        description: "Book - 201 pages;",
        location: "Nova Schola Main Library",
        available: true
      },

      {
        id: 12,
        title: "Geometry",
        author: "Prinami/ Caruso 2012,",
        description: "Book - 201 pages;",
        location: "Nova Schola Main Library",
        available: true
      },


      {
        id: 13,
        title: "California Pre-Algebra",
        author: "Charles Etal,",
        description: "Book - 760 pages;",
        location: "Nova Schola Main Library",
        available: true
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