import { useEffect, useState } from "react";

const LG_BREAKPOINT = 1024;

/** True when viewport is laptop/desktop (lg breakpoint). */
export function useIsLgUp() {
  const [isLgUp, setIsLgUp] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= LG_BREAKPOINT : true
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);
    const onChange = () => setIsLgUp(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isLgUp;
}
