import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';

export const ZoomControls: React.FC = () => {
  const zoom = useCanvasStore((s) => s.zoom);
  const setZoom = useCanvasStore((s) => s.setZoom);
  const resetView = useCanvasStore((s) => s.resetView);

  const buttonStyle = {
    padding: '4px 10px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb'
    }}>
      <button
        onClick={() => setZoom(zoom * 0.8)}
        style={buttonStyle}
      >
        -
      </button>

      <span style={{ fontSize: '14px', width: '60px', textAlign: 'center', color: '#374151' }}>
        {Math.round(zoom * 100)}%
      </span>

      <button
        onClick={() => setZoom(zoom * 1.25)}
        style={buttonStyle}
      >
        +
      </button>

      <button
        onClick={resetView}
        style={buttonStyle}
      >
        适应
      </button>
    </div>
  );
};
