"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence, Variants } from "framer-motion";
import { projects } from '../data/projects';
import { certificates } from "@/data/certificates";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaExternalLinkAlt, FaTimes, FaSun, FaMoon, FaTerminal } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  // --- STATE ---
  const [isDark, setIsDark] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [typedText, setTypedText] = useState("");

  // --- THEME TOGGLE ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Lock scroll saat modal terbuka
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedProject]);

  // --- CODE TYPING ANIMATION LOGIC ---
  const codeSnippet = `const developer = {
  name: "Nadhif Hafiz",
  role: ["Full-Stack Dev", "Video Clipper"],
  tech: ["Next.js", "Golang", "CapCut", "IoT"],
  mission: "Merangkai Logika & Visual."
};`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(codeSnippet.substring(0, i));
      i++;
      if (i > codeSnippet.length) {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // --- SCROLL & PARALLAX ---
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Parallax untuk Hero Elements
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const yName = useTransform(heroProgress, [0, 1], ["0%", "60%"]);
  const ySubtitle = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const bgParallaxY = useTransform(heroProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  // --- VARIANTS ---
  const FADE_UP: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
  };

  const STAGGER: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <main className="min-h-screen relative bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-500 selection:bg-zinc-800 selection:text-white font-sans overflow-x-hidden">
      
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100 origin-left z-60" style={{ scaleX }} />

      {/* --- FLOATING NAVBAR --- */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed w-full top-6 z-50 flex justify-center px-4"
      >
        <div className="flex items-center gap-6 px-6 py-3 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full shadow-lg">
          <span className="font-bold text-lg tracking-tight">nadhif<span className="text-blue-500">.</span></span>
          <div className="hidden md:flex space-x-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
             <a href="#home" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Home</a>
            <a href="#about" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Tentang</a>
            <a href="#projects" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Proyek</a>
            <a href="#contact" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Kontak</a>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 hover:scale-110 transition-transform">
            {isDark ? <FaSun size={14} className="text-zinc-300" /> : <FaMoon size={14} className="text-zinc-600" />}
          </button>
        </div>
      </motion.nav>

      {/* --- 1. HERO SECTION (TYPOGRAPHY NADHIF HAFIZ + PARALLAX BACKGROUND) --- */}
      <section ref={heroRef} id="home" className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Parallax Background Layer */}
        <motion.div 
          style={{ y: bgParallaxY, opacity: heroOpacity }}
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 -z-10 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-zinc-100/30 to-transparent dark:via-zinc-900/10" />
          <div className="w-150 md:w-200 h-100 bg-blue-500/10 dark:bg-zinc-800/30 blur-[120px] rounded-full" />
        </motion.div>
        
        <div className="max-w-5xl w-full mx-auto flex flex-col items-center justify-center relative z-10 text-center">
          <motion.div 
            style={{ opacity: heroOpacity }}
            className="space-y-4 flex flex-col items-center w-full"
            initial="hidden" animate="show" variants={STAGGER}
          >
            <motion.div variants={FADE_UP}>
              <span className="px-4 py-1.5 text-xs font-medium bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-full text-zinc-700 dark:text-zinc-300">
                Portfolio Platform
              </span>
            </motion.div>
            
            {/* Big Premium Typography */}
            <motion.h1 
              style={{ y: yName }}
              variants={FADE_UP} 
              className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-zinc-950 to-zinc-400 dark:from-white dark:to-zinc-600 select-none uppercase leading-none py-2"
            >
              NADHIF HAFIZ
            </motion.h1>

            <motion.p 
              style={{ y: ySubtitle }}
              variants={FADE_UP} 
              className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-light tracking-tight mt-4"
            >
              Merangkai Logika & Visual.
            </motion.p>
          </motion.div>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-32">
        
        {/* --- 2. BENTO GRID: ABOUT (FIXED SEPARATE LAYOUT) --- */}
        <motion.section id="about" className="scroll-mt-32" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={STAGGER}>
          
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">Tentang Saya</h2>
            <p className="text-zinc-600 dark:text-zinc-500 font-light">Perjalanan karir, latar pendidikan, dan keahlian komputasi visual.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* BARIS ATAS KIRI: Deskripsi Utama (Makan 2 Kolom) */}
            <SpotlightCard className="md:col-span-2 p-8 md:p-10 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-medium mb-4 text-zinc-900 dark:text-zinc-100 z-10 tracking-tight">Membangun Sistem, <br/> Merangkai Momen.</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light z-10 text-base md:text-lg">
                Saya mengkhususkan diri dalam pengembangan aplikasi web dan pengaturan sistem IoT, sekaligus memiliki ketertarikan mendalam pada seni mengedit video. Sebagai seorang Video Clipper, saya memahami pentingnya ritme, transisi, dan retensi penonton.
              </p>
            </SpotlightCard>

            {/* BARIS ATAS KANAN: Foto Profil Terpisah (Makan 1 Kolom) */}
            <SpotlightCard className="p-2 flex items-center justify-center min-h-[300px] md:min-h-full">
              <div className="w-full h-full relative rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 z-10">
                <img src="/profile.jpeg" alt="Nadhif Hafiz Pradiptya" className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            </SpotlightCard>

            {/* BARIS BAWAH KIRI: Tech Stack */}
            <SpotlightCard className="p-6 flex flex-col justify-center">
               <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider z-10">Tech Stack</h3>
               <div className="flex flex-wrap gap-2 z-10 relative">
                 {['Next.js', 'React', 'Golang', 'IoT', 'CapCut'].map(skill => (
                   <span key={skill} className="text-xs px-2.5 py-1 bg-zinc-200 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md backdrop-blur-md">
                     {skill}
                   </span>
                 ))}
               </div>
            </SpotlightCard>

            {/* BARIS BAWAH TENGAH: Pendidikan Terpisah (UNSIKA) */}
            <SpotlightCard className="p-6 flex items-center gap-4 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 z-10 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <img src="/unsika.png" alt="UNSIKA" className="w-full h-full object-contain" />
              </div>
              <div className="z-10">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">UNSIKA</h3>
                <p className="text-sm text-zinc-500">Mahasiswa S1</p>
              </div>
            </SpotlightCard>

            {/* BARIS BAWAH KANAN: Aktivitas Terpisah (Ruang Guru) */}
            <SpotlightCard className="p-6 flex items-center gap-4 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 z-10 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <img src="/ruangguru.png" alt="Ruang Guru" className="w-full h-full object-contain" />
              </div>
              <div className="z-10">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Ruang Guru</h3>
                <p className="text-sm text-zinc-500">Studi Independen</p>
              </div>
            </SpotlightCard>

          </div>
        </motion.section>

        {/* --- 3. PROJECTS (ZIG-ZAG LAYOUT + SCROLL-MT NAVIGATION) --- */}
        <section id="projects" className="relative z-10 scroll-mt-32">
          <div className="mb-16 md:mb-24 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">Arsip Proyek & Studi Kasus</h2>
            <p className="text-zinc-600 dark:text-zinc-500 font-light">Eksplorasi rekayasa perangkat lunak dan portofolio kreatif visual.</p>
          </div>

          <div className="space-y-24 md:space-y-32">
            {projects.map((project, idx) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col gap-8 md:gap-16 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
              >
                {/* Image Side */}
                <div className="w-full md:w-1/2 cursor-pointer" onClick={() => setSelectedProject(project)}>
                  <SpotlightCard className="p-0 aspect-video md:aspect-4/3 group relative">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out z-10 relative" />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                      <span className="px-5 py-2.5 bg-white/20 text-white backdrop-blur-md rounded-full text-xs font-medium border border-white/20 shadow-lg tracking-wide">
                        Baca Studi Kasus
                      </span>
                    </div>
                  </SpotlightCard>
                </div>

                {/* Text Details */}
                <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">{project.category}</span>
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{project.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light mb-6 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-zinc-200 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 h-11 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-full hover:scale-105 transition-transform shadow-md">
                      Visit Site <FaExternalLinkAlt size={10} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- 4. CONTACT & ANIMATED FOOTER CHARACTER --- */}
        <motion.section id="contact" initial="hidden" whileInView="show" viewport={{ once: true }} variants={STAGGER} className="scroll-mt-32 border-t border-zinc-200 dark:border-white/10 pt-20 pb-10 relative">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
            <div>
              <h2 className="text-3xl font-medium tracking-tight text-zinc-900 dark:text-white mb-2">Mari Berkolaborasi.</h2>
              <p className="text-zinc-600 dark:text-zinc-500 font-light max-w-sm">
                Tertarik untuk membahas proyek web, sistem IoT, atau butuh jasa clipping video?
              </p>
            </div>
            
            <div className="flex gap-4">
              <MagneticLink href="mailto:nadhifhafizp@gmail.com" title="Email"><FaEnvelope size={20} /></MagneticLink>
              <MagneticLink href="https://www.linkedin.com/in/nadhif-hafiz-pradiptya/" title="LinkedIn"><FaLinkedin size={20} /></MagneticLink>
              <MagneticLink href="https://github.com/nadhifhafizp" title="GitHub"><FaGithub size={20} /></MagneticLink>
              <MagneticLink href="https://www.instagram.com/nadhifhafizz/" title="Instagram"><FaInstagram size={20} /></MagneticLink>
            </div>
          </div>
          
          {/* HORIZONTAL ANIMATED WALKING TRACK (Gaya Contoh Gambar) */}
          <div className="w-full h-8 relative border-b border-zinc-200 dark:border-zinc-800 mb-6 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute bottom-0 flex flex-col items-center"
              animate={{ 
                x: ["-10%", "110%"],
                y: [0, -3, 0, -3, 0] // Efek memantul saat melangkah (Wobble walking physics)
              }}
              transition={{ 
                x: { repeat: Infinity, duration: 18, ease: "linear" },
                y: { repeat: Infinity, duration: 0.6, ease: "easeInOut" }
              }}
            >
              {/* Premium Custom SVG Walking Tech Companion / Cat Lineart */}
              <svg className="w-6 h-6 text-zinc-400 dark:text-zinc-600 fill-current" viewBox="0 0 24 24">
                <path d="M20 12h-2v-1c0-1.7-1.3-3-3-3h-2c-.5 0-1-.2-1.4-.6L10.3 6.1C9.7 5.4 8.9 5 8 5H4c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h1v4c0 .6.4 1 1 1s1-.4 1-1v-4h4v4c0 .6.4 1 1 1s1-.4 1-1v-4h3c1.1 0 2-.9 2-2v-1h2c.6 0 1-.4 1-1s-.4-1-1-1zm-12-3c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/>
              </svg>
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 font-medium">
            <p>© {new Date().getFullYear()} Nadhif Hafiz Pradiptya. All rights reserved.</p>
            <p className="mt-2 md:mt-0 flex items-center gap-1">Designed in Karawang <span className="text-red-500">❤</span></p>
          </div>
        </motion.section>

      </div>

      {/* --- POP-UP MODAL STUDI KASUS --- */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8 bg-zinc-900/60 dark:bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-zinc-950 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 w-10 h-10 bg-white/20 backdrop-blur-md dark:bg-zinc-900/50 rounded-full flex items-center justify-center text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors z-20"
              >
                <FaTimes size={14} />
              </button>

              <div className="w-full h-64 md:h-80 relative bg-zinc-100 dark:bg-zinc-900">
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-white dark:from-zinc-950 to-transparent"></div>
              </div>

              <div className="p-6 md:p-12 -mt-16 relative z-10">
                <span className="px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-wider rounded-md mb-4 inline-block">
                  {selectedProject.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-white">{selectedProject.title}</h2>
                
                <div className="space-y-8 text-sm md:text-base font-light text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  <p>{selectedProject.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Tantangan (The Problem)</h4>
                      <p className="text-xs md:text-sm">Membangun arsitektur yang responsif, interaktif, dan mudah dimengerti oleh pengguna tanpa mengorbankan kecepatan loading data.</p>
                    </div>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Solusi (The Solution)</h4>
                      <p className="text-xs md:text-sm">Memanfaatkan ekosistem {selectedProject.techStack.join(', ')} untuk manajemen status dan efisiensi *rendering* komponen visual.</p>
                    </div>
                  </div>

                  <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="w-full py-4 mt-4 flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold transition-transform hover:scale-[1.02]">
                    Kunjungi Aplikasi / Web <FaExternalLinkAlt size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// --- SUB COMPONENTS ---

function SpotlightCard({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
      }}
      ref={divRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-zinc-900/40 transition-colors hover:bg-zinc-200/50 dark:hover:bg-zinc-900/60 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

function MagneticLink({ children, href, title }: { children: React.ReactNode, href: string, title?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={ref} href={href} target="_blank" rel="noopener noreferrer" title={title}
      onMouseMove={handleMouse} onMouseLeave={reset} animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-white/30 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors z-10"
    >
      {children}
    </motion.a>
  );
}