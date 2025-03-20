const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Đảm bảo mỗi người dùng chỉ có thể đánh giá mỗi sách một lần
RatingSchema.index({ book: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema); 