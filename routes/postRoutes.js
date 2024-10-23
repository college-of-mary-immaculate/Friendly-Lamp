const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticateToken = require('../middleware/authenticate');

router.post('/create', authenticateToken, postController.createPost);
router.get('/:postId', postController.getPostDetails);
router.delete('/:postId', authenticateToken, postController.deletePost);

module.exports = router;

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticateToken = require('../middleware/authenticate');

router.post('/create', authenticateToken, commentController.createComment);
router.get('/:commentId', commentController.getCommentDetails);
router.delete('/:commentId', authenticateToken, commentController.deleteComment);

module.exports = router;
