import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { PixelCanvas } from '../Canvas/PixelCanvas';
import { ToolBar } from '../Canvas/ToolBar';
import { ZoomControls } from '../Canvas/ZoomControls';

export const PreviewStep: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const setWizardStep = useProjectStore((s) => s.setWizardStep);

  if (!project) return null;

  return (
    <div className="flex flex-col h-full">
      <ToolBar />

      <div className="flex-1 overflow-hidden">
        <PixelCanvas />
      </div>

      <ZoomControls />

      <div className="p-4 bg-white border-t">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setWizardStep('input')}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            返回
          </button>

          <div className="text-sm text-gray-500">
            {project.width} x {project.height} | {project.palette.length} 种颜色
          </div>

          <button
            onClick={() => setWizardStep('export')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            导出图纸
          </button>
        </div>
      </div>
    </div>
  );
};