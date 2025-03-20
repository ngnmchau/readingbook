document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
  
  // Đặt giá trị tìm kiếm từ URL vào thanh tìm kiếm navbar
  const searchParam = new URLSearchParams(window.location.search).get('search');
  const navbarSearchInput = document.querySelector('.search-input');
  if (searchParam && navbarSearchInput) {
    navbarSearchInput.value = searchParam;
    toggleClearButton();
  }
  
  // Kiểm tra đăng nhập
  const token = getCookie('token');
  if (token) {
    updateUIForLoggedInUser();
    
    // Fetch user data
    fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('username').textContent = data.data.username;
      }
    })
    .catch(error => console.error('Error:', error));
  }
  
  // Hiệu ứng cuộn mượt cho các liên kết
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Hiệu ứng hiển thị khi cuộn
  const revealElements = document.querySelectorAll('.reveal');
  
  function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
      const revealTop = element.getBoundingClientRect().top;
      
      if (revealTop < windowHeight - revealPoint) {
        element.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', checkReveal);
  checkReveal();
  
  // Hiệu ứng đếm số
  const statNumbers = document.querySelectorAll('.stat-number');
  let counted = false;
  
  function countUp() {
    if (counted) return;
    
    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;
    
    const statsSectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (statsSectionTop < windowHeight) {
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          stat.textContent = Math.floor(current);
          if (current >= target) {
            clearInterval(timer);
            counted = true;
          }
        }, 16);
      });
    }
  }
  
  countUp();
  
  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      fetch('/api/auth/logout')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Clear cookie and redirect to home
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = '/';
          }
        })
        .catch(error => console.error('Error logging out:', error));
    });
  }
  
  // Search functionality
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const searchTerm = document.getElementById('search-input').value.trim();
      if (searchTerm) {
        window.location.href = `/books?search=${encodeURIComponent(searchTerm)}`;
      }
    });
  }
  
  // Helper function to get cookie value
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  // Update UI for logged in user
  function updateUIForLoggedInUser() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (userDropdown) userDropdown.style.display = 'block';
  }
}); 

// Hàm xử lý tìm kiếm từ thanh navbar
function submitSearch(event) {
  event.preventDefault();
  const searchInput = document.querySelector('.search-input');
  const searchTerm = searchInput.value.trim();
  
  if (searchTerm) {
    // Điều hướng đến trang thư viện với tham số tìm kiếm
    window.location.href = `/library?search=${encodeURIComponent(searchTerm)}`;
  }
} 