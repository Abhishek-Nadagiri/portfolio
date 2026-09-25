import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loading({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setVisible(false);
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    // 1. Sleek gold accent line expansion
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.65, ease: 'power2.inOut' }
    );

    // 2. Name character reveal
    tl.fromTo(
      nameRef.current,
      { opacity: 0, y: 15, letterSpacing: '0.25em' },
      { opacity: 1, y: 0, letterSpacing: '0.35em', duration: 0.55, ease: 'power3.out' },
      '-=0.25'
    );

    // 3. Subtle delay then smooth fade out
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.inOut',
      delay: 0.2,
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0B0D]"
      aria-hidden="true"
    >
      {/* Loading accent line */}
      <div className="w-44 h-[1.5px] mb-7 overflow-hidden">
        <div
          ref={lineRef}
          className="w-full h-full origin-left bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Name */}
      <div
        ref={nameRef}
        className="font-display text-lg sm:text-2xl font-semibold uppercase text-chrome-100 opacity-0 select-none"
        style={{ letterSpacing: '0.3em' }}
      >
        Abhishek Nadagiri
      </div>
    </div>
  );
}
