import express from 'express'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const studentRoutes = require('./routes/studentRoutes');

// Get app instance from index.js
import('./index.js').then(module => {
  const app = module.app;

  //Mount routes
  app.use('/api/student',studentRoutes);

//welcom routes

app.get('/', (req,res) =>{
    res.json({
        success:true,
        message: 'welcome to sikshya sadan API',
        endpoints:{
            student:'/api/student'
        }
    });
});


// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});