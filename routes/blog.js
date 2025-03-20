const express = require('express');
const BlogPost = require('../models/Blog'); // Import model
const router = express.Router();

// Lấy danh sách bài viết
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.render('blog', { posts });
  } catch (err) {
    res.status(500).send("Lỗi khi tải bài viết");
  }
});

// Route tìm kiếm bài viết
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    let posts = [];
    
    if (query) {
      // Tách từ khóa tìm kiếm thành các từ riêng biệt
      const keywords = query.split(/\s+/).filter(word => word.length > 0);
      
      // Tạo mảng điều kiện tìm kiếm cho từng từ khóa
      const searchConditions = [];
      
      // Thêm điều kiện tìm kiếm cho từng từ khóa
      keywords.forEach(keyword => {
        searchConditions.push(
          { title: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } }
        );
      });
      
      // Tìm kiếm bài viết chứa bất kỳ từ khóa nào
      posts = await BlogPost.find({
        $or: searchConditions
      }).sort({ createdAt: -1 });
    }
    
    res.render('blog', { 
      posts, 
      searchQuery: query,
      isSearchResult: true 
    });
  } catch (err) {
    console.error('Lỗi khi tìm kiếm bài viết:', err);
    res.status(500).render('error', {
      title: 'Lỗi Hệ Thống',
      message: 'Đã xảy ra lỗi khi tìm kiếm bài viết. Vui lòng thử lại sau.',
      user: req.user
    });
  }
});

// Lấy bài viết theo ID
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).render('404', { message: "Bài viết không tồn tại!" });

    res.render('blog_post', { post });
  } catch (err) {
    res.status(500).send("Lỗi khi tải bài viết");
  }
});

// API Like bài viết
router.post('/:id/like', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Bài viết không tồn tại" });

    post.likes++;
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi like bài viết" });
  }
});

// API Bình luận bài viết
router.post('/:id/comment', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Bài viết không tồn tại" });

    post.comments.push({ author: req.body.author, text: req.body.text });
    await post.save();
    res.json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi bình luận bài viết" });
  }
});

module.exports = router;
