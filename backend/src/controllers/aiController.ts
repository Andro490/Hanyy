import { Request, Response } from 'express';
import https from 'https';

export const generateAiImage = (req: Request, res: Response): void => {
  const { prompt, material } = req.body as { prompt: string; material: string };

  if (!prompt || prompt.trim().length === 0) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const apiKey = process.env.IDEOGRAM_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'IDEOGRAM_API_KEY not set on server' });
    return;
  }

  const materialLabel = material === 'GOLD' ? '18 karat gold' : '925 sterling silver';
  // Ideogram is excellent at typography. We make sure to emphasize the text rendering.
  const fullPrompt = `A high quality, photorealistic macro product shot of a ${materialLabel} nameplate necklace. The necklace clearly spells the text: "${prompt.trim()}". Flat lay on a clean white marble background, studio lighting, highly detailed.`;

  const body = JSON.stringify({
    image_request: {
      prompt: fullPrompt,
      aspect_ratio: "ASPECT_1_1",
      model: "V_2",
      magic_prompt_option: "AUTO"
    }
  });

  const options = {
    hostname: 'api.ideogram.ai',
    path: '/generate',
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
    timeout: 90_000,
  };

  const request = https.request(options, (hfRes) => {
    const chunks: Buffer[] = [];
    hfRes.on('data', (chunk: Buffer) => chunks.push(chunk));
    hfRes.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const text = buffer.toString('utf-8');
      
      try {
        const json = JSON.parse(text);
        if (json.data && json.data[0] && json.data[0].url) {
          res.status(200).json({ imageUrl: json.data[0].url });
        } else {
          console.error('[Ideogram Error]', json);
          res.status(500).json({ error: 'سيرفر الذكاء الاصطناعي مشغول حالياً، يرجى المحاولة بعد قليل.' });
        }
      } catch (e) {
        console.error('[Ideogram Parse Error]', text);
        res.status(500).json({ error: 'سيرفر الذكاء الاصطناعي مشغول حالياً، يرجى المحاولة بعد قليل.' });
      }
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
