import React, { useRef, useEffect, useCallback } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useCanvasStore } from '../../stores/canvasStore';
import type { PixelData } from '../../types';

export const PixelCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const project = useProjectStore((s) => s.project);
  const updatePixels = useProjectStore((s) => s.updatePixels);

  const zoom = useCanvasStore((s) => s.zoom);
  const showGrid = useCanvasStore((s) => s.showGrid);
  const currentTool = useCanvasStore((s) => s.currentTool);
  const currentColor = useCanvasStore((s) => s.currentColor);
  const setZoom = useCanvasStore((s) => s.setZoom);

  const CELL_SIZE = 20;

  // Auto-fit zoom when project changes
  useEffect(() => {
    if (!project || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;

    const canvasWidth = project.width * CELL_SIZE;
    const canvasHeight = project.height * CELL_SIZE;

    const scaleX = containerWidth / canvasWidth;
    const scaleY = containerHeight / canvasHeight;
    const fitZoom = Math.min(scaleX, scaleY, 1);

    setZoom(fitZoom);
  }, [project, setZoom]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !project) return;

    const ctx = canvas.getContext('2d')!;
    const { width, height, pixels } = project;

    canvas.width = width * CELL_SIZE;
    canvas.height = height * CELL_SIZE;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixel = pixels[y]?.[x];
        if (pixel) {
          ctx.fillStyle = pixel.color;
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    if (showGrid) {
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 0.5;

      for (let x = 0; x <= width; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, height * CELL_SIZE);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(width * CELL_SIZE, y * CELL_SIZE);
        ctx.stroke();
      }
    }
  }, [project, showGrid]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, zoom * delta));
    setZoom(newZoom);
  }, [zoom, setZoom]);

  const getCellFromEvent = (e: React.MouseEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas || !project) return null;

    const rect = canvas.getBoundingClientRect();

    const canvasX = (e.clientX - rect.left) / zoom;
    const canvasY = (e.clientY - rect.top) / zoom;

    const x = Math.floor(canvasX / CELL_SIZE);
    const y = Math.floor(canvasY / CELL_SIZE);

    if (x >= 0 && x < project.width && y >= 0 && y < project.height) {
      return { x, y };
    }
    return null;
  };

  const handlePixelAction = useCallback((x: number, y: number) => {
    if (!project) return;

    const newPixels = project.pixels.map(row => [...row]);

    switch (currentTool) {
      case 'pencil':
        newPixels[y][x] = { color: currentColor };
        break;
      case 'eraser':
        newPixels[y][x] = { color: '#FFFFFF' };
        break;
      case 'fill':
        floodFill(newPixels, x, y, currentColor, project.width, project.height);
        break;
      case 'eyedropper':
        const pickedColor = newPixels[y][x].color;
        useCanvasStore.getState().setColor(pickedColor);
        break;
    }

    updatePixels(newPixels);
  }, [project, currentTool, currentColor, updatePixels]);

  const handleClick = (e: React.MouseEvent) => {
    const cell = getCellFromEvent(e);
    if (cell) {
      handlePixelAction(cell.x, cell.y);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#f8fafc'
      }}
      onWheel={handleWheel}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        minWidth: '100%',
        padding: '20px'
      }}>
        <canvas
          ref={canvasRef}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            borderRadius: '2px',
            flexShrink: 0
          }}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

function floodFill(
  pixels: PixelData[][],
  startX: number,
  startY: number,
  newColor: string,
  width: number,
  height: number
): void {
  const targetColor = pixels[startY][startX].color;
  if (targetColor === newColor) return;

  const stack: [number, number][] = [[startX, startY]];

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;

    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    if (pixels[y][x].color !== targetColor) continue;

    pixels[y][x] = { color: newColor };

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
}
