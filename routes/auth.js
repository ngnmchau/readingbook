const express = require('express');
const router = express.Router();
const passport = require('passport');

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

// Route đăng nhập với Google
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route callback từ Google
router.get('/login/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/me'); // Điều hướng về trang cá nhân sau khi đăng nhập
  }
);

// Route đăng nhập với Facebook
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Route callback từ Facebook
router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/me'); // Điều hướng về trang cá nhân sau khi đăng nhập
  }
);
module.exports = router; 
