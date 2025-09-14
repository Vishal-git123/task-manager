const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    if (!title) return res.status(400).json({ msg: 'Please provide title' });

    const task = new Task({
      title, description, status, priority, dueDate: dueDate || null,
      tags: tags || [], user: req.user.id
    });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get tasks with filtering & sorting
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, tag, sortBy } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (tag) filter.tags = tag;

    let query = Task.find(filter).populate('user', 'name email');

    if (sortBy === 'dueDate') query = query.sort({ dueDate: 1 });
    else if (sortBy === 'priority') query = query.sort({ priority: 1 });
    else query = query.sort({ createdAt: -1 });

    const tasks = await query;
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    const { title, description, status, priority, dueDate, tags } = req.body;
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.tags = tags || task.tags;
    task.updatedAt = Date.now();
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    await task.remove();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
