import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { AuthController } from './controllers/authController';
import { authenticate } from './middleware/auth';
import { validate } from './middleware/validate';
import { loginSchema } from './validators/schemas';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import publicRoutes from './routes/public/index';
import adminRoutes from './routes/admin/index';

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: config.cors.origin, credentials: true }));

// Rate limiting for public inquiry API
const inquiryLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: 'Too many inquiries, please try again later' } });
app.use('/api/inquiries', inquiryLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.env === 'development') app.use(morgan('dev'));

// Static files (uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Auth routes
app.post('/api/auth/login', validate(loginSchema), AuthController.login);
app.get('/api/auth/me', authenticate, AuthController.me);
app.post('/api/auth/logout', AuthController.logout);

// API routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
