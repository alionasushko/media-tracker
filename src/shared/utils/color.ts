const parseHex = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

export const hexToRgba = (hex: string, alpha: number) => {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const mixHex = (a: string, b: string, weight: number) => {
  const A = parseHex(a);
  const B = parseHex(b);
  const r = Math.round(A[0] * weight + B[0] * (1 - weight));
  const g = Math.round(A[1] * weight + B[1] * (1 - weight));
  const bl = Math.round(A[2] * weight + B[2] * (1 - weight));
  return `rgb(${r}, ${g}, ${bl})`;
};
