import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { ImageUpload } from '../Input/ImageUpload';
import { DrawingBoard } from '../Input/DrawingBoard';
import { TextPixelate } from '../Input/TextPixelate';

const inputOptions = [
  { type: 'image' as const, icon: '🖼️', title: '上传图片', desc: '将图片转换为像素画' },
  { type: 'draw' as const, icon: '✏️', title: '手绘画布', desc: '在画布上自由绘制' },
  { type: 'text' as const, icon: '📝', title: '文字像素化', desc: '将文字转换为像素画' },
];

export const InputStep: React.FC = () => {
  const inputType = useProjectStore((s) => s.inputType);
  const setInputType = useProjectStore((s) => s.setInputType);

  return (
    <div style={{ padding: '40px 32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>
          开始创作
        </h2>
        <p style={{ fontSize: '15px', color: '#6b7280' }}>选择一种方式，将你的创意变成拼豆图纸</p>
      </div>

      {!inputType && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {inputOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setInputType(opt.type)}
              style={{
                padding: '32px 20px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: 'white',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{opt.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{opt.title}</div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>{opt.desc}</div>
            </button>
          ))}
        </div>
      )}

      {inputType && (
        <div>
          <button
            onClick={() => setInputType(null)}
            style={{
              marginBottom: '20px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>←</span> 返回选择
          </button>
          {inputType === 'image' && <ImageUpload />}
          {inputType === 'draw' && <DrawingBoard />}
          {inputType === 'text' && <TextPixelate />}
        </div>
      )}
    </div>
  );
};
