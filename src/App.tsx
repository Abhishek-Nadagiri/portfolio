import { useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Loading from './components/Loading';
import DockNav from './components/DockNav';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Achievements from './components/Achievements';
import GitHubSection from './components/GitHubSection';
import CreatorWall from './components/CreatorWall';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen relative bg-surface-light dark:bg-surface-dark text-chrome-900 dark:text-chrome-100 transition-colors duration-300">
        {/* Subtle Ambient Background Gradients */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
          aria-hidden="true"
        >
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gold/5 blur-[120px] dark:bg-gold/8" />
          <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full bg-chrome-400/5 blur-[140px] dark:bg-chrome-600/10" />
          <div className="absolute bottom-1/4 -left-40 w-[28rem] h-[28rem] rounded-full bg-gold/4 blur-[130px] dark:bg-gold/6" />
        </div>

        {/* Loading Intro Screen */}
        <Loading onComplete={handleLoadingComplete} />

        {/* Global Dock Navigation */}
        <DockNav />

        {/* Main Content Sections */}
        <main className="relative z-10">
          <Hero isLoaded={isLoaded} />
          <About />
          <Projects />
          <Skills />
          <Experience />
          <Achievements />
          <GitHubSection />
          <CreatorWall />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
