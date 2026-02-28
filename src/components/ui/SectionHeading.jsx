// src/components/ui/SectionHeading.jsx

export default function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left'

  return (
    <div className={`${alignClass} mb-16`}>
      {eyebrow && (
        <p
          data-animate="up"
          className="text-[var(--accent-primary)] text-sm tracking-[0.3em] 
                     uppercase mb-3 font-medium"
        >
          {eyebrow}
        </p>
      )}
      <h2
        data-animate="up"
        data-delay="0.1"
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white 
                    leading-tight font-['Space_Grotesk']"
      >
        {title}
      </h2>
      {description && (
        <p
          data-animate="up"
          data-delay="0.2"
          className="text-[var(--text-secondary)] mt-4 max-w-xl mx-auto 
                     leading-relaxed"
        >
          {description}
        </p>
      )}
    </div>
  )
}