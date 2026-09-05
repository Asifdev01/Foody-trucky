import React, { useEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";

/**
 * Animates a number counting up from 0 once it scrolls into view.
 * Reused across the landing page stats and the donor dashboard impact block.
 */
const CountUp = ({ end, duration = 1500, prefix = "", suffix = "", decimals = 0, variant = "h3", sx }) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(end * eased);
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <Typography ref={ref} variant={variant} sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, ...sx }}>
      {prefix}
      {value.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
      {suffix}
    </Typography>
  );
};

export default CountUp;
