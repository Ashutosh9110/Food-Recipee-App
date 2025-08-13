// const express = require('express');
// const cors = require('cors');
// const connectDb = require('../config/connectionDb');
// const userRoutes = require('../routes/user');
// const recipeRoutes = require('../routes/recipe');
// const { userLogin, userSignUp } = require('../controller/user');

// // Initialize express
// const app = express();

// // Connect to database
// connectDb();

// // CORS configuration with specific origins
// const corsOptions = {
//   origin: [
//     'https://culinary-inspirations.netlify.app',
//     'http://localhost:3000',
//     'http://localhost:5173',
//     'http://localhost:5174'
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 204
// };

// // Middleware
// app.use(express.json());
// app.use(cors(corsOptions));
// app.use(express.static("../public"));

// // Log all requests for debugging
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   console.log('Request Body:', req.body);
//   next();
// });

// // Handle OPTIONS preflight requests
// app.options('*', cors(corsOptions));

// // Root route
// app.get('/', (req, res) => {
//   res.json({ message: 'Food Recipe API is running!' });
// });

// // API test route
// app.get('/api-test', (req, res) => {
//   res.json({ 
//     endpoints: {
//       users: '/signUp, /login, /user/:id',
//       recipes: '/recipe/, /recipe/:id'
//     },
//     status: 'online'
//   });
// });

// // Authentication routes - direct mapping without prefix
// app.post('/signUp', userSignUp);
// app.post('/login', userLogin);

// // Other routes with their respective routers
// app.use("/", userRoutes);
// app.use("/recipe", recipeRoutes);

// // Error handler middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({
//     error: 'Something went wrong on the server',
//     message: err.message
//   });
// });

// // 404 handler for undefined routes
// app.use((req, res) => {
//   res.status(404).json({
//     error: 'Not Found',
//     message: `The requested endpoint ${req.method} ${req.url} does not exist`
//   });
// });

// // Export as serverless function
// module.exports = app; 