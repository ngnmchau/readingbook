const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Import các model
const Book = require('./models/Book');
const Chapter = require('./models/Chapter');
const User = require('./models/User');
const Category = require('./models/Category');
const BlogPost = require('./models/Blog');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Đảm bảo các thư mục uploads tồn tại
const uploadDirs = [
  path.join(__dirname, 'public/uploads'),
  path.join(__dirname, 'public/uploads/books'),
  path.join(__dirname, 'public/uploads/users'),
  path.join(__dirname, 'public/uploads/categories'),
  path.join(__dirname, 'public/uploads/blogs'),
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Đã tạo thư mục ${dir} thành công!`);
  }
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Route files
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/bookRoutes');
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin'); // Make sure this path is correct
const blogRoutes = require('./routes/blog');


// Mount routers
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);

// API routes
app.post('/api/books/:id/favorites', (req, res) => {
  // Xử lý thêm sách vào danh sách yêu thích
  res.json({ success: true });
});

app.delete('/api/books/:id/favorites', (req, res) => {
  // Xử lý xóa sách khỏi danh sách yêu thích
  res.json({ success: true });
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error('Lỗi ứng dụng:', err.stack);
  res.status(500).render('error', {
    title: 'Lỗi Hệ Thống',
    message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
    user: req.user
  });
});

// Xử lý 404 - Xóa một cái để tránh định nghĩa trùng
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Không Tìm Thấy Trang',
    message: 'Trang bạn đang tìm kiếm không tồn tại.',
    user: req.user
  });
});

// Gọi hàm kiểm tra và seed dữ liệu sau khi kết nối database
connectDB().then(async () => {
  console.log('Kết nối MongoDB thành công!');
}).catch(err => {
  console.error('Lỗi kết nối MongoDB:', err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server đang chạy ở cổng ${PORT}`);
});