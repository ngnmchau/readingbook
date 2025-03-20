// Controller để render view blog và truyền dữ liệu bài viết
const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();

// Route để render trang blog
router.get('/blog', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name');  // Lấy tất cả bài viết
    res.render('blog', { blogs: blogs });  // Truyền dữ liệu vào view EJS
  } catch (error) {
    res.status(500).send('Lỗi khi lấy bài viết');
  }
});

module.exports = router;
