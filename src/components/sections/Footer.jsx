// src/components/sections/Footer.jsx

import { personal } from '../../data/personal'

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/[0.04] bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-white/20 text-sm">
          © {new Date().getFullYear()} {personal.name}. Built with React & ShaderGradient.
        </p>
        <div className="flex gap-6">
          <a
            href={personal.social.github}
            className="text-white/20 hover:text-white/60 text-sm transition-colors"
          >
            GitHub
          </a>
          <a
            href={personal.social.linkedin}
            className="text-white/20 hover:text-white/60 text-sm transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={personal.social.twitter}
            className="text-white/20 hover:text-white/60 text-sm transition-colors"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  )
}