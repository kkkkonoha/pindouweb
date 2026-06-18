import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { ImageUpload } from '../Input/ImageUpload';
import { DrawingBoard } from '../Input/DrawingBoard';

export const InputStep: React.FC = () => {
  const inputType = useProjectStore((s) => s.inputType);
  const setInputType = useProjectStore((s) => s.setInputType);

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>
        选择输入方式
      </h2>

      {!inputType && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <button
            onClick={() => setInputType('image')}
            style={{
              padding: '32px 24px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              backgroundColor: 'white',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🖼️</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>上传图片</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>将图片转换为像素画</div>
          </button>

          <button
            onClick={() => setInputType('draw')}
            style={{
              padding: '32px 24px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              backgroundColor: 'white',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✏️</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>手绘画布</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>在画布上自由绘制</div>
          </button>
        </div>
      )}

      {inputType === 'image' && (
        <div>
          <button
            onClick={() => setInputType(null)}
            style={{
              marginBottom: '16px',
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← 返回选择
          </button>
          <ImageUpload />
        </div>
      )}

      {inputType === 'draw' && (
        <div>
          <button
            onClick={() => setInputType(null)}
            style={{
              marginBottom: '16px',
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← 返回选择
          </button>
          <DrawingBoard />
        </div>
      )}
    </div>
  );
};
