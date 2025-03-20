const User = require('../../models/User');
const fs = require('fs');
const path = require('path');

/**
 * Hiển thị danh sách người dùng với tìm kiếm và phân trang
 */
exports.index = async (req, res) => {
  try {
    // Xây dựng query cơ bản, không sử dụng bộ lọc người dùng
    const query = {};
    
    // Fetch tất cả người dùng từ database
    const users = await User.find(query).sort({ createdAt: -1 });
    
    // Render trang với dữ liệu
    res.render('admin/users/index', {
      title: 'Quản lý người dùng',
      users,
      breadcrumbs: [
        { name: 'Dashboard', url: '/admin' },
        { name: 'Quản lý người dùng', url: '/admin/users', active: true }
      ]
    });
  } catch (error) {
    console.error('Lỗi khi tải trang quản lý người dùng:', error);
    res.status(500).render('error', {
      message: 'Đã xảy ra lỗi khi tải trang quản lý người dùng',
      error
    });
  }
};

exports.addForm = (req, res) => {
  try {
    res.render('admin/users/add', {
      title: 'Thêm người dùng',
      user: req.user
    });
  } catch (err) {
    console.error('Lỗi khi hiển thị form thêm người dùng:', err);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải trang thêm người dùng',
      user: req.user
    });
  }
};

exports.create = async (req, res) => {
  try {
    // Xử lý dữ liệu từ form
    const { name, email, password, confirmPassword, role } = req.body;
    
    // Kiểm tra password khớp
    if (password !== confirmPassword) {
      return res.status(400).render('admin/users/add', {
        title: 'Thêm người dùng',
        user: req.user,
        error: 'Mật khẩu xác nhận không khớp',
        formData: req.body
      });
    }
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('admin/users/add', {
        title: 'Thêm người dùng',
        user: req.user,
        error: 'Email đã được sử dụng',
        formData: req.body
      });
    }
    
    // Tạo người dùng mới
    const newUser = new User({
      name,
      email,
      password, // Mật khẩu sẽ được hash trong schema pre-save
      role: role || 'user',
      avatar: req.file ? `/uploads/${req.file.filename}` : '/images/default-avatar.png'
    });
    
    await newUser.save();
    
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Lỗi khi tạo người dùng mới:', err);
    res.status(500).render('admin/users/add', {
      title: 'Thêm người dùng',
      user: req.user,
      error: 'Đã xảy ra lỗi khi tạo người dùng mới',
      formData: req.body
    });
  }
};

exports.view = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).render('error', {
        title: 'Không Tìm Thấy',
        message: 'Không tìm thấy người dùng',
        user: req.user
      });
    }
    
    res.render('admin/users/view', {
      title: 'Chi tiết người dùng',
      user: req.user,
      viewUser: user // Sử dụng viewUser để tránh xung đột với biến user từ request
    });
  } catch (err) {
    console.error('Lỗi khi xem chi tiết người dùng:', err);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải chi tiết người dùng',
      user: req.user
    });
  }
};

exports.editForm = async (req, res) => {
  try {
    const editUser = await User.findById(req.params.id);
    
    if (!editUser) {
      return res.status(404).render('error', {
        title: 'Không Tìm Thấy',
        message: 'Không tìm thấy người dùng',
        user: req.user
      });
    }
    
    res.render('admin/users/edit', {
      title: 'Chỉnh sửa người dùng',
      user: req.user,
      editUser: editUser // Sử dụng editUser để tránh xung đột với biến user từ request
    });
  } catch (err) {
    console.error('Lỗi khi chỉnh sửa người dùng:', err);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải trang chỉnh sửa người dùng',
      user: req.user
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
    
    // Kiểm tra nếu password được cung cấp thì phải khớp với confirmPassword
    if (password && password !== confirmPassword) {
      return res.status(400).render('admin/users/edit', {
        title: 'Chỉnh sửa người dùng',
        user: req.user,
        error: 'Mật khẩu xác nhận không khớp',
        editUser: await User.findById(req.params.id)
      });
    }
    
    // Tạo đối tượng cập nhật
    const updateData = {
      name,
      email,
      role: role || 'user'
    };
    
    // Nếu có mật khẩu mới
    if (password) {
      updateData.password = password;
    }
    
    // Nếu có file ảnh mới
    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).render('error', {
        title: 'Không Tìm Thấy',
        message: 'Không tìm thấy người dùng',
        user: req.user
      });
    }
    
    res.redirect(`/admin/users/${updatedUser._id}/view`);
  } catch (err) {
    console.error('Lỗi khi cập nhật người dùng:', err);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi cập nhật người dùng',
      user: req.user
    });
  }
};

/**
 * Xóa người dùng khỏi hệ thống
 */
exports.delete = async (req, res) => {
  try {
    // Tìm người dùng trước khi xóa để lấy thông tin về file ảnh
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).render('error', {
        title: 'Không Tìm Thấy',
        message: 'Không tìm thấy người dùng',
        user: req.user
      });
    }
    
    // Kiểm tra nếu là admin duy nhất, không cho phép xóa
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).render('error', {
          title: 'Không Thể Xóa',
          message: 'Không thể xóa admin duy nhất trong hệ thống',
          user: req.user
        });
      }
    }
    
    // Xóa file ảnh đại diện nếu tồn tại và không phải ảnh mặc định
    if (user.avatar && !user.avatar.includes('default-avatar.png')) {
      try {
        // Chuyển đổi đường dẫn URL thành đường dẫn file
        const avatarPath = path.join(__dirname, '../../public', user.avatar);
        
        // Kiểm tra file tồn tại trước khi xóa
        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
          console.log(`Đã xóa file ảnh đại diện: ${avatarPath}`);
        }
      } catch (fileErr) {
        console.error('Lỗi khi xóa file ảnh đại diện:', fileErr);
        // Vẫn tiếp tục xóa người dùng ngay cả khi không thể xóa file ảnh
      }
    }
    
    // Xóa người dùng từ database
    await User.findByIdAndDelete(req.params.id);
    
    // Redirect về trang danh sách người dùng
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Lỗi khi xóa người dùng:', err);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi xóa người dùng',
      user: req.user
    });
  }
};

// Implement other controller methods for users...