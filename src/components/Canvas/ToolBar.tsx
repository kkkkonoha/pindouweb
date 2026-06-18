import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { ToolType } from '../../types';

const tools: { type: ToolType; label: string; icon: string; tip: string }[] = [
  { type: 'pencil', label: '画笔', icon: '✏️', tip: '绘制单个像素点' },
  { type: 'eraser', label: '橡皮', icon: '🧹', tip: '擦除像素点' },
  { type: 'fill', label: '填充', icon: '🪣', tip: '填充相同颜色区域' },
  { type: 'eyedropper', label: '取色', icon: '💉', tip: '拾取画布颜色' },
];

export const ToolBar: React.FC = () => {
  const currentTool = useCanvasStore((s) => s.currentTool);
  const currentColor = useCanvasStore((s) => s.currentColor);
  const setTool = useCanvasStore((s) => s.setTool);
  const setColor = useCanvasStore((s) => s.setColor);
  const isMobile = useIsMobile();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '6px' : '12px',
      padding: isMobile ? '8px 12px' : '10px 16px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      flexWrap: isMobile ? 'wrap' : 'nowrap'
    }}>
      <div style={{
        display: 'flex',
        gap: '4px',
        overflowX: isMobile ? 'auto' : 'visible',
        flexWrap: isMobile ? 'nowrap' : 'wrap',
        paddingBottom: isMobile ? '4px' : '0'
      }}>
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setTool(tool.type)}
            title={tool.tip}
            style={{
              padding: isMobile ? '8px 10px' : '6px 14px',
              borderRadius: '6px',
              border: '1px solid transparent',
              backgroundColor: currentTool === tool.type ? '#eff6ff' : 'transparent',
              color: currentTool === tool.type ? '#2563eb' : '#6b7280',
              cursor: 'pointer',
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: currentTool === tool.type ? '500' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              borderColor: currentTool === tool.type ? '#bfdbfe' : 'transparent',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <span>{tool.icon}</span>
            {!isMobile && <span>{tool.label}</span>}
          </button>
        ))}
      </div>

      {!isMobile && <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb' }} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: '28px', height: '28px', padding: '1px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #d1d5db' }}
        />
      </div>

      {!isMobile && <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb' }} />}

      <button
        onClick={() => useCanvasStore.getState().toggleGrid()}
        style={{
          padding: isMobile ? '6px 8px' : '6px 12px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: isMobile ? '12px' : '13px',
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <span>⊞</span>
        {!isMobile && <span>网格</span>}
      </button>

      <div style={{ flex: 1 }} />

      {!isMobile && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          点击绘制 | 滚轮缩放
        </div>
      )}
    </div>
  );
};
