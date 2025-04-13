// palitan to later
const books = [
    {
      id: 1,
      title: "American Journal of Criminal Law : Articles",
      author: "Jpshua E. Kastentzerg, Thomas M. DiBegio,",
      description: "Book - 48, 68,  pages;",
      location: "Nova Schola Main Library",
      available: true
    },
    {
      id: 2,
      title: "ADVERBS: A Novel",
      author: "Daniel, Handler, author.",
      description: "Book - 272 pages;",
      location: "Nova Schola Main Library",
      available: false
    },
    {
      id: 3,
      title: "The Fountainhead",
      author: "AYN Rand.",
      description: "Book - 696 pages;",
      location: "Nova Schola Main Library",
      available: true
    },
    {
      id: 4,
      title: "Ethics and Value for law enforcers ",
      author: "Ricardo M. Gevera.",
      description: "Book - 170 pages;",
      location: "Nova Schola Main Library",
      available: true
    },
    {
      id: 5,
      title: "Crimonological Rseearch Mode Simple",
      author: "Mario A. Garcia.",
      description: "Book - 116 pages;",
      location: "Nova Schola Main Library",
      available: false
    },
    {
      id: 6,
      title: "Police Intelligence and Secret Service ",
      author: "Bayani H. Salamenara, Sammy B. Estoque, Donabell O. Aclis.",
      description: "Book - 126 pages;",
      location: "Nova Schola Main Library",
      available: true
    },
    {
      id: 7,
      title: "Rules of Court for Criminology Students",
      author: "Nicanor Reyes,",
      description: "Book - 407 pages;",
      location: "Nova Schola Main Library",
      available: true
    },


    {
        id: 8,
        title: "Fovensic Chemistry and Technology",
        author: "Arlyn M. Dasal, Ronaldo Q Santos,",
        description: "Book - 232 pages;",
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