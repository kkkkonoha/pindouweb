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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <ToolBar />

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PixelCanvas />
      </div>

      <ZoomControls />

      <div style={{
        padding: '16px',
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setWizardStep('input')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← 返回
        </button>

        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          {project.width} x {project.height} | {project.palette.length} 种颜色 | {project.width * project.height} 像素
        </div>

        <button
          onClick={() => setWizardStep('export')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          导出图纸 →
        </button>
      </div>
    </div>
  );
};
