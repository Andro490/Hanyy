import { Request, Response } from 'express';
import https from 'https';

/**
 * POST /api/ai/generate-image
 * Proxies image generation to Pollinations.ai with a 90-second timeout.
 * Returns the image as a base64 data URL so the browser never hits CORS issues.
 */
export const generateAiImage = (req: Request, res: Response): void => {
  const { prompt, material } = req.body as { prompt: string; material: string };

  if (!prompt || prompt.trim().length === 0) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const materialLabel = material === 'GOLD' ? '18k gold' : '925 silver';
  const fullPrompt = `luxury jewelry design, ${prompt.trim()}, ${materialLabel}, high detail, white background, professional product photo, photorealistic`;
  const encoded = encodeURIComponent(fullPrompt);
  const pollinationsUrl = `https://gen.pollinations.ai/image/${encoded}?model=flux&width=512&height=512&nologo=true&seed=${Date.now()}`;

  const parsedUrl = new URL(pollinationsUrl);

  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'GET',
    headers: { 'User-Agent': 'HanyJewelry/1.0' },
    timeout: 90_000,
  };

  const request = https.request(options, (imageRes) => {
    const chunks: Buffer[] = [];

    imageRes.on('data', (chunk: Buffer) => chunks.push(chunk));

    imageRes.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const contentType = imageRes.headers['content-type'] || 'image/jpeg';
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${contentType};base64,${base64}`;
      res.status(200).json({ imageUrl: dataUrl });
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

