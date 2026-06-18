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
