import { Brand } from '../types';
import { rgbToLab, hexToRgb } from '../utils/colorConvert';

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

export const domesticBrand: Brand = {
  id: 'domestic',
  name: '国产拼豆',
  colors
};