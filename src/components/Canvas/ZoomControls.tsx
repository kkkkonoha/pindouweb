import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';

export const ZoomControls: React.FC = () => {
  const zoom = useCanvasStore((s) => s.zoom);
  const setZoom = useCanvasStore((s) => s.setZoom);
  const resetView = useCanvasStore((s) => s.resetView);

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-t">
      <button
        onClick={() => setZoom(zoom * 0.8)}
        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
      >
        -
      </button>

      <span className="text-sm w-16 text-center">
        {Math.round(zoom * 100)}%
      </span>

      <button
        onClick={() => setZoom(zoom * 1.25)}
        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
      >
        +
      </button>

      <button
        onClick={resetView}
        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
      >
        适应
      </button>
    </div>
  );
};
