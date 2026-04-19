import app from './app.js';
import config from './config/index.js';
import connectDB from './src/config/database.js';
import seedDatabase from './src/utils/seed.js';

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${config.port} is already in use. Stop the existing process or set a different PORT.`);
      } else {
        console.error('Server failed to start:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
