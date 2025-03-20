document.addEventListener('DOMContentLoaded', function() {
  const chapterContent = document.querySelector('#chapter-content');
  if (!chapterContent) {
    console.error("Không tìm thấy phần nội dung chương!");
    return;
  }

  const chapterId = chapterContent.dataset.chapterId;
  if (!chapterId) {
    console.error("Không tìm thấy chapterId!");
    return;
  }

  // Lấy nội dung chương từ API
  fetchChapterContent(chapterId);

  // Lưu vị trí đọc hiện tại khi cuộn
  window.addEventListener('scroll', debounce(saveReadingPosition, 200));

  // Khôi phục vị trí đọc trước đó sau khi nội dung chương tải xong
  restoreReadingPosition();
});

// Lấy nội dung chương từ API
function fetchChapterContent(chapterId) {
  fetch(`/api/books/chapters/${chapterId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Không thể tải nội dung chương');
      }
      return response.json();
    })
    .then(data => {
      if (!data.success || !data.data || !data.data.chapter) {
        throw new Error('Dữ liệu không hợp lệ');
      }

      // Kiểm tra nếu các phần tử cần cập nhật tồn tại
      const chapterContent = document.querySelector('.chapter-content');
      const bookTitleElem = document.querySelector('#bookTitle');
      const chapterTitleElem = document.querySelector('.chapter-title');

      if (chapterContent) {
        chapterContent.innerHTML = data.data.chapter.content;
      }
      if (bookTitleElem) {
        bookTitleElem.textContent = data.data.book.title;
      }
      if (chapterTitleElem) {
        chapterTitleElem.textContent = data.data.chapter.title;
      }

      // Cập nhật tiêu đề trang
      document.title = `${data.data.chapter.title} - ReadingBook`;

      // Cập nhật điều hướng chương
      updateChapterNavigation(data.data);

      // Khôi phục vị trí đọc sau khi nội dung được tải
      restoreReadingPosition();
    })
    .catch(error => {
      console.error('Lỗi:', error);
      document.querySelector('.chapter-content').innerHTML = 
        '<div class="alert alert-danger">Không thể tải nội dung chương. Vui lòng thử lại sau.</div>';
    });
}

// Cập nhật nút điều hướng chương
function updateChapterNavigation(data) {
  const prevChapterBtn = document.querySelector('#prev-chapter');
  const nextChapterBtn = document.querySelector('#next-chapter');

  if (prevChapterBtn) {
    if (data.navigation.prev) {
      prevChapterBtn.href = `/reader/${data.navigation.prev}`;
      prevChapterBtn.classList.remove('disabled');
      prevChapterBtn.onclick = (e) => {
        e.preventDefault();
        loadChapter(data.navigation.prev);
      };
    } else {
      prevChapterBtn.href = '#';
      prevChapterBtn.classList.add('disabled');
    }
  }

  if (nextChapterBtn) {
    if (data.navigation.next) {
      nextChapterBtn.href = `/reader/${data.navigation.next}`;
      nextChapterBtn.classList.remove('disabled');
      nextChapterBtn.onclick = (e) => {
        e.preventDefault();
        loadChapter(data.navigation.next);
      };
    } else {
      nextChapterBtn.href = '#';
      nextChapterBtn.classList.add('disabled');
    }
  }
}

// Hàm tải chương mới khi ấn nút chuyển chương
function loadChapter(chapterId) {
  history.pushState(null, '', `/reader/${chapterId}`); // Cập nhật URL mà không reload
  fetchChapterContent(chapterId); // Gọi API lấy nội dung chương mới
}


// Lưu vị trí đọc
function saveReadingPosition() {
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  const chapterId = document.querySelector('#chapter-content')?.dataset.chapterId;

  if (chapterId) {
    localStorage.setItem(`reading-position-${chapterId}`, scrollPosition);
  }
}

// Khôi phục vị trí đọc
function restoreReadingPosition() {
  const chapterId = document.querySelector('#chapter-content')?.dataset.chapterId;
  if (!chapterId) return;

  const savedPosition = localStorage.getItem(`reading-position-${chapterId}`);
  if (savedPosition) {
    setTimeout(() => {
      window.scrollTo({
        top: parseInt(savedPosition, 10),
        behavior: 'smooth'
      });
    }, 300);
  }
}

// Hàm debounce để tránh gọi hàm quá nhiều lần khi cuộn
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
