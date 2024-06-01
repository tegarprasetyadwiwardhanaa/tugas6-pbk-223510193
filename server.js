// Import dependencies
const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware to allow CORS
app.use(cors({
  origin: 'https://tegar-223510193-tugas6.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Dummy data
const articles = [
  { id: 1, title: 'Article 1', content: 'Content of article 1' },
  { id: 2, title: 'Article 2', content: 'Content of article 2' },
];

// Routes
app.get('/articles', (req, res) => {
  res.json(articles);
});

app.post('/articles', (req, res) => {
  const newArticle = req.body;
  articles.push(newArticle);
  res.status(201).json(newArticle);
});

app.put('/articles/:id', (req, res) => {
  const articleId = parseInt(req.params.id);
  const updatedArticle = req.body;

  const index = articles.findIndex(article => article.id === articleId);
  if (index !== -1) {
    articles[index] = updatedArticle;
    res.json(updatedArticle);
  } else {
    res.status(404).send('Article not found');
  }
});

app.delete('/articles/:id', (req, res) => {
  const articleId = parseInt(req.params.id);

  const index = articles.findIndex(article => article.id === articleId);
  if (index !== -1) {
    articles.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Article not found');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
