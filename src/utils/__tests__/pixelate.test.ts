import { describe, it, expect, vi } from 'vitest';
import { pixelateImage } from '../pixelate';

function createMockCtx() {
  return {
    imageSmoothingEnabled: true,
    drawImage: vi.fn(),
    fillStyle: '',
    fillRect: vi.fn(),
    getImageData: vi.fn(),
    putImageData: vi.fn(),
  };
}

describe('pixelateImage', () => {
  it('should reduce image dimensions', () => {
    const mockCtx = createMockCtx();
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockCtx),
    };
    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') return mockCanvas as unknown as HTMLCanvasElement;
      return origCreateElement(tag);
    });

    try {
      const source = {
        width: 100,
        height: 100,
        getContext: vi.fn(() => createMockCtx()),
      } as unknown as HTMLCanvasElement;

      const result = pixelateImage(source, 10, 10);
      expect(result.width).toBe(10);
      expect(result.height).toBe(10);
      expect(mockCtx.drawImage).toHaveBeenCalled();
    } finally {
      vi.restoreAllMocks();
    }
  });
});