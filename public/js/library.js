document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const categoryFilters = document.querySelectorAll('.category-filters input');
  const ratingFilters = document.querySelectorAll('.rating-filters input');
  const sortOrder = document.getElementById('sortOrder');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const applyFiltersBtn = document.getElementById('applyFilters');
  const resetFiltersBtn = document.getElementById('resetFilters');
  const booksGrid = document.querySelector('.books-grid');
  const booksCountElement = document.getElementById('booksCount');
  
  // Store original books for filtering
  let allBooks = [];
  
  // Initialize by storing all books
  function initializeBooks() {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
      allBooks.push({
        element: card,
        title: card.querySelector('.book-title').textContent.trim(),
        author: card.querySelector('.book-author').textContent.trim(),
        rating: parseFloat(card.querySelector('.book-rating span').textContent),
        categories: Array.from(card.querySelectorAll('.book-categories .category-badge')).map(badge => badge.textContent.trim())
      });
    });
  }
  
  // Filter books based on criteria
  function filterBooks() {
    // Get selected categories
    const selectedCategories = Array.from(categoryFilters)
      .filter(input => input.checked)
      .map(input => input.value);
    
    // Get minimum rating
    const selectedRating = Array.from(ratingFilters)
      .find(input => input.checked);
    const minRating = selectedRating ? parseInt(selectedRating.value) : 0;
    
    // Get search term
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    // Filter books
    const filteredBooks = allBooks.filter(book => {
      // Category filter
      const passesCategory = selectedCategories.length === 0 || 
        book.categories.some(category => selectedCategories.includes(category));
      
      // Rating filter
      const passesRating = book.rating >= minRating;
      
      // Search filter
      const passesSearch = searchTerm === '' || 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm);
      
      return passesCategory && passesRating && passesSearch;
    });
    
    // Sort books
    const sortValue = sortOrder.value;
    filteredBooks.sort((a, b) => {
      switch (sortValue) {
        case 'newest':
          // Assuming newer books are at the beginning of the array
          return allBooks.indexOf(a) - allBooks.indexOf(b);
        case 'popular':
          // Sort by rating descending
          return b.rating - a.rating;
        case 'rating':
          // Sort by rating descending
          return b.rating - a.rating;
        case 'title':
          // Sort by title alphabetically
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    // Update UI
    booksGrid.innerHTML = '';
    filteredBooks.forEach(book => {
      booksGrid.appendChild(book.element.cloneNode(true));
    });
    
    // Update count
    booksCountElement.textContent = filteredBooks.length;
    
    // Update pagination if needed
    updatePagination(filteredBooks.length);
  }
  
  // Update pagination based on number of books
  function updatePagination(bookCount) {
    const paginationContainer = document.querySelector('.pagination-container');
    const pagination = document.querySelector('.pagination');
    
    if (bookCount === 0) {
      paginationContainer.style.display = 'none';
    } else {
      paginationContainer.style.display = 'flex';
      
      // Simple pagination logic - can be expanded
      const pageCount = Math.ceil(bookCount / 12); // Assuming 12 books per page
      
      if (pageCount <= 1) {
        paginationContainer.style.display = 'none';
      } else {
        pagination.innerHTML = `
          <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Trước</a>
          </li>
        `;
        
        for (let i = 1; i <= Math.min(pageCount, 5); i++) {
          pagination.innerHTML += `
            <li class="page-item ${i === 1 ? 'active' : ''}">
              <a class="page-link" href="#">${i}</a>
            </li>
          `;
        }
        
        pagination.innerHTML += `
          <li class="page-item">
            <a class="page-link" href="#">Sau</a>
          </li>
        `;
      }
    }
  }
  
  // Reset all filters
  function resetFilters() {
    // Uncheck all category filters
    categoryFilters.forEach(input => {
      input.checked = false;
    });
    
    // Uncheck all rating filters
    ratingFilters.forEach(input => {
      input.checked = false;
    });
    
    // Reset sort order
    sortOrder.value = 'newest';
    
    // Clear search
    searchInput.value = '';
    
    // Apply filters
    filterBooks();
  }
  
  // Event listeners
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', filterBooks);
  }
  
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetFilters);
  }
  
  if (searchButton) {
    searchButton.addEventListener('click', filterBooks);
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        filterBooks();
      }
    });
  }
  
  if (sortOrder) {
    sortOrder.addEventListener('change', filterBooks);
  }
  
  // Initialize
  initializeBooks();
  
  // Favorite button functionality
  const favoriteButtons = document.querySelectorAll('.btn-favorite');
  favoriteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const bookId = this.dataset.bookId;
      const icon = this.querySelector('i');
      const isFavorite = icon.classList.contains('fas');
      
      // Check if user is logged in
      if (!document.body.classList.contains('logged-in')) {
        window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
        return;
      }
      
      // Toggle favorite status
      if (isFavorite) {
        // Remove from favorites
        fetch(`/books/${bookId}/favorites`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            icon.classList.remove('fas');
            icon.classList.add('far');
          }
        })
        .catch(error => console.error('Error:', error));
      } else {
        // Add to favorites
        fetch(`/books/${bookId}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            icon.classList.remove('far');
            icon.classList.add('fas');
          }
        })
        .catch(error => console.error('Error:', error));
      }
    });
  });
}); 