"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence, Variants, useMotionValue, useAnimationFrame } from "framer-motion";
import { projects } from '../data/projects';
import { certificates } from '../data/certificates';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaExternalLinkAlt, FaTimes, FaSun, FaMoon, FaCode, FaVideo, FaBars } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";


// --- TACTILE FEEDBACK UTILITY ---
// Creates a premium "haptic" feel via subtle vibration and a synthesized micro-click sound.
const handleTactileFeedback = () => {
  // 1. Hardware Haptic Feedback (Supported Mobile Devices)
  if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(10); // Very subtle 10ms vibration
  }
  
  // 2. Subtle Audio "Tick" (Premium Desktop UI feel)
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Quick frequency drop for a "pop" / "tick" sound
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
    
    // Very low volume, quick fade
    gainNode.gain.setValueAtTime(0.10, ctx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {
    // Silently ignore if AudioContext is not supported or blocked
  }
};

export default function Home() {
  // --- STATE ---
  const [isDark, setIsDark] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- FILTER PROJECTS ---
  const webProjects = projects.filter(p => p.category === 'Web Development');
  const videoProjects = projects.filter(p => p.category === 'Creative');

  // --- STATE UNTUK HERO TEXT GLOW ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

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

  // --- SCROLL & PARALLAX ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

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
    <main className="min-h-screen relative bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black font-sans overflow-x-hidden">
      
      {/* Scroll Progress Bar - Monochrome */}
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-black dark:bg-white origin-left z-60" style={{ scaleX }} />

      {/* --- GLOBAL INTERACTIVE COMPANION --- */}
      <InteractiveCompanion />

      {/* --- FLOATING NAVBAR --- */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed w-full top-6 z-50 flex justify-center px-4"
      >
        <div className="relative flex items-center gap-4 md:gap-6 px-5 py-3 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full shadow-lg">
          
          <span className="font-bold text-lg tracking-tight text-black dark:text-white">nadhif<span className="text-zinc-400 dark:text-zinc-600">.</span></span>
          
          {/* DESKTOP MENU (Hanya tampil di layar besar) */}
          <div className="hidden md:flex space-x-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
             <a href="#home" className="hover:text-black dark:hover:text-white transition-colors">Home</a>
            <a href="#about" className="hover:text-black dark:hover:text-white transition-colors">Tentang</a>
            <a href="#projects" className="hover:text-black dark:hover:text-white transition-colors">Proyek</a>
            <a href="#contact" className="hover:text-black dark:hover:text-white transition-colors">Kontak</a>
          </div>

          {/* GROUP TOMBOL KANAN */}
          <div className="flex items-center gap-2">
            {/* THEME TOGGLE */}
            <motion.button 
              onClick={() => { handleTactileFeedback(); setIsDark(!isDark); }} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 transition-colors border border-zinc-200 dark:border-zinc-800"
            >
              {isDark ? <FaSun size={14} className="text-zinc-300" /> : <FaMoon size={14} className="text-zinc-700" />}
            </motion.button>

            {/* MOBILE MENU BUTTON (Hanya tampil di HP) */}
            <motion.button 
              onClick={() => { handleTactileFeedback(); setIsMobileMenuOpen(!isMobileMenuOpen); }} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 transition-colors border border-zinc-200 dark:border-zinc-800 text-black dark:text-white"
            >
              {isMobileMenuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
            </motion.button>
          </div>

          {/* MOBILE MENU DROPDOWN */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute top-full mt-3 right-0 w-48 p-4 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl flex flex-col gap-4 md:hidden"
              >
                {[
                  { name: 'Home', href: '#home' },
                  { name: 'Tentang', href: '#about' },
                  { name: 'Proyek', href: '#projects' },
                  { name: 'Kontak', href: '#contact' },
                ].map((item) => (
                  <a 
                    key={item.name}
                    href={item.href} 
                    onClick={() => { handleTactileFeedback(); setIsMobileMenuOpen(false); }}
                    className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors px-2 py-1 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
                  >
                    {item.name}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.nav>

      {/* --- 1. HERO SECTION --- */}
      <section ref={heroRef} id="home" className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Parallax Background Layer */}
        <motion.div 
          style={{ y: bgParallaxY, opacity: heroOpacity }}
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 -z-10 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-zinc-200/20 to-transparent dark:via-zinc-900/10" />
          <div className="w-150 md:w-200 h-100 bg-zinc-300/20 dark:bg-zinc-900/30 blur-[120px] rounded-full" />
        </motion.div>
        
        <div className="max-w-5xl w-full mx-auto flex flex-col items-center justify-center relative z-10 text-center">
          <motion.div 
            style={{ opacity: heroOpacity }}
            className="space-y-4 flex flex-col items-center w-full"
            initial="hidden" animate="show" variants={STAGGER}
          >
            <motion.div variants={FADE_UP}>
              <span className="px-4 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-full text-black dark:text-white shadow-sm uppercase tracking-widest">
                Portfolio Platform
              </span>
            </motion.div>
            
            <motion.div variants={FADE_UP} style={{ y: yName }} className="relative w-full cursor-default">
              <div 
                onMouseMove={handleHeroMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative inline-block w-full"
              >
                {/* Glow Layer */}
                <div 
                  className="absolute inset-0 pointer-events-none text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none py-2 text-transparent transition-all duration-300 -z-10"
                  style={{
                    textShadow: isHovered 
                      ? (isDark 
                          ? `${mousePos.x * -80}px ${mousePos.y * -80}px 80px rgba(255, 255, 255, 0.3)` 
                          : `${mousePos.x * -80}px ${mousePos.y * -80}px 80px rgba(0, 0, 0, 0.2)`)
                      : '0px 0px 0px rgba(0, 0, 0, 0)'
                  }}
                >
                  NADHIF HAFIZ
                </div>
                
                {/* Text Asli */}
                <h1 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-black to-zinc-500 dark:from-white dark:to-zinc-600 select-none uppercase leading-none py-2 relative z-10">
                  NADHIF HAFIZ
                </h1>
              </div>
            </motion.div>

            <motion.p 
              style={{ y: ySubtitle }}
              variants={FADE_UP} 
              className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-light tracking-tight mt-4"
            >
              Merangkai Logika & Visual.
            </motion.p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-20">
          <TechMarquee />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-32">
        
        {/* --- 2. BENTO GRID: ABOUT, PHILOSOPHY & CERTIFICATIONS --- */}
        <motion.section id="about" className="scroll-mt-32 pt-20 md:pt-32" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={STAGGER}>
          
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black dark:text-white mb-2">Tentang Saya</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-light">Perjalanan karir, latar pendidikan, dan keahlian komputasi visual.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <SpotlightCard className="md:col-span-2 p-8 md:p-10 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-medium mb-4 text-black dark:text-white z-10 tracking-tight">Membangun Sistem, <br/> Merangkai Momen.</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light z-10 text-base md:text-lg">
                Saya mengkhususkan diri dalam pengembangan aplikasi web dan pengaturan sistem IoT, sekaligus memiliki ketertarikan mendalam pada seni mengedit video. Sebagai seorang Video Clipper, saya memahami pentingnya ritme, transisi, dan retensi penonton.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-2 flex items-center justify-center min-h-75 md:min-h-full">
              <div className="w-full h-full relative rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 z-10">
                <img src="/profile.jpeg" alt="Nadhif Hafiz Pradiptya" className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 flex flex-col justify-center">
               <h3 className="text-sm font-semibold text-black dark:text-white mb-3 uppercase tracking-wider z-10">Tech Stack</h3>
               <div className="flex flex-wrap gap-2 z-10 relative">
                 {['Next.js', 'React', 'Golang', 'IoT', 'CapCut'].map(skill => (
                   <span key={skill} className="text-xs px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white rounded-md font-medium">
                     {skill}
                   </span>
                 ))}
               </div>
            </SpotlightCard>

            <SpotlightCard className="md:col-span-2 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 group">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center p-2 z-10 border border-zinc-200 dark:border-zinc-800 shrink-0">
                <img src="/unsika.png" alt="UNSIKA" className="w-full h-full object-contain" />
              </div>
              <div className="z-10 text-center sm:text-left flex-1">
                 <h3 className="font-semibold text-lg text-black dark:text-white tracking-tight">Universitas Singaperbangsa Karawang</h3>
                 <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">S1 Informatika • Menuju Kelulusan</p>
                 <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                   Menyelesaikan tahap akhir studi sarjana dengan rekam jejak pengembangan perangkat lunak secara utuh dari studi independen bersama <strong>Ruang Guru</strong>, hingga implementasi solusi IoT terapan. Berkomitmen menghadirkan karya akhir yang menyatukan logika komputasi visual.
                 </p>
              </div>
            </SpotlightCard>

            <SpotlightCard className="md:col-span-3 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between mt-2">
              <div className="md:w-1/3 z-10 text-center md:text-left">
                <h3 className="text-2xl font-semibold text-black dark:text-white tracking-tight">Filosofi Kerja</h3>
                <p className="text-zinc-500 mt-2 text-sm font-light">Prinsip dasar yang membentuk setiap baris kode dan frame video saya.</p>
              </div>
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 z-10 w-full">
                <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-[#111111] border border-zinc-200 dark:border-white/5">
                  <h4 className="font-bold text-black dark:text-white mb-2 text-sm">Fungsional & Estetis</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">Kode harus dirancang se-efisien mungkin, namun tampilan antarmuka (UI) harus tetap memanjakan dan mudah dinavigasi oleh pengguna akhir.</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-[#111111] border border-zinc-200 dark:border-white/5">
                  <h4 className="font-bold text-black dark:text-white mb-2 text-sm">Arsitektur di Atas Sintaks</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">Esensi rekayasa perangkat lunak bukan pada menghafal baris kode, melainkan memahami alur sistem. Saya memanfaatkan AI untuk efisiensi sintaks, dan berfokus penuh pada logika bisnis & skalabilitas arsitektur.</p>
                </div>
              </div>
            </SpotlightCard>

            {/* Sertifikasi */}
            <div className="md:col-span-3 pt-8 z-10">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-2xl font-semibold tracking-tight text-black dark:text-white">Sertifikasi & Lisensi</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates && certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <SpotlightCard key={cert.id} className="p-6 flex flex-col justify-between group h-full">
                      <div className="z-10">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-sm text-black dark:text-white group-hover:text-zinc-500 transition-colors line-clamp-3 pr-4 leading-snug">
                            {cert.title}
                          </h4>
                          {cert.link && <FaExternalLinkAlt size={10} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">{cert.issuer}</p>
                      </div>
                      <div className="z-10 mt-6 pt-4 border-t border-zinc-200 dark:border-white/10 flex justify-between items-center">
                         <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{cert.date}</span>
                         {cert.link && (
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-black dark:text-white hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700">
                              Kredensial
                            </a>
                         )}
                      </div>
                    </SpotlightCard>
                  ))
                ) : (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 p-8 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl text-zinc-500 text-sm">
                     Data sertifikasi sedang diperbarui...
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.section>

        {/* --- 3. PROJECTS SECTION (DIPISAH BERDASARKAN KATEGORI) --- */}
        <section id="projects" className="relative z-10 scroll-mt-32">
          
          <div className="mb-16 md:mb-24 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black dark:text-white mb-2">Katalog Karya</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-light">Eksplorasi rekayasa perangkat lunak dan portofolio kreatif visual.</p>
          </div>

          {/* KATEGORI A: WEB DEVELOPMENT (ZIG-ZAG LAYOUT) */}
          <div className="mb-32">
            <div className="flex items-center gap-3 mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <FaCode className="text-zinc-400 dark:text-zinc-500 text-xl" />
              <h3 className="text-2xl font-bold text-black dark:text-white tracking-tight">Pengembangan Web</h3>
            </div>
            
            <div className="space-y-24">
              {webProjects.map((project, idx) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col gap-8 md:gap-16 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                >
                  {/* Image Side */}
                  <div className="w-full md:w-1/2 cursor-pointer">
                    <SpotlightCard onClick={() => setSelectedProject(project)} className="p-0 aspect-video md:aspect-4/3 group relative border-zinc-200 dark:border-white/5 cursor-pointer">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out z-10 relative" />
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                        <span className="px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs font-bold tracking-wide shadow-xl border border-white/20">
                          Baca Studi Kasus
                        </span>
                      </div>
                    </SpotlightCard>
                  </div>

                  {/* Text Details */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3">{project.category}</span>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-white">{project.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light mb-6 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                      {project.techStack.map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white border border-zinc-200 dark:border-zinc-800">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div>
                      <motion.a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={handleTactileFeedback}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="inline-flex items-center gap-2 px-6 h-11 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg"
                      >
                        Visit Web <FaExternalLinkAlt size={10} />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* KATEGORI B: VIDEO EDITING & CREATIVE (GRID 3 KOLOM) */}
          <div>
            <div className="flex items-center gap-3 mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <FaVideo className="text-zinc-400 dark:text-zinc-500 text-xl" />
              <h3 className="text-2xl font-bold text-black dark:text-white tracking-tight">Karya Visual & Video</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videoProjects.map((project) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                >
                  <SpotlightCard className="flex flex-col h-full group cursor-pointer" onClick={() => setSelectedProject(project)}>
                    <div className="w-full aspect-9/16 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/5">
                       <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                       
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                          <span className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center pl-1">
                            {/* Icon Play */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </span>
                       </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{project.category}</span>
                           <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); handleTactileFeedback(); }}>
                              <FaExternalLinkAlt size={12} />
                           </a>
                        </div>
                        <h4 className="text-lg font-bold text-black dark:text-white mb-2 leading-tight group-hover:text-zinc-500 transition-colors line-clamp-2">{project.title}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light line-clamp-3 mb-4">{project.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                         {project.techStack.map((tech, i) => (
                           <span key={i} className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                             {tech}
                           </span>
                         ))}
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>

        </section>

        {/* --- 4. CONTACT --- */}
        <motion.section id="contact" initial="hidden" whileInView="show" viewport={{ once: true }} variants={STAGGER} className="scroll-mt-32 border-t border-zinc-200 dark:border-white/10 pt-20 pb-10 relative">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
            <div>
              <h2 className="text-3xl font-medium tracking-tight text-black dark:text-white mb-2">Mari Berkolaborasi.</h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-light max-w-sm">
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

          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 font-medium border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <p>© {new Date().getFullYear()} Nadhif Hafiz Pradiptya. All rights reserved.</p>
            <p className="mt-2 md:mt-0 flex items-center gap-1">Designed in Karawang <span className="text-black dark:text-white">❤</span></p>
          </div>
        </motion.section>

      </div>

      {/* --- POP-UP MODAL STUDI KASUS --- */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8 bg-white/90 dark:bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-[#0a0a0a] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-200 dark:border-white/10 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button 
                onClick={() => { handleTactileFeedback(); setSelectedProject(null); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-5 right-5 w-10 h-10 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center text-black dark:text-white z-20 shadow-sm"
              >
                <FaTimes size={14} />
              </motion.button>

              <div className="w-full h-64 md:h-80 relative bg-zinc-100 dark:bg-zinc-900">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  // Sesuaikan object-fit jika yang dibuka adalah Video yang memanjang ke bawah (9:16)
                  className={`w-full h-full ${selectedProject.category === 'Creative' ? 'object-contain bg-zinc-200 dark:bg-zinc-950 py-4' : 'object-cover grayscale'} `} 
                />
                <div className="absolute inset-0 bg-linear-to-t from-white dark:from-[#0a0a0a] to-transparent"></div>
              </div>

              <div className="p-6 md:p-12 -mt-16 relative z-10">
                <span className="px-4 py-1.5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-widest rounded-md mb-4 inline-block">
                  {selectedProject.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 text-black dark:text-white">{selectedProject.title}</h2>
                
                <div className="space-y-8 text-sm md:text-base font-light text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  <p>{selectedProject.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-zinc-50 dark:bg-[#111] rounded-2xl border border-zinc-200 dark:border-white/5">
                      <h4 className="text-sm font-bold text-black dark:text-white mb-2">Fokus Objektif</h4>
                      <p className="text-xs md:text-sm">Membangun hasil yang sesuai dengan target pengguna, dengan mempertahankan arsitektur visual dan struktur data yang rapi.</p>
                    </div>
                    <div className="p-6 bg-zinc-50 dark:bg-[#111] rounded-2xl border border-zinc-200 dark:border-white/5">
                      <h4 className="text-sm font-bold text-black dark:text-white mb-2">Pendekatan Solusi</h4>
                      <p className="text-xs md:text-sm">Memanfaatkan ekosistem {selectedProject.techStack.join(', ')} untuk manajemen efisiensi kualitas aset serta optimalisasi hasil akhir.</p>
                    </div>
                  </div>

                  <motion.a 
                    href={selectedProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={handleTactileFeedback}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-full py-4 mt-4 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg"
                  >
                    Lihat Proyek Langsung <FaExternalLinkAlt size={12} />
                  </motion.a>
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

// --- SISTEM 2 KARAKTER (COWOK & CEWEK) ---

// 1. Komponen Global Companion (Parent pembungkus)
function InteractiveCompanion() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none overflow-hidden h-[150px]">
      {/* Karakter Cowok (Mulai dari kiri) */}
      <SingleCharacter gender="boy" startX={-150} initialDir={1} />
      
      {/* Karakter Cewek (Mulai dari kanan luar) */}
      <SingleCharacter gender="girl" startX={2500} initialDir={-1} />
    </div>
  );
}

// 2. Sub-Komponen Karakter Tunggal
function SingleCharacter({ gender, startX, initialDir }: { gender: 'boy' | 'girl', startX: number, initialDir: number }) {
  const x = useMotionValue(startX);
  const direction = useRef(initialDir);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const [isFlipped, setIsFlipped] = useState(initialDir === -1);
  
  // States Animasi & Perilaku
  const [fleeingState, setFleeingState] = useState(false);
  const [isSurrenderedState, setIsSurrenderedState] = useState(false);
  const [isIdleStoppedState, setIsIdleStoppedState] = useState(false);
  const [isInteractingState, setIsInteractingState] = useState(false);

  // States Bubble Chat
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Logika Internal
  const isFleeing = useRef(false);
  const isSurrendered = useRef(false);
  const isIdleStopped = useRef(false);
  const isInteracting = useRef(false);
  const fleeStartX = useRef<number | null>(null);
  const hasSaidSurrender = useRef(false);

  // --- KONFIGURASI KARAKTER ---
  const config = gender === 'boy' ? {
    greetings: ["Halo bro! 👋", "Lagi sibuk ya?", "Selamat datang! 👊", "Mantap webnya!"],
    clickPhrases: ["Yoo! Ada apa?", "Sip! 👍", "Hehe, geli bang!"],
    surrenderPhrases: ["Ampun bang! 🏳️", "Mentok bro...", "Waduh, nyerah deh 😵"],
    colorBody: "bg-zinc-800 dark:bg-zinc-200",
    colorText: "text-white dark:text-black",
    bow: false,
    speedBase: 1.3,
    speedFlee: 3.5
  } : {
    greetings: ["Haiii kak~ 👋", "Selamat datang! ✨", "Bagus ya portofolionya? 🌸", "Hihihi 🤭"],
    clickPhrases: ["Kyaa! Geli~ 🤭", "Ada yang bisa dibantu kak? 🎀", "Yey! (^.^)"],
    surrenderPhrases: ["Huft, capek lari... 🏳️", "Jangan dikejar dong kak~ 🥺", "Mentok nih... 🧱"],
    colorBody: "bg-rose-400 dark:bg-rose-300",
    colorText: "text-white dark:text-zinc-900",
    bow: true,
    speedBase: 1.0,
    speedFlee: 2.8
  };

  const triggerBubble = (text: string, duration = 3000) => {
    setBubbleText(text);
    setShowBubble(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowBubble(false), duration);
  };

  // Lacak Kursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Idle Chat & Berhenti (Offset delay supaya cowok & cewek nggak ngomong barengan)
  useEffect(() => {
    const startDelay = gender === 'girl' ? 3000 : 0; 
    
    const initTimeout = setTimeout(() => {
      const patrolInterval = setInterval(() => {
        if (!isFleeing.current && !isInteracting.current && !isSurrendered.current && !isIdleStopped.current) {
          isIdleStopped.current = true;
          setIsIdleStoppedState(true);
          
          const randomGreeting = config.greetings[Math.floor(Math.random() * config.greetings.length)];
          triggerBubble(randomGreeting, 3000);

          setTimeout(() => {
            if (isIdleStopped.current && !isInteracting.current && !isFleeing.current) {
              isIdleStopped.current = false;
              setIsIdleStoppedState(false);
            }
          }, 3500);
        }
      }, 9000); // Tiap 9 detik nyapa
      return () => clearInterval(patrolInterval);
    }, startDelay);

    return () => clearTimeout(initTimeout);
  }, [gender]); // eslint-disable-line

  // Fisika Animasi Frame-by-Frame
  useAnimationFrame(() => {
    if (isInteracting.current || isIdleStopped.current) return;

    const currentX = x.get();
    const charY = window.innerHeight - 40; 
    const dist = Math.hypot(mouseX.current - currentX, mouseY.current - charY);

    if (dist < 120) { // Kursor dekat
      if (!isFleeing.current) {
         isFleeing.current = true;
         setFleeingState(true);
         fleeStartX.current = currentX;
         isSurrendered.current = false;
         hasSaidSurrender.current = false;
      }
      direction.current = mouseX.current < currentX ? 1 : -1;

      // Nyerah kalau dikejar terus (jarak 70px)
      if (fleeStartX.current !== null && !isSurrendered.current) {
         const fleeDistance = Math.abs(currentX - fleeStartX.current);
         if (fleeDistance > 70) {
             isSurrendered.current = true;
             setFleeingState(false);
             setIsSurrenderedState(true);

             if (!hasSaidSurrender.current) {
                hasSaidSurrender.current = true;
                const randomSurrender = config.surrenderPhrases[Math.floor(Math.random() * config.surrenderPhrases.length)];
                triggerBubble(randomSurrender, 4000);
             }
         }
      }
    } else { // Kursor jauh
      if (isFleeing.current || isSurrendered.current) {
         isFleeing.current = false;
         setFleeingState(false);
         fleeStartX.current = null;
         isSurrendered.current = false;
         setIsSurrenderedState(false);
         hasSaidSurrender.current = false;
      }
    }

    let speed = config.speedBase; 
    if (isFleeing.current) speed = isSurrendered.current ? 0 : config.speedFlee; 

    let nextX = currentX + speed * direction.current;

    if (nextX > window.innerWidth - 80) { 
      direction.current = -1;
      nextX = window.innerWidth - 80;
    } else if (nextX < 0) {
      direction.current = 1;
      nextX = 0;
    }

    x.set(nextX);
    
    if (direction.current === 1 && !isFlipped) setIsFlipped(true);
    if (direction.current === -1 && isFlipped) setIsFlipped(false);
  });

  // Saat di-Klik
  const handleCharacterClick = () => {
    if (typeof window !== "undefined" && (window as any).handleTactileFeedback) {
      (window as any).handleTactileFeedback();
    } else if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }

    isInteracting.current = true;
    setIsInteractingState(true);
    setFleeingState(false);
    isIdleStopped.current = false;
    setIsIdleStoppedState(false);
    isSurrendered.current = false;
    setIsSurrenderedState(false);

    const randomPhrase = config.clickPhrases[Math.floor(Math.random() * config.clickPhrases.length)];
    triggerBubble(randomPhrase, 3000);

    setTimeout(() => {
      isInteracting.current = false;
      setIsInteractingState(false);
    }, 3000);
  };

  // --- KOMPONEN WAJAH DINAMIS ---
  const FaceBoy = () => {
    if (isSurrenderedState) return (
      <svg viewBox="0 0 40 40" className="w-full h-full transition-all">
         <line x1="12" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
         <line x1="24" y1="18" x2="28" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
         <circle cx="20" cy="24" r="2" fill="currentColor" />
         <text x="25" y="10" fontSize="8" fill="currentColor" fontWeight="bold">Z</text>
         <text x="32" y="5" fontSize="5" fill="currentColor" fontWeight="bold">z</text>
      </svg>
    );
    if (fleeingState) return (
      <svg viewBox="0 0 40 40" className="w-full h-full transition-all">
         <path d="M 16 16 L 12 18 L 16 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
         <path d="M 24 16 L 28 18 L 24 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
         <path d="M 16 25 L 18 23 L 20 25 L 22 23 L 24 25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
    if (isInteractingState || isIdleStoppedState) return (
      <svg viewBox="0 0 40 40" className="w-full h-full transition-all">
         <path d="M 12 18 Q 14 15 16 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
         <path d="M 24 18 Q 26 15 28 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
         <path d="M 16 23 Q 20 28 24 23" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    );
    return (
      <svg viewBox="0 0 40 40" className="w-full h-full transition-all">
         <circle cx="14" cy="18" r="2.5" fill="currentColor" />
         <circle cx="26" cy="18" r="2.5" fill="currentColor" />
         <path d="M 18 24 Q 20 26 22 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  };

  const FaceGirl = () => {
    // Helper untuk pipi merona (Blush)
    const Blush = () => (
      <>
        <ellipse cx="10" cy="21" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6"/>
        <ellipse cx="30" cy="21" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6"/>
      </>
    );

    if (isSurrenderedState) return (
      <svg viewBox="0 0 40 40" className="w-full h-full transition-all">
         <path d="M 12 18 Q 14 20 16 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
         <path d="M 24 18 Q 26 20 28 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
         <Blush />
         <line x1="18" y1="24" x2="22" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
    if (fleeingState) return (
      <svg viewBox="0 0 40 40" className="w-full h-full transition-all">
         <path d="M 16 16 L 12 18 L 16 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
         <path d="M 24 16 L 28 18 L 24 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
         <Blush />
         <circle cx="20" cy="24" r="2.5" fill="currentColor" />
      </svg>
    );
    if (isInteractingState || isIdleStoppedState) return (
      <svg viewBox="0 0 40 40" className="w-full h-full transition-all">
         <path d="M 12 18 Q 14 15 16 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
         <path d="M 24 18 Q 26 15 28 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
         <Blush />
         <path d="M 18 23 Q 20 26 22 23" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
    return (
      <svg viewBox="0 0 40 40" className="w-full h-full transition-all">
         <circle cx="14" cy="18" r="2.5" fill="currentColor" />
         <circle cx="26" cy="18" r="2.5" fill="currentColor" />
         <Blush />
         <circle cx="20" cy="23" r="1.5" fill="currentColor" />
      </svg>
    );
  };

  const isMoving = !isSurrenderedState && !isIdleStoppedState && !isInteractingState;
  const bounceDuration = fleeingState ? 0.25 : 0.6;

  return (
    <motion.div 
      style={{ x }} 
      className="absolute bottom-4 w-14 h-14 pointer-events-auto cursor-pointer"
      animate={{ scaleX: isFlipped ? -1 : 1 }}
      onClick={handleCharacterClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* --- CHAT BUBBLE --- */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.8 }}
            style={{ scaleX: isFlipped ? -1 : 1 }} 
            className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-max max-w-[220px] bg-white dark:bg-zinc-800 text-black dark:text-white text-[11px] font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 pointer-events-none"
          >
            {bubbleText}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[6px] border-transparent border-t-white dark:border-t-zinc-800" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FISIK KARAKTER --- */}
      <motion.div
        animate={{ y: isMoving ? [0, -6, 0] : 0 }} 
        transition={{ repeat: Infinity, duration: bounceDuration, ease: "easeInOut" }}
        className="relative w-full h-full"
      >
        {/* Pita untuk Cewek */}
        {config.bow && (
          <svg viewBox="0 0 24 24" className="absolute -top-3 right-0 w-8 h-8 text-rose-500 z-20 drop-shadow-sm">
            <path fill="currentColor" d="M12 12c-1.5-1-4-3-4-5s1.5-3 3-3 2 1.5 3 2.5c1-1 1.5-2.5 3-2.5s3 1 3 3-2.5 4-4 5c1.5 1 4 3 4 5s-1.5 3-3 3-2-1.5-3-2.5c-1 1-1.5 2.5-3 2.5s-3-1-3-3 2.5-4 4-5z"/>
          </svg>
        )}

        {/* Badan Karakter */}
        <div className={`w-12 h-12 rounded-[22px] shadow-xl flex items-center justify-center relative z-10 mx-auto transition-colors duration-500 ${config.colorBody} ${config.colorText}`}>
           {gender === 'boy' ? <FaceBoy /> : <FaceGirl />}
        </div>

        {/* Kaki Kiri */}
        <motion.div
           animate={{ y: isMoving ? [0, -4, 0] : 0 }}
           transition={{ repeat: Infinity, duration: bounceDuration, ease: "easeInOut", delay: 0.1 }}
           className={`absolute -bottom-1.5 left-3 w-2.5 h-4 rounded-full z-0 ${config.colorBody}`}
        />
        {/* Kaki Kanan */}
        <motion.div
           animate={{ y: isMoving ? [0, -4, 0] : 0 }}
           transition={{ repeat: Infinity, duration: bounceDuration, ease: "easeInOut", delay: 0.25 }}
           className={`absolute -bottom-1.5 right-3 w-2.5 h-4 rounded-full z-0 ${config.colorBody}`}
        />
      </motion.div>
    </motion.div>
  );
}

// Komponen Marquee Tech Stack
function TechMarquee() {
  const techList = [
    "Next.js", "Golang", "Laravel", "Supabase", "React-Three-Fiber", 
    "Three.js", "ESP32", "MQTT", "CapCut", "Wireshark"
  ];

  return (
    <div 
      className="w-full relative overflow-hidden py-4 border-y border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-md"
      style={{ 
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", 
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" 
      }}
    >
      <motion.div
        className="flex whitespace-nowrap items-center w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 35, repeat: Infinity }}
      >
        {[...techList, ...techList].map((tech, idx) => (
          <div key={idx} className="flex items-center gap-10 px-5">
            <span className="text-xs md:text-sm font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.25em] select-none">
              {tech}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// SpotlightCard (Upgraded for Tactile Feedback on Click)
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
      onClick={(e) => {
        if (onClick) {
          handleTactileFeedback();
          onClick();
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] shadow-sm transition-colors hover:border-zinc-300 dark:hover:border-zinc-800 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(161,161,170,0.1), transparent 40%)`, 
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
      onMouseMove={handleMouse} onMouseLeave={reset} 
      onClick={handleTactileFeedback}
      animate={{ x: position.x, y: position.y }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
      className="w-12 h-12 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-black dark:text-white transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black z-10 shadow-sm"
    >
      {children}
    </motion.a>
  );
}