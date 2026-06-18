import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { exportAsPng, exportAsSvg } from '../../utils/exportUtils';

export const ExportDialog: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const [showGrid, setShowGrid] = useState(false);
  const [format, setFormat] = useState<'png' | 'svg'>('png');

  if (!project) return null;

  const handleExport = () => {
    if (format === 'png') {
      exportAsPng(project, showGrid);
    } else {
      exportAsSvg(project, showGrid);
    }
  };

  return (
    <div className="p-8 border rounded-lg bg-white">
      <h2 className="text-xl font-bold mb-6">导出图纸</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">导出格式</label>
        <div className="flex gap-2">
          <button
            onClick={() => setFormat('png')}
            className={`px-4 py-2 rounded ${
              format === 'png' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            PNG
          </button>
          <button
            onClick={() => setFormat('svg')}
            className={`px-4 py-2 rounded ${
              format === 'svg' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            SVG
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
          />
          <span className="text-sm">显示网格线</span>
        </label>
      </div>

      <button
        onClick={handleExport}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        下载 {format.toUpperCase()}
      </button>
    </div>
  );
};