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
  let rn = r / 255;
  let gn = g / 255;
  let bn = b / 255;

  rn = rn > 0.04045 ? Math.pow((rn + 0.055) / 1.055, 2.4) : rn / 12.92;
  gn = gn > 0.04045 ? Math.pow((gn + 0.055) / 1.055, 2.4) : gn / 12.92;
  bn = bn > 0.04045 ? Math.pow((bn + 0.055) / 1.055, 2.4) : bn / 12.92;

  let x = rn * 0.4124564 + gn * 0.3575761 + bn * 0.1804375;
  let y = rn * 0.2126729 + gn * 0.7151522 + bn * 0.0721750;
  let z = rn * 0.0193339 + gn * 0.1191920 + bn * 0.9503041;

  const xn = 0.95047, yn = 1.0, zn = 1.08883;
  x /= xn; y /= yn; z /= zn;

  const f = (t: number) => t > 0.008856 ? Math.pow(t, 1/3) : 7.787 * t + 16/116;
  x = f(x);
  y = f(y);
  z = f(z);

  return [
    116 * y - 16,
    500 * (x - y),
    200 * (y - z)
  ];
}

export function labToRgb(l: number, a: number, b: number): [number, number, number] {
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  const xn = 95.047, yn = 100.0, zn = 108.883;

  x = Math.pow(x, 3) > 0.008856 ? Math.pow(x, 3) : (x - 16/116) / 7.787;
  y = Math.pow(y, 3) > 0.008856 ? Math.pow(y, 3) : (y - 16/116) / 7.787;
  z = Math.pow(z, 3) > 0.008856 ? Math.pow(z, 3) : (z - 16/116) / 7.787;

  x *= xn; y *= yn; z *= zn;

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
