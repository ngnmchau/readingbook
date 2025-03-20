const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên'],
    trim: true,
    maxlength: [50, 'Tên không được vượt quá 50 ký tự']
  },
  username: {
    type: String,
    unique: true,
    sparse: true // Cho phép nhiều giá trị null
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Vui lòng nhập email hợp lệ'
    ]
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    select: false
  },
  avatar: {
    type: String,
    default: '/uploads/users/default-avatar.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  favorites: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Book'
  }],
  readingHistory: [{
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Book'
    },
    chapter: {
      type: mongoose.Schema.ObjectId,
      ref: 'Chapter'
    },
    lastRead: {
      type: Date,
      default: Date.now
    }
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Mã hóa mật khẩu trước khi lưu
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Phương thức ký JWT
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Kiểm tra mật khẩu
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 