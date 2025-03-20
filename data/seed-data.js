const mongoose = require('mongoose');
const Book = require('../models/Book');
const Chapter = require('../models/Chapter');
const Category = require('../models/Category');
const sampleChapters = require('./sample-chapters');
const sampleChapters2 = require('./sample-chapters-2');

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://tdanh:123@readingbookweb.noj8w.mongodb.net/readingbooks')
  .then(async () => {
    try {
      console.log('Kết nối MongoDB thành công');
      
      // Lấy sách từ database
      const books = await Book.find().select('_id title');
      console.log(`Tìm thấy ${books.length} cuốn sách trong database`);
      
      // Tạo map tên sách và ID
      const bookIds = {};
      books.forEach(book => {
        bookIds[book.title] = book._id;
      });
      
      // In ra các tên sách có trong database để kiểm tra
      console.log('Danh sách tên sách trong database:');
      Object.keys(bookIds).forEach(title => {
        console.log(`- ${title}`);
      });
      
      // Danh sách các tên sách cần thêm chương từ dữ liệu cũ
      const targetBookTitles = [
        'Đắc Nhân Tâm',
        'Nhà Giả Kim',
        'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        'Tôi Tài Giỏi, Bạn Cũng Thế'
      ];
      
      // Danh sách các tên sách cần thêm chương từ dữ liệu mới
      const targetBookTitles2 = [
        'Người Giàu Có Nhất Thành Babylon',
        'Mắt Biếc',
        'Đời Ngắn Đừng Ngủ Dài',
        'Tư Duy Nhanh Và Chậm'
      ];
      
      // Xóa các chương hiện có của các sách cần thêm chương mới
      const allTargetBooks = [...targetBookTitles, ...targetBookTitles2];
      for (const title of allTargetBooks) {
        if (bookIds[title]) {
          await Chapter.deleteMany({ bookId: bookIds[title] });
          console.log(`Đã xóa các chương cũ của sách: ${title}`);
        } else {
          console.log(`Không tìm thấy sách với tên: ${title}`);
        }
      }
      
      // Thêm chương mẫu từ dữ liệu cũ
      console.log('Đang thêm chương mẫu từ dữ liệu cũ...');
      
      // Gán bookId cho chương dựa vào tên chương
      const chaptersWithBookIds = sampleChapters.map(chapter => {
        // Lấy tiêu đề sách từ tên chương
        const bookTitle = chapter.title.split(' - ')[0].trim();
        if (bookIds[bookTitle]) {
          return {
            ...chapter,
            bookId: bookIds[bookTitle]
          };
        } else {
          console.log(`Không tìm thấy sách cho chương: ${chapter.title}`);
          return null;
        }
      }).filter(chapter => chapter !== null); // Lọc bỏ các chương không có bookId
      
      // Thêm từng chương vào cơ sở dữ liệu
      let addedCount = 0;
      for (const chapter of chaptersWithBookIds) {
        await Chapter.create(chapter);
        console.log(`Đã thêm chương: ${chapter.title}`);
        addedCount++;
      }
      
      console.log(`Đã thêm ${addedCount} chương mẫu từ dữ liệu cũ thành công!`);
      
      // Thêm chương mẫu từ dữ liệu mới (sample-chapters-2.js)
      console.log('Đang thêm chương mẫu từ dữ liệu mới...');
      
      // Gán bookId cho chương dựa vào tên chương
      const chaptersWithBookIds2 = sampleChapters2.map(chapter => {
        // Lấy tiêu đề sách từ tên chương
        const bookTitle = chapter.title.split(' - ')[0].trim();
        if (bookIds[bookTitle]) {
          return {
            ...chapter,
            bookId: bookIds[bookTitle]
          };
        } else {
          console.log(`Không tìm thấy sách cho chương: ${chapter.title}`);
          return null;
        }
      }).filter(chapter => chapter !== null); // Lọc bỏ các chương không có bookId
      
      // Thêm từng chương vào cơ sở dữ liệu
      let addedCount2 = 0;
      for (const chapter of chaptersWithBookIds2) {
        await Chapter.create(chapter);
        console.log(`Đã thêm chương: ${chapter.title}`);
        addedCount2++;
      }
      
      console.log(`Đã thêm ${addedCount2} chương mẫu từ dữ liệu mới thành công!`);
      console.log(`Tổng cộng đã thêm ${addedCount + addedCount2} chương!`);
      
    } catch (err) {
      console.error('Lỗi khi thêm dữ liệu mẫu:', err.message);
    } finally {
      mongoose.disconnect();
      console.log('Đã ngắt kết nối MongoDB');
    }
  })
  .catch(err => {
    console.error('Lỗi kết nối MongoDB:', err.message);
  });
