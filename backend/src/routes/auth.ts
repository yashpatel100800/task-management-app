import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Helper function to verify token and get user
const getUserFromToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true }
    });
    return user;
  } catch (error) {
    return null;
  }
};

// Check current user
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.token;
  
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const user = await getUserFromToken(token);
  if (!user) {
    res.clearCookie('token');
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  res.json({ user });
});

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is already logged in
    const existingToken = req.cookies.token;
    if (existingToken) {
      const existingUser = await getUserFromToken(existingToken);
      if (existingUser) {
        res.json({ user: existingUser });
        return;
      }
      res.clearCookie('token');
    }

    const { email, password, name } = userSchema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is already logged in
    const existingToken = req.cookies.token;
    if (existingToken) {
      const existingUser = await getUserFromToken(existingToken);
      if (existingUser) {
        res.json({ user: existingUser });
        return;
      }
      res.clearCookie('token');
    }

    const { email, password } = loginSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true
      }
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (_req: Request, res: Response): void => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logged out successfully' });
});

export default router; 