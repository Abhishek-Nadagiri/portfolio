// src/components/ui/SkillBar.jsx

import { useCountUp } from '../../hooks/useCountUp'

export default function SkillBar({ name, level }) {
  const { count, ref } = useCountUp(level, 1500)

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-white/80 text-sm font-medium">{name}</span>
        <span className="text-white/40 text-xs font-mono">{count}%</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 
                     ease-out relative"
          style={{
            width: `${count}%`,
            background: `linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))`,
          }}
        >
          {/* Glow effect on bar tip */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 
                        rounded-full"
            style={{
              background: 'var(--accent-secondary)',
              boxShadow: '0 0 10px var(--accent-secondary), 0 0 20px var(--accent-secondary)',
            }}
          />
        </div>
      </div>
    </div>
  )
}