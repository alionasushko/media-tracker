import { useEffect, useState } from 'react';

export const useCountUp = (target: number, start: boolean, duration = 1100) => {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!start || target === 0) {
      setV(target);
      return;
    }

    const t0 = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);

  return v;
};
