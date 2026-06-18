import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';

export const ZoomControls: React.FC = () => {
  const zoom = useCanvasStore((s) => s.zoom);
  const setZoom = useCanvasStore((s) => s.setZoom);
  const resetView = useCanvasStore((s) => s.resetView);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      padding: '8px 16px',
      backgroundColor: 'white',
      borderTop: '1px solid #eaeaea'
    }}>
      <span style={{ fontSize: '12px', color: '#9ca3af', marginRight: '8px' }}>缩放</span>
      <button
        onClick={() => setZoom(zoom * 0.8)}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="缩小"
      >
        −
      </button>

      <span style={{ fontSize: '13px', color: '#374151', minWidth: '48px', textAlign: 'center', fontWeight: '500' }}>
        {Math.round(zoom * 100)}%
      </span>

      <button
        onClick={() => setZoom(zoom * 1.25)}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="放大"
      >
        +
      </button>

      <div style={{ width: '1px', height: '16px', backgroundColor: '#e5e7eb', margin: '0 6px' }} />

      <button
        onClick={resetView}
        style={{
          padding: '4px 10px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '12px',
          color: '#6b7280'
        }}
        title="重置缩放"
      >
        重置
      </button>
    </div>
  );
};
