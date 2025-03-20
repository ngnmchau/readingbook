const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Bảo vệ route - yêu cầu đăng nhập
exports.protect = async (req, res, next) => {
  let token;

  // Kiểm tra token từ cookie
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Nếu không có token
  if (!token) {
    return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user từ id trong token
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
    }

    next();
  } catch (err) {
    return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
  }
};

// Thêm thông tin user vào tất cả các request
exports.loadUser = async (req, res, next) => {
  try {
    let token;

    // Kiểm tra token từ cookie
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Nếu không có token, tiếp tục nhưng không có user
    if (!token) {
      res.locals.user = null;
      return next();
    }

    try {
      // Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

      // Tìm user từ id trong token
      const user = await User.findById(decoded.id);
      
      // Thêm user vào res.locals để sử dụng trong views
      res.locals.user = user;
      req.user = user; // Thêm vào req.user để middleware khác sử dụng
      next();
    } catch (tokenError) {
      // Nếu token không hợp lệ hoặc hết hạn, xóa cookie
      console.log('Token không hợp lệ:', tokenError.message);
      res.clearCookie('token');
      res.locals.user = null;
      req.user = null;
      next();
    }
  } catch (err) {
    console.error('Lỗi loadUser:', err);
    res.locals.user = null;
    req.user = null;
    next();
  }
};

// Cấp quyền truy cập cho các vai trò
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Vai trò ${req.user.role} không có quyền truy cập vào route này`,
      });
    }
    next();
  };
};

// Middleware để kiểm tra quyền admin
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  // Nếu không phải admin, chuyển hướng về trang chính
  res.status(403).redirect('/');
};

/**
 * Kiểm tra người dùng đã đăng nhập chưa
 */
exports.ensureAuthenticated = async (req, res, next) => {
  try {
    let token;
    
    // Kiểm tra token từ cookie
    if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    // Nếu không có token
    if (!token) {
      console.log('Không tìm thấy token, chuyển hướng đến trang đăng nhập');
      return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
    }
    
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tìm user từ id trong token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      // Nếu không tìm thấy user, xóa cookie và chuyển hướng đến trang đăng nhập
      console.log('Không tìm thấy user từ token, xóa cookie và chuyển hướng đến trang đăng nhập');
      res.clearCookie('token');
      return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
    }
    
    // Lưu thông tin user vào request để sử dụng trong các middleware và route tiếp theo
    req.user = user;
    next();
  } catch (err) {
    console.error('Lỗi xác thực:', err);
    res.clearCookie('token');
    return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
  }
};

/**
 * Kiểm tra người dùng có quyền admin không
 */
exports.ensureAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      console.log('Không có thông tin người dùng, chuyển hướng đến trang đăng nhập');
      return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
    }

    // Kiểm tra quyền admin của user
    if (req.user.role !== 'admin') {
      // Nếu user không có quyền admin, chuyển hướng về trang lỗi
      console.log('Người dùng không có quyền admin');
      return res.status(403).render('error', {
        title: 'Lỗi Truy Cập',
        message: 'Bạn không có quyền truy cập trang này. Chỉ quản trị viên mới có thể truy cập.',
        user: req.user
      });
    }

    next();
  } catch (err) {
    console.error('Lỗi kiểm tra quyền admin:', err);
    return res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi kiểm tra quyền truy cập.',
      user: req.user
    });
  }
}; 