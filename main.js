const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const initializeSocket = require('./routes/socket'); // 👈 socket module
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');

dotenv.config();

const app = express();
const server = http.createServer(app); 

const env = process.env.NODE_ENV || 'development';
let allowedOrigins = null;

if (env == 'development'){
    allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ]
} else {
    allowedOrigins = env;
}

app.use(cors({
  origin: allowedOrigins
}));
app.use(express.json());

// Register routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', messageRoutes);

// DB connection
sequelize.authenticate()
  .then(() => logger.info('✅ Database connected'))
  .catch(err => logger.error('❌ DB connection error:', err));

// Initialize socket
initializeSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
