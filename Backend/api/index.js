const express = require('express');
const cors = require('cors');
const connectDb = require('../config/connectionDb');
const userRoutes = require('../routes/user');
const recipeRoutes = require('../routes/recipe');

// Initialize express
const app = express();

// Connect to database
connectDb();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("../public"));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Food Recipe API is running!' });
});

// API test route
app.get('/api-test', (req, res) => {
  res.json({ 
    endpoints: {
      users: '/signUp, /login, /user/:id',
      recipes: '/recipe/, /recipe/:id'
    },
    status: 'online'
  });
});

// Mount routes
app.use("/", userRoutes);
app.use("/recipe", recipeRoutes);

// Export as serverless function
module.exports = app; 