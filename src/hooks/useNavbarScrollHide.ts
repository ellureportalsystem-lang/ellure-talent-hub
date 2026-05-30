import { useEffect, useRef, useState } from "react";

/** Hides navbar when scrolling down; shows when scrolling up (after threshold). */
export function useNavbarScrollHide(threshold = 72, disabled = false) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (disabled) {
      setHidden(false);
      return;
    }

    const onScroll = () => {
      const y = window.scrollY;
      if (y <= threshold) {
        setHidden(false);
        lastY.current = y;
        return;
      }
      const scrollingDown = y > lastY.current;
      setHidden(scrollingDown);
      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, disabled]);

  return hidden;
}
