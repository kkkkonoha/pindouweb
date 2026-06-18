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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <ToolBar />

      <div style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <PixelCanvas />
      </div>

      <ZoomControls />

      <div style={{
        padding: '12px 20px',
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
            backgroundColor: 'transparent',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>←</span> 返回选择
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '13px',
          color: '#6b7280'
        }}>
          <span style={{ padding: '4px 10px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
            {project.width} × {project.height}
          </span>
          <span style={{ padding: '4px 10px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
            {project.palette.length} 种颜色
          </span>
          <span style={{ padding: '4px 10px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
            {project.width * project.height} 像素
          </span>
        </div>

        <button
          onClick={() => setWizardStep('export')}
          style={{
            padding: '8px 20px',
            backgroundColor: '#111827',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          导出图纸 <span>→</span>
        </button>
      </div>
    </div>
  );
};
