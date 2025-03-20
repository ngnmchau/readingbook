const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Tạo và gửi token trong cookie
const sendTokenResponse = (user, statusCode, res, redirect) => {
  // Tạo token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  if (redirect) {
    return res
      .status(statusCode)
      .cookie('token', token, options)
      .redirect(redirect);
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

// @desc    Hiển thị form đăng ký
// @route   GET /auth/register
// @access  Public
exports.getRegisterForm = (req, res) => {
  if (res.locals.user) {
    return res.redirect('/');
  }
  
  res.render('register', {
    title: 'Đăng ký tài khoản',
    page: 'auth'
  });
};

// @desc    Đăng ký người dùng
// @route   POST /auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    console.log('Đang cố gắng đăng ký với email:', email);
    
    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      console.log('Mật khẩu và xác nhận mật khẩu không khớp');
      return res.render('register', {
        title: 'Đăng ký tài khoản',
        error: 'Mật khẩu và xác nhận mật khẩu không khớp',
        name,
        email,
        page: 'auth'
      });
    }
    
    // Tạo username từ email (phần trước @)
    const username = email.split('@')[0];
    
    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      console.log('Mật khẩu quá ngắn');
      return res.render('register', {
        title: 'Đăng ký tài khoản',
        error: 'Mật khẩu phải có ít nhất 6 ký tự',
        name,
        email,
        page: 'auth'
      });
    }
    
    // Tạo người dùng mới
    const user = await User.create({
      name,
      email,
      password,
      username
    });
    
    console.log('Đăng ký thành công, người dùng mới với ID:', user._id);

    // Chuyển hướng đến trang đăng nhập
    res.redirect('/auth/login?registered=true');
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    
    // Kiểm tra lỗi trùng lặp (duplicate key error)
    if (err.code === 11000) {
      // Xác định trường nào gây ra lỗi
      const field = Object.keys(err.keyPattern)[0];
      let errorMessage = '';
      
      if (field === 'email') {
        errorMessage = 'Email này đã được đăng ký';
      } else if (field === 'username') {
        errorMessage = 'Tên đăng nhập này đã tồn tại';
      } else {
        errorMessage = 'Thông tin đăng ký đã tồn tại';
      }
      
      return res.render('register', {
        title: 'Đăng ký tài khoản',
        page: 'auth',
        error: errorMessage,
        name: req.body.name,
        email: field === 'email' ? '' : req.body.email
      });
    }
    
    // Xử lý các lỗi khác
    res.render('register', {
      title: 'Đăng ký tài khoản',
      page: 'auth',
      error: 'Đã xảy ra lỗi, vui lòng thử lại',
      name: req.body.name,
      email: req.body.email
    });
  }
};

// @desc    Hiển thị form đăng nhập
// @route   GET /auth/login
// @access  Public
exports.getLoginForm = (req, res) => {
  if (res.locals.user) {
    return res.redirect('/');
  }
  
  const registered = req.query.registered === 'true';
  const redirect = req.query.redirect || '';
  
  res.render('login', {
    title: 'Đăng nhập',
    page: 'auth',
    registered,
    redirect
  });
};

// @desc    Đăng nhập người dùng
// @route   POST /auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Đang cố gắng đăng nhập với email:', email);
    
    // Kiểm tra email và password có được nhập không
    if (!email || !password) {
      console.log('Thiếu email hoặc password');
      return res.render('login', {
        title: 'Đăng nhập',
        error: 'Vui lòng nhập email và mật khẩu',
        email,
        page: 'auth'
      });
    }

    // Kiểm tra xem user có tồn tại không - thông báo chi tiết
    const user = await User.findOne({ email }).select('+password');
    console.log('User tìm thấy:', user ? 'Có' : 'Không');
    if (user) {
      console.log('User ID:', user._id);
      console.log('Role:', user.role);
      console.log('Stored Password (Hashed):', user.password);
      console.log('Plain Password:', password);
    }
    
    if (!user) {
      console.log('Không tìm thấy người dùng với email:', email);
      return res.render('login', {
        title: 'Đăng nhập',
        error: 'Email hoặc mật khẩu không chính xác',
        email,
        page: 'auth'
      });
    }

    // Kiểm tra mật khẩu
    let isMatch;
    try {
      isMatch = await bcrypt.compare(password, user.password);
      console.log('Kết quả so sánh mật khẩu:', isMatch);
    } catch (error) {
      console.error('Lỗi khi so sánh mật khẩu:', error);
      return res.render('login', {
        title: 'Đăng nhập',
        error: 'Có lỗi khi xác thực mật khẩu',
        email,
        page: 'auth'
      });
    }
    
    if (!isMatch) {
      console.log('Mật khẩu không khớp cho email:', email);
      return res.render('login', {
        title: 'Đăng nhập',
        error: 'Email hoặc mật khẩu không chính xác',
        email,
        page: 'auth'
      });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
    
    console.log('Đăng nhập thành công, đang tạo token cho user id:', user._id);

    // Lưu token vào cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };
    
    res.cookie('token', token, cookieOptions);

    // Kiểm tra nếu là tài khoản admin, chuyển đến trang admin
    if (user.role === 'admin') {
      console.log('Người dùng là admin, chuyển hướng đến /admin');
      return res.redirect('/admin');
    }

    // Chuyển đến trang chủ hoặc trang được yêu cầu trước đó
    const redirectUrl = req.query.redirect || '/';
    console.log('Chuyển hướng đến:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.render('login', {
      title: 'Đăng nhập',
      error: 'Có lỗi khi đăng nhập, vui lòng thử lại sau',
      email: req.body.email,
      page: 'auth'
    });
  }
};

// @desc    Đăng xuất người dùng
// @route   GET /auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.redirect('/');
};

// @desc    Hiển thị form quên mật khẩu
// @route   GET /auth/forgot-password
// @access  Public
exports.getForgotPasswordForm = (req, res) => {
  res.render('forgot-password', {
    title: 'Quên mật khẩu',
    page: 'auth'
  });
};

// @desc    Xử lý quên mật khẩu
// @route   POST /auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.render('forgot-password', {
        title: 'Quên mật khẩu',
        page: 'auth',
        error: 'Không tìm thấy tài khoản với email này',
        email
      });
    }

    // Trong thực tế, bạn sẽ gửi email reset password ở đây
    // Nhưng hiện tại chúng ta sẽ chỉ hiển thị thông báo thành công

    res.render('forgot-password', {
      title: 'Quên mật khẩu',
      page: 'auth',
      success: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn',
      email
    });
  } catch (err) {
    console.error(err);
    res.render('forgot-password', {
      title: 'Quên mật khẩu',
      page: 'auth',
      error: 'Đã xảy ra lỗi, vui lòng thử lại',
      email: req.body.email
    });
  }
};

// @desc    Lấy thông tin người dùng hiện tại
// @route   GET /auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.render('profile', {
      user,
      title: 'Hồ sơ của tôi'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Lỗi máy chủ'
    });
  }
};

// @desc    Cập nhật thông tin người dùng
// @route   POST /auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, username, email } = req.body;
    
    // Kiểm tra nếu email hoặc username đã tồn tại
    const existingUser = await User.findOne({
      $or: [
        { email, _id: { $ne: req.user.id } },
        { username, _id: { $ne: req.user.id } }
      ]
    });
    
    if (existingUser) {
      return res.render('profile', {
        user: req.user,
        title: 'Hồ sơ của tôi',
        error: 'Email hoặc tên đăng nhập đã tồn tại'
      });
    }
    
    // Cập nhật thông tin người dùng
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, username, email },
      { new: true, runValidators: true }
    );
    
    res.render('profile', {
      user,
      title: 'Hồ sơ của tôi',
      success: 'Thông tin đã được cập nhật thành công'
    });
  } catch (err) {
    console.error(err);
    res.render('profile', {
      user: req.user,
      title: 'Hồ sơ của tôi',
      error: 'Đã xảy ra lỗi, vui lòng thử lại'
    });
  }
};

// @desc    Đổi mật khẩu
// @route   POST /auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Kiểm tra xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      return res.render('profile', {
        user: req.user,
        title: 'Hồ sơ của tôi',
        error: 'Mật khẩu xác nhận không khớp',
        activeTab: 'settings'
      });
    }
    
    // Lấy người dùng có mật khẩu
    const user = await User.findById(req.user.id).select('+password');
    
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.render('profile', {
        user: req.user,
        title: 'Hồ sơ của tôi',
        error: 'Mật khẩu hiện tại không đúng',
        activeTab: 'settings'
      });
    }
    
    // Cập nhật mật khẩu
    user.password = newPassword;
    await user.save();
    
    res.render('profile', {
      user,
      title: 'Hồ sơ của tôi',
      success: 'Mật khẩu đã được cập nhật thành công',
      activeTab: 'settings'
    });
  } catch (err) {
    console.error(err);
    res.render('profile', {
      user: req.user,
      title: 'Hồ sơ của tôi',
      error: 'Đã xảy ra lỗi, vui lòng thử lại',
      activeTab: 'settings'
    });
  }
};

// @desc    Cập nhật avatar
// @route   POST /auth/update-avatar
// @access  Private
exports.updateAvatar = async (req, res, next) => {
  try {
    // Xử lý tải lên avatar (cần thiết lập multer trước)
    if (!req.file) {
      return res.render('profile', {
        user: req.user,
        title: 'Hồ sơ của tôi',
        error: 'Vui lòng chọn một file ảnh'
      });
    }
    
    // Cập nhật đường dẫn avatar
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: `/uploads/users/${req.file.filename}` },
      { new: true }
    );
    
    res.render('profile', {
      user,
      title: 'Hồ sơ của tôi',
      success: 'Ảnh đại diện đã được cập nhật thành công'
    });
  } catch (err) {
    console.error(err);
    res.render('profile', {
      user: req.user,
      title: 'Hồ sơ của tôi',
      error: 'Đã xảy ra lỗi, vui lòng thử lại'
    });
  }
};

// @desc    Xóa tài khoản
// @route   POST /auth/delete-account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    // Lấy người dùng có mật khẩu
    const user = await User.findById(req.user.id).select('+password');
    
    // Kiểm tra mật khẩu
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.render('profile', {
        user: req.user,
        title: 'Hồ sơ của tôi',
        error: 'Mật khẩu không đúng',
        activeTab: 'settings'
      });
    }
    
    // Xóa tài khoản
    await User.findByIdAndDelete(req.user.id);
    
    // Xóa cookie token
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    
    res.redirect('/auth/login?deleted=true');
  } catch (err) {
    console.error(err);
    res.render('profile', {
      user: req.user,
      title: 'Hồ sơ của tôi',
      error: 'Đã xảy ra lỗi, vui lòng thử lại',
      activeTab: 'settings'
    });
  }
}; 