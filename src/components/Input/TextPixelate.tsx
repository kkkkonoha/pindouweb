import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import type { PixelData } from '../../types';

const SIZE_OPTIONS = [
  { label: '小 (16px)', value: 16 },
  { label: '中 (24px)', value: 24 },
  { label: '大 (32px)', value: 32 },
  { label: '特大 (48px)', value: 48 },
];

const CANVAS_SIZES = [
  { label: '29 x 29', width: 29, height: 29 },
  { label: '58 x 58', width: 58, height: 58 },
  { label: '116 x 116', width: 116, height: 116 },
];

export const TextPixelate: React.FC = () => {
  const [text, setText] = useState('LOVE');
  const [fontSize, setFontSize] = useState(32);
  const [targetWidth, setTargetWidth] = useState(29);
  const [targetHeight, setTargetHeight] = useState(29);
  const setProject = useProjectStore((s) => s.setProject);
  const setWizardStep = useProjectStore((s) => s.setWizardStep);

  const handleGenerate = () => {
    if (!text.trim()) return;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const scale = Math.min(targetWidth / (text.length * fontSize * 0.6), targetHeight / fontSize);
    const actualFontSize = Math.max(8, Math.floor(fontSize * scale * 0.8));

    ctx.font = `bold ${actualFontSize}px sans-serif`;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels: PixelData[][] = [];

    for (let y = 0; y < canvas.height; y++) {
      const row: PixelData[] = [];
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        const isBlack = r < 128 && g < 128 && b < 128;
        row.push({ color: isBlack ? '#000000' : '#FFFFFF' });
      }
      pixels.push(row);
    }

    const palette = [
      { color: '#000000', beadCode: 'D39', beadName: '黑色', count: pixels.flat().filter(p => p.color === '#000000').length },
      { color: '#FFFFFF', beadCode: 'D01', beadName: '本白', count: pixels.flat().filter(p => p.color === '#FFFFFF').length },
    ];

    setProject({
      id: crypto.randomUUID(),
      name: text,
      width: targetWidth,
      height: targetHeight,
      pixels,
      palette,
      brand: 'domestic',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    setWizardStep('preview');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>文字像素化</h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
          输入文字
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="请输入文字"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
          字体大小
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFontSize(opt.value)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: fontSize === opt.value ? '#3b82f6' : '#f9fafb',
                color: fontSize === opt.value ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
          输出尺寸
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {CANVAS_SIZES.map((size) => (
            <button
              key={size.label}
              onClick={() => { setTargetWidth(size.width); setTargetHeight(size.height); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: targetWidth === size.width ? '#3b82f6' : '#f9fafb',
                color: targetWidth === size.width ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>
          预览效果: "{text}" → {targetWidth} x {targetHeight} 像素画
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!text.trim()}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: text.trim() ? '#3b82f6' : '#d1d5db',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: text.trim() ? 'pointer' : 'not-allowed',
          fontSize: '15px',
          fontWeight: '500'
        }}
      >
        生成像素文字
      </button>
    </div>
  );
};
