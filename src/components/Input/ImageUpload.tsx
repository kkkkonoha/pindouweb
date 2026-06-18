import React, { useRef } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { pixelateImage, canvasToPixelGrid } from '../../utils/pixelate';
import { mapColorsToBeads } from '../../utils/colorMatch';
import { domesticBrand } from '../../data/domestic';

export const ImageUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setProject = useProjectStore((s) => s.setProject);
  const setWizardStep = useProjectStore((s) => s.setWizardStep);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = img.width;
      sourceCanvas.height = img.height;
      const ctx = sourceCanvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const targetSize = 29;
      const pixelated = pixelateImage(sourceCanvas, targetSize, targetSize);
      const pixelGrid = canvasToPixelGrid(pixelated);
      const { mappedGrid, palette } = mapColorsToBeads(pixelGrid, domesticBrand.colors);

      const pixels = mappedGrid.map(row =>
        row.map(hex => ({ color: hex }))
      );

      const paletteArray = Array.from(palette.entries()).map(([hex, { bead, count }]) => ({
        color: hex,
        beadCode: bead.code,
        beadName: bead.name,
        count
      }));

      setProject({
        id: crypto.randomUUID(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        width: targetSize,
        height: targetSize,
        pixels,
        palette: paletteArray,
        brand: 'domestic',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setWizardStep('preview');
    };

    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="p-8 border-2 border-dashed rounded-lg text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="mb-4">
        <span className="text-4xl">📁</span>
      </div>

      <p className="text-gray-600 mb-4">点击或拖拽图片到此处</p>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        选择图片
      </button>

      <p className="text-sm text-gray-400 mt-2">
        支持 JPG, PNG, GIF, BMP 格式
      </p>
    </div>
  );
};
