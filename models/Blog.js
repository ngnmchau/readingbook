const mongoose = require('mongoose');

// Định nghĩa schema cho bài viết Blog
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,  // Tiêu đề bài viết bắt buộc
  },
  content: {
    type: String,
    required: true,  // Nội dung bài viết bắt buộc
  },
  image: {
    type: String,
    required: true,  // Đường dẫn ảnh của bài viết
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Tham chiếu đến mô hình User (Chắc chắn bạn đã có model này)
    required: true,  // Người viết bài viết
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Ngày tạo mặc định
  },
  updatedAt: {
    type: Date,  // Ngày sửa bài viết
    default: Date.now,
  }
});

// Mongoose middleware để cập nhật `updatedAt` mỗi khi bài viết được sửa
BlogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();  // Cập nhật `updatedAt` trước khi lưu bài viết
  next();
});

const Blog = mongoose.model('Blog', BlogSchema);  // Tạo model Blog

module.exports = Blog;  // Export Blog model
