const Book = require('../../models/Book');
const Category = require('../../models/Category');
const fs = require('fs');
const path = require('path');

/**
 * Hiển thị danh sách sách với tìm kiếm và phân trang
 */
exports.index = async (req, res) => {
  try {
    // Xây dựng query cơ bản, không sử dụng bộ lọc nâng cao
    const query = {};
    
    // Fetch tất cả sách từ database
    const books = await Book.find(query).sort({ createdAt: -1 });
    
    // Lấy danh sách thể loại duy nhất từ tất cả sách
    const allCategories = [];
    books.forEach(book => {
      if (book.categories && book.categories.length > 0) {
        book.categories.forEach(category => {
          if (!allCategories.includes(category)) {
            allCategories.push(category);
          }
        });
      }
    });

    // Render trang với dữ liệu
    res.render('admin/books/index', {
      title: 'Quản lý sách',
      books,
      categories: allCategories,
      breadcrumbs: [
        { name: 'Dashboard', url: '/admin' },
        { name: 'Quản lý sách', url: '/admin/books', active: true }
      ]
    });
  } catch (error) {
    console.error('Lỗi khi tải trang quản lý sách:', error);
    res.status(500).render('error', {
      message: 'Đã xảy ra lỗi khi tải trang quản lý sách',
      error
    });
  }
};

exports.addForm = (req, res) => {
  try {
    res.render('admin/books/add', {
      title: 'Thêm sách mới',
      user: req.user
    });
  } catch (err) {
    console.error('Lỗi khi hiển thị form thêm sách:', err);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải trang thêm sách',
      user: req.user
    });
  }
};

exports.create = async (req, res) => {
  try {
    // Xử lý dữ liệu từ form
    const { title, author, description, pages, language, categories, publishDate } = req.body;
    
    // Tạo sách mới
    const newBook = new Book({
      title,
      author,
      description,
      pages: parseInt(pages) || 0,
      language,
      categories: categories ? categories.split(',').map(cat => cat.trim()) : [],
      publishDate: new Date(publishDate) || new Date(),
      cover: req.file ? `/uploads/${req.file.filename}` : '/images/default-book-cover.jpg',
      rating: 0,
      views: 0
    });
    
    await newBook.save();
    
    res.redirect('/admin/books');
  } catch (err) {
    console.error('Lỗi khi tạo sách mới:', err);
    res.status(500).render('admin/books/add', {
      title: 'Thêm sách mới',
      user: req.user,
      error: 'Đã xảy ra lỗi khi tạo sách mới',
      formData: req.body
    });
  }
};

exports.view = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).render('error', {
        title: 'Không Tìm Thấy',
        message: 'Không tìm thấy sách',
        user: req.user
      });
    }
    
    res.render('admin/books/view', {
      title: 'Chi tiết sách',
      user: req.user,
      book: book
    });
  } catch (err) {
    console.error('Lỗi khi xem chi tiết sách:', err);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải chi tiết sách',
      user: req.user
    });
  }
};

exports.editForm = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).render('error', {
        title: 'Không Tìm Thấy',
        message: 'Không tìm thấy sách',
        user: req.user
      });
    }
    
    res.render('admin/books/edit', {
      title: 'Chỉnh sửa sách',
      user: req.user,
      book: book
    });
  } catch (err) {
    console.error('Lỗi khi chỉnh sửa sách:', err);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải trang chỉnh sửa sách',
      user: req.user
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, author, description, pages, language, categories, publishDate, rating, views } = req.body;
    
    const updateData = {
      title,
      author,
      description,
      pages: parseInt(pages) || 0,
      language,
      categories: categories ? categories.split(',').map(cat => cat.trim()) : [],
      publishDate: new Date(publishDate) || new Date(),
      rating: parseFloat(rating) || 0,
      views: parseInt(views) || 0
    };
    
    // Nếu có file ảnh mới
    if (req.file) {
      updateData.cover = `/uploads/${req.file.filename}`;
    }
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedBook) {
      return res.status(404).render('error', {
        title: 'Không Tìm Thấy',
        message: 'Không tìm thấy sách',
        user: req.user
      });
    }
    
    res.redirect(`/admin/books/${updatedBook._id}/view`);
  } catch (err) {
    console.error('Lỗi khi cập nhật sách:', err);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi cập nhật sách',
      user: req.user
    });
  }
};

/**
 * Xóa sách khỏi hệ thống
 */
exports.delete = async (req, res) => {
  try {
    // Tìm sách trước khi xóa để lấy thông tin về file ảnh
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).render('error', {
        title: 'Không Tìm Thấy',
        message: 'Không tìm thấy sách',
        user: req.user
      });
    }
    
    // Xóa file ảnh nếu tồn tại và không phải ảnh mặc định
    if (book.cover && !book.cover.includes('default-book-cover.png')) {
      try {
        // Chuyển đổi đường dẫn URL thành đường dẫn file
        const coverPath = path.join(__dirname, '../../public', book.cover);
        
        // Kiểm tra file tồn tại trước khi xóa
        if (fs.existsSync(coverPath)) {
          fs.unlinkSync(coverPath);
          console.log(`Đã xóa file ảnh: ${coverPath}`);
        }
      } catch (fileErr) {
        console.error('Lỗi khi xóa file ảnh:', fileErr);
        // Vẫn tiếp tục xóa sách ngay cả khi không thể xóa file ảnh
      }
    }
    
    // Xóa sách từ database
    await Book.findByIdAndDelete(req.params.id);
    
    // Redirect về trang danh sách sách
    res.redirect('/admin/books');
  } catch (err) {
    console.error('Lỗi khi xóa sách:', err);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi xóa sách',
      user: req.user
    });
  }
};