const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên thể loại'],
    unique: true,
    trim: true,
    maxlength: [50, 'Tên thể loại không được vượt quá 50 ký tự']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    maxlength: [500, 'Mô tả không được vượt quá 500 ký tự']
  },
  image: {
    type: String,
    default: '/images/default-category.png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tạo slug từ tên thể loại trước khi lưu
CategorySchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  
  // Tạo slug từ tên (chuyển thành chữ thường, thay thế khoảng trắng bằng dấu gạch ngang)
  this.slug = this.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
    
  next();
});

module.exports = mongoose.model('Category', CategorySchema); 