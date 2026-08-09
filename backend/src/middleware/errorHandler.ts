import { Request, Response, NextFunction } from 'express';

// Global error handler that prevents leaking sensitive DB/stack trace data
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    // Log the error securely for server admins
    console.error(`[Error] ${err.name}: ${err.message}`);

    res.status(statusCode).json({
        status: 'error',
        message: isProduction && statusCode === 500 ? 'Internal Server Error' : err.message,
        // Only include stack trace in development
        stack: isProduction ? undefined : err.stack,
    });
};
