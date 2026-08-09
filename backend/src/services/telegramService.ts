/// <reference types="node" />

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

export const sendTelegramNotification = async (message: string): Promise<void> => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('[Telegram] Bot token or chat ID not configured');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    
    if (!response.ok) {
      const err = await response.text();
      console.error('[Telegram] Failed to send message:', err);
    }
  } catch (error) {
    console.error('[Telegram] Error:', error);
  }
};

export const sendTelegramPhoto = async (base64Image: string, caption: string): Promise<void> => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  try {
    // Strip base64 header (data:image/png;base64,...)
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');
    formData.append(
      'photo',
      new Blob([imageBuffer], { type: 'image/png' }),
      'design_preview.png'
    );

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
    const response = await fetch(url, { method: 'POST', body: formData });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Telegram] Failed to send photo:', err);
      // Fallback: send as text
      await sendTelegramNotification(caption);
    }
  } catch (error) {
    console.error('[Telegram] Photo error:', error);
    await sendTelegramNotification(caption);
  }
};
