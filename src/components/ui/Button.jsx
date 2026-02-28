// src/components/ui/Button.jsx

export default function Button({
  children,
  variant = 'primary',
  href,
  className = '',
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    px-7 py-3 rounded-xl text-sm font-semibold tracking-wide
    transition-all duration-300 cursor-pointer
  `

  const variants = {
    primary: `
      bg-white text-black hover:bg-white/90 
      hover:scale-105 active:scale-[0.98]
      shadow-[0_0_20px_rgba(255,255,255,0.1)]
    `,
    secondary: `
      border border-white/20 text-white backdrop-blur-sm
      hover:bg-white/10 hover:border-white/40
    `,
    ghost: `
      text-white/60 hover:text-white
    `,
    accent: `
      bg-[var(--accent-primary)] text-white
      hover:brightness-110 hover:scale-105 active:scale-[0.98]
      shadow-[0_0_20px_var(--glow)]
    `,
  }

  const classes = `${baseStyles} ${variants[variant]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}