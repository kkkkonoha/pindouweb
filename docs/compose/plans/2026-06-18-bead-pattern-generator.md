# 拼豆图纸生成器 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个纯前端Web应用，将图片转换为可编辑的拼豆图纸。

**Architecture:** React + TypeScript + Vite，使用Canvas API进行像素操作，Zustand管理状态，Tailwind CSS处理样式。

**Tech Stack:** React, TypeScript, Vite, Zustand, Tailwind CSS, Canvas API

---

## 阶段一：项目基础

### Task 1: 项目初始化

**Covers:** [S4]
**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

- [ ] **Step 1: 初始化Vite项目**

```bash
npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: 安装依赖**

```bash
npm install zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 3: 配置Tailwind**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 4: 配置CSS**

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5: 创建基础App组件**

```tsx
// src/App.tsx
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold p-4">拼豆图纸生成器</h1>
    </div>
  )
}

export default App
```

- [ ] **Step 6: 验证项目运行**

```bash
npm run dev
```

Expected: 浏览器打开 http://localhost:5173 显示标题

- [ ] **Step 7: 提交**

```bash
git add .
git commit -m "feat: initialize project with Vite + React + TypeScript + Tailwind"
```

---

### Task 2: 类型定义

**Covers:** [S6]
**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 创建核心类型定义**

```typescript
// src/types/index.ts

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
```

- [ ] **Step 2: 提交**

```bash
git add src/types/index.ts
git commit -m "feat: add core type definitions"
```

---

## 阶段二：核心算法

### Task 3: 色彩空间转换

**Covers:** [S2, S4]
**Files:**
- Create: `src/utils/colorConvert.ts`
- Create: `src/utils/__tests__/colorConvert.test.ts`

- [ ] **Step 1: 编写测试**

```typescript
// src/utils/__tests__/colorConvert.test.ts
import { describe, it, expect } from 'vitest';
import { rgbToLab, labToRgb, hexToRgb, rgbToHex } from '../colorConvert';

describe('colorConvert', () => {
  it('should convert hex to rgb', () => {
    expect(hexToRgb('#FF0000')).toEqual([255, 0, 0]);
    expect(hexToRgb('#00FF00')).toEqual([0, 255, 0]);
    expect(hexToRgb('#0000FF')).toEqual([0, 0, 255]);
  });

  it('should convert rgb to hex', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
    expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
  });

  it('should convert rgb to lab', () => {
    const lab = rgbToLab(255, 0, 0);
    expect(lab[0]).toBeGreaterThan(0);
    expect(lab[0]).toBeLessThanOrEqual(100);
  });
});
```

- [ ] **Step 2: 运行测试验证失败**

```bash
npm run test src/utils/__tests__/colorConvert.test.ts
```

Expected: FAIL - functions not defined

- [ ] **Step 3: 实现色彩转换**

```typescript
// src/utils/colorConvert.ts

export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  // RGB to XYZ
  let x = r / 255 * 100;
  let y = g / 255 * 100;
  let z = b / 255 * 100;

  // Apply gamma correction
  x = x > 0.04045 ? Math.pow((x + 0.055) / 1.055, 2.4) * 100 : x / 12.92 * 100;
  y = y > 0.04045 ? Math.pow((y + 0.055) / 1.055, 2.4) * 100 : y / 12.92 * 100;
  z = z > 0.04045 ? Math.pow((z + 0.055) / 1.055, 2.4) * 100 : z / 12.92 * 100;

  // XYZ to Lab
  const xn = 95.047, yn = 100.0, zn = 108.883;
  x /= xn; y /= yn; z /= zn;

  x = x > 0.008856 ? Math.pow(x, 1/3) : 7.787 * x + 16/116;
  y = y > 0.008856 ? Math.pow(y, 1/3) : 7.787 * y + 16/116;
  z = z > 0.008856 ? Math.pow(z, 1/3) : 7.787 * z + 16/116;

  return [
    116 * y - 16,
    500 * (x - y),
    200 * (y - z)
  ];
}

export function labToRgb(l: number, a: number, b: number): [number, number, number] {
  // Lab to XYZ
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  const xn = 95.047, yn = 100.0, zn = 108.883;

  x = Math.pow(x, 3) > 0.008856 ? Math.pow(x, 3) : (x - 16/116) / 7.787;
  y = Math.pow(y, 3) > 0.008856 ? Math.pow(y, 3) : (y - 16/116) / 7.787;
  z = Math.pow(z, 3) > 0.008856 ? Math.pow(z, 3) : (z - 16/116) / 7.787;

  x *= xn; y *= yn; z *= zn;

  // XYZ to RGB
  x /= 100; y /= 100; z /= 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let bVal = x * 0.0557 + y * -0.2040 + z * 1.0570;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1/2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1/2.4) - 0.055 : 12.92 * g;
  bVal = bVal > 0.0031308 ? 1.055 * Math.pow(bVal, 1/2.4) - 0.055 : 12.92 * bVal;

  return [
    Math.round(Math.max(0, Math.min(255, r * 255))),
    Math.round(Math.max(0, Math.min(255, g * 255))),
    Math.round(Math.max(0, Math.min(255, bVal * 255)))
  ];
}

export function deltaE2000(lab1: [number, number, number], lab2: [number, number, number]): number {
  const [l1, a1, b1] = lab1;
  const [l2, a2, b2] = lab2;

  const kL = 1, kC = 1, kH = 1;

  const c1 = Math.sqrt(a1 * a1 + b1 * b1);
  const c2 = Math.sqrt(a2 * a2 + b2 * b2);
  const cAvg = (c1 + c2) / 2;

  const cAvg7 = Math.pow(cAvg, 7);
  const g = 0.5 * (1 - Math.sqrt(cAvg7 / (cAvg7 + Math.pow(25, 7))));

  const a1p = a1 * (1 + g);
  const a2p = a2 * (1 + g);

  const c1p = Math.sqrt(a1p * a1p + b1 * b1);
  const c2p = Math.sqrt(a2p * a2p + b2 * b2);

  let h1p = Math.atan2(b1, a1p) * 180 / Math.PI;
  if (h1p < 0) h1p += 360;

  let h2p = Math.atan2(b2, a2p) * 180 / Math.PI;
  if (h2p < 0) h2p += 360;

  const dLp = l2 - l1;
  const dCp = c2p - c1p;

  let dhp;
  if (c1p * c2p === 0) {
    dhp = 0;
  } else if (Math.abs(h2p - h1p) <= 180) {
    dhp = h2p - h1p;
  } else if (h2p - h1p > 180) {
    dhp = h2p - h1p - 360;
  } else {
    dhp = h2p - h1p + 360;
  }

  const dHp = 2 * Math.sqrt(c1p * c2p) * Math.sin(dhp * Math.PI / 360);

  const LpAvg = (l1 + l2) / 2;
  const CpAvg = (c1p + c2p) / 2;

  let HpAvg;
  if (c1p * c2p === 0) {
    HpAvg = h1p + h2p;
  } else if (Math.abs(h1p - h2p) <= 180) {
    HpAvg = (h1p + h2p) / 2;
  } else if (h1p + h2p < 360) {
    HpAvg = (h1p + h2p + 360) / 2;
  } else {
    HpAvg = (h1p + h2p - 360) / 2;
  }

  const T = 1 - 0.17 * Math.cos((HpAvg - 30) * Math.PI / 180) + 0.24 * Math.cos(2 * HpAvg * Math.PI / 180);
  const SL = 1 + 0.015 * Math.pow(LpAvg - 50, 2) / Math.sqrt(20 + Math.pow(LpAvg - 50, 2));
  const SC = 1 + 0.045 * CpAvg;
  const SH = 1 + 0.015 * CpAvg * T;

  const CpAvg7 = Math.pow(CpAvg, 7);
  const RT = -2 * Math.sqrt(CpAvg7 / (CpAvg7 + Math.pow(25, 7)))
    * Math.sin(60 * Math.exp(-Math.pow((HpAvg - 275) / 25, 2)) * Math.PI / 180);

  return Math.sqrt(
    Math.pow(dLp / (kL * SL), 2) +
    Math.pow(dCp / (kC * SC), 2) +
    Math.pow(dHp / (kH * SH), 2) +
    RT * (dCp / (kC * SC)) * (dHp / (kH * SH))
  );
}
```

- [ ] **Step 4: 运行测试验证通过**

```bash
npm run test src/utils/__tests__/colorConvert.test.ts
```

Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/utils/colorConvert.ts src/utils/__tests__/colorConvert.test.ts
git commit -m "feat: add color space conversion utilities with CIEDE2000"
```

---

### Task 4: 像素化算法

**Covers:** [S2, S4]
**Files:**
- Create: `src/utils/pixelate.ts`
- Create: `src/utils/__tests__/pixelate.test.ts`

- [ ] **Step 1: 编写测试**

```typescript
// src/utils/__tests__/pixelate.test.ts
import { describe, it, expect } from 'vitest';
import { pixelateImage } from '../pixelate';

describe('pixelateImage', () => {
  it('should reduce image dimensions', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 100, 100);

    const result = pixelateImage(canvas, 10, 10);
    expect(result.width).toBe(10);
    expect(result.height).toBe(10);
  });
});
```

- [ ] **Step 2: 运行测试验证失败**

```bash
npm run test src/utils/__tests__/pixelate.test.ts
```

Expected: FAIL

- [ ] **Step 3: 实现像素化算法**

```typescript
// src/utils/pixelate.ts

export function pixelateImage(
  source: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, 0, 0, targetWidth, targetHeight);

  return canvas;
}

export function getPixelData(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext('2d')!;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function setImageData(canvas: HTMLCanvasElement, data: ImageData): void {
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(data, 0, 0);
}

export function canvasToPixelGrid(
  canvas: HTMLCanvasElement
): string[][] {
  const data = getPixelData(canvas);
  const grid: string[][] = [];

  for (let y = 0; y < canvas.height; y++) {
    const row: string[] = [];
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const r = data.data[i];
      const g = data.data[i + 1];
      const b = data.data[i + 2];
      const hex = rgbToHex(r, g, b);
      row.push(hex);
    }
    grid.push(row);
  }

  return grid;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
```

- [ ] **Step 4: 运行测试验证通过**

```bash
npm run test src/utils/__tests__/pixelate.test.ts
```

Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/utils/pixelate.ts src/utils/__tests__/pixelate.test.ts
git commit -m "feat: add pixelation algorithm"
```

---

### Task 5: 颜色匹配

**Covers:** [S2, S3]
**Files:**
- Create: `src/utils/colorMatch.ts`
- Create: `src/data/domestic.ts`

- [ ] **Step 1: 创建国产拼豆颜色数据**

```typescript
// src/data/domestic.ts
import { Brand } from '../types';
import { rgbToLab } from '../utils/colorConvert';

const colors = [
  { code: 'D01', name: '本白', hex: '#FFFFFF' },
  { code: 'D02', name: '雪白', hex: '#F5F5F5' },
  { code: 'D03', name: '乳白', hex: '#FFF8DC' },
  { code: 'D04', name: '米白', hex: '#F5DEB3' },
  { code: 'D05', name: '浅黄', hex: '#FFFACD' },
  { code: 'D06', name: '柠檬黄', hex: '#FFF44F' },
  { code: 'D07', name: '中黄', hex: '#FFD700' },
  { code: 'D08', name: '橙黄', hex: '#FFA500' },
  { code: 'D09', name: '橙色', hex: '#FF8C00' },
  { code: 'D10', name: '橘红', hex: '#FF4500' },
  { code: 'D11', name: '大红', hex: '#FF0000' },
  { code: 'D12', name: '深红', hex: '#DC143C' },
  { code: 'D13', name: '玫红', hex: '#FF007F' },
  { code: 'D14', name: '粉色', hex: '#FFB6C1' },
  { code: 'D15', name: '浅粉', hex: '#FFF0F5' },
  { code: 'D16', name: '紫色', hex: '#800080' },
  { code: 'D17', name: '深紫', hex: '#4B0082' },
  { code: 'D18', name: '蓝紫', hex: '#6A5ACD' },
  { code: 'D19', name: '深蓝', hex: '#0000CD' },
  { code: 'D20', name: '蓝色', hex: '#0000FF' },
  { code: 'D21', name: '天蓝', hex: '#87CEEB' },
  { code: 'D22', name: '浅蓝', hex: '#ADD8E6' },
  { code: 'D23', name: '青色', hex: '#00CED1' },
  { code: 'D24', name: '湖蓝', hex: '#00BFFF' },
  { code: 'D25', name: '深绿', hex: '#006400' },
  { code: 'D26', name: '绿色', hex: '#008000' },
  { code: 'D27', name: '草绿', hex: '#7CFC00' },
  { code: 'D28', name: '浅绿', hex: '#90EE90' },
  { code: 'D29', name: '薄荷绿', hex: '#98FF98' },
  { code: 'D30', name: '棕色', hex: '#8B4513' },
  { code: 'D31', name: '深棕', hex: '#654321' },
  { code: 'D32', name: '咖啡', hex: '#6F4E37' },
  { code: 'D33', name: '卡其', hex: '#C3B091' },
  { code: 'D34', name: '肤色', hex: '#FFDAB9' },
  { code: 'D35', name: '浅肤色', hex: '#FFE4C4' },
  { code: 'D36', name: '灰色', hex: '#808080' },
  { code: 'D37', name: '深灰', hex: '#404040' },
  { code: 'D38', name: '浅灰', hex: '#C0C0C0' },
  { code: 'D39', name: '黑色', hex: '#000000' },
  { code: 'D40', name: '透明', hex: '#FFFFFF' },
].map(c => ({
  ...c,
  rgb: hexToRgb(c.hex) as [number, number, number],
  lab: rgbToLab(...hexToRgb(c.hex) as [number, number, number])
}));

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];
}

export const domesticBrand: Brand = {
  id: 'domestic',
  name: '国产拼豆',
  colors
};
```

- [ ] **Step 2: 实现颜色匹配**

```typescript
// src/utils/colorMatch.ts
import { BrandColor } from '../types';
import { hexToRgb, rgbToLab, deltaE2000 } from './colorConvert';

export function findClosestBead(
  targetHex: string,
  brandColors: BrandColor[]
): BrandColor {
  const targetRgb = hexToRgb(targetHex);
  const targetLab = rgbToLab(...targetRgb);

  let closest = brandColors[0];
  let minDelta = Infinity;

  for (const bead of brandColors) {
    const delta = deltaE2000(targetLab, bead.lab);
    if (delta < minDelta) {
      minDelta = delta;
      closest = bead;
    }
  }

  return closest;
}

export function mapColorsToBeads(
  pixelGrid: string[][],
  brandColors: BrandColor[]
): { mappedGrid: string[][]; palette: Map<string, { bead: BrandColor; count: number }> } {
  const palette = new Map<string, { bead: BrandColor; count: number }>();
  const mappedGrid: string[][] = [];

  for (const row of pixelGrid) {
    const mappedRow: string[] = [];
    for (const hex of row) {
      const bead = findClosestBead(hex, brandColors);
      mappedRow.push(bead.hex);

      const existing = palette.get(bead.hex);
      if (existing) {
        existing.count++;
      } else {
        palette.set(bead.hex, { bead, count: 1 });
      }
    }
    mappedGrid.push(mappedRow);
  }

  return { mappedGrid, palette };
}
```

- [ ] **Step 3: 提交**

```bash
git add src/utils/colorMatch.ts src/data/domestic.ts
git commit -m "feat: add color matching with domestic bead brand data"
```

---

## 阶段三：状态管理

### Task 6: Zustand Store

**Covers:** [S3, S6]
**Files:**
- Create: `src/stores/projectStore.ts`
- Create: `src/stores/canvasStore.ts`

- [ ] **Step 1: 创建项目Store**

```typescript
// src/stores/projectStore.ts
import { create } from 'zustand';
import { Project, PixelData, PaletteColor, WizardStep, InputType } from '../types';

interface ProjectState {
  project: Project | null;
  wizardStep: WizardStep;
  inputType: InputType | null;
  history: PixelData[][][];
  historyIndex: number;

  setProject: (project: Project) => void;
  updatePixels: (pixels: PixelData[][]) => void;
  setWizardStep: (step: WizardStep) => void;
  setInputType: (type: InputType) => void;
  undo: () => void;
  redo: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,
  wizardStep: 'input',
  inputType: null,
  history: [],
  historyIndex: -1,

  setProject: (project) => set({ project, history: [project.pixels], historyIndex: 0 }),

  updatePixels: (pixels) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(pixels);

    set((state) => ({
      project: state.project ? { ...state.project, pixels, updatedAt: new Date() } : null,
      history: newHistory,
      historyIndex: newHistory.length - 1
    }));
  },

  setWizardStep: (step) => set({ wizardStep: step }),

  setInputType: (type) => set({ inputType: type }),

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set((state) => ({
        project: state.project ? { ...state.project, pixels: history[newIndex] } : null,
        historyIndex: newIndex
      }));
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set((state) => ({
        project: state.project ? { ...state.project, pixels: history[newIndex] } : null,
        historyIndex: newIndex
      }));
    }
  }
}));
```

- [ ] **Step 2: 创建画布Store**

```typescript
// src/stores/canvasStore.ts
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
```

- [ ] **Step 3: 提交**

```bash
git add src/stores/projectStore.ts src/stores/canvasStore.ts
git commit -m "feat: add Zustand stores for project and canvas state"
```

---

## 阶段四：画布引擎

### Task 7: 像素画布组件

**Covers:** [S2, S3]
**Files:**
- Create: `src/components/Canvas/PixelCanvas.tsx`

- [ ] **Step 1: 创建PixelCanvas组件**

```tsx
// src/components/Canvas/PixelCanvas.tsx
import React, { useRef, useEffect, useCallback } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useCanvasStore } from '../../stores/canvasStore';
import { PixelData } from '../../types';

export const PixelCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const project = useProjectStore((s) => s.project);
  const updatePixels = useProjectStore((s) => s.updatePixels);

  const zoom = useCanvasStore((s) => s.zoom);
  const panX = useCanvasStore((s) => s.panX);
  const panY = useCanvasStore((s) => s.panY);
  const showGrid = useCanvasStore((s) => s.showGrid);
  const currentTool = useCanvasStore((s) => s.currentTool);
  const currentColor = useCanvasStore((s) => s.currentColor);
  const setZoom = useCanvasStore((s) => s.setZoom);

  const CELL_SIZE = 20;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !project) return;

    const ctx = canvas.getContext('2d')!;
    const { width, height, pixels } = project;

    canvas.width = width * CELL_SIZE;
    canvas.height = height * CELL_SIZE;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pixels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixel = pixels[y]?.[x];
        if (pixel) {
          ctx.fillStyle = pixel.color;
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#ccc';
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
    setZoom(zoom * delta);
  }, [zoom, setZoom]);

  const getCellFromEvent = (e: React.MouseEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas || !project) return null;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

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
      className="overflow-auto bg-gray-200 flex-1"
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        className="cursor-crosshair"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left'
        }}
        onClick={handleClick}
      />
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
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Canvas/PixelCanvas.tsx
git commit -m "feat: add PixelCanvas component with drawing tools"
```

---

### Task 8: 工具栏组件

**Covers:** [S2, S3]
**Files:**
- Create: `src/components/Canvas/ToolBar.tsx`
- Create: `src/components/Canvas/ZoomControls.tsx`

- [ ] **Step 1: 创建ToolBar组件**

```tsx
// src/components/Canvas/ToolBar.tsx
import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';
import { ToolType } from '../../types';

const tools: { type: ToolType; label: string; icon: string }[] = [
  { type: 'pencil', label: '铅笔', icon: '✏️' },
  { type: 'eraser', label: '橡皮', icon: '🧹' },
  { type: 'fill', label: '油漆桶', icon: '🪣' },
  { type: 'eyedropper', label: '取色器', icon: '💉' },
];

export const ToolBar: React.FC = () => {
  const currentTool = useCanvasStore((s) => s.currentTool);
  const currentColor = useCanvasStore((s) => s.currentColor);
  const setTool = useCanvasStore((s) => s.setTool);
  const setColor = useCanvasStore((s) => s.setColor);

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <div className="flex gap-1">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setTool(tool.type)}
            className={`px-3 py-2 rounded ${
              currentTool === tool.type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <input
        type="color"
        value={currentColor}
        onChange={(e) => setColor(e.target.value)}
        className="w-8 h-8 cursor-pointer"
      />

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <button
        onClick={() => useCanvasStore.getState().toggleGrid()}
        className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
      >
        网格
      </button>
    </div>
  );
};
```

- [ ] **Step 2: 创建ZoomControls组件**

```tsx
// src/components/Canvas/ZoomControls.tsx
import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';

export const ZoomControls: React.FC = () => {
  const zoom = useCanvasStore((s) => s.zoom);
  const setZoom = useCanvasStore((s) => s.setZoom);
  const resetView = useCanvasStore((s) => s.resetView);

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-t">
      <button
        onClick={() => setZoom(zoom * 0.8)}
        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
      >
        -
      </button>

      <span className="text-sm w-16 text-center">
        {Math.round(zoom * 100)}%
      </span>

      <button
        onClick={() => setZoom(zoom * 1.25)}
        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
      >
        +
      </button>

      <button
        onClick={resetView}
        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
      >
        适应
      </button>
    </div>
  );
};
```

- [ ] **Step 3: 提交**

```bash
git add src/components/Canvas/ToolBar.tsx src/components/Canvas/ZoomControls.tsx
git commit -m "feat: add ToolBar and ZoomControls components"
```

---

## 阶段五：输入模块

### Task 9: 图片上传组件

**Covers:** [S2]
**Files:**
- Create: `src/components/Input/ImageUpload.tsx`

- [ ] **Step 1: 创建ImageUpload组件**

```tsx
// src/components/Input/ImageUpload.tsx
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
      // 创建源canvas
      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = img.width;
      sourceCanvas.height = img.height;
      const ctx = sourceCanvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      // 像素化
      const targetSize = 29; // 默认29x29
      const pixelated = pixelateImage(sourceCanvas, targetSize, targetSize);

      // 获取像素网格
      const pixelGrid = canvasToPixelGrid(pixelated);

      // 颜色匹配
      const { mappedGrid, palette } = mapColorsToBeads(pixelGrid, domesticBrand.colors);

      // 转换为PixelData
      const pixels = mappedGrid.map(row =>
        row.map(hex => ({ color: hex }))
      );

      // 构建palette数组
      const paletteArray = Array.from(palette.entries()).map(([hex, { bead, count }]) => ({
        color: hex,
        beadCode: bead.code,
        beadName: bead.name,
        count
      }));

      // 创建项目
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
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Input/ImageUpload.tsx
git commit -m "feat: add ImageUpload component with pixelation"
```

---

### Task 10: 手绘画布组件

**Covers:** [S2]
**Files:**
- Create: `src/components/Input/DrawingBoard.tsx`

- [ ] **Step 1: 创建DrawingBoard组件**

```tsx
// src/components/Input/DrawingBoard.tsx
import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { PixelData } from '../../types';

const GRID_SIZES = [
  { label: '29 x 29', value: 29 },
  { label: '58 x 58', value: 58 },
  { label: '116 x 116', value: 116 },
];

export const DrawingBoard: React.FC = () => {
  const [gridSize, setGridSize] = useState(29);
  const [color, setColor] = useState('#000000');
  const setProject = useProjectStore((s) => s.setProject);
  const setWizardStep = useProjectStore((s) => s.setWizardStep);

  const handleStart = () => {
    const pixels: PixelData[][] = Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => ({ color: '#FFFFFF' }))
    );

    setProject({
      id: crypto.randomUUID(),
      name: '新图纸',
      width: gridSize,
      height: gridSize,
      pixels,
      palette: [],
      brand: 'domestic',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    setWizardStep('preview');
  };

  return (
    <div className="p-8 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">手绘模式</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">选择网格大小</label>
        <div className="flex gap-2">
          {GRID_SIZES.map((size) => (
            <button
              key={size.value}
              onClick={() => setGridSize(size.value)}
              className={`px-4 py-2 rounded ${
                gridSize === size.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">默认颜色</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12"
        />
      </div>

      <button
        onClick={handleStart}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        开始绘制
      </button>
    </div>
  );
};
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Input/DrawingBoard.tsx
git commit -m "feat: add DrawingBoard component"
```

---

### Task 11: 向导组件

**Covers:** [S3]
**Files:**
- Create: `src/components/Wizard/StepIndicator.tsx`
- Create: `src/components/Wizard/InputStep.tsx`
- Create: `src/components/Wizard/PreviewStep.tsx`

- [ ] **Step 1: 创建StepIndicator组件**

```tsx
// src/components/Wizard/StepIndicator.tsx
import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { WizardStep } from '../../types';

const steps: { key: WizardStep; label: string }[] = [
  { key: 'input', label: '选择输入' },
  { key: 'settings', label: '参数设置' },
  { key: 'preview', label: '预览调整' },
  { key: 'export', label: '导出' },
];

export const StepIndicator: React.FC = () => {
  const currentStep = useProjectStore((s) => s.wizardStep);

  return (
    <div className="flex items-center justify-center py-4 bg-white border-b">
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step.key
                  ? 'bg-blue-500 text-white'
                  : steps.findIndex(s => s.key === currentStep) > index
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {steps.findIndex(s => s.key === currentStep) > index ? '✓' : index + 1}
            </div>
            <span className="ml-2 text-sm">{step.label}</span>
          </div>

          {index < steps.length - 1 && (
            <div className="w-12 h-0.5 bg-gray-200 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
```

- [ ] **Step 2: 创建InputStep组件**

```tsx
// src/components/Wizard/InputStep.tsx
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
```

- [ ] **Step 3: 创建PreviewStep组件**

```tsx
// src/components/Wizard/PreviewStep.tsx
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
    <div className="flex flex-col h-full">
      <ToolBar />

      <div className="flex-1 overflow-hidden">
        <PixelCanvas />
      </div>

      <ZoomControls />

      <div className="p-4 bg-white border-t">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setWizardStep('input')}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            返回
          </button>

          <div className="text-sm text-gray-500">
            {project.width} x {project.height} | {project.palette.length} 种颜色
          </div>

          <button
            onClick={() => setWizardStep('export')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            导出图纸
          </button>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 4: 提交**

```bash
git add src/components/Wizard/
git commit -m "feat: add Wizard components (StepIndicator, InputStep, PreviewStep)"
```

---

## 阶段六：导出功能

### Task 12: PNG导出

**Covers:** [S2]
**Files:**
- Create: `src/utils/exportUtils.ts`
- Create: `src/components/Export/ExportDialog.tsx`

- [ ] **Step 1: 创建导出工具**

```typescript
// src/utils/exportUtils.ts
import { Project } from '../types';

export function exportAsPng(project: Project, showGrid: boolean = false): void {
  const canvas = document.createElement('canvas');
  const cellSize = 20;
  canvas.width = project.width * cellSize;
  canvas.height = project.height * cellSize;

  const ctx = canvas.getContext('2d')!;

  // 白色背景
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制像素
  for (let y = 0; y < project.height; y++) {
    for (let x = 0; x < project.width; x++) {
      const pixel = project.pixels[y]?.[x];
      if (pixel) {
        ctx.fillStyle = pixel.color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // 绘制网格
  if (showGrid) {
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= project.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, project.height * cellSize);
      ctx.stroke();
    }

    for (let y = 0; y <= project.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(project.width * cellSize, y * cellSize);
      ctx.stroke();
    }
  }

  // 下载
  const link = document.createElement('a');
  link.download = `${project.name}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function exportAsSvg(project: Project, showGrid: boolean = false): void {
  const cellSize = 20;
  const width = project.width * cellSize;
  const height = project.height * cellSize;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
  svg += `<rect width="${width}" height="${height}" fill="white"/>`;

  for (let y = 0; y < project.height; y++) {
    for (let x = 0; x < project.width; x++) {
      const pixel = project.pixels[y]?.[x];
      if (pixel) {
        svg += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${pixel.color}"/>`;
      }
    }
  }

  if (showGrid) {
    svg += `<g stroke="#CCCCCC" stroke-width="0.5">`;
    for (let x = 0; x <= project.width; x++) {
      svg += `<line x1="${x * cellSize}" y1="0" x2="${x * cellSize}" y2="${height}"/>`;
    }
    for (let y = 0; y <= project.height; y++) {
      svg += `<line x1="0" y1="${y * cellSize}" x2="${width}" y2="${y * cellSize}"/>`;
    }
    svg += `</g>`;
  }

  svg += `</svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const link = document.createElement('a');
  link.download = `${project.name}.svg`;
  link.href = URL.createObjectURL(blob);
  link.click();
}
```

- [ ] **Step 2: 创建ExportDialog组件**

```tsx
// src/components/Export/ExportDialog.tsx
import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { exportAsPng, exportAsSvg } from '../../utils/exportUtils';

export const ExportDialog: React.FC = () => {
  const project = useProjectStore((s) => s.project);
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
    <div className="p-8 border rounded-lg bg-white">
      <h2 className="text-xl font-bold mb-6">导出图纸</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">导出格式</label>
        <div className="flex gap-2">
          <button
            onClick={() => setFormat('png')}
            className={`px-4 py-2 rounded ${
              format === 'png' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            PNG
          </button>
          <button
            onClick={() => setFormat('svg')}
            className={`px-4 py-2 rounded ${
              format === 'svg' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            SVG
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
          />
          <span className="text-sm">显示网格线</span>
        </label>
      </div>

      <button
        onClick={handleExport}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        下载 {format.toUpperCase()}
      </button>
    </div>
  );
};
```

- [ ] **Step 3: 提交**

```bash
git add src/utils/exportUtils.ts src/components/Export/ExportDialog.tsx
git commit -m "feat: add PNG and SVG export functionality"
```

---

## 阶段七：整合

### Task 13: App主组件

**Covers:** [S3]
**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 整合所有组件**

```tsx
// src/App.tsx
import { useProjectStore } from './stores/projectStore';
import { StepIndicator } from './components/Wizard/StepIndicator';
import { InputStep } from './components/Wizard/InputStep';
import { PreviewStep } from './components/Wizard/PreviewStep';
import { ExportDialog } from './components/Export/ExportDialog';

function App() {
  const wizardStep = useProjectStore((s) => s.wizardStep);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">拼豆图纸生成器</h1>
      </header>

      <StepIndicator />

      <main className="flex-1 overflow-hidden">
        {wizardStep === 'input' && <InputStep />}
        {wizardStep === 'preview' && <PreviewStep />}
        {wizardStep === 'export' && (
          <div className="p-8 max-w-md mx-auto">
            <ExportDialog />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
```

- [ ] **Step 2: 提交**

```bash
git add src/App.tsx
git commit -m "feat: integrate all components into App"
```

---

### Task 14: 最终验证

**Covers:** [S7, S8]
**Files:** 无

- [ ] **Step 1: 运行开发服务器**

```bash
npm run dev
```

- [ ] **Step 2: 测试完整流程**

1. 上传图片 → 生成像素画 → 导出PNG
2. 手绘模式 → 绘制 → 导出SVG

- [ ] **Step 3: 运行测试**

```bash
npm run test
```

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "chore: final integration and verification"
```

---

## 计划总结

| 阶段 | 任务数 | 主要内容 |
|------|--------|----------|
| 一 | 2 | 项目初始化、类型定义 |
| 二 | 3 | 色彩转换、像素化、颜色匹配 |
| 三 | 2 | 状态管理 |
| 四 | 2 | 画布引擎、工具栏 |
| 五 | 3 | 图片上传、手绘、向导 |
| 六 | 1 | 导出功能 |
| 七 | 2 | 整合、验证 |
| **总计** | **15** | **MVP完成** |

---

## 执行方式

请选择执行方式：<tool_call>
<function=question>
<parameter=questions>[{"header": "Execution", "question": "Plan saved. How would you like to execute it?", "options": [{"label": "Subagent, always", "description": "Fresh subagent per task — remember for future sessions"}, {"label": "Subagent, this time", "description": "Fresh subagent per task — just this once"}, {"label": "Inline, always", "description": "Execute in this session — remember for future sessions"}, {"label": "Inline, this time", "description": "Execute in this session — just this once"}]}]