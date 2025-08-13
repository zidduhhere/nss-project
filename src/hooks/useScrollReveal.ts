import { useEffect } from "react";

interface UseScrollRevealOptions {
  selector?: string;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  animationClassNames?: string[];
  initialClassNames?: string[];
}

export function useScrollReveal({
  selector = ".reveal-on-scroll",
  threshold = 0.15,
  rootMargin = "0px 0px -5% 0px",
  once = true,
  animationClassNames = ["opacity-100", "translate-y-0"],
  initialClassNames = [
    "opacity-0",
    "translate-y-6",
    "transition-all",
    "duration-700",
  ],
}: UseScrollRevealOptions = {}) {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(selector)
    );
    if (!elements.length) return;

    elements.forEach((el) => {
      initialClassNames.forEach((cls) => el.classList.add(cls));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animationClassNames.forEach((cls) =>
              entry.target.classList.add(cls)
            );
            if (once) observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [
    selector,
    threshold,
    rootMargin,
    once,
    animationClassNames,
    initialClassNames,
  ]);
}

export default useScrollReveal;
