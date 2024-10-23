// controllers/postController.js
const db = require('../models/db');

exports.createPost = (req, res) => {
    const { threadId, content } = req.body;
    const userId = req.userId;

    const query = 'INSERT INTO posts (thread_id, content, created_by) VALUES (?, ?, ?)';
    db.execute(query, [threadId, content, userId], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error creating post' });
        res.status(201).send({ message: 'Post created' });
    });
};

exports.getPostDetails = (req, res) => {
    const { postId } = req.params;

    db.execute('SELECT * FROM posts WHERE id = ?', [postId], (err, post) => {
        if (err) return res.status(500).send({ message: 'Error fetching post details' });
        res.status(200).send(post[0]);
    });
};

exports.deletePost = (req, res) => {
    const { postId } = req.params;
    const userId = req.userId;

    db.execute('DELETE FROM posts WHERE id = ? AND created_by = ?', [postId, userId], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error deleting post' });
        if (result.affectedRows === 0) return res.status(403).send({ message: 'Unauthorized' });
        res.status(200).send({ message: 'Post deleted' });
    });
};