const router = require('express').Router();
const auth = require('../middleware/auth');
const TodoModel = require('../models/todoModel');

router.post('/new', auth, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ error: "title is missing .." });
    }

    const newTodo = new TodoModel({
      title,
      userId: req.user
    });

    const saveTodo = await newTodo.save();

    res.json(saveTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const todos = await TodoModel.find({ userId: req.user });
    
    if (!todos) {
      res.status(400).json({ error: "bad request .." });
    }
    
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const currentTodo = await TodoModel.findOne({ userId: req.user, _id: req.params.id });

    if (!currentTodo) {
      res.status(404).json({ error: "user does not have any todo tasks yet" });
    }
    
    const deletedTodo = await TodoModel.findByIdAndDelete(req.params.id);
    
    res.json(deletedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
