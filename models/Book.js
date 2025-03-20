const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng thêm tiêu đề'],
    trim: true,
    maxlength: [100, 'Tiêu đề không được quá 100 ký tự']
  },
  author: {
    type: String,
    required: [true, 'Vui lòng thêm tác giả'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Vui lòng thêm mô tả'],
  },
  cover: {
    type: String,
    required: [true, 'Vui lòng thêm ảnh bìa']
  },
  categories: {
    type: [String],
    required: true,
    enum: [
      'Tiểu thuyết',
      'Văn học',
      'Kinh tế',
      'Tài chính',
      'Kỹ năng sống',
      'Tâm lý',
      'Khoa học',
      'Lịch sử',
      'Kỹ năng',
      'Thiếu nhi'
    ]
  },
  rating: {
    type: Number,
    min: [1, 'Đánh giá tối thiểu là 1'],
    max: [5, 'Đánh giá tối đa là 5'],
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['completed', 'ongoing', 'coming soon'],
    default: 'ongoing'
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  pages: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    required: true,
    default: 'Tiếng Việt'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', BookSchema); 