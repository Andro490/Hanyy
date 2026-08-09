import { Request, Response } from 'express';
import https from 'https';

// Helper: make a POST request to HF Inference API and return raw buffer + content-type
function callHF(token: string, model: string, body: string): Promise<{ buffer: Buffer; contentType: string }> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api-inference.huggingface.co',
      path: `/models/${model}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 90_000,
    };

    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        const contentType = res.headers['content-type'] || '';
        const buffer = Buffer.concat(chunks);
        resolve({ buffer, contentType });
      });
    });

    req.on('timeout', () => { req.destroy(); reject(new Error('HF timeout')); });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

export const generateAiImage = async (req: Request, res: Response): Promise<void> => {
  const { prompt, material } = req.body as { prompt: string; material: string };

  if (!prompt || prompt.trim().length === 0) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    res.status(500).json({ error: 'HF_TOKEN not set on server' });
    return;
  }

  const materialLabel = material === 'GOLD' ? '18 karat gold' : '925 sterling silver';
  const fullPrompt = `${prompt.trim()}, made of ${materialLabel}, photorealistic jewelry product shot, white background, no people`;
  const body = JSON.stringify({ inputs: fullPrompt });

  // Retry up to 3 times (handles "model loading" 503 responses)
  const model = 'stabilityai/stable-diffusion-xl-base-1.0';
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { buffer, contentType } = await callHF(hfToken, model, body);

      if (contentType.startsWith('image/')) {
        const base64 = buffer.toString('base64');
        res.status(200).json({ imageUrl: `data:${contentType};base64,${base64}` });
        return;
      }

      // HF returned JSON (model loading or error)
      const text = buffer.toString('utf-8');
      console.log(`[HF attempt ${attempt}] Non-image response:`, text.slice(0, 200));

      // If model is loading, wait and retry
      if (text.includes('loading') || text.includes('estimated_time')) {
        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 8000)); // wait 8 seconds
          continue;
        }
      }

      // Non-recoverable error
      res.status(500).json({ error: 'سيرفر الذكاء الاصطناعي مشغول حالياً، يرجى المحاولة بعد قليل.' });
      return;

    } catch (err: any) {
      console.error(`[HF attempt ${attempt}] Error:`, err.message);
      if (attempt === maxRetries) {
        res.status(500).json({ error: 'Failed to generate image. Please try again.' });
      }
    }
  }
};
