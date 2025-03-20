const Book = require('../models/Book');

// @desc    Hiển thị trang thư viện với tất cả sách
// @route   GET /library
// @access  Public
exports.getLibrary = async (req, res, next) => {
  try {
    // Lấy tham số truy vấn
    const { category, search, sort, rating } = req.query;
    
    // Xây dựng truy vấn
    let query = {};
    
    // Lọc theo thể loại
    if (category) {
      query.categories = category;
    }
    
    // Lọc theo đánh giá
    if (rating) {
      query.rating = { $gte: parseInt(rating) };
    }
    
    // Tìm kiếm theo tiêu đề hoặc tác giả
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Thực hiện truy vấn
    let books = await Book.find(query);
    
    // Sắp xếp kết quả
    if (sort) {
      switch (sort) {
        case 'newest':
          books.sort((a, b) => b.publishDate - a.publishDate);
          break;
        case 'popular':
          books.sort((a, b) => b.views - a.views);
          break;
        case 'rating':
          books.sort((a, b) => b.rating - a.rating);
          break;
        case 'title':
          books.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }
    } else {
      // Mặc định sắp xếp theo ngày xuất bản mới nhất
      books.sort((a, b) => b.publishDate - a.publishDate);
    }
    
    // Phân trang (đơn giản)
    const page = parseInt(req.query.page) || 1;
    const limit = 12; // 12 sách mỗi trang
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = books.length;
    
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total
    };
    
    books = books.slice(startIndex, endIndex);
    
    // Kiểm tra sách yêu thích nếu đã đăng nhập
    if (req.user) {
      const user = await User.findById(req.user.id);
      const favorites = user.favorites.map(id => id.toString());
      
      books = books.map(book => {
        const bookObj = book.toObject();
        bookObj.isFavorite = favorites.includes(book._id.toString());
        return bookObj;
      });
    }
    
    res.render('library', {
      title: 'Thư viện sách',
      books,
      pagination,
      filters: {
        category,
        search,
        sort,
        rating
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      message: 'Đã xảy ra lỗi khi tải thư viện sách'
    });
  }
};

// @desc    Hiển thị sách theo thể loại
// @route   GET /categories/:category
// @access  Public
exports.getBooksByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;
    
    // Chuyển đổi slug thành tên thể loại thực tế
    const categoryMap = {
      'tieu-thuyet': 'Tiểu thuyết',
      'van-hoc': 'Văn học',
      'kinh-te': 'Kinh tế',
      'tai-chinh': 'Tài chính',
      'ky-nang-song': 'Kỹ năng sống',
      'tam-ly': 'Tâm lý',
      'khoa-hoc': 'Khoa học',
      'lich-su': 'Lịch sử',
      'ky-nang': 'Kỹ năng',
      'thieu-nhi': 'Thiếu nhi'
    };
    
    const categoryName = categoryMap[category];
    
    if (!categoryName) {
      return res.status(404).render('error', {
        message: 'Không tìm thấy thể loại'
      });
    }
    
    // Chuyển hướng đến trang thư viện với bộ lọc thể loại
    res.redirect(`/library?category=${encodeURIComponent(categoryName)}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      message: 'Đã xảy ra lỗi khi tải sách theo thể loại'
    });
  }
}; 