import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import type { PixelData } from '../../types';

const PRESET_SIZES = [
  { label: '29 x 29', width: 29, height: 29 },
  { label: '29 x 58', width: 29, height: 58 },
  { label: '58 x 29', width: 58, height: 29 },
  { label: '58 x 58', width: 58, height: 58 },
  { label: '116 x 116', width: 116, height: 116 },
];

export const DrawingBoard: React.FC = () => {
  const [width, setWidth] = useState(29);
  const [height, setHeight] = useState(29);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [color, setColor] = useState('#000000');
  const setProject = useProjectStore((s) => s.setProject);
  const setWizardStep = useProjectStore((s) => s.setWizardStep);

  const handleStart = () => {
    const pixels: PixelData[][] = Array(height).fill(null).map(() =>
      Array(width).fill(null).map(() => ({ color: '#FFFFFF' }))
    );

    setProject({
      id: crypto.randomUUID(),
      name: '新图纸',
      width,
      height,
      pixels,
      palette: [],
      brand: 'domestic',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    setWizardStep('preview');
  };

  const handlePresetSelect = (presetWidth: number, presetHeight: number) => {
    setWidth(presetWidth);
    setHeight(presetHeight);
    setUseCustomSize(false);
  };

  return (
    <div style={{ padding: '24px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>手绘模式</h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          预设尺寸
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRESET_SIZES.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetSelect(preset.width, preset.height)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: !useCustomSize && width === preset.width && height === preset.height ? '#3b82f6' : '#f3f4f6',
                color: !useCustomSize && width === preset.width && height === preset.height ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setUseCustomSize(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: useCustomSize ? '#3b82f6' : '#f3f4f6',
              color: useCustomSize ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            自定义
          </button>
        </div>
      </div>

      {useCustomSize && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              宽度
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
              min="1"
              max="200"
              style={{
                width: '80px',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <span style={{ marginTop: '20px', color: '#6b7280' }}>x</span>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              高度
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
              min="1"
              max="200"
              style={{
                width: '80px',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <span style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
            ({width} x {height} = {width * height} 像素)
          </span>
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          默认颜色
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: '48px', height: '48px', padding: '2px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '14px', color: '#6b7280' }}>{color}</span>
        </div>
      </div>

      <button
        onClick={handleStart}
        style={{
          padding: '10px 20px',
          backgroundColor: '#22c55e',
          color: 'white',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        开始绘制 ({width} x {height})
      </button>
    </div>
  );
};
