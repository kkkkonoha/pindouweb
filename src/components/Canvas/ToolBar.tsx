import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';
import { ToolType } from '../../types';

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
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <div className="flex gap-1">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setTool(tool.type)}
            className={`px-3 py-2 rounded ${
              currentTool === tool.type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <input
        type="color"
        value={currentColor}
        onChange={(e) => setColor(e.target.value)}
        className="w-8 h-8 cursor-pointer"
      />

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <button
        onClick={() => useCanvasStore.getState().toggleGrid()}
        className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
      >
        网格
      </button>
    </div>
  );
};
