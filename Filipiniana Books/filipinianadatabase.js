// This file contains all the book data for the e-library
const books = [
    {
      id: 1,
      title: "Perception of five selected companies in Tanauan City that uses accounting system: basis for coming-up with a proposal",
      author: "Banilla et al.",
      description: "Book - 66 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 2,
      title: "Ebalwasyon sa bidyo kagamitan sa pagpapataas ng pang unawa sa el filibusterismo ng mga mag-aaral sa ikasampungbaitang ng pantay national high school (PNHS) Tanauan City, Batangas",
      author: "Lalaine Unico Tercero",
      description: "Book - 86 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 3,
      title: "Comparative analysis of the interpersonal and intrapersonal intelligence of grade 12 senior high school students of Nova Schola Tanauan in academic and technical vocational track basis for developing an oction plan",
      author: "Biescas et al.",
      description: "Book - 51 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 4,
      title: "Academic calendar shifts and its effect to students readiness of Tanauan City College: basis for an action plan ",
      author: "Arelane et al.",
      description: "Book - 47 pages;",
      location: "Nova Schola Main Library"
    },
    {
      id: 5,
      title: "Correlation of educational activities and academic performance of grade 8 students of Tanauan City National High School: basis for an action plan creation",
      author: "Balignasay et  al.",
      description: "Book - 86 pages;",
      location: "Nova Schola Main Library"
    },
  
    {
        id: 6,
        title: "Correlation of the level of the competetiveness and academic performance of technical-vocational grade 12 students of Sto. Tomas Senior High School: basis for crafting a proposed plan of action",
        author: "Aptial et al.",
        description: "Book - 77 pages;",
        location: "Nova Schola Main Library"
      },
      
      {
        id: 7,
        title: "Correlation of the students perception on academic behavior and positive reinforcement utilization and its significance to academic performance: basis for an action plan creation",
        author: "Benimar et al.",
        description: "Book - 64 pages;",
        location: "Nova Schola Main Library"
      },


      {
        id: 8,
        title: "An assessment of the proposal and personal competence of school heads in leading 21st century learning in selected deped and non deped schools offering senior high school: basis of training and development",
        author: "Molinyawe et al.",
        description: "Book - 71 pages;",
        location: "Nova Schola Main Library"
      },


      {
        id: 9,
        title: "Students perception of Quizlet as a learning tool among high school students",
        author: "Santos et al.",
        description: "Book - 61 pages;",
        location: "Nova Schola Main Library"
      },


      {
        id: 10,
        title: "Perception on sustainable food packaging and purchasing behavior of consumers in Brgy. Darasa Tanauan City, Batangas: a correlational study",
        author: "Favila et al.",
        description: "Book - 81 pages;",
        location: "Nova Schola Main Library"
      },


      {
        id: 11,
        title: "Food wasting awareness among students of Nova Schola Tanauan: a Comparative Study",
        author: "Leonor et al.",
        description: "Book - 88 pages;",
        location: "Nova Schola Main Library"
      },

      {
        id: 12,
        title: "Anak ka ba ni Henry SY?: a comparative study about impulsive buying behavior across generation x, millenials, and generation z in Brgy, Darasa Tanauan City",
        author: "Nobleza et al.",
        description: "Book - 66 pages;",
        location: "Nova Schola Main Library"
      },

      {
        id: 13,
        title: "Eating smart, spending wise: a study on food choices and budgeting practices among high school students of Nova Schola Tanauan, inc.",
        author: "Galapin et al.",
        description: "Book - 70 pages;",
        location: "Nova Schola Main Library"
      },


      {
        id: 14,
        title: "Magsasaka ka, hindi magsasaka lang: perceived effectiveness of the magsasakang Tanaueno agricultural marketing cooperative (MTMAC) among local farmers of barangay Santor and barangay Janopol Oriental in Tanauan City, Batangas",
        author: "Salazar et al.",
        description: "Book - 177 pages;",
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