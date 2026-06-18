import { create } from 'zustand';
import { ToolType } from '../types';

interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  currentTool: ToolType;
  currentColor: string;

  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  toggleGrid: () => void;
  setTool: (tool: ToolType) => void;
  setColor: (color: string) => void;
  resetView: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  zoom: 1,
  panX: 0,
  panY: 0,
  showGrid: true,
  currentTool: 'pencil',
  currentColor: '#000000',

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
  setPan: (panX, panY) => set({ panX, panY }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  setTool: (tool) => set({ currentTool: tool }),
  setColor: (color) => set({ currentColor: color }),
  resetView: () => set({ zoom: 1, panX: 0, panY: 0 })
}));
