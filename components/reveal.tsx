"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes } from "react";

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  delay?: number;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  style,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.2,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-visible={visible}
      style={{
        ...(style as CSSProperties),
        transitionDelay: `${delay}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
