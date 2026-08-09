import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export const getPricing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pricing = await prisma.pricingVariables.findFirst();
    res.status(200).json({ status: 'success', data: pricing || { baseGoldPrice: 200, baseSilverPrice: 80, manufacturingFee: 1.3 } });
  } catch (error) {
    next(error);
  }
};

export const updatePricing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { baseGoldPrice, baseSilverPrice, manufacturingFee } = req.body;
    let pricing = await prisma.pricingVariables.findFirst();
    if (pricing) {
      pricing = await prisma.pricingVariables.update({
        where: { id: pricing.id },
        data: { baseGoldPrice, baseSilverPrice, manufacturingFee }
      });
    } else {
      pricing = await prisma.pricingVariables.create({
        data: { baseGoldPrice, baseSilverPrice, manufacturingFee }
      });
    }
    res.status(200).json({ status: 'success', data: pricing });
  } catch (error) {
    next(error);
  }
};

export const getGallery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ status: 'success', data: items });
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, imageUrl, price } = req.body;
    const item = await prisma.galleryItem.create({
      data: { title, description, imageUrl, price: price ? String(price) : null }
    });
    res.status(201).json({ status: 'success', data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.galleryItem.delete({ where: { id: id as string } });
    res.status(200).json({ status: 'success', message: 'Item deleted' });
  } catch (error) {
    next(error);
  }
};
