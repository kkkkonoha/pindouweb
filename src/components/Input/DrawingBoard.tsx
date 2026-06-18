import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { PixelData } from '../../types';

const PRESET_SIZES = [
  { label: '29×29', width: 29, height: 29 },
  { label: '29×58', width: 29, height: 58 },
  { label: '58×29', width: 58, height: 29 },
  { label: '58×58', width: 58, height: 58 },
  { label: '116×116', width: 116, height: 116 },
];

export const DrawingBoard: React.FC = () => {
  const [width, setWidth] = useState(29);
  const [height, setHeight] = useState(29);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [color, setColor] = useState('#000000');
  const setProject = useProjectStore((s) => s.setProject);
  const setWizardStep = useProjectStore((s) => s.setWizardStep);
  const isMobile = useIsMobile();

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
    <div style={{ padding: isMobile ? '16px' : '24px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
      <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', marginBottom: '16px' }}>手绘模式</h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
          画布尺寸
        </label>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {PRESET_SIZES.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetSelect(preset.width, preset.height)}
              style={{
                padding: isMobile ? '6px 10px' : '8px 14px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: !useCustomSize && width === preset.width && height === preset.height ? '#3b82f6' : '#f3f4f6',
                color: !useCustomSize && width === preset.width && height === preset.height ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: isMobile ? '12px' : '13px'
              }}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setUseCustomSize(true)}
            style={{
              padding: isMobile ? '6px 10px' : '8px 14px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: useCustomSize ? '#3b82f6' : '#f3f4f6',
              color: useCustomSize ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: isMobile ? '12px' : '13px'
            }}
          >
            自定义
          </button>
        </div>
      </div>

      {useCustomSize && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#6b7280' }}>宽度</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
              min="1"
              max="200"
              style={{ width: '70px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', textAlign: 'center' }}
            />
          </div>
          <span style={{ marginTop: '18px', color: '#9ca3af' }}>×</span>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#6b7280' }}>高度</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
              min="1"
              max="200"
              style={{ width: '70px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', textAlign: 'center' }}
            />
          </div>
          <span style={{ marginTop: '18px', fontSize: '12px', color: '#9ca3af' }}>
            {width * height} 像素
          </span>
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
          默认颜色
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: '40px', height: '40px', padding: '2px', cursor: 'pointer', borderRadius: '6px' }}
          />
          <span style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'monospace' }}>{color}</span>
        </div>
      </div>

      <button
        onClick={handleStart}
        style={{
          padding: isMobile ? '12px 16px' : '10px 20px',
          backgroundColor: '#111827',
          color: 'white',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          fontSize: isMobile ? '14px' : '14px',
          fontWeight: '500',
          width: isMobile ? '100%' : 'auto'
        }}
      >
        开始绘制 ({width}×{height})
      </button>
    </div>
  );
};
