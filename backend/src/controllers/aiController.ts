import { Request, Response } from 'express';
import https from 'https';
import http from 'http';
import { URL } from 'url';

// Follow redirects automatically (https module doesn't do this by default)
function fetchWithRedirects(urlStr: string, maxRedirects = 5): Promise<{ buffer: Buffer; contentType: string }> {
  return new Promise((resolve, reject) => {
    const doRequest = (currentUrl: string, redirectsLeft: number) => {
      const parsed = new URL(currentUrl);
      const lib = parsed.protocol === 'https:' ? https : http;

      const options = {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: 'GET',
        headers: { 'User-Agent': 'HanyJewelry/1.0' },
        timeout: 90_000,
      };

      const req = lib.request(options, (res) => {
        // Follow redirect
        if ([301, 302, 303, 307, 308].includes(res.statusCode ?? 0) && res.headers.location) {
          if (redirectsLeft === 0) {
            reject(new Error('Too many redirects'));
            return;
          }
          const nextUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : `${parsed.protocol}//${parsed.hostname}${res.headers.location}`;
          doRequest(nextUrl, redirectsLeft - 1);
          return;
        }

        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          const contentType = res.headers['content-type'] || '';
          resolve({ buffer: Buffer.concat(chunks), contentType });
        });
      });

      req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
      req.on('error', reject);
      req.end();
    };

    doRequest(urlStr, maxRedirects);
  });
}

export const generateAiImage = async (req: Request, res: Response): Promise<void> => {
  const { prompt, material } = req.body as { prompt: string; material: string };

  if (!prompt || prompt.trim().length === 0) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const materialLabel = material === 'GOLD' ? '18 karat gold' : '925 sterling silver';
  const fullPrompt = `flat lay overhead, ${prompt.trim()}, made of ${materialLabel}, white marble surface, professional product photography, no people`;
  const encoded = encodeURIComponent(fullPrompt);
  const seed = Date.now();
  const url = `https://image.pollinations.ai/prompt/${encoded}?model=flux&width=512&height=512&nologo=true&seed=${seed}`;

  try {
    const { buffer, contentType } = await fetchWithRedirects(url);

    if (!contentType.startsWith('image/')) {
      console.error('[Pollinations non-image]', contentType, buffer.toString('utf-8').slice(0, 200));
      res.status(500).json({ error: 'سيرفر الذكاء الاصطناعي مشغول حالياً، يرجى المحاولة بعد قليل.' });
      return;
    }

    const base64 = buffer.toString('base64');
    res.status(200).json({ imageUrl: `data:${contentType};base64,${base64}` });
  } catch (err: any) {
    console.error('[AI Image Error]', err.message);
    res.status(500).json({ error: 'Failed to generate image. Please try again.' });
  }
};
