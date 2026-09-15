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

function listenOnPort(portIndex) {
  if (portIndex >= PORT_CANDIDATES.length) {
    console.error(`[Server Error] Unable to start server: All candidate ports (${PORT_CANDIDATES.join(', ')}) are busy.`);
    process.exit(1);
  }

  const port = PORT_CANDIDATES[portIndex];
  const server = app.listen(port, () => {
    console.log(`SupplyGuard AI backend running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && portIndex < PORT_CANDIDATES.length - 1) {
      console.warn(`[Server Startup] Port ${port} is busy. Retrying on port ${PORT_CANDIDATES[portIndex + 1]}...`);
      listenOnPort(portIndex + 1);
    } else {
      console.error(`Unable to start server on port ${port}: ${error.message}`);
      process.exit(1);
    }
  });
}

async function startServer() {
  try {
    await connectDatabase();
    console.log('[Server Startup] Connected to MongoDB database successfully.');
  } catch (err) {
    console.warn(`[Server Startup Warning] MongoDB connection attempt returned: ${err.message}`);
  }
  listenOnPort(0);
}

startServer();
