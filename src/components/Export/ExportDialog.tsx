import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { exportAsPng, exportAsSvg } from '../../utils/exportUtils';

export const ExportDialog: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const setWizardStep = useProjectStore((s) => s.setWizardStep);
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
    <div style={{
      padding: '32px',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      backgroundColor: 'white'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>导出图纸</h2>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
          导出格式
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setFormat('png')}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: format === 'png' ? '#3b82f6' : '#f3f4f6',
              color: format === 'png' ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            PNG 图片
          </button>
          <button
            onClick={() => setFormat('svg')}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: format === 'svg' ? '#3b82f6' : '#f3f4f6',
              color: format === 'svg' ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            SVG 矢量
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          <span style={{ fontSize: '14px', color: '#374151' }}>显示网格线</span>
        </label>
      </div>

      <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          图纸信息: {project.width} x {project.height} | {project.palette.length} 种颜色
        </div>
      </div>

      <button
        onClick={handleExport}
        style={{
          width: '100%',
          padding: '12px 24px',
          backgroundColor: '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500'
        }}
      >
        下载 {format.toUpperCase()}
      </button>

      <button
        onClick={() => setWizardStep('preview')}
        style={{
          width: '100%',
          padding: '12px 24px',
          backgroundColor: '#f3f4f6',
          color: '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          marginTop: '12px'
        }}
      >
        ← 返回编辑
      </button>
    </div>
  );
};
