import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Sparkles, Box, Type, ShoppingCart, Check } from 'lucide-react';
import { useCustomizerStore } from '../../store/customizerStore';
import { usePricingEngine } from '../../hooks/usePricingEngine';
import html2canvas from 'html2canvas';

// Hand-drawn SVG Template Wrappers
const CrownTemplate = ({ text, material, textColor, fontFamily }: { text: string; material: string; textColor: string; fontFamily: string }) => (
  <div className="flex flex-col items-center justify-center relative">
    <svg width="60" height="40" viewBox="0 0 100 60" fill="currentColor" className={`mb-[-15px] z-10 opacity-90 drop-shadow-md ${material === 'GOLD' ? 'text-[#D4AF37]' : 'text-gray-300'}`}>
      <path d="M10,50 L20,10 L40,30 L50,0 L60,30 L80,10 L90,50 Z" />
      <circle cx="20" cy="5" r="5" />
      <circle cx="50" cy="-5" r="5" />
      <circle cx="80" cy="5" r="5" />
    </svg>
    <span className="text-4xl md:text-5xl drop-shadow-lg transition-all duration-500" style={{ fontFamily: fontFamily, color: textColor }}>{text || 'الاسم'}</span>
  </div>
);

const HeartTemplate = ({ text, material, textColor, fontFamily, autoFit, textCurve, fontSizeScale = 1 }: { text: string; material: string; textColor: string; fontFamily: string; autoFit: boolean; textCurve: 'none' | 'up' | 'down'; fontSizeScale?: number }) => {
  const spanRef = React.useRef<HTMLSpanElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  const fontScaleMap: Record<string, { m: number; useWidthOnly?: boolean }> = {
    "'Sacramento', cursive":        { m: 1.15, useWidthOnly: true  }, // Slightly reduced to touch inner edges perfectly
    "'Great Vibes', cursive":        { m: 1.15, useWidthOnly: true  },
    "'Dancing Script', cursive":     { m: 1.05, useWidthOnly: false },
    "'Pacifico', cursive":           { m: 0.90, useWidthOnly: false },
    "'Aref Ruqaa', serif":           { m: 0.95, useWidthOnly: false },
    "'Amiri', serif":                { m: 0.95, useWidthOnly: false },
    "'Scheherazade New', serif":     { m: 0.95, useWidthOnly: false },
    "'Lateef', serif":               { m: 0.90, useWidthOnly: false },
    "'Reem Kufi', sans-serif":       { m: 0.92, useWidthOnly: false },
    "'Tajawal', sans-serif":         { m: 0.92, useWidthOnly: false },
  };
  const { m: multiplier, useWidthOnly } = fontScaleMap[fontFamily] ?? { m: 0.90, useWidthOnly: false };

  React.useLayoutEffect(() => {
    if (!spanRef.current || !containerRef.current) return;
    if (!autoFit || !text || textCurve !== 'none') { setScale(1); return; }

    spanRef.current.style.transform = 'scale(1)';

    requestAnimationFrame(() => {
      if (!spanRef.current || !containerRef.current) return;

      // Width ratio for script fonts to touch inner edges perfectly
      const wRatio = useWidthOnly ? 0.60 : 0.58;
      const containerW = containerRef.current!.clientWidth * wRatio;
      const containerH = containerRef.current!.clientHeight * 0.44;
      const textW = spanRef.current.scrollWidth;
      const textH = spanRef.current.scrollHeight;
      const sx = (containerW / textW) * multiplier;
      const sy = (containerH / textH) * multiplier;
      setScale(Math.min(useWidthOnly ? Math.min(sx, 2.2) : Math.min(sx, sy, 2.2)));
    });
  }, [text, autoFit, fontFamily, textCurve]);

  const filterGold = 'brightness(0) saturate(100%) invert(79%) sepia(46%) saturate(601%) hue-rotate(355deg) brightness(99%) contrast(93%)';
  const filterSilver = 'brightness(0) saturate(100%) invert(85%) sepia(0%) saturate(10%) hue-rotate(185deg) brightness(91%) contrast(90%)';
  const displayText = text || 'الاسم';
  
  // Font size for SVG curved text
  const baseSvgFontSize = 42 * multiplier; // Default size when autoFit is off
  // Scale script fonts so they touch the edges of the heart without overflowing
  const maxSvgSize = useWidthOnly ? 66 : 85;
  const lengthFactor = useWidthOnly ? 260 : 280;
  const autoSvgFontSize = Math.min(maxSvgSize, Math.max(24, lengthFactor / displayText.length)) * multiplier; 
  const svgFontSize = autoFit ? autoSvgFontSize : baseSvgFontSize;

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center min-w-[260px] min-h-[220px]">
      <img
        src="/templates/heart.png"
        alt="Heart Frame"
        className="absolute inset-0 w-full h-full object-contain z-0 drop-shadow-md"
        style={{ filter: material === 'GOLD' ? filterGold : filterSilver }}
      />

      {/* Curved text via SVG textPath */}
      {textCurve !== 'none' ? (
        <svg viewBox="0 0 260 220" className="absolute inset-0 w-full h-full z-10">
          <defs>
            {/*
              Ultra-extended paths to ensure massive auto-fitted text NEVER gets cut off.
              Using Quadratic Bezier curves (Q) spanning from x=-500 to x=760 (1260px width!).
              Mathematically identical curvature to the previous arcs, just much longer.
              Center of viewBox is x=130.
              Down (Smile): dips to y=132 at center.
              Up (Frown): rises to y=125 at center (raised slightly per request).
            */}
            <path id="arcDown" d="M -500,-258 Q 130,500 760,-258" fill="none" />
            <path id="arcUp"   d="M -500,350 Q 130,-120 760,350" fill="none" />
          </defs>
          <text
            fontFamily={fontFamily.replace(/['"]/g, '').split(',')[0]}
            fontSize={svgFontSize * fontSizeScale}
            fill={textColor}
            textAnchor="middle"
            transform="translate(0, -6)" // غير الرقم -10 عشان ترفع أو تنزل النص (بالسالب لفوق والموجب لتحت)

            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
              transition: 'font-size 0.35s cubic-bezier(0.34,1.56,0.64,1)' 
            }}
          >
            <textPath
              href={textCurve === 'up' ? '#arcUp' : '#arcDown'}
              startOffset="50%"
            >
              {displayText}
            </textPath>
          </text>
        </svg>
      ) : (
        <span
          ref={spanRef}
          className="z-10 relative whitespace-nowrap drop-shadow-lg"
          style={{
            fontFamily,
            color: textColor,
            fontSize: '3.5rem',
            lineHeight: 1,
            display: 'inline-block',
            transformOrigin: 'center center',
            transform: `scale(${scale * fontSizeScale})`,
            transition: autoFit ? 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
            marginBottom: '16%', // Adjusted for perfect visual center
          }}
        >
          {displayText}
        </span>
      )}
    </div>
  );
};

const SwashTemplate = ({ text, material, textColor, fontFamily }: { text: string; material: string; textColor: string; fontFamily: string }) => (
  <div className="flex flex-col items-center justify-center">
    <span className="text-4xl md:text-5xl drop-shadow-lg transition-all duration-500" style={{ fontFamily: fontFamily, color: textColor }}>{text || 'الاسم'}</span>
    <svg width="120" height="40" viewBox="0 0 100 30" fill="currentColor" className={`mt-[-5px] opacity-90 drop-shadow-md ${material === 'GOLD' ? 'text-[#D4AF37]' : 'text-gray-300'}`}>
      <path d="M0,15 Q30,30 50,15 T100,15 Q70,0 50,15 T0,15 Z" />
      <path d="M40,15 Q50,0 60,15 T50,30 Q40,15 50,15 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  </div>
);

const renderTemplate = (style: string, text: string, material: string, textColor: string, fontFamily: string, autoFit: boolean, textCurve: 'none' | 'up' | 'down', fontSizeScale: number) => {
  switch (style) {
    case 'crown': return <CrownTemplate text={text} material={material} textColor={textColor} fontFamily={fontFamily} />;
    case 'heart': return <HeartTemplate text={text} material={material} textColor={textColor} fontFamily={fontFamily} autoFit={autoFit} textCurve={textCurve} fontSizeScale={fontSizeScale} />;
    case 'swash': return <SwashTemplate text={text} material={material} textColor={textColor} fontFamily={fontFamily} />;
    default: return <span className="text-4xl drop-shadow-lg transition-all duration-500" style={{ fontFamily, color: textColor }}>{text || 'الاسم'}</span>;
  }
};

export const CustomizerPanel = () => {
  const store = useCustomizerStore();
  const { isLoading, error } = usePricingEngine();
  const [aiImageUrl, setAiImageUrl] = React.useState<string | null>(null);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState(false);
  const [addedToCart, setAddedToCart] = React.useState(false);
  const previewRef = React.useRef<HTMLDivElement>(null);

  const handleAddToCart = async () => {
    // Save design to localStorage cart
    const cart = JSON.parse(localStorage.getItem('hany_cart') || '[]');
    const item = {
      id: Date.now(),
      type: store.type,
      text: store.text,
      templateStyle: store.templateStyle,
      material: store.material,
      width: store.width,
      height: store.height,
      price: store.price,
      aiPrompt: store.aiPrompt,
      aiImageUrl: aiImageUrl,
      fontFamily: store.fontFamily,
      addedAt: new Date().toISOString(),
    };
    cart.push(item);
    localStorage.setItem('hany_cart', JSON.stringify(cart));

    // Capture preview screenshot
    let previewBase64: string | null = null;
    if (previewRef.current) {
      try {
        await document.fonts.ready;
        const canvas = await html2canvas(previewRef.current, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false
        });
        previewBase64 = canvas.toDataURL('image/png');
      } catch {
        // Screenshot failed silently
      }
    }

    // Send Telegram notification
    try {
      const baseUrl = import.meta.env.PROD ? 'https://hanyy-production-166a.up.railway.app' : '';
      await fetch(`${baseUrl}/api/orders/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: store.type,
          text: store.text,
          templateStyle: store.templateStyle,
          material: store.material,
          width: store.width,
          height: store.height,
          price: store.price,
          aiPrompt: store.aiPrompt,
          fontFamily: store.fontFamily,
          previewBase64,
        }),
      });
    } catch {
      // Notification failed silently - don't block user
    }

    // Show success feedback
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };


  const generateAiImage = async () => {
    if (!store.aiPrompt.trim()) return;
    setAiLoading(true);
    setAiImageUrl(null);
    setAiError(false);
    try {
      const baseUrl = import.meta.env.PROD ? 'https://hanyy-production-166a.up.railway.app' : '';
      const res = await fetch(`${baseUrl}/api/ai/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: store.aiPrompt, material: store.material }),
        signal: AbortSignal.timeout(95_000), // slightly longer than backend timeout
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setAiImageUrl(data.imageUrl); // base64 data URL - no CORS issues!
    } catch {
      setAiError(true);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-900 rounded-3xl text-white shadow-2xl border border-slate-800">
      
      {/* 3D / Live Preview Area */}
      <div className="flex flex-col items-center justify-center bg-slate-950 rounded-2xl p-6 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
        
        {/* Live Scaling Element */}
        <motion.div
          ref={previewRef}
          animate={{
            width: store.type === 'PRE_DESIGNED' ? 'auto' : store.width * 10,
            height: store.type === 'PRE_DESIGNED' ? 'auto' : store.height * 10,
            scaleX: store.type === 'PRE_DESIGNED' ? store.width / 5 : 1,
            scaleY: store.type === 'PRE_DESIGNED' ? store.height / (store.templateStyle === 'heart' ? 4 : 2) : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`flex items-center justify-center text-center shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-2xl border border-white/10 z-10 transition-colors duration-500 origin-center ${
            store.type === 'PRE_DESIGNED' 
              ? 'bg-transparent' // Remove yellow background for templates
              : store.material === 'GOLD' 
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950' 
                : 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-900'
          }`}
          style={{ minWidth: '150px', minHeight: '80px', padding: '20px' }}
        >
          {store.type === 'AI_GENERATED' ? (
            aiLoading && !aiImageUrl ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-400 text-sm">جارٍ إنشاء التصميم...</span>
              </div>
            ) : aiError ? (
              <div className="flex flex-col items-center gap-3 text-red-400">
                <span className="text-3xl">⚠️</span>
                <span className="text-sm text-center">تعذّر التوليد، حاول مرة ثانية</span>
                <button onClick={generateAiImage} className="text-xs border border-red-400 px-3 py-1 rounded-lg hover:bg-red-400/10">إعادة المحاولة</button>
              </div>
            ) : aiImageUrl ? (
              <img
                src={aiImageUrl}
                alt="AI Design"
                className="max-w-full max-h-[280px] object-contain rounded-xl shadow-2xl"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <Sparkles className="w-10 h-10 animate-pulse" />
                <span className="text-xs">اكتب برومت واضغط "توليد"</span>
              </div>
            )
          ) : store.type === 'PRE_DESIGNED' ? (
            renderTemplate(store.templateStyle, store.text, store.material, store.textColor, store.fontFamily, store.autoFit, store.textCurve, store.fontSizeScale)
          ) : (
            <span style={{ fontFamily: store.fontFamily, color: store.textColor }} className="text-3xl transition-colors duration-500">{store.text || 'Preview'}</span>
          )}
        </motion.div>
        
        <div className="absolute bottom-4 right-4 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-700 backdrop-blur-md">
          <p className="text-sm text-slate-400 font-medium">Estimated Price</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-400">${store.price}</span>
            {isLoading && <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>}
          </div>
        </div>
      </div>

      {/* Controls Area */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">Design Studio</h2>
          <p className="text-sm text-slate-400">Customize your premium jewelry</p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-800 p-1 rounded-xl gap-1">
          {['PRE_DESIGNED', 'AI_GENERATED'].map((mode) => (
            <button
              key={mode}
              onClick={() => store.setType(mode as any)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${store.type === mode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
            >
              {mode === 'PRE_DESIGNED' ? 'Templates' : 'AI Magic'}
            </button>
          ))}
        </div>

        {/* Dynamic Inputs based on mode */}
        <div className="space-y-4 flex-1">
          {store.type === 'PRE_DESIGNED' && (
            <div className="mb-4">
              <label className="text-sm font-medium text-slate-300 mb-2 block">Choose Design Template</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'crown', label: 'Crown' },
                  { id: 'heart', label: 'Heart' },
                  { id: 'swash', label: 'Classic' }
                ].map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => store.setTemplateStyle(tpl.id)}
                    className={`py-2 text-sm rounded-lg border transition-all ${store.templateStyle === tpl.id ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {store.type !== 'AI_GENERATED' ? (
            <div>
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2"><Type size={16}/> {store.type === 'PRE_DESIGNED' ? 'Your Name (Arabic/English)' : 'Engraving Text'}</label>
              <input 
                type="text" 
                value={store.text}
                onChange={(e) => store.setText(e.target.value)}
                placeholder={store.type === 'PRE_DESIGNED' ? 'مثال: ريم' : 'Enter your name...'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-slate-600"
                dir="auto"
              />
              {/* Curve Selector — only for Heart template */}
              {store.templateStyle === 'heart' && store.text && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-400 mb-1 block">انحناء الاسم</label>
                  <div className="flex gap-2">
                    {([
                      { val: 'none', label: '—',  title: 'مستقيم' },
                      { val: 'up',   label: '⌢',  title: 'محني لفوق' },
                      { val: 'down', label: '⌣',  title: 'محني لتحت' },
                    ] as const).map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => store.setTextCurve(opt.val)}
                        title={opt.title}
                        className={`flex-1 py-1.5 text-base rounded-lg border transition-all ${
                          store.textCurve === opt.val
                            ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        {opt.label} <span className="text-xs ml-1">{opt.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Auto-Fit checkbox — shows for Heart template whenever text is entered */}
              {store.templateStyle === 'heart' && store.text && (
                <label className="flex items-center gap-2 mt-2 cursor-pointer select-none group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={store.autoFit}
                      onChange={(e) => store.setAutoFit(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      store.autoFit ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-600 group-hover:border-slate-400'
                    }`}>
                      {store.autoFit && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                          <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                    ملء الاسم داخل القلب تلقائياً
                  </span>
                </label>
              )}
              
              {/* Manual Font Size Slider */}
              <div className="mt-4 bg-slate-900 border border-slate-700 p-3 rounded-xl">
                <label className="flex justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>حجم الخط (يدوي)</span>
                  <span>{Math.round(store.fontSizeScale * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={store.fontSizeScale}
                  onChange={(e) => store.setFontSizeScale(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                  dir="ltr"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2"><Sparkles size={16}/> AI Prompt</label>
              <textarea 
                value={store.aiPrompt}
                onChange={(e) => store.setAIPrompt(e.target.value)}
                placeholder="مثال: خاتم ذهبي بنقش زهرة، قلادة فضية بشكل قلب..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white placeholder-slate-600 resize-none mb-3"
                dir="rtl"
              />
              <button
                onClick={generateAiImage}
                disabled={aiLoading || !store.aiPrompt.trim()}
                className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
              >
                {aiLoading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> جارٍ التوليد...</>
                ) : (
                  <><Sparkles size={16} /> توليد التصميم</>
                )}
              </button>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2"><Type size={16}/> Font Style</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "'Aref Ruqaa', serif",         label: 'رقعة',       preview: 'رقعة' },
                { id: "'Amiri', serif",               label: 'أميري',      preview: 'أميري' },
                { id: "'Reem Kufi', sans-serif",      label: 'كوفي',       preview: 'كوفي' },
                { id: "'Scheherazade New', serif",    label: 'شهرزاد',     preview: 'شهرزاد' },
                { id: "'Lateef', serif",              label: 'لطيف',       preview: 'لطيف' },
                { id: "'Tajawal', sans-serif",        label: 'حديث',       preview: 'حديث' },
                { id: "'Dancing Script', cursive",    label: 'Script',     preview: 'Script' },
                { id: "'Great Vibes', cursive",       label: 'Elegant',    preview: 'Elegant' },
                { id: "'Pacifico', cursive",          label: 'Pacifico',   preview: 'Pacifico' },
                { id: "'Sacramento', cursive",        label: 'Sacramento', preview: 'Sac' },
              ].map(font => (
                <button
                  key={font.id}
                  onClick={() => store.setFontFamily(font.id)}
                  className={`py-2 px-1 text-sm rounded-lg border transition-all truncate ${store.fontFamily === font.id ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                  style={{ fontFamily: font.id }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2"><Box size={16}/> Width (cm)</label>
              <input 
                type="number" min="1" max="50"
                value={store.width}
                onChange={(e) => store.setDimensions(Number(e.target.value), store.height)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2"><Box size={16}/> Height (cm)</label>
              <input 
                type="number" min="1" max="50"
                value={store.height}
                onChange={(e) => store.setDimensions(store.width, Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-white"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div>
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2"><Settings size={16}/> Material</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => store.setMaterial('GOLD')}
                className={`py-3 rounded-xl font-medium border ${store.material === 'GOLD' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                18K Gold
              </button>
              <button 
                onClick={() => store.setMaterial('SILVER')}
                className={`py-3 rounded-xl font-medium border ${store.material === 'SILVER' ? 'bg-slate-300/20 border-slate-300 text-slate-200' : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                925 Silver
              </button>
            </div>
          </div>

        </div>

        <button
          onClick={handleAddToCart}
          className={`w-full py-4 mt-auto font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
            addedToCart
              ? 'bg-emerald-600 shadow-emerald-500/25 text-white'
              : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-blue-500/25'
          }`}
        >
          {addedToCart ? (
            <><Check size={18} /> تمت الإضافة للسلة!</>
          ) : (
            <><ShoppingCart size={18} /> Add to Cart • ${store.price}</>
          )}
        </button>

      </div>
    </div>
  );
};
