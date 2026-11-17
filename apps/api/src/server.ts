import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Security & Parsing Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [FRONTEND_URL, 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'dollarpath-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Initial API endpoints (Ready for Prisma connection)
app.get('/api/portfolio/summary', (req: Request, res: Response) => {
  res.json({
    message: 'DollarPath API Summary Endpoint - Ready for Database Connection',
    currency: 'USD',
  });
});

// Centralized Error Handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Error]:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Ocorreu um erro interno.' : err.message,
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`DollarPath API running on http://localhost:${PORT}`);
  });
}

export default app;
