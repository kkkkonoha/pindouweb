import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { ImageUpload } from '../Input/ImageUpload';
import { DrawingBoard } from '../Input/DrawingBoard';

export const InputStep: React.FC = () => {
  const inputType = useProjectStore((s) => s.inputType);
  const setInputType = useProjectStore((s) => s.setInputType);

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-6">选择输入方式</h2>

      {!inputType && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setInputType('image')}
            className="p-6 border-2 rounded-lg hover:border-blue-500 transition"
          >
            <span className="text-4xl block mb-2">🖼️</span>
            <span className="font-medium">上传图片</span>
          </button>

          <button
            onClick={() => setInputType('draw')}
            className="p-6 border-2 rounded-lg hover:border-blue-500 transition"
          >
            <span className="text-4xl block mb-2">✏️</span>
            <span className="font-medium">手绘画布</span>
          </button>

          <button
            onClick={() => setInputType('text')}
            className="p-6 border-2 rounded-lg hover:border-blue-500 transition"
          >
            <span className="text-4xl block mb-2">📝</span>
            <span className="font-medium">文字像素化</span>
          </button>
        </div>
      )}

      {inputType === 'image' && <ImageUpload />}
      {inputType === 'draw' && <DrawingBoard />}
      {inputType === 'text' && (
        <div className="p-8 border rounded-lg text-center text-gray-500">
          文字像素化功能开发中...
        </div>
      )}
    </div>
  );
};