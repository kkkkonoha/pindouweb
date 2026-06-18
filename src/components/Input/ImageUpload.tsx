import React, { useRef, useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { pixelateImage, canvasToPixelGrid } from '../../utils/pixelate';
import { mapColorsToBeads } from '../../utils/colorMatch';
import { domesticBrand } from '../../data/domestic';

const PRESET_SIZES = [
  { label: '29 x 29', width: 29, height: 29 },
  { label: '29 x 58', width: 29, height: 58 },
  { label: '58 x 29', width: 58, height: 29 },
  { label: '58 x 58', width: 58, height: 58 },
  { label: '116 x 116', width: 116, height: 116 },
];

export const ImageUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setProject = useProjectStore((s) => s.setProject);
  const setWizardStep = useProjectStore((s) => s.setWizardStep);

  const [targetWidth, setTargetWidth] = useState(29);
  const [targetHeight, setTargetHeight] = useState(29);
  const [useCustomSize, setUseCustomSize] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = img.width;
      sourceCanvas.height = img.height;
      const ctx = sourceCanvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const pixelated = pixelateImage(sourceCanvas, targetWidth, targetHeight);
      const pixelGrid = canvasToPixelGrid(pixelated);
      const { mappedGrid, palette } = mapColorsToBeads(pixelGrid, domesticBrand.colors);

      const pixels = mappedGrid.map(row =>
        row.map(hex => ({ color: hex }))
      );

      const paletteArray = Array.from(palette.entries()).map(([hex, { bead, count }]) => ({
        color: hex,
        beadCode: bead.code,
        beadName: bead.name,
        count
      }));

      setProject({
        id: crypto.randomUUID(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        width: targetWidth,
        height: targetHeight,
        pixels,
        palette: paletteArray,
        brand: 'domestic',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setWizardStep('preview');
    };

    img.src = URL.createObjectURL(file);
  };

  const handlePresetSelect = (w: number, h: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
    setUseCustomSize(false);
  };

  return (
    <div style={{ padding: '32px', border: '2px dashed #d1d5db', borderRadius: '12px', textAlign: 'center', backgroundColor: 'white' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📁</div>
        <p style={{ color: '#4b5563', marginBottom: '16px', fontSize: '16px' }}>选择图片并设置输出尺寸</p>
      </div>

      <div style={{ marginBottom: '24px', textAlign: 'left', maxWidth: '400px', margin: '0 auto 24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
          输出尺寸
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {PRESET_SIZES.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetSelect(preset.width, preset.height)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: !useCustomSize && targetWidth === preset.width && targetHeight === preset.height ? '#3b82f6' : '#f3f4f6',
                color: !useCustomSize && targetWidth === preset.width && targetHeight === preset.height ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setUseCustomSize(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: useCustomSize ? '#3b82f6' : '#f3f4f6',
              color: useCustomSize ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            自定义
          </button>
        </div>

        {useCustomSize && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', alignItems: 'center', justifyContent: 'center' }}>
            <input
              type="number"
              value={targetWidth}
              onChange={(e) => setTargetWidth(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
              min="1"
              max="200"
              style={{
                width: '70px',
                padding: '6px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                textAlign: 'center'
              }}
            />
            <span style={{ color: '#6b7280' }}>x</span>
            <input
              type="number"
              value={targetHeight}
              onChange={(e) => setTargetHeight(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
              min="1"
              max="200"
              style={{
                width: '70px',
                padding: '6px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                textAlign: 'center'
              }}
            />
          </div>
        )}
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: '12px 24px',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500'
        }}
      >
        选择图片
      </button>

      <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '12px' }}>
        支持 JPG, PNG, GIF, BMP 格式 | 输出: {targetWidth} x {targetHeight}
      </p>
    </div>
  );
};
