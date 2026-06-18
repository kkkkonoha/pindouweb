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

export function canvasToPixelGrid(canvas: HTMLCanvasElement): string[][] {
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