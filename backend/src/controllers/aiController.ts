import { Request, Response } from 'express';
import https from 'https';

export const generateAiImage = (req: Request, res: Response): void => {
  const { prompt, material } = req.body as { prompt: string; material: string };

  if (!prompt || prompt.trim().length === 0) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    res.status(500).json({ error: 'Missing HF_TOKEN environment variable on server' });
    return;
  }

  const materialLabel = material === 'GOLD' ? '18 karat gold' : '925 sterling silver';
  const fullPrompt = `${prompt.trim()}, made of ${materialLabel}, photorealistic jewelry product shot, white background, no people`;
  const body = JSON.stringify({ inputs: fullPrompt });

  const options = {
    hostname: 'api-inference.huggingface.co',
    path: '/models/stabilityai/stable-diffusion-xl-base-1.0',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${hfToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
    timeout: 90_000,
  };

  const request = https.request(options, (hfRes) => {
    const chunks: Buffer[] = [];
    hfRes.on('data', (chunk: Buffer) => chunks.push(chunk));
    hfRes.on('end', () => {
      const contentType = hfRes.headers['content-type'] || '';

      if (!contentType.startsWith('image/')) {
        const errorText = Buffer.concat(chunks).toString('utf-8');
        console.error('[HF AI Error]', hfRes.statusCode, errorText.slice(0, 300));
        res.status(500).json({ error: 'سيرفر الذكاء الاصطناعي مشغول حالياً، يرجى المحاولة بعد قليل.' });
        return;
      }

      const buffer = Buffer.concat(chunks);
      const base64 = buffer.toString('base64');
      res.status(200).json({ imageUrl: `data:${contentType};base64,${base64}` });
    });
  });

  request.on('timeout', () => {
    request.destroy();
    res.status(504).json({ error: 'Image generation timed out. Please try again.' });
  });

  request.on('error', (err: Error) => {
    console.error('[AI Image Error]', err.message);
    res.status(500).json({ error: 'Failed to generate image. Please try again.' });
  });

  request.write(body);
  request.end();
};
