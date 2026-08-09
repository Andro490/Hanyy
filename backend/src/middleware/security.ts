import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Rate limiter for sensitive endpoints (e.g., auth, AI generation, payments)
export const securityRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ status: 'error', message: 'Authentication required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
        return;
    }
};

export const authorizeRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRole = (req as any).user?.role;
        if (!roles.includes(userRole)) {
            res.status(403).json({ status: 'error', message: 'Access denied: Insufficient privileges' });
            return;
        }
        next();
    };
};
