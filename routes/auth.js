const express = require('express');
const router = express.Router();
const {
  getRegisterForm,
  register,
  getLoginForm,
  login,
  logout,
  getForgotPasswordForm,
  forgotPassword
} = require('../controllers/authController');

// Hiển thị trang đăng nhập
router.get('/login', getLoginForm);

// Xử lý đăng nhập
router.post('/login', login);

// Hiển thị trang đăng ký
router.get('/register', getRegisterForm);

// Xử lý đăng ký
router.post('/register', register);

// Đăng xuất
router.get('/logout', logout);

// Quên mật khẩu
router.get('/forgot-password', getForgotPasswordForm);
router.post('/forgot-password', forgotPassword);

module.exports = router; 