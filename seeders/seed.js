const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Nạp các biến môi trường - sửa đường dẫn để phù hợp khi chạy từ thư mục seeders
dotenv.config({ path: path.join(__dirname, '../config/config.env') });

// In ra MONGO_URI để kiểm tra
console.log('MONGO_URI:', process.env.MONGO_URI);

// Nạp các models
const User = require('../models/User');
const Category = require('../models/Category');
const Book = require('../models/Book');
const Chapter = require('../models/Chapter');
const Blog = require('../models/Blog');
const Rating = require('../models/Rating');
const Notification = require('../models/Notification');

// Kết nối database
const connectDB = async () => {
  try {
    console.log('Đang kết nối đến MongoDB Atlas với URI:', process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB đã kết nối thành công!');
    console.log('Tên database:', conn.connection.db.databaseName);
    return conn;
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error.message);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Xóa dữ liệu hiện có - đã comment lại để không xóa dữ liệu cũ
    /*
    await User.deleteMany();
    await Category.deleteMany();
    await Book.deleteMany();
    await Chapter.deleteMany();
    await Blog.deleteMany();
    await Rating.deleteMany();
    await Notification.deleteMany();
    
    console.log('Đã xóa dữ liệu cũ');
    */
    
    console.log('Bắt đầu thêm dữ liệu mới (không xóa dữ liệu cũ)');
    
    // Seed Categories - kiểm tra trùng lặp trước khi thêm
    const categoryData = [
      {
        name: 'Tiểu thuyết',
        description: 'Các tác phẩm tiểu thuyết nổi tiếng',
        slug: 'tieu-thuyet'
      },
      {
        name: 'Văn học',
        description: 'Các tác phẩm văn học Việt Nam và thế giới',
        slug: 'van-hoc'
      },
      {
        name: 'Tâm lý',
        description: 'Sách về tâm lý học và phát triển bản thân',
        slug: 'tam-ly'
      },
      {
        name: 'Kinh tế',
        description: 'Sách về kinh tế và quản trị',
        slug: 'kinh-te'
      },
      {
        name: 'Khoa học',
        description: 'Sách về khoa học và công nghệ',
        slug: 'khoa-hoc'
      },
      {
        name: 'Kỹ năng sống',
        description: 'Sách phát triển kỹ năng sống',
        slug: 'ky-nang-song'
      }
    ];
    
    // Thêm từng category một, kiểm tra nếu đã tồn tại thì bỏ qua
    const categories = [];
    for (const cat of categoryData) {
      const existingCategory = await Category.findOne({ name: cat.name });
      if (!existingCategory) {
        const newCategory = await Category.create(cat);
        categories.push(newCategory);
        console.log(`Đã thêm thể loại: ${cat.name}`);
      } else {
        categories.push(existingCategory);
        console.log(`Thể loại ${cat.name} đã tồn tại, bỏ qua`);
      }
    }
    
    console.log('Hoàn tất thêm dữ liệu thể loại');
    
    // Seed User đầu tiên (admin)
    const passwordHash = '$2a$10$X4QSPaW1wuYjCnJcS6UMZeP3HYNrAEA.ZGxnbp0fvpxksMYEcgauO'; // "admin123"
    
    let admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        username: 'admin',
        email: 'admin@example.com',
        password: passwordHash,
        role: 'admin'
      });
      console.log('Đã thêm người dùng admin');
    } else {
      console.log('Người dùng admin đã tồn tại, bỏ qua');
    }
    
    // Seed user thường
    let user = await User.findOne({ username: 'user' });
    if (!user) {
      user = await User.create({
        name: 'Người dùng',
        username: 'user',
        email: 'user@example.com',
        password: passwordHash,
        role: 'user'
      });
      console.log('Đã thêm người dùng thường');
    } else {
      console.log('Người dùng thường đã tồn tại, bỏ qua');
    }
    
    console.log('Hoàn tất thêm dữ liệu người dùng');
    
    // Seed Books - kiểm tra trùng lặp trước khi thêm
    const bookData = [
      {
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        description: 'Đắc nhân tâm (How to Win Friends and Influence People) là một quyển sách nhằm tự giúp bản thân bán chạy nhất từ trước đến nay. Quyển sách này do Dale Carnegie viết và đã được xuất bản lần đầu vào năm 1936.',
        cover: '/uploads/books/dac-nhan-tam.jpg',
        categories: ['Tâm lý', 'Kỹ năng sống'],
        rating: 4.8,
        views: 1200,
        pages: 320,
        language: 'Tiếng Việt',
        publishDate: new Date('1936-10-01'),
        status: 'completed'
      },
      {
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        description: 'Tất cả những trải nghiệm trong chuyến phiêu du theo đuổi vận mệnh của mình đã giúp Santiago thấu hiểu được ý nghĩa sâu xa nhất của hạnh phúc, hòa hợp với vũ trụ và con người.',
        cover: '/uploads/books/nha-gia-kim.jpg',
        categories: ['Tiểu thuyết', 'Văn học'],
        rating: 4.7,
        views: 980,
        pages: 224,
        language: 'Tiếng Việt',
        publishDate: new Date('1988-01-01'),
        status: 'completed'
      },
      {
        title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        author: 'Rosie Nguyễn',
        description: 'Tuổi trẻ đáng giá bao nhiêu? được tác giả chia làm 3 phần: HỌC, LÀM, ĐI, đề cập một cách sâu sắc và toàn diện về nhiều vấn đề của người trẻ.',
        cover: '/uploads/books/tuoi-tre-dang-gia-bao-nhieu.jpg',
        categories: ['Kỹ năng sống', 'Tâm lý'],
        rating: 4.2,
        views: 750,
        pages: 285,
        language: 'Tiếng Việt',
        publishDate: new Date('2016-02-28'),
        status: 'completed'
      },
      {
        title: 'Tôi Tài Giỏi, Bạn Cũng Thế',
        author: 'Adam Khoo',
        description: 'Tôi Tài Giỏi, Bạn Cũng Thế là cuốn sách bán chạy nhất của Adam Khoo, được dịch ra nhiều thứ tiếng, giúp hàng triệu người trẻ trên thế giới tìm ra phương pháp học tập hiệu quả.',
        cover: '/uploads/books/toi-tai-gioi-ban-cung-the.jpg',
        categories: ['Kỹ năng sống', 'Tâm lý'],
        rating: 4.5,
        views: 850,
        pages: 285,
        language: 'Tiếng Việt',
        publishDate: new Date('2008-05-15'),
        status: 'completed'
      },
      {
        title: 'Người Giàu Có Nhất Thành Babylon',
        author: 'George S. Clason',
        description: 'Người giàu có nhất thành Babylon là một cuốn sách tài chính cá nhân kinh điển, truyền tải những bài học về cách tiết kiệm, tích lũy tài sản và đầu tư thông minh.',
        cover: '/uploads/books/nguoi-giau-co-nhat-thanh-babylon.jpg',
        categories: ['Kinh tế', 'Tài chính'],
        rating: 4.6,
        views: 920,
        pages: 188,
        language: 'Tiếng Việt',
        publishDate: new Date('1926-01-01'),
        status: 'completed'
      },
      {
        title: 'Nghĩ Giàu Làm Giàu',
        author: 'Napoleon Hill',
        description: 'Nghĩ giàu làm giàu là cuốn sách kinh điển về thành công cá nhân, tập trung vào 13 nguyên lý tư duy giúp đạt được thành công và sự giàu có.',
        cover: '/uploads/books/nghi-giau-lam-giau.jpg',
        categories: ['Kinh tế', 'Kỹ năng sống'],
        rating: 4.4,
        views: 1050,
        pages: 320,
        language: 'Tiếng Việt',
        publishDate: new Date('1937-03-01'),
        status: 'completed'
      },
      {
        title: 'Dám Nghĩ Lớn',
        author: 'David J. Schwartz',
        description: 'Dám Nghĩ Lớn là cuốn sách giúp bạn khai phá tiềm năng của bản thân, mang lại sự tự tin để đạt được những mục tiêu to lớn trong cuộc sống.',
        cover: '/uploads/books/dam-nghi-lon.jpg',
        categories: ['Kỹ năng sống', 'Tâm lý'],
        rating: 4.3,
        views: 780,
        pages: 276,
        language: 'Tiếng Việt',
        publishDate: new Date('1959-09-01'),
        status: 'completed'
      },
      {
        title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ',
        author: 'Nguyễn Nhật Ánh',
        description: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ là cuốn tiểu thuyết nhẹ nhàng về ký ức tuổi thơ, về tình bạn, tình yêu học trò trong sáng.',
        cover: '/uploads/books/cho-toi-xin-mot-ve-di-tuoi-tho.jpg',
        categories: ['Tiểu thuyết', 'Văn học'],
        rating: 4.5,
        views: 1100,
        pages: 208,
        language: 'Tiếng Việt',
        publishDate: new Date('2008-12-01'),
        status: 'completed'
      },
      {
        title: 'Mắt Biếc',
        author: 'Nguyễn Nhật Ánh',
        description: 'Mắt Biếc là câu chuyện tình yêu của Ngạn dành cho cô bạn thời thơ ấu Hà Lan, người con gái với đôi mắt biếc đẹp lạ lùng nhưng lại chỉ yêu Dũng.',
        cover: '/uploads/books/mat-biec.jpg',
        categories: ['Tiểu thuyết', 'Văn học'],
        rating: 4.6,
        views: 1250,
        pages: 252,
        language: 'Tiếng Việt',
        publishDate: new Date('1990-01-01'),
        status: 'completed'
      },
      {
        title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
        author: 'Nguyễn Nhật Ánh',
        description: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh là câu chuyện về tuổi thơ nghèo khó nhưng đầy ắp tình thương và kỷ niệm của hai anh em Thiều và Tường.',
        cover: '/uploads/books/toi-thay-hoa-vang-tren-co-xanh.jpg',
        categories: ['Tiểu thuyết', 'Văn học'],
        rating: 4.5,
        views: 1150,
        pages: 378,
        language: 'Tiếng Việt',
        publishDate: new Date('2010-12-01'),
        status: 'completed'
      },
      {
        title: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        description: 'Sapiens là cuốn sách về lịch sử loài người từ thời kỳ đồ đá đến hiện đại, khám phá cách con người đã tiến hóa và thống trị Trái Đất.',
        cover: '/uploads/books/sapiens.jpg',
        categories: ['Khoa học', 'Lịch sử'],
        rating: 4.8,
        views: 980,
        pages: 552,
        language: 'Tiếng Việt',
        publishDate: new Date('2011-01-01'),
        status: 'completed'
      },
      {
        title: 'Homo Deus: Lược Sử Tương Lai',
        author: 'Yuval Noah Harari',
        description: 'Homo Deus khám phá tương lai của nhân loại, khi con người có công nghệ đủ mạnh để thiết kế và tái tạo sự sống, bao gồm chính mình.',
        cover: '/uploads/books/homo-deus.jpg',
        categories: ['Khoa học', 'Tâm lý'],
        rating: 4.7,
        views: 850,
        pages: 484,
        language: 'Tiếng Việt',
        publishDate: new Date('2015-09-01'),
        status: 'completed'
      },
      {
        title: 'Hiệu Ứng Chim Mồi',
        author: 'Nguyễn Hữu Long',
        description: 'Hiệu Ứng Chim Mồi là cuốn sách về tâm lý học trong bán hàng và marketing, giúp bạn hiểu cách tác động đến quyết định mua hàng của khách.',
        cover: '/uploads/books/hieu-ung-chim-moi.jpg',
        categories: ['Kinh tế', 'Tâm lý'],
        rating: 4.2,
        views: 760,
        pages: 272,
        language: 'Tiếng Việt',
        publishDate: new Date('2018-05-20'),
        status: 'completed'
      },
      {
        title: 'Trí Tuệ Do Thái',
        author: 'Eran Katz',
        description: 'Trí Tuệ Do Thái khám phá những phương pháp phát triển tư duy, cải thiện trí nhớ và tăng cường khả năng học tập từ văn hóa Do Thái.',
        cover: '/uploads/books/tri-tue-do-thai.jpg',
        categories: ['Tâm lý', 'Kỹ năng sống'],
        rating: 4.3,
        views: 690,
        pages: 316,
        language: 'Tiếng Việt',
        publishDate: new Date('2010-01-01'),
        status: 'completed'
      },
      {
        title: 'Đời Ngắn Đừng Ngủ Dài',
        author: 'Robin Sharma',
        description: 'Đời Ngắn Đừng Ngủ Dài là tác phẩm truyền cảm hứng, động viên bạn sống hết mình với đam mê và không ngừng học hỏi, phát triển.',
        cover: '/uploads/books/doi-ngan-dung-ngu-dai.jpg',
        categories: ['Kỹ năng sống', 'Tâm lý'],
        rating: 4.1,
        views: 880,
        pages: 228,
        language: 'Tiếng Việt',
        publishDate: new Date('2012-03-01'),
        status: 'completed'
      },
      {
        title: 'Đừng Bao Giờ Đi Ăn Một Mình',
        author: 'Keith Ferrazzi',
        description: 'Đừng Bao Giờ Đi Ăn Một Mình là cuốn sách về cách xây dựng mối quan hệ trong kinh doanh và cuộc sống, tạo nên mạng lưới kết nối có giá trị.',
        cover: '/uploads/books/dung-bao-gio-di-an-mot-minh.jpg',
        categories: ['Kinh tế', 'Kỹ năng sống'],
        rating: 4.4,
        views: 730,
        pages: 376,
        language: 'Tiếng Việt',
        publishDate: new Date('2005-02-22'),
        status: 'completed'
      },
      {
        title: 'Tư Duy Nhanh Và Chậm',
        author: 'Daniel Kahneman',
        description: 'Tư Duy Nhanh Và Chậm là cuốn sách về tâm lý học nhận thức, khám phá hai hệ thống tư duy của não bộ và cách chúng ảnh hưởng đến quyết định của chúng ta.',
        cover: '/uploads/books/tu-duy-nhanh-va-cham.jpg',
        categories: ['Tâm lý', 'Khoa học'],
        rating: 4.6,
        views: 850,
        pages: 612,
        language: 'Tiếng Việt',
        publishDate: new Date('2011-10-25'),
        status: 'completed'
      },
      {
        title: 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ',
        author: 'Trác Nhã',
        description: 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ là cuốn sách bán chạy về nghệ thuật giao tiếp, giúp bạn cải thiện kỹ năng nói chuyện và thuyết phục người khác.',
        cover: '/uploads/books/kheo-an-noi-se-co-duoc-thien-ha.jpg',
        categories: ['Kỹ năng sống', 'Tâm lý'],
        rating: 4.3,
        views: 920,
        pages: 356,
        language: 'Tiếng Việt',
        publishDate: new Date('2014-06-01'),
        status: 'completed'
      },
      {
        title: 'Đọc Vị Bất Kỳ Ai',
        author: 'David J. Lieberman',
        description: 'Đọc Vị Bất Kỳ Ai trang bị cho bạn kỹ năng đọc hiểu tâm lý, hành vi của người khác thông qua ngôn ngữ cơ thể và các dấu hiệu phi ngôn ngữ.',
        cover: '/uploads/books/doc-vi-bat-ky-ai.jpg',
        categories: ['Tâm lý', 'Kỹ năng sống'],
        rating: 4.2,
        views: 1100,
        pages: 228,
        language: 'Tiếng Việt',
        publishDate: new Date('2010-08-15'),
        status: 'completed'
      },
      {
        title: 'Hai Số Phận',
        author: 'Jeffrey Archer',
        description: 'Hai Số Phận là tiểu thuyết về cuộc đời của hai người đàn ông sinh cùng ngày: một người giàu, một người nghèo và cách họ cạnh tranh, đối đầu trong suốt cuộc đời.',
        cover: '/uploads/books/hai-so-phan.jpg',
        categories: ['Tiểu thuyết', 'Văn học'],
        rating: 4.7,
        views: 1320,
        pages: 768,
        language: 'Tiếng Việt',
        publishDate: new Date('1979-05-01'),
        status: 'completed'
      }
    ];
    
    // Thêm từng sách một, kiểm tra nếu đã tồn tại thì bỏ qua
    const books = [];
    for (const book of bookData) {
      const existingBook = await Book.findOne({ title: book.title, author: book.author });
      if (!existingBook) {
        const newBook = await Book.create(book);
        books.push(newBook);
        console.log(`Đã thêm sách: ${book.title}`);
      } else {
        books.push(existingBook);
        console.log(`Sách ${book.title} đã tồn tại, bỏ qua`);
      }
    }
    
    console.log('Hoàn tất thêm dữ liệu sách');
    
    // Seed Chapters cho mỗi sách - kiểm tra trùng lặp
    for (const book of books) {
      // Kiểm tra xem sách đã có chương chưa
      const existingChapters = await Chapter.find({ bookId: book._id });
      if (existingChapters.length > 0) {
        console.log(`Sách ${book.title} đã có ${existingChapters.length} chương, bỏ qua`);
        continue;
      }
      
      // Tạo 3 chương cho mỗi sách chưa có chương
      await Chapter.create([
        {
          bookId: book._id,
          title: `Chương 1: Giới thiệu về ${book.title}`,
          order: 1,
          content: `Đây là nội dung chương 1 của sách ${book.title}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.`,
          views: Math.floor(Math.random() * 100) + 50
        },
        {
          bookId: book._id,
          title: `Chương 2: Phát triển ý tưởng`,
          order: 2,
          content: `Đây là nội dung chương 2 của sách ${book.title}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.`,
          views: Math.floor(Math.random() * 100) + 30
        },
        {
          bookId: book._id,
          title: `Chương 3: Kết luận`,
          order: 3,
          content: `Đây là nội dung chương 3 của sách ${book.title}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.`,
          views: Math.floor(Math.random() * 100) + 10
        }
      ]);
      console.log(`Đã thêm 3 chương cho sách: ${book.title}`);
    }
    
    console.log('Hoàn tất thêm dữ liệu chương sách');
    
    // Seed Blogs - kiểm tra trùng lặp
    const blogData = [
      {
        title: 'Top 10 sách hay nên đọc trong năm 2023',
        content: 'Đây là nội dung bài viết về top 10 sách hay nên đọc trong năm 2023...',
        author: admin._id,
        image: '/uploads/blogs/top-10-books.jpg',
        tags: ['Sách hay', 'Đề xuất', 'Reading Challenge'],
        views: 145,
        likes: 23
      },
      {
        title: 'Cách tạo thói quen đọc sách mỗi ngày',
        content: 'Đây là nội dung bài viết về cách tạo thói quen đọc sách mỗi ngày...',
        author: admin._id,
        image: '/uploads/blogs/reading-habit.jpg',
        tags: ['Kỹ năng đọc', 'Thói quen', 'Phát triển bản thân'],
        views: 98,
        likes: 15
      },
      {
        title: 'Những tác giả Việt Nam bạn nên biết',
        content: 'Bài viết giới thiệu về các tác giả Việt Nam nổi tiếng như Nguyễn Nhật Ánh, Nguyễn Ngọc Tư, Nguyễn Phong Việt và những tác phẩm tiêu biểu của họ. Đây là những cây bút có ảnh hưởng lớn đến văn học Việt Nam hiện đại.',
        author: admin._id,
        image: '/uploads/blogs/vietnamese-authors.jpg',
        tags: ['Tác giả Việt Nam', 'Văn học', 'Gợi ý đọc'],
        views: 75,
        likes: 18
      },
      {
        title: 'Lợi ích của việc đọc sách thường xuyên',
        content: 'Bài viết phân tích các lợi ích của việc đọc sách thường xuyên như cải thiện khả năng tập trung, tăng cường trí nhớ, giảm stress, mở rộng vốn từ vựng và kiến thức. Đọc sách còn giúp phát triển khả năng đồng cảm và hiểu biết về thế giới.',
        author: admin._id,
        image: '/uploads/blogs/reading-benefits.jpg',
        tags: ['Sức khỏe tinh thần', 'Lợi ích đọc sách', 'Phát triển bản thân'],
        views: 120,
        likes: 30
      }
    ];
    
    for (const blog of blogData) {
      const existingBlog = await Blog.findOne({ title: blog.title });
      if (!existingBlog) {
        await Blog.create(blog);
        console.log(`Đã thêm blog: ${blog.title}`);
      } else {
        console.log(`Blog ${blog.title} đã tồn tại, bỏ qua`);
      }
    }
    
    console.log('Hoàn tất thêm dữ liệu blog');
    
    // Seed Ratings - kiểm tra trùng lặp
    for (const book of books) {
      // Kiểm tra đánh giá của admin
      const existingAdminRating = await Rating.findOne({ book: book._id, user: admin._id });
      if (!existingAdminRating) {
        await Rating.create({
          book: book._id,
          user: admin._id,
          rating: Math.floor(Math.random() * 3) + 3, // Rating từ 3-5
          review: `Đánh giá của admin về sách ${book.title}. Đây là một cuốn sách hay.`
        });
        console.log(`Đã thêm đánh giá của admin cho sách: ${book.title}`);
      }
      
      // Kiểm tra đánh giá của user thường
      const existingUserRating = await Rating.findOne({ book: book._id, user: user._id });
      if (!existingUserRating && Math.random() > 0.3) { // 70% khả năng user đánh giá sách này
        await Rating.create({
          book: book._id,
          user: user._id,
          rating: Math.floor(Math.random() * 5) + 1, // Rating từ 1-5
          review: `Đánh giá của người dùng về sách ${book.title}.`
        });
        console.log(`Đã thêm đánh giá của người dùng cho sách: ${book.title}`);
      }
    }
    
    console.log('Hoàn tất thêm dữ liệu đánh giá');
    
    // Seed Notifications - kiểm tra trùng lặp
    const notificationData = [
      {
        user: admin._id,
        title: 'Chào mừng bạn đến với ReadingBook!',
        content: 'Cảm ơn bạn đã tham gia cộng đồng đọc sách của chúng tôi.',
        type: 'system',
        isRead: true
      },
      {
        user: admin._id,
        title: 'Sách mới đã được thêm vào',
        content: 'Nhiều sách mới đã được thêm vào thư viện. Hãy khám phá ngay!',
        type: 'book',
        isRead: false
      },
      {
        user: user._id,
        title: 'Chào mừng bạn đến với ReadingBook!',
        content: 'Cảm ơn bạn đã tham gia cộng đồng đọc sách của chúng tôi.',
        type: 'system',
        isRead: false
      }
    ];
    
    for (const notification of notificationData) {
      const existingNotification = await Notification.findOne({ 
        user: notification.user, 
        title: notification.title 
      });
      
      if (!existingNotification) {
        await Notification.create(notification);
        console.log(`Đã thêm thông báo: ${notification.title} cho người dùng ${notification.user}`);
      } else {
        console.log(`Thông báo ${notification.title} đã tồn tại, bỏ qua`);
      }
    }
    
    console.log('Hoàn tất thêm dữ liệu thông báo');
    
    console.log('Đã hoàn tất việc thêm dữ liệu!');
    process.exit();
    
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
};

// Kết nối DB và thực hiện seed
connectDB().then(() => {
  seedData();
});
