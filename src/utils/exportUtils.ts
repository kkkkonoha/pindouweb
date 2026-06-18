import type { Project } from '../types';

export function exportAsPng(project: Project, showGrid: boolean = false): void {
  const canvas = document.createElement('canvas');
  const cellSize = 20;
  canvas.width = project.width * cellSize;
  canvas.height = project.height * cellSize;

  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < project.height; y++) {
    for (let x = 0; x < project.width; x++) {
      const pixel = project.pixels[y]?.[x];
      if (pixel) {
        ctx.fillStyle = pixel.color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

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