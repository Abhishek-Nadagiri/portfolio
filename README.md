# Abhishek Nadagiri — Personal Portfolio

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

**Software Engineer · Prompt Engineer · Content Creator**

[Live Portfolio Demo](https://portfolio-aj-new.vercel.app) · [GitHub Profile](https://github.com/Abhishek-Nadagiri) · [LinkedIn](https://linkedin.com/in/abhishek-nadagiri)

</div>

---

## 🌟 Overview

A modern, high-performance personal developer portfolio built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **GSAP**. Designed around the three core pillars of **Software Engineering**, **Prompt Engineering**, and **Content Creation**.

### Key Highlights
- **Interactive macOS-Inspired Dock Navigation**: Fluid proximity magnification on desktop hover, individual tooltip reveals, active section scroll-spy, and an ergonomic 5-icon mobile navigation dock with an expandable "All Sections" drawer.
- **Dark & Light Mode**: Seamless theme toggling with system preference fallback, zero-FOUC initialization, and localStorage persistence.
- **Real-Time GitHub Activity**: Dynamic live sync with GitHub REST API, automatic background polling, tab-focus revalidation, contribution grid visualization, and language distribution bar.
- **Creator Wall**: Featured LinkedIn posts highlighting developer security and AI culture, displaying live engagement counts for reactions, comments, and community impressions.
- **Interactive Projects Showcase**: Categorized showcases with direct GitHub source repository links and live production deployment demos.
- **Fluid & Accessible Responsive Design**: Full multi-device responsiveness from mobile viewports (320px+) to ultra-wide displays with reduced-motion support.

---

## 🚀 Projects Featured

| Project | Category | Tech Stack | Links |
| :--- | :--- | :--- | :--- |
| **Ayucare** | Healthcare Clinical Platform | React, TypeScript, Tailwind CSS, Vercel | [Source](https://github.com/Abhishek-Nadagiri/ayucare) · [Live Demo](https://medora-rosy.vercel.app) |
| **ReBite** | AI Food Waste Reduction | Next.js, TypeScript, Supabase, Tailwind CSS | [Source](https://github.com/Abhishek-Nadagiri/rebite) · [Live Demo](https://rebite.vercel.app) |
| **Inventa** | Modern Full-Stack Web App | TypeScript, React, Tailwind CSS, Vercel | [Source](https://github.com/Abhishek-Nadagiri/Inventa) · [Live Demo](https://inventa-black.vercel.app) |
| **Tech Layoffs Predictor** | ML Workforce Analytics | Python, Streamlit, Scikit-learn, Pandas | [Source](https://github.com/Abhishek-Nadagiri/tech-layoffs-predictor) · [Live Demo](https://tech-layoffs-predictor.streamlit.app) |

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design tokens (`gold`, `chrome`, `surface`)
- **Animations**: [GSAP](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (display) & [Inter](https://fonts.google.com/specimen/Inter) (body)

---

## 📂 Project Structure

```text
portfolio/
├── public/
│   └── favicon.svg           # Custom SVG favicon
├── src/
│   ├── components/           # UI Components
│   │   ├── About.tsx         # Bio, background & core statistics
│   │   ├── Achievements.tsx  # Certifications & honors
│   │   ├── Contact.tsx       # Direct contact channels
│   │   ├── CreatorWall.tsx   # LinkedIn posts with reactions & metrics
│   │   ├── DockNav.tsx       # Desktop & mobile persistent dock
│   │   ├── Experience.tsx    # Timeline with leadership & internships
│   │   ├── Footer.tsx        # Social links & back-to-top navigation
│   │   ├── GitHubSection.tsx # Real-time repository & contribution stream
│   │   ├── Hero.tsx          # Dynamic character stagger & identity reveal
│   │   ├── Loading.tsx       # Intro animation sequence
│   │   ├── Projects.tsx      # Filterable work cards with source & demo
│   │   └── Skills.tsx        # 3D capability matrix
│   ├── context/
│   │   └── ThemeContext.tsx  # Dark / Light mode provider & hook
│   ├── data/
│   │   ├── achievements.ts   # Certifications and milestones
│   │   ├── experience.ts     # Work history & education data
│   │   ├── linkedin.ts       # Creator wall posts & engagement data
│   │   ├── profile.ts        # Core profile, bio, and social links
│   │   ├── projects.ts       # Project descriptions, tags & URLs
│   │   └── skills.ts         # Skill categorizations
│   ├── hooks/
│   │   ├── useGitHub.ts      # Live GitHub API polling & sync hook
│   │   └── useScrollSpy.ts   # Active section tracking for dock
│   ├── App.tsx               # Root component assembling layout
│   ├── index.css             # Tailwind base, utilities & scrollbars
│   ├── main.tsx              # React DOM entry point
│   └── vite-env.d.ts         # Vite TypeScript declarations
├── index.html                # HTML5 entry with SEO tags & pre-paint theme script
├── package.json              # Project scripts & dependencies
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind theme extensions & keyframes
├── tsconfig.json             # Root TypeScript config
└── vite.config.ts            # Vite build configuration
```

---

## 💻 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or later recommended)
- `npm` or `pnpm`

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Abhishek-Nadagiri/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <b>Built by Abhishek Nadagiri</b><br />
  <i>“I am no bird; and no net ensnares me: I am a free human being with an independent will.”</i>
</div>
