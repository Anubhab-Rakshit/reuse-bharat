import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 5050,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/reuse_bharat',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'reuse-bharat-dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
