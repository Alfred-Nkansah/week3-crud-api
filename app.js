const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());


let todos = [
  {
    id: 1,
    task: 'Learn Node.js',
    completed: false
  },
  {
    id: 2,
    task: 'Build CRUD API',
    completed: false
  }
];


app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});


app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((todo) => !todo.completed);

  res.status(200).json(activeTodos);
});


app.get('/todos/completed', (req, res) => {
  const completedTodos = todos.filter((todo) => todo.completed);

  res.status(200).json(completedTodos);
});


app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({
      message: 'Todo not found'
    });
  }

  res.status(200).json(todo);
});


app.post('/todos', (req, res) => {
  const { task } = req.body;

  // Validation: task is required
  if (!task || task.trim() === '') {
    return res.status(400).json({
      error: 'The "task" field is required'
    });
  }

  // Generate a new ID
  const newId =
    todos.length > 0
      ? Math.max(...todos.map((todo) => todo.id)) + 1
      : 1;

  const newTodo = {
    id: newId,
    task: task,
    completed: req.body.completed || false
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});


app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({
      message: 'Todo not found'
    });
  }

  Object.assign(todo, req.body);

  res.status(200).json(todo);
});


app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const initialLength = todos.length;

  todos = todos.filter((todo) => todo.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({
      error: 'Todo not found'
    });
  }

  res.status(204).send();
});



app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: 'Server error!'
  });
});



const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});