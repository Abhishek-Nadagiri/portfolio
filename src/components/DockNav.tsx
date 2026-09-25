import { useRef, useState, useCallback } from 'react';
import {
  Home, User, FolderKanban, Sparkles, Briefcase,
  Award, Github, PenLine, Mail, Sun, Moon, Grid, X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useScrollSpy } from '../hooks/useScrollSpy';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'about', icon: User, label: 'About' },
  { id: 'projects', icon: FolderKanban, label: 'Projects' },
  { id: 'skills', icon: Sparkles, label: 'Skills' },
  { id: 'experience', icon: Briefcase, label: 'Experience' },
  { id: 'achievements', icon: Award, label: 'Achievements' },
  { id: 'github', icon: Github, label: 'GitHub' },
  { id: 'creator', icon: PenLine, label: 'Creator' },
  { id: 'contact', icon: Mail, label: 'Contact' },
] as const;

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export default function DockNav() {
  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const activeSection = useScrollSpy(SECTION_IDS);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileOpen(false);
  }, []);

  const getScale = useCallback(
    (index: number) => {
      if (mouseX === null || !dockRef.current) return 1;
      const items = dockRef.current.querySelectorAll('[data-dock-item]');
      const item = items[index] as HTMLElement | undefined;
      if (!item) return 1;
      const itemRect = item.getBoundingClientRect();
      const dockRect = dockRef.current.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2 - dockRect.left;
      const distance = Math.abs(mouseX - itemCenter);
      const maxDistance = 120;
      const maxScale = 0.42;
      const scale = 1 + maxScale * Math.max(0, 1 - distance / maxDistance);
      return scale;
    },
    [mouseX]
  );

  return (
    <>
      {/* ──────────────── Desktop Persistent Glass Dock ──────────────── */}
      <nav
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-end gap-1"
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          ref={dockRef}
          className="flex items-end gap-1.5 px-3 py-2 rounded-2xl
            bg-white/45 dark:bg-[#121217]/50
            backdrop-blur-2xl backdrop-saturate-[190%]
            border border-white/70 dark:border-white/12
            shadow-[0_20px_45px_-12px_rgba(0,0,0,0.14),inset_0_1.5px_1px_0_rgba(255,255,255,0.85),inset_0_-1px_1px_0_rgba(0,0,0,0.06)]
            dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_1.5px_1px_0_rgba(255,255,255,0.22),inset_0_-1px_1px_0_rgba(0,0,0,0.5)]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const scale = getScale(index);
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                data-dock-item
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="group relative flex flex-col items-center"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'bottom center',
                  transition: mouseX !== null ? 'transform 0.15s ease-out' : 'transform 0.3s ease-out',
                }}
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {/* Glass Tooltip - only visible when specifically hovered */}
                <span
                  className={`
                    absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg
                    text-[11px] font-medium whitespace-nowrap
                    bg-chrome-950/85 dark:bg-white/90 text-white dark:text-chrome-950
                    backdrop-blur-xl border border-white/20 dark:border-black/10
                    transition-all duration-150 pointer-events-none shadow-xl
                    ${hoveredItem === item.id ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-1 scale-95 pointer-events-none'}
                  `}
                >
                  {item.label}
                </span>

                {/* Glass Dock Icon Button */}
                <div
                  className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    transition-all duration-200
                    ${isActive
                      ? 'bg-gold/20 text-gold border border-gold/45 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.4),0_2px_8px_rgba(201,168,76,0.25)] backdrop-blur-md'
                      : 'text-chrome-700 dark:text-chrome-300 hover:text-chrome-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] backdrop-blur-sm'
                    }
                  `}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
                </div>

                {/* Active indicator dot */}
                <div
                  className={`w-1 h-1 rounded-full mt-1 transition-all duration-300 ${
                    isActive ? 'bg-gold scale-100 opacity-100 shadow-[0_0_6px_rgba(201,168,76,0.8)]' : 'bg-transparent scale-0 opacity-0'
                  }`}
                />
              </button>
            );
          })}

          {/* Glass Divider */}
          <div className="w-px h-6 bg-gradient-to-b from-transparent via-chrome-300/60 dark:via-white/20 to-transparent self-center mx-1" />

          {/* Theme Toggle Button */}
          <button
            data-dock-item
            onClick={toggleTheme}
            onMouseEnter={() => setHoveredItem('theme')}
            onMouseLeave={() => setHoveredItem(null)}
            className="group relative flex flex-col items-center"
            style={{
              transform: `scale(${getScale(NAV_ITEMS.length)})`,
              transformOrigin: 'bottom center',
              transition: mouseX !== null ? 'transform 0.15s ease-out' : 'transform 0.3s ease-out',
            }}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <span
              className={`
                absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg
                text-[11px] font-medium whitespace-nowrap
                bg-chrome-950/85 dark:bg-white/90 text-white dark:text-chrome-950
                backdrop-blur-xl border border-white/20 dark:border-black/10
                transition-all duration-150 pointer-events-none shadow-xl
                ${hoveredItem === 'theme' ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-1 scale-95 pointer-events-none'}
              `}
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-chrome-700 dark:text-chrome-300 hover:text-gold dark:hover:text-gold hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all duration-200">
              {isDark ? (
                <Sun className="w-[18px] h-[18px]" strokeWidth={1.8} />
              ) : (
                <Moon className="w-[18px] h-[18px]" strokeWidth={1.8} />
              )}
            </div>
            <div className="w-1 h-1 mt-1" />
          </button>
        </div>
      </nav>

      {/* ──────────────── Mobile Persistent Glass Dock (5 Clean Icons) ──────────────── */}
      <nav
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden w-[calc(100%-2rem)] max-w-sm"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {/* Expanded All-Sections Glass Drawer Sheet */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/55 backdrop-blur-md z-40 transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        <div
          className={`
            absolute bottom-full left-0 right-0 mb-3 z-50
            transition-all duration-300 ease-out origin-bottom
            ${isMobileOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
            }
          `}
        >
          <div className="p-4 rounded-3xl bg-white/85 dark:bg-[#121217]/85 backdrop-blur-3xl backdrop-saturate-[190%] border border-white/70 dark:border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3),inset_0_1.5px_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8),inset_0_1.5px_1px_0_rgba(255,255,255,0.2)]">
            <div className="flex items-center justify-between px-2 pb-3 mb-2.5 border-b border-chrome-200/50 dark:border-white/10">
              <span className="text-xs font-display font-bold tracking-wider uppercase text-chrome-700 dark:text-chrome-300">
                All Sections
              </span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-lg text-chrome-400 hover:text-chrome-700 dark:hover:text-chrome-200 hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3x3 All Sections Grid */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`
                      flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl
                      transition-all duration-150 active:scale-95
                      ${isActive
                        ? 'bg-gold/20 text-gold font-semibold shadow-xs border border-gold/40'
                        : 'text-chrome-700 dark:text-chrome-300 hover:bg-white/50 dark:hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" strokeWidth={isActive ? 2.2 : 1.8} />
                    <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Theme Toggle in All Sections Drawer */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl
                bg-white/60 dark:bg-white/10 text-chrome-800 dark:text-chrome-200
                border border-white/60 dark:border-white/10
                text-xs font-display font-medium hover:text-gold transition-colors shadow-xs"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-gold" strokeWidth={1.8} />
                  <span>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-chrome-600" strokeWidth={1.8} />
                  <span>Switch to Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Floating Quick Glass Action Bar: Exactly 5 Icons */}
        <div className="flex items-center justify-around px-2 py-1.5 rounded-2xl
          bg-white/50 dark:bg-[#121217]/55
          backdrop-blur-2xl backdrop-saturate-[190%]
          border border-white/70 dark:border-white/15
          shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15),inset_0_1.5px_1px_0_rgba(255,255,255,0.85),inset_0_-1px_1px_0_rgba(0,0,0,0.05)]
          dark:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.7),inset_0_1.5px_1px_0_rgba(255,255,255,0.2),inset_0_-1px_1px_0_rgba(0,0,0,0.4)]">
          {[
            { id: NAV_ITEMS[0].id, icon: NAV_ITEMS[0].icon, label: NAV_ITEMS[0].label }, // Home
            { id: NAV_ITEMS[2].id, icon: NAV_ITEMS[2].icon, label: NAV_ITEMS[2].label }, // Projects
            { id: NAV_ITEMS[6].id, icon: NAV_ITEMS[6].icon, label: NAV_ITEMS[6].label }, // GitHub
            { id: NAV_ITEMS[8].id, icon: NAV_ITEMS[8].icon, label: NAV_ITEMS[8].label }, // Contact
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`
                  flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'text-gold bg-gold/20 font-semibold border border-gold/35 shadow-xs'
                    : 'text-chrome-600 dark:text-chrome-400 active:text-chrome-950 dark:active:text-white'
                  }
                `}
                aria-label={item.label}
              >
                <Icon className="w-4 h-4" strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="text-[10px] font-medium mt-0.5 leading-none">{item.label}</span>
              </button>
            );
          })}

          {/* 5th Icon: All Sections Drawer Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`
              flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200
              ${isMobileOpen
                ? 'text-gold bg-gold/25 font-semibold border border-gold/40'
                : 'text-chrome-600 dark:text-chrome-400 active:text-chrome-950 dark:active:text-white'
              }
            `}
            aria-label="All Sections"
            aria-expanded={isMobileOpen}
          >
            <Grid className="w-4 h-4" strokeWidth={1.8} />
            <span className="text-[10px] font-medium mt-0.5 leading-none">All</span>
          </button>
        </div>
      </nav>
    </>
  );
}
