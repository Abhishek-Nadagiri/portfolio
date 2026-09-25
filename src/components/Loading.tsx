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
      },
    });

    // 1. Sleek gold accent line expansion (0.5s)
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }
    );

    // 2. Name character reveal (0.4s)
    tl.fromTo(
      nameRef.current,
      { opacity: 0, y: 10, letterSpacing: '0.25em' },
      { opacity: 1, y: 0, letterSpacing: '0.35em', duration: 0.4, ease: 'power3.out' },
      '-=0.2'
    );

    // 3. Smooth fast fade out with onStart triggering Hero immediately (0.25s)
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      delay: 0.1,
      onStart: () => {
        // Trigger Hero immediately when fade begins to eliminate any dead delay
        onComplete();
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0B0D] pointer-events-none"
      aria-hidden="true"
    >
      {/* Loading accent line */}
      <div className="w-44 h-[1.5px] mb-6 overflow-hidden">
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
