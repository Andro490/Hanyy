import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/db';
import { ENV } from '../config/env';

// ── Zod Schemas for strict input validation ──
const registerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).trim().toLowerCase(),
  password: z.string().min(8).max(128),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

// Helper to generate JWT and set HttpOnly cookie
const signTokenAndSetCookie = (res: Response, userId: string, role: string) => {
  const token = jwt.sign({ id: userId, role }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // Must be true for sameSite: 'none'
    sameSite: 'none', // Required for cross-domain (Vercel -> Railway)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

// ── REGISTER ──
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existingUser) {
      res.status(409).json({ status: 'error', message: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 12);

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashedPassword,
        role: parsed.role || 'USER',
      },
    });

    signTokenAndSetCookie(res, user.id, user.role);

    res.status(201).json({
      status: 'success',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ status: 'error', message: (error as any).errors });
      return;
    }
    next(error);
  }
};

// ── LOGIN ──
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) {
      res.status(401).json({ status: 'error', message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(parsed.password, user.password);
    if (!isMatch) {
      res.status(401).json({ status: 'error', message: 'Invalid email or password' });
      return;
    }

    signTokenAndSetCookie(res, user.id, user.role);

    res.status(200).json({
      status: 'success',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ status: 'error', message: (error as any).errors });
      return;
    }
    next(error);
  }
};

// ── LOGOUT ──
export const logout = (_req: Request, res: Response): void => {
  res.cookie('token', '', { httpOnly: true, secure: true, sameSite: 'none', expires: new Date(0) });
  res.status(200).json({ status: 'success', message: 'Logged out' });
};

// ── GET CURRENT USER (Protected) ──
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

// ── GOOGLE OAUTH CALLBACK ──
export const googleCallback = (req: Request, res: Response): void => {
  const user = (req as any).user;
  if (!user) {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_failed`);
    return;
  }

  // Sign JWT and set cookie
  const token = jwt.sign({ id: user.id, role: user.role }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Redirect back to frontend
  res.redirect(`${ENV.FRONTEND_URL}?google_auth=success`);
};
