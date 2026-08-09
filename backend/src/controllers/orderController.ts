import { Request, Response } from 'express';
import { sendTelegramNotification } from '../services/telegramService';

export const notifyOrder = async (req: Request, res: Response): Promise<void> => {
  const {
    type, text, templateStyle, material,
    width, height, price, aiPrompt, fontFamily,
    userName, userEmail,
  } = req.body;

  const materialLabel = material === 'GOLD' ? '🥇 ذهب 18 قيراط' : '🥈 فضة 925';
  const typeLabel = type === 'PRE_DESIGNED' ? '📐 قالب جاهز' : '🤖 AI Magic';

  const message = `
🔔 <b>طلب تصميم جديد!</b>

👤 <b>العميل:</b> ${userName || 'زائر'}
📧 <b>الإيميل:</b> ${userEmail || '-'}

💎 <b>نوع التصميم:</b> ${typeLabel}
${text ? `✍️ <b>الاسم/النص:</b> ${text}` : ''}
${aiPrompt ? `🎨 <b>البرومت:</b> ${aiPrompt}` : ''}
${templateStyle ? `🖼️ <b>القالب:</b> ${templateStyle}` : ''}
${fontFamily ? `🔤 <b>الخط:</b> ${fontFamily.replace(/'/g, '').split(',')[0]}` : ''}

📏 <b>الأبعاد:</b> ${width} × ${height} سم
${materialLabel}

💰 <b>السعر المقدر:</b> $${price}

⏰ ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}
  `.trim();

  await sendTelegramNotification(message);
  res.status(200).json({ status: 'ok' });
};
