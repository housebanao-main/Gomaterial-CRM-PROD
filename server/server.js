require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3002;

console.log(PORT);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://ec2-16-171-2-222.eu-north-1.compute.amazonaws.com'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Add PATCH here
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Debugging CORS
app.use((req, res, next) => {
  console.log('Incoming request origin:', req.headers.origin);
  next();
});

// Routes
app.use('/api/boq', require('./routes/boqRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // Ensure this line exists
app.use('/api/leads', require('./routes/leadRoutes')); // Include the lead routes
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/partners', require('./routes/partnerRoutes'));
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/transports', require('./routes/transportRoutes'));
app.use(require('./routes/userAuth')); // Add this line to include the user authentication route

// Serve static files from the React app in the client/build directory
app.use(express.static(path.join(__dirname, 'client', 'build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
