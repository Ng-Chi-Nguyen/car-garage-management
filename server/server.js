const app = require('./src/app');
const { PORT, NODE_ENV } = require('./src/config/env');

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Garage Management API Server         ║
╠════════════════════════════════════════╣
║ Environment: ${NODE_ENV.padEnd(28)} ║
║ Port: ${PORT.toString().padEnd(33)} ║
║ Status: Running ✓                      ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
