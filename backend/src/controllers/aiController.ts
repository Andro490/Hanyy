import { Request, Response } from 'express';
import https from 'https';

export const generateAiImage = (req: Request, res: Response): void => {
  const { prompt, material } = req.body as { prompt: string; material: string };

  if (!prompt || prompt.trim().length === 0) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const materialLabel = material === 'GOLD' ? '18 karat gold' : '925 sterling silver';
  const fullPrompt = `${prompt.trim()}, made of ${materialLabel}, photorealistic jewelry product shot, white background, no people`;
  const encoded = encodeURIComponent(fullPrompt);
  const seed = Date.now();
  const reqPath = `/prompt/${encoded}?model=flux&width=512&height=512&nologo=true&seed=${seed}`;

  const options = {
    hostname: 'image.pollinations.ai',
    path: reqPath,
    method: 'GET',
    headers: { 'User-Agent': 'HanyJewelry/1.0' },
    timeout: 90_000,
  };

  const request = https.request(options, (imgRes) => {
    const chunks: Buffer[] = [];
    imgRes.on('data', (chunk: Buffer) => chunks.push(chunk));
    imgRes.on('end', () => {
      const contentType = imgRes.headers['content-type'] || '';
      if (!contentType.startsWith('image/')) {
        const errorText = Buffer.concat(chunks).toString('utf-8');
        console.error('[Pollinations Error]', errorText.slice(0, 200));
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

  request.end();
};
