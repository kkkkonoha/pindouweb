import type { BrandColor } from '../types';
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