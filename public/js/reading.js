document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const tocSidebar = document.getElementById('tocSidebar');
  const settingsPanel = document.getElementById('settingsPanel');
  const overlay = document.getElementById('overlay');
  const toggleTocBtn = document.getElementById('toggleToc');
  const closeTocBtn = document.getElementById('closeToc');
  const toggleSettingsBtn = document.getElementById('toggleSettings');
  const closeSettingsBtn = document.getElementById('closeSettings');
  const readingContainer = document.querySelector('.reading-container');
  const chapterContent = document.querySelector('.chapter-content');
  
  // Font size controls
  const increaseFontBtn = document.getElementById('increaseFontSize');
  const decreaseFontBtn = document.getElementById('decreaseFontSize');
  const resetFontBtn = document.getElementById('resetFontSize');
  
  // Theme controls
  const themeButtons = document.querySelectorAll('.theme-btn');
  
  // Font family control
  const fontSelect = document.getElementById('fontSelect');
  
  // Default font size
  let currentFontSize = 18; // in pixels
  
  // Initialize reading settings from localStorage
  function initializeSettings() {
    // Font size
    const savedFontSize = localStorage.getItem('reading_fontSize');
    if (savedFontSize) {
      currentFontSize = parseInt(savedFontSize);
      chapterContent.style.fontSize = `${currentFontSize}px`;
    }
    
    // Theme
    const savedTheme = localStorage.getItem('reading_theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.querySelector(`.theme-btn.theme-${savedTheme}`).classList.add('active');
    }
    
    // Font family
    const savedFont = localStorage.getItem('reading_fontFamily');
    if (savedFont) {
      chapterContent.style.fontFamily = savedFont;
      fontSelect.value = savedFont;
    }
  }
  
  // Toggle Table of Contents
  toggleTocBtn.addEventListener('click', function() {
    tocSidebar.classList.add('active');
    overlay.classList.add('active');
  });
  
  // Close Table of Contents
  closeTocBtn.addEventListener('click', function() {
    tocSidebar.classList.remove('active');
    overlay.classList.remove('active');
  });
  
  // Toggle Settings Panel
  toggleSettingsBtn.addEventListener('click', function() {
    settingsPanel.classList.add('active');
    overlay.classList.add('active');
  });
  
  // Close Settings Panel
  closeSettingsBtn.addEventListener('click', function() {
    settingsPanel.classList.remove('active');
    overlay.classList.remove('active');
  });
  
  // Close both panels when clicking overlay
  overlay.addEventListener('click', function() {
    tocSidebar.classList.remove('active');
    settingsPanel.classList.remove('active');
    overlay.classList.remove('active');
  });
  
  // Increase font size
  increaseFontBtn.addEventListener('click', function() {
    if (currentFontSize < 32) {
      currentFontSize += 2;
      chapterContent.style.fontSize = `${currentFontSize}px`;
      localStorage.setItem('reading_fontSize', currentFontSize);
    }
  });
  
  // Decrease font size
  decreaseFontBtn.addEventListener('click', function() {
    if (currentFontSize > 14) {
      currentFontSize -= 2;
      chapterContent.style.fontSize = `${currentFontSize}px`;
      localStorage.setItem('reading_fontSize', currentFontSize);
    }
  });
  
  // Reset font size
  resetFontBtn.addEventListener('click', function() {
    currentFontSize = 18;
    chapterContent.style.fontSize = `${currentFontSize}px`;
    localStorage.setItem('reading_fontSize', currentFontSize);
  });
  
  // Set theme
  function setTheme(theme) {
    // Remove all theme classes
    readingContainer.classList.remove('reading-theme-light', 'reading-theme-sepia', 'reading-theme-dark');
    
    // Add selected theme class
    readingContainer.classList.add(`reading-theme-${theme}`);
    
    // Update active button
    themeButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.theme === theme) {
        btn.classList.add('active');
      }
    });
    
    // Save to localStorage
    localStorage.setItem('reading_theme', theme);
  }
  
  // Theme buttons click event
  themeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const theme = this.dataset.theme;
      setTheme(theme);
    });
  });
  
  // Font family change
  fontSelect.addEventListener('change', function() {
    const selectedFont = this.value;
    chapterContent.style.fontFamily = selectedFont;
    localStorage.setItem('reading_fontFamily', selectedFont);
  });
  
  // Save reading progress
  function saveReadingProgress() {
    const bookId = document.querySelector('meta[name="book-id"]').content;
    const chapterId = document.querySelector('meta[name="chapter-id"]').content;
    
    // Only save if user is logged in
    if (document.body.classList.contains('logged-in')) {
      fetch('/api/reading-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId,
          chapterId
        })
      })
      .then(response => response.json())
      .then(data => console.log('Progress saved'))
      .catch(error => console.error('Error saving progress:', error));
    }
  }
  
  // Save progress when page is loaded
  saveReadingProgress();
  
  // Initialize settings
  initializeSettings();
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Left arrow key - previous chapter
    if (e.key === 'ArrowLeft') {
      const prevChapterLink = document.querySelector('.chapter-navigation a:first-child');
      if (prevChapterLink) {
        prevChapterLink.click();
      }
    }
    
    // Right arrow key - next chapter
    if (e.key === 'ArrowRight') {
      const nextChapterLink = document.querySelector('.chapter-navigation a:last-child');
      if (nextChapterLink) {
        nextChapterLink.click();
      }
    }
    
    // Escape key - close panels
    if (e.key === 'Escape') {
      tocSidebar.classList.remove('active');
      settingsPanel.classList.remove('active');
      overlay.classList.remove('active');
    }
  });
}); 