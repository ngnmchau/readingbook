const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import controllers
const booksController = require('../controllers/admin/books.controller');
const usersController = require('../controllers/admin/users.controller');

// Cấu hình multer cho upload ảnh
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép tải lên file hình ảnh!'));
    }
  }
});

// Áp dụng middleware bảo vệ cho tất cả các route admin
router.use(ensureAuthenticated);
router.use(ensureAdmin);

// Dashboard route
router.get('/', async (req, res) => {
  try {
    console.log('Đang tải trang dashboard...');
    
    // Lấy tham chiếu đến models
    const User = require('../models/User');
    const Book = require('../models/Book');
    const Category = require('../models/Category');
    
    // Fetch stats
    console.log('Đang truy vấn số liệu thống kê...');
    const userCount = await User.countDocuments() || 0;
    const bookCount = await Book.countDocuments() || 0;
    const categoryCount = await Category.countDocuments() || 0;
    
    console.log(`Số liệu thống kê: ${userCount} người dùng, ${bookCount} sách, ${categoryCount} thể loại`);
    
    // Đối với thống kê lượt đọc và bình luận, cần có model tương ứng
    const viewCount = 0; // Thay bằng truy vấn thực khi có model
    const commentCount = 0; // Thay bằng truy vấn thực khi có model
    
    // Lấy sách mới nhất để hiển thị
    const recentBooks = await Book.find().sort({ createdAt: -1 }).limit(5);
    
    res.render('admin/dashboard', {
      stats: {
        userCount,
        bookCount,
        categoryCount,
        viewCount,
        commentCount
      },
      recentBooks: recentBooks || []
    });
  } catch (err) {
    console.error('Lỗi trang dashboard:', err);
    res.status(500).render('error', { 
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải trang quản trị',
      user: req.user
    });
  }
});
router.get('/dashboard', (req, res) => res.redirect('/admin'));

// Book routes
router.get('/books', booksController.index);
router.get('/books/add', booksController.addForm);
router.post('/books', upload.single('cover'), booksController.create);
router.get('/books/:id/view', booksController.view);
router.get('/books/:id/edit', booksController.editForm);
router.post('/books/:id', upload.single('cover'), booksController.update);
router.get('/books/:id/delete', booksController.delete);

// User routes
router.get('/users', usersController.index);
router.get('/users/add', usersController.addForm);
router.post('/users', upload.single('avatar'), usersController.create);
router.get('/users/:id/view', usersController.view);
router.get('/users/:id/edit', usersController.editForm);
router.post('/users/:id', upload.single('avatar'), usersController.update);
router.get('/users/:id/delete', usersController.delete);

module.exports = router;