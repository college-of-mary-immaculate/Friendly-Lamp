// controllers/commentController.js
const db = require('../models/db');

exports.createComment = (req, res) => {
    const { postId, content } = req.body;
    const userId = req.userId;

    const query = 'INSERT INTO comments (post_id, content, created_by) VALUES (?, ?, ?)';
    db.execute(query, [postId, content, userId], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error creating comment' });
        res.status(201).send({ message: 'Comment created' });
    });
};

exports.getCommentDetails = (req, res) => {
    const { commentId } = req.params;

    db.execute('SELECT * FROM comments WHERE id = ?', [commentId], (err, comment) => {
        if (err) return res.status(500).send({ message: 'Error fetching comment details' });
        res.status(200).send(comment[0]);
    });
};

exports.deleteComment = (req, res) => {
    const { commentId } = req.params;
    const userId = req.userId;

    db.execute('DELETE FROM comments WHERE id = ? AND created_by = ?', [commentId, userId], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error deleting comment' });
        if (result.affectedRows === 0) return res.status(403).send({ message: 'Unauthorized' });
        res.status(200).send({ message: 'Comment deleted' });
    });
};