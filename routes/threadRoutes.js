const express = require('express');
const router = express.Router();
const db = require('./db');

const authenticate = (req, res, next) => {
    next();
};

router.post('/threads', authenticate, async (req, res) => {
    const { userId, title, content } = req.body;

    try {
        const result = await db.query('INSERT INTO threads (user_id, title, content) VALUES (?, ?, ?)', [userId, title, content]);
        res.status(201).json({ message: 'Thread created', threadId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create thread' });
    }
});

router.get('/threads', async (req, res) => {
    try {
        const threads = await db.query('SELECT * FROM threads ORDER BY created_at DESC');
        res.status(200).json(threads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve threads' });
    }
});

router.get('/threads/:threadId', async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await db.query('SELECT * FROM threads WHERE id = ?', [threadId]);
        if (thread.length > 0) {
            res.status(200).json(thread[0]);
        } else {
            res.status(404).json({ message: 'Thread not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve thread details' });
    }
});

router.patch('/threads/:threadId', authenticate, async (req, res) => {
    const { threadId } = req.params;
    const { title, content } = req.body;

    try {
        const result = await db.query('UPDATE threads SET title = ?, content = ? WHERE id = ?', [title, content, threadId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Thread updated' });
        } else {
            res.status(404).json({ message: 'Thread not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update thread' });
    }
});

router.delete('/threads/:threadId', authenticate, async (req, res) => {
    const { threadId } = req.params;

    try {
        const result = await db.query('DELETE FROM threads WHERE id = ?', [threadId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Thread deleted' });
        } else {
            res.status(404).json({ message: 'Thread not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete thread' });
    }
});

module.exports = router;
