import app from './app';
import { config } from './config';
import { pool } from './config/database';

const start = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    app.listen(config.port, () => {
      console.log(`🚀 AVADH Jewellery API running on port ${config.port}`);
      console.log(`📍 Environment: ${config.env}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();
