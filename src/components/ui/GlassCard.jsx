// src/components/ui/GlassCard.jsx

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
  ...props
}) {
  return (
    <div
      className={`
        backdrop-blur-xl bg-white/[0.03] 
        border border-white/[0.06] rounded-2xl
        ${hover ? 'hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500' : ''}
        ${glow ? 'shadow-[0_0_30px_rgba(108,99,255,0.1)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}