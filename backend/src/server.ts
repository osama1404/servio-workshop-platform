import express from 'express';
import { apiRouter } from './routes/api';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Enable CORS headers for React Admin Dashboard
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use('/api/v1', apiRouter);

export const server = app.listen(PORT, () => {
  console.log(`🚗 Servio Workshop Engine running on port ${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/v1/health`);
  console.log(`🔧 Bay Status: http://localhost:${PORT}/api/v1/workshops/ws-alquoz-01/bays`);
});

export default app;
