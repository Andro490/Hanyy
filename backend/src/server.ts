import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import { securityRateLimiter } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import pricingRoutes from './routes/pricingRoutes';
import customizerRoutes from './routes/customizerRoutes';
import aiRoutes from './routes/aiRoutes';

const app: Application = express();

// ── Security Middleware (Non-Negotiable) ──
app.use(helmet());
app.use(cors({
  origin: ENV.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Increase server timeout for AI image generation (90s)
app.use((req, res, next) => {
  res.setTimeout(95_000);
  next();
});

// Rate limiting on sensitive routes
app.use('/api/auth', securityRateLimiter);

// ── Core Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/customizer', customizerRoutes);
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Global Error Handler (must be last) ──
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`🚀 Server running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
});

export default app;
