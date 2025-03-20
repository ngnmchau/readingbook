/**
 * Admin Portal JavaScript - Xử lý giao diện và chức năng chung
 */

// Kiểm tra xem document đã sẵn sàng chưa
document.addEventListener('DOMContentLoaded', function() {
  // Khởi tạo tooltips
  initTooltips();
  
  // Xử lý sidebar toggle
  handleSidebar();
  
  // Xử lý dropdown menu
  handleDropdowns();
  
  // Hiển thị thông báo thành công & lỗi
  handleAlerts();
  
  // Khởi tạo DataTables
  initDataTables();
  
  // Khởi tạo xử lý xác nhận xóa
  initDeleteConfirmation();
  
  // Xử lý tìm kiếm nhanh
  handleQuickSearch();
});

/**
 * Khởi tạo tooltips
 */
function initTooltips() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      trigger: 'hover'
    })
  });
}

/**
 * Xử lý sidebar toggle
 */
function handleSidebar() {
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const adminSidebar = document.querySelector('.admin-sidebar');
  const overlay = document.querySelector('.overlay');
  
  if (sidebarToggle && adminSidebar) {
    sidebarToggle.addEventListener('click', function() {
      adminSidebar.classList.toggle('active');
      if (overlay) {
        overlay.classList.toggle('show');
      }
    });
    
    if (overlay) {
      overlay.addEventListener('click', function() {
        adminSidebar.classList.remove('active');
        overlay.classList.remove('show');
      });
    }
  }
  
  // Đóng sidebar khi nhấp vào liên kết trên màn hình nhỏ
  const sidebarLinks = document.querySelectorAll('.admin-sidebar .nav-link');
  if (sidebarLinks.length > 0) {
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth < 992 && adminSidebar.classList.contains('active')) {
          adminSidebar.classList.remove('active');
          if (overlay) {
            overlay.classList.remove('show');
          }
        }
      });
    });
  }
}

/**
 * Xử lý dropdown menu
 */
function handleDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown-toggle');
  
  if (dropdowns.length > 0) {
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', function(e) {
        if (this.getAttribute('data-bs-toggle') !== 'dropdown') {
          e.preventDefault();
          const target = this.getAttribute('data-bs-target') || this.getAttribute('href');
          const parent = this.closest('.nav-item');
          
          // Toggle target visibility
          if (parent && target) {
            const targetElement = document.querySelector(target);
            if (targetElement) {
              const isCollapsed = targetElement.classList.contains('show');
              
              // Close all other dropdowns
              const allTargets = document.querySelectorAll('.collapse.show');
              const allParents = document.querySelectorAll('.nav-item');
              
              allTargets.forEach(item => {
                if (item !== targetElement) {
                  item.classList.remove('show');
                }
              });
              
              allParents.forEach(item => {
                if (item !== parent) {
                  item.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                }
              });
              
              // Toggle current dropdown
              this.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
              targetElement.classList.toggle('show');
            }
          }
        }
      });
    });
  }
}

/**
 * Hiển thị thông báo thành công và lỗi
 */
function handleAlerts() {
  const alerts = document.querySelectorAll('.alert-dismissible');
  
  if (alerts.length > 0) {
    alerts.forEach(alert => {
      setTimeout(() => {
        const closeBtn = alert.querySelector('.btn-close');
        if (closeBtn) {
          closeBtn.click();
        }
      }, 5000);
    });
  }
}

/**
 * Xử lý tìm kiếm nhanh cho DataTable
 */
function handleQuickSearch() {
  // Xử lý tìm kiếm nhanh cho bảng users
  const usersQuickSearch = document.getElementById('quickSearch');
  const usersTable = document.getElementById('usersTable');
  
  if (usersQuickSearch && usersTable) {
    usersQuickSearch.addEventListener('keyup', function() {
      const usersDataTable = $(usersTable).DataTable();
      usersDataTable.search(this.value).draw();
    });
    
    document.getElementById('btnQuickSearch')?.addEventListener('click', function() {
      const usersDataTable = $(usersTable).DataTable();
      usersDataTable.search(usersQuickSearch.value).draw();
    });
  }
  
  // Xử lý tìm kiếm nhanh cho bảng books
  const booksQuickSearch = document.getElementById('quickSearch');
  const booksTable = document.getElementById('booksTable');
  
  if (booksQuickSearch && booksTable) {
    booksQuickSearch.addEventListener('keyup', function() {
      const booksDataTable = $(booksTable).DataTable();
      booksDataTable.search(this.value).draw();
    });
    
    document.getElementById('btnQuickSearch')?.addEventListener('click', function() {
      const booksDataTable = $(booksTable).DataTable();
      booksDataTable.search(booksQuickSearch.value).draw();
    });
  }
}

// Xử lý xác nhận xóa
function confirmDelete(url, title = 'Bạn có chắc chắn muốn xóa?', text = 'Hành động này không thể hoàn tác!') {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = url;
    }
  });
}

// Khởi tạo DataTable cho bảng users và books
function initDataTables() {
  if (document.getElementById('usersTable')) {
    $('#usersTable').DataTable({
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/vi.json'
      }
    });
  }
  
  if (document.getElementById('booksTable')) {
    $('#booksTable').DataTable({
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/vi.json'
      }
    });
  }
}

// Khởi tạo xác nhận xóa cho các nút xóa
function initDeleteConfirmation() {
  // Xử lý nút xóa người dùng
  document.querySelectorAll('.confirm-delete').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const userId = this.dataset.id;
      
      if (this.closest('#usersTable')) {
        confirmDelete(`/admin/users/${userId}/delete`, 'Xác nhận xóa người dùng?', 'Tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa.');
      } else if (this.closest('#booksTable')) {
        confirmDelete(`/admin/books/${userId}/delete`, 'Xác nhận xóa sách?', 'Tất cả dữ liệu liên quan đến sách này sẽ bị xóa.');
      }
    });
  });
} 