const express = require('express');
const {
  getBooks,
  getBook,
  getBookChapters,
  getChapter,
  addToFavorites,
  removeFromFavorites,
  addBookReview
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/').get(getBooks);
router.route('/:id').get(getBook);
router.route('/:id/chapters').get(getBookChapters);
router.route('/chapters/:chapterId').get(getChapter);

// Protected routes
router.route('/:id/favorites').post(protect, addToFavorites);
router.route('/:id/favorites').delete(protect, removeFromFavorites);
router.route('/:id/review').post(protect, addBookReview);

module.exports = router; 