exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // ... existing validation code ...
    
    // Tìm user và kiểm tra mật khẩu
    const user = await User.findOne({ email }).select('+password');
    
    // ... existing password check code ...
    
    // Tạo token và đăng nhập
    sendTokenResponse(user, 200, res);
    
    // Chuyển hướng người dùng dựa vào role
    if (user.role === 'admin') {
      return res.redirect('/admin');
    } else {
      return res.redirect('/');
    }
    
  } catch (error) {
    // ... existing error handling ...
  }
}; 