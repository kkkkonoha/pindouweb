import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { PixelData } from '../../types';

const GRID_SIZES = [
  { label: '29 x 29', value: 29 },
  { label: '58 x 58', value: 58 },
  { label: '116 x 116', value: 116 },
];

export const DrawingBoard: React.FC = () => {
  const [gridSize, setGridSize] = useState(29);
  const [color, setColor] = useState('#000000');
  const setProject = useProjectStore((s) => s.setProject);
  const setWizardStep = useProjectStore((s) => s.setWizardStep);

  const handleStart = () => {
    const pixels: PixelData[][] = Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => ({ color: '#FFFFFF' }))
    );

    setProject({
      id: crypto.randomUUID(),
      name: '新图纸',
      width: gridSize,
      height: gridSize,
      pixels,
      palette: [],
      brand: 'domestic',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    setWizardStep('preview');
  };

  return (
    <div className="p-8 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">手绘模式</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">选择网格大小</label>
        <div className="flex gap-2">
          {GRID_SIZES.map((size) => (
            <button
              key={size.value}
              onClick={() => setGridSize(size.value)}
              className={`px-4 py-2 rounded ${
                gridSize === size.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">默认颜色</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12"
        />
      </div>

      <button
        onClick={handleStart}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        开始绘制
      </button>
    </div>
  );
};
