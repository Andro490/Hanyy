import { Request, Response } from 'express';

export const generateAiImage = async (req: Request, res: Response): Promise<void> => {
  const { prompt, material } = req.body as { prompt: string; material: string };

  if (!prompt || prompt.trim().length === 0) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const materialLabel = material === 'GOLD' ? '18 karat gold' : '925 sterling silver';
  const fullPrompt = `${prompt.trim()}, made of ${materialLabel}, high quality photorealistic jewelry product shot`;

  try {
    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
       res.status(500).json({ error: 'Missing Hugging Face Token in backend' });
       return;
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: fullPrompt }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('[AI Error]', text);
      res.status(500).json({ error: 'سيرفر الذكاء الاصطناعي مشغول حالياً، يرجى المحاولة بعد قليل.' });
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    
    res.status(200).json({ imageUrl: dataUrl });
  } catch (error: any) {
    console.error('[AI Image Error]', error.message);
    res.status(500).json({ error: 'Failed to generate image. Please try again.' });
  }
};
