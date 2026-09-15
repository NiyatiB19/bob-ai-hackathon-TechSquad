const app = require('./app');
const dotenv = require('dotenv');
const { connectDatabase } = require('./config/db');

dotenv.config();

const DEFAULT_PORT = 5000;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;
const PORT_CANDIDATES = Number.isInteger(PORT) && PORT > 0 ? [PORT] : [DEFAULT_PORT];

if (!process.env.PORT) {
  PORT_CANDIDATES.push(5001, 5002, 5003, 5004);
}

async function startServer(port, candidateIndex = 0) {
  try {
    await connectDatabase();
    console.log('[Server Startup] Connected to MongoDB database successfully.');
  } catch (err) {
    console.warn(`[Server Startup Warning] MongoDB connection attempt returned: ${err.message}`);
  }

  const server = app.listen(port, () => {
    console.log(`SupplyGuard AI backend running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && candidateIndex < PORT_CANDIDATES.length - 1) {
      const nextPort = PORT_CANDIDATES[candidateIndex + 1];
      console.warn(`Port ${port} is busy. Retrying on port ${nextPort}...`);
      startServer(nextPort, candidateIndex + 1);
      return;
    }

    console.error(`Unable to start server on port ${port}: ${error.message}`);
    process.exit(1);
  });
}

startServer(PORT_CANDIDATES[0], 0);
