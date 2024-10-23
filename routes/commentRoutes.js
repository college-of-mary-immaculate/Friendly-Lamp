const express = require('express');
const router = express.Router();
const db = require('./db');


const authenticate = (req, res, next) => {
    next();
};

router.post('/comments', authenticate, async (req, res) => {
    const { postId, userId, content } = req.body;

    try {
        const result = await db.query('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)', [postId, userId, content]);
        res.status(201).json({ message: 'Comment created', commentId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create comment' });
    }
});

router.get('/comments/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await db.query('SELECT * FROM comments WHERE post_id = ?', [postId]);
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve comments' });
    }
});

router.patch('/comments/:commentId', authenticate, async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        const result = await db.query('UPDATE comments SET content = ? WHERE id = ?', [content, commentId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Comment updated' });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update comment' });
    }
});

router.delete('/comments/:commentId', authenticate, async (req, res) => {
    const { commentId } = req.params;

    try {
        const result = await db.query('DELETE FROM comments WHERE id = ?', [commentId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Comment deleted' });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete comment' });
    }
});

router.post('/comments/:commentId/reactions', authenticate, async (req, res) => {
    const { commentId } = req.params;
    const { userId, reactionType } = req.body;

    try {
        const result = await db.query('INSERT INTO comment_reactions (comment_id, user_id, reaction_type) VALUES (?, ?, ?)', [commentId, userId, reactionType]);
        res.status(201).json({ message: 'Reaction added', reactionId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add reaction' });
    }
});

router.get('/comments/:commentId/reactions', async (req, res) => {
    const { commentId } = req.params;

    try {
        const reactions = await db.query('SELECT * FROM comment_reactions WHERE comment_id = ?', [commentId]);
        res.status(200).json(reactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve reactions' });
    }
});

module.exports = router;