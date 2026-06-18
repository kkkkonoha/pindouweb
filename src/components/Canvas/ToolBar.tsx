import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';
import type { ToolType } from '../../types';

const tools: { type: ToolType; label: string; icon: string }[] = [
  { type: 'pencil', label: '铅笔', icon: '✏️' },
  { type: 'eraser', label: '橡皮', icon: '🧹' },
  { type: 'fill', label: '油漆桶', icon: '🪣' },
  { type: 'eyedropper', label: '取色器', icon: '💉' },
];

export const ToolBar: React.FC = () => {
  const currentTool = useCanvasStore((s) => s.currentTool);
  const currentColor = useCanvasStore((s) => s.currentColor);
  const setTool = useCanvasStore((s) => s.setTool);
  const setColor = useCanvasStore((s) => s.setColor);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setTool(tool.type)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: currentTool === tool.type ? '#3b82f6' : '#f3f4f6',
              color: currentTool === tool.type ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 8px' }} />

      <input
        type="color"
        value={currentColor}
        onChange={(e) => setColor(e.target.value)}
        style={{ width: '32px', height: '32px', padding: '2px', cursor: 'pointer' }}
      />

      <div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 8px' }} />

      <button
        onClick={() => useCanvasStore.getState().toggleGrid()}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: '#f3f4f6',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        网格
      </button>

      <div style={{ flex: 1 }} />

      <span style={{ fontSize: '13px', color: '#6b7280' }}>
        点击画布绘制 | 滚轮缩放
      </span>
    </div>
  );
};
