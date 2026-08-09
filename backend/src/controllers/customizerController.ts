import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/db';
import { ENV } from '../config/env';

// ── Zod Schemas ──
const saveDesignSchema = z.object({
  templateId: z.string().uuid().optional(),
  type: z.enum(['PRE_DESIGNED', 'BLANK', 'AI_GENERATED']),
  text: z.string().max(200).optional(),
  fontFamily: z.string().max(100).optional(),
  width: z.number().min(1).max(50),
  height: z.number().min(1).max(50),
  material: z.enum(['GOLD', 'SILVER']),
  aiPrompt: z.string().max(1000).optional(),
});

const aiGenerateSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000),
  material: z.enum(['GOLD', 'SILVER']),
});

// ── GET ALL TEMPLATES ──
export const getTemplates = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const templates = await prisma.productTemplate.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json({ status: 'success', data: templates });
  } catch (error) {
    next(error);
  }
};

// ── SAVE DESIGN ──
export const saveDesign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = saveDesignSchema.parse(req.body);
    const userId = (req as any).user?.id;

    const pricingVars = await prisma.pricingVariables.findFirst();
    if (!pricingVars) {
      res.status(500).json({ status: 'error', message: 'Pricing not configured' });
      return;
    }

    const area = parsed.width * parsed.height;
    const basePrice = parsed.material === 'GOLD' ? pricingVars.baseGoldPrice : pricingVars.baseSilverPrice;
    const calculatedPrice = parseFloat((area * basePrice * pricingVars.manufacturingFee).toFixed(2));

    const design = await prisma.design.create({
      data: {
        userId,
        templateId: parsed.templateId,
        type: parsed.type,
        text: parsed.text,
        fontFamily: parsed.fontFamily,
        width: parsed.width,
        height: parsed.height,
        material: parsed.material,
        calculatedPrice,
        aiPrompt: parsed.aiPrompt,
      },
    });

    res.status(201).json({ status: 'success', data: design });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ status: 'error', message: (error as any).errors });
      return;
    }
    next(error);
  }
};

// ── AI GENERATE (Proxied securely through backend) ──
export const aiGenerate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = aiGenerateSchema.parse(req.body);

    if (!ENV.AI_API_KEY) {
      res.status(503).json({ status: 'error', message: 'AI service is not configured' });
      return;
    }

    // Mock response for development — replace with real AI API call
    const mockResult = {
      imageUrl: `https://placehold.co/400x200/1a1a2e/eaeaea?text=${encodeURIComponent(parsed.prompt.substring(0, 20))}`,
      prompt: parsed.prompt,
      material: parsed.material,
    };

    res.status(200).json({ status: 'success', data: mockResult });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ status: 'error', message: (error as any).errors });
      return;
    }
    next(error);
  }
};

// ── GET USER DESIGNS ──
export const getUserDesigns = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const designs = await prisma.design.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: designs });
  } catch (error) {
    next(error);
  }
};
