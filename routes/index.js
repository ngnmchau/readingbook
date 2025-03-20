const express = require('express');
const router = express.Router();
const { getBooks } = require('../controllers/bookController');
const { getLibrary, getBooksByCategory } = require('../controllers/libraryController');
const { protect, loadUser } = require('../middleware/auth');
const Book = require('../models/Book');
const Category = require('../models/Category');
const Chapter = require('../models/Chapter');
const bookController = require('../controllers/bookController');
const User = require('../models/User');

// Áp dụng middleware loadUser cho tất cả các route
router.use(loadUser);

// Trang chủ
router.get('/', async (req, res) => {
  try {
    // Lấy sách nổi bật (có rating cao)
    const featuredBooks = await Book.find()
      .sort({ rating: -1 })
      .limit(4);
    
    // Lấy sách mới nhất
    const newBooks = await Book.find()
      .sort({ publishDate: -1 })
      .limit(6);
    
    // Lấy danh sách thể loại
    const categories = await Category.find().limit(6);
    
    // Map dữ liệu thể loại để phù hợp với format hiển thị
    const mappedCategories = categories.map(category => {
      return {
        name: category.name,
        icon: getCategoryIcon(category.name),
        count: 0 // Sẽ được cập nhật ở bước tiếp theo
      };
    });
    
    // Đếm số sách trong mỗi thể loại
    for (let i = 0; i < mappedCategories.length; i++) {
      const count = await Book.countDocuments({ 
        categories: mappedCategories[i].name 
      });
      mappedCategories[i].count = count;
    }

    res.render('index', { 
      title: 'Trang chủ',
      featuredBooks: featuredBooks,
      newBooks: newBooks,
      categories: mappedCategories
    });
  } catch (error) {
    console.error('Lỗi khi tải trang chủ:', error);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải trang chủ. Vui lòng thử lại sau.',
      user: req.user
    });
  }
});

// Hàm hỗ trợ để lấy icon cho mỗi thể loại
function getCategoryIcon(categoryName) {
  const iconMap = {
    'Tiểu thuyết': 'fa-book',
    'Văn học': 'fa-feather',
    'Kinh tế': 'fa-chart-line',
    'Tài chính': 'fa-dollar-sign',
    'Kỹ năng sống': 'fa-hands-helping',
    'Tâm lý': 'fa-brain',
    'Khoa học': 'fa-flask',
    'Lịch sử': 'fa-history',
    'Kỹ năng': 'fa-tools',
    'Thiếu nhi': 'fa-child'
  };
  
  return iconMap[categoryName] || 'fa-book';
}

// Trang thư viện
router.get('/library', async (req, res) => {
  try {
    // Lấy tham số truy vấn
    const { category, search, sort = 'newest', page = 1, rating } = req.query;
    const limit = 12; // Số sách trên mỗi trang
    
    // Xây dựng truy vấn
    let query = {};
    
    // Lọc theo thể loại
    if (category) {
      query.categories = category;
    }
    
    // Tìm kiếm theo tiêu đề hoặc tác giả
    if (search) {
      // Tách từ khóa tìm kiếm thành các từ riêng biệt
      const keywords = search.split(/\s+/).filter(word => word.length > 0);
      
      // Tạo mảng điều kiện tìm kiếm cho từng từ khóa
      const searchConditions = [];
      
      // Thêm điều kiện tìm kiếm cho từng từ khóa
      keywords.forEach(keyword => {
        searchConditions.push(
          { title: { $regex: keyword, $options: 'i' } },
          { author: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        );
      });
      
      // Tìm kiếm sách chứa bất kỳ từ khóa nào
      query.$or = searchConditions;
    }
    
    // Lọc theo đánh giá
    if (rating) {
      query.rating = { $gte: parseInt(rating) };
    }
    
    // Tính pagination
    const skip = (page - 1) * limit;
    
    // Xác định cách sắp xếp
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { publishDate: -1 };
        break;
      case 'popular':
        sortOption = { views: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
      default:
        sortOption = { publishDate: -1 };
    }
    
    // Thực hiện truy vấn
    let books = await Book.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    
    // Đếm tổng số kết quả để làm pagination
    const total = await Book.countDocuments(query);
    const pages = Math.ceil(total / limit);
    
    // Lấy danh sách thể loại để hiển thị bộ lọc
    const categories = await Category.find();
    
    // Thêm icon cho mỗi thể loại
    const categoriesWithIcons = categories.map(category => {
      const categoryObj = category.toObject();
      categoryObj.icon = getCategoryIcon(category.name);
      return categoryObj;
    });
    
    // Đếm số sách trong mỗi thể loại
    for (let i = 0; i < categoriesWithIcons.length; i++) {
      const count = await Book.countDocuments({ categories: categoriesWithIcons[i].name });
      categoriesWithIcons[i].count = count;
    }
    
    // Lấy sách phổ biến (cho carousel thứ hai)
    let popularBooks = [];
    if (books.length > 0) {
      popularBooks = await Book.find()
        .sort({ views: -1 })
        .limit(4);
    }
    
    // Kiểm tra sách yêu thích nếu đã đăng nhập
    if (req.user) {
      const user = await User.findById(req.user._id);
      const favorites = user.favorites.map(id => id.toString());
      
      // Đánh dấu sách đã yêu thích
      books = books.map(book => {
        const bookObj = book.toObject();
        bookObj.isFavorite = favorites.includes(book._id.toString());
        return bookObj;
      });
      
      // Làm tương tự cho sách phổ biến
      popularBooks = popularBooks.map(book => {
        const bookObj = book.toObject();
        bookObj.isFavorite = favorites.includes(book._id.toString());
        return bookObj;
      });
    }
    
    // Lấy thông tin chương đầu tiên cho mỗi sách
    for (let i = 0; i < books.length; i++) {
      const chapters = await Chapter.find({ bookId: books[i]._id })
        .sort({ order: 1 })
        .limit(1);
      
      books[i].hasChapters = chapters.length > 0;
      books[i].firstChapterId = chapters.length > 0 ? chapters[0]._id : null;
    }
    
    // Xử lý tương tự cho sách phổ biến
    for (let i = 0; i < popularBooks.length; i++) {
      const chapters = await Chapter.find({ bookId: popularBooks[i]._id })
        .sort({ order: 1 })
        .limit(1);
      
      popularBooks[i].hasChapters = chapters.length > 0;
      popularBooks[i].firstChapterId = chapters.length > 0 ? chapters[0]._id : null;
    }
    
    res.render('books', { 
      title: 'Thư viện sách',
      books,
      popularBooks,
      pagination: {
        pages,
        currentPage: parseInt(page),
        total
      },
      filters: {
        category,
        search,
        sort,
        rating
      },
      categories: categoriesWithIcons
    });
  } catch (error) {
    console.error('Lỗi khi tải trang thư viện:', error);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải trang thư viện. Vui lòng thử lại sau.',
      user: req.user
    });
  }
});

// Trang thể loại
router.get('/categories/:category', getBooksByCategory);
router.get('/categories', async (req, res) => {
  try {
    // Lấy tất cả thể loại
    const categories = await Category.find();
    
    // Đếm số sách trong mỗi thể loại
    const categoryData = await Promise.all(
      categories.map(async (category) => {
        const count = await Book.countDocuments({ categories: category.name });
        return {
          ...category.toObject(),
          count,
          icon: getCategoryIcon(category.name)
        };
      })
    );
    
    res.render('categories', {
      title: 'Thể loại sách',
      categories: categoryData
    });
  } catch (error) {
    console.error('Lỗi khi tải trang thể loại:', error);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải trang thể loại. Vui lòng thử lại sau.',
      user: req.user
    });
  }
});

// Trang chi tiết sách
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).render('error', {
        title: 'Không tìm thấy',
        message: 'Sách không tồn tại hoặc đã bị xóa.',
        user: req.user
      });
    }
    
    // Tăng lượt xem
    book.views += 1;
    await book.save();
    
    // Lấy danh sách chương của sách
    const chapters = await Chapter.find({ bookId: req.params.id }).sort({ order: 1 });
    
    // Lấy sách liên quan (cùng thể loại)
    const relatedBooks = await Book.find({
      _id: { $ne: req.params.id },
      categories: { $in: book.categories }
    }).limit(4);
    
    res.render('book-detail', { 
      title: book.title,
      book,
      chapters,
      relatedBooks,
      user: req.user
    });
  } catch (error) {
    console.error('Lỗi khi tải trang chi tiết sách:', error);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải trang chi tiết sách. Vui lòng thử lại sau.',
      user: req.user
    });
  }
});

// Thêm đánh giá cho sách
router.post('/books/:id/review', protect, bookController.addBookReview);

// API thêm sách vào mục yêu thích
router.post('/api/books/:id/favorites', protect, bookController.addToFavorites);

// API xóa sách khỏi mục yêu thích
router.delete('/api/books/:id/favorites', protect, bookController.removeFromFavorites);

// Trang đọc sách
router.get('/reader/:chapterId', async (req, res) => {
  try {
    // Kiểm tra xem chương có tồn tại không
    const chapter = await Chapter.findById(req.params.chapterId);
    if (!chapter) {
      return res.status(404).render('error', {
        title: 'Không tìm thấy chương',
        message: 'Không tìm thấy chương sách bạn đang tìm kiếm.',
        user: req.user
      });
    }

    // Cập nhật lịch sử đọc nếu người dùng đã đăng nhập
    if (req.user) {
      // Xóa lịch sử đọc cũ của sách này (nếu có)
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { readingHistory: { book: chapter.bookId } }
      });
      
      // Thêm lịch sử đọc mới
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          readingHistory: {
            $each: [{ book: chapter.bookId, chapter: chapter._id, lastRead: new Date() }],
            $position: 0, // Thêm vào đầu mảng
            $slice: 20 // Giữ 20 mục gần nhất
          }
        }
      });
    }

    res.render('reader', {
      title: 'Đọc sách',
      chapterId: req.params.chapterId,
      user: req.user
    });
  } catch (error) {
    console.error('Lỗi khi tải trang đọc sách:', error);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải trang đọc sách. Vui lòng thử lại sau.',
      user: req.user
    });
  }
});

// Trang hồ sơ (yêu cầu đăng nhập)
router.get('/profile', protect, (req, res) => {
  res.render('profile', {
    title: 'Hồ sơ của tôi'
  });
});

// Trang sách yêu thích (yêu cầu đăng nhập)
router.get('/favorites', protect, async (req, res) => {
  try {
    // Lấy thông tin người dùng với danh sách sách yêu thích
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).render('error', {
        title: 'Không tìm thấy',
        message: 'Không tìm thấy thông tin người dùng',
        user: req.user
      });
    }
    
    // Lấy thông tin chi tiết của các sách yêu thích
    let favorites = [];
    
    if (user.favorites && user.favorites.length > 0) {
      // Lấy thông tin chi tiết các sách từ danh sách ID
      favorites = await Book.find({
        _id: { $in: user.favorites }
      }).sort({ title: 1 });
      
      // Lấy thông tin chương đầu tiên của mỗi sách
      for (let i = 0; i < favorites.length; i++) {
        const chapters = await Chapter.find({ book: favorites[i]._id })
          .sort({ order: 1 })
          .limit(1);
        
        favorites[i] = favorites[i].toObject();
        favorites[i].chapters = chapters;
      }
    }
    
    res.render('favorites', {
      title: 'Sách yêu thích',
      favorites: favorites
    });
  } catch (error) {
    console.error('Lỗi khi tải trang sách yêu thích:', error);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải danh sách sách yêu thích. Vui lòng thử lại sau.',
      user: req.user
    });
  }
});

// Trang lịch sử đọc (yêu cầu đăng nhập)
router.get('/reading-history', protect, async (req, res) => {
  try {
    // Lấy thông tin người dùng và populate lịch sử đọc
    const user = await User.findById(req.user._id)
      .populate({
        path: 'readingHistory.book',
        select: 'title author cover'
      })
      .populate({
        path: 'readingHistory.chapter',
        select: 'title order'
      });
    
    res.render('reading-history', {
      title: 'Lịch sử đọc',
      user: user
    });
  } catch (error) {
    console.error('Lỗi khi tải trang lịch sử đọc:', error);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tải trang lịch sử đọc. Vui lòng thử lại sau.'
    });
  }
});

module.exports = router; 