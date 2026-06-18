// 像素数据
export interface PixelData {
  color: string;           // HEX颜色值
  beadCode?: string;       // 拼豆色号
}

// 调色板颜色
export interface PaletteColor {
  color: string;           // HEX颜色值
  beadCode: string;        // 拼豆色号
  beadName: string;        // 拼豆名称
  count: number;           // 使用数量
}

// 项目数据
export interface Project {
  id: string;
  name: string;
  width: number;
  height: number;
  pixels: PixelData[][];
  palette: PaletteColor[];
  brand: string;
  createdAt: Date;
  updatedAt: Date;
}

// 品牌颜色
export interface BrandColor {
  code: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
  lab: [number, number, number];
}

// 品牌数据
export interface Brand {
  id: string;
  name: string;
  colors: BrandColor[];
}

// 绘图工具
export type ToolType = 'pencil' | 'eraser' | 'fill' | 'eyedropper' | 'select';

// 画布状态
export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
}

// 历史记录
export interface HistoryEntry {
  pixels: PixelData[][];
  timestamp: number;
}

// 导出选项
export interface ExportOptions {
  format: 'png' | 'pdf' | 'svg';
  showGrid: boolean;
  showColorTable: boolean;
  template?: string;
}

// 向导步骤
export type WizardStep = 'input' | 'settings' | 'preview' | 'export';

// 输入类型
export type InputType = 'image' | 'text' | 'draw';
