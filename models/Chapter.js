const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng thêm tiêu đề chương'],
    trim: true,
    maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
  },
  content: {
    type: String,
    required: [true, 'Vui lòng thêm nội dung chương']
  },
  bookId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: true,
    validate: {
      validator: mongoose.Types.ObjectId.isValid,
      message: 'ID sách không hợp lệ'
    }
  },
  order: {
    type: Number,
    required: [true, 'Vui lòng thêm số thứ tự chương'],
    min: [1, 'Số thứ tự chương phải lớn hơn hoặc bằng 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Số thứ tự chương phải là số nguyên'
    }
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Đảm bảo mỗi chương trong một cuốn sách có thứ tự duy nhất
ChapterSchema.index({ bookId: 1, order: 1 }, { unique: true });

// ✅ Middleware: Tự động tăng views khi có người đọc
ChapterSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.views += 1;
  }
  next();
});

// ✅ Hàm tiện ích: Tăng views khi đọc
ChapterSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

module.exports = mongoose.model('Chapter', ChapterSchema);
