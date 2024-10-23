const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signin', userController.signIn);
router.post('/signup', userController.signUp);

module.exports = router;

const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');

router.post('/create', authenticateToken, threadController.createThread);
router.get('/:threadId', threadController.getThreadDetails);

module.exports = router;
