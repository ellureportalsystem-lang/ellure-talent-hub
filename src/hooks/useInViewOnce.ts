import { useEffect, useRef, useState } from "react";

/** Fires once when the element enters the viewport (for scroll-triggered animations). */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.25,
  rootMargin = "0px 0px -8% 0px"
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}
