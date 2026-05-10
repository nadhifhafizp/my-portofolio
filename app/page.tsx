"use client";

import { motion, Variants } from "framer-motion"; // <-- Menambahkan import 'Variants'
import { projects } from '../data/projects';
import { FaGithub, FaLinkedin, FaInstagram, FaDiscord, FaEnvelope, FaAward, FaExternalLinkAlt } from "react-icons/fa";
import { certificates } from "@/data/certificates";

export default function Home() {
  const webProjects = projects.filter(p => p.category === 'Web Development');
  const videoProjects = projects.filter(p => p.category === 'Creative');

  // Menambahkan tipe :Variants agar TypeScript tidak error
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-200 selection:text-indigo-900 font-sans overflow-hidden">
      
      {/* Navbar Minimalis */}
      <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto p-4 md:p-6 flex justify-between items-center">
          <span className="font-bold text-2xl tracking-tighter text-slate-900">Nadhif Hafiz Pradiptya<span className="text-blue-600">.</span></span>
          <div className="hidden md:flex space-x-8 text-sm font-semibold">
            <a href="#about" className="text-slate-500 hover:text-blue-600 transition-colors">Tentang</a>
            <a href="#projects" className="text-slate-500 hover:text-blue-600 transition-colors">Proyek</a>
            <a href="#education" className="text-slate-500 hover:text-blue-600 transition-colors">Aktivitas</a>
            <a href="#contact" className="text-slate-500 hover:text-blue-600 transition-colors">Kontak</a>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-32 pb-20 md:pt-40 md:pb-32 flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          className="flex-1 space-y-6"
          initial="hidden" animate="visible" variants={fadeUp}
        >
          <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 font-bold tracking-widest uppercase text-xs rounded-full">
            Full-stack Dev & Video Clipper
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Merangkai <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Logika</span> <br /> & Visual.
          </h1>
          <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
            Halo, saya Nadhif Hafiz Pradiptya. Saya menerjemahkan ide kompleks menjadi kode yang efisien dan memotong momen visual menjadi karya yang memukau.
          </p>
          <div className="pt-6 flex gap-4">
            <a href="#projects" className="px-8 py-3.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30 hover:-translate-y-1">
              Lihat Karya
            </a>
            <a href="#contact" className="px-8 py-3.5 bg-white border border-slate-300 text-slate-700 rounded-full font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all">
              Hubungi Saya
            </a>
          </div>
        </motion.div>

        <motion.div 
          className="flex-1 w-full flex justify-center md:justify-end"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
        >
          {/* Efek Lingkaran Melayang */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 group">
            <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-indigo-400 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
            <div className="relative w-full h-full bg-white rounded-full overflow-hidden shadow-2xl border-4 border-white flex items-center justify-center text-slate-400">
              <img src="/profile.jpeg" alt="Nadhif Hafiz Pradiptya" className="w-auto h-auto object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Tentang Saya */}
      <section id="about" className="bg-white py-24 border-y border-slate-200/60">
        {/* Menghapus konflik class max-w-6xl dan mempertahankan max-w-3xl agar teks nyaman dibaca */}
        <motion.div 
          className="mx-auto px-6 md:px-8 text-center max-w-3xl"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Membangun Sistem, Merangkai Momen.</h2>
          <p className="text-slate-600 leading-relaxed text-lg mb-6">
            Saya mengkhususkan diri dalam pengembangan aplikasi web dan pengaturan sistem IoT, sekaligus memiliki ketertarikan mendalam pada seni mengedit video. Sebagai seorang <span className="font-semibold text-blue-600">Video Clipper</span>, saya memahami pentingnya ritme, transisi, dan retensi penonton.
          </p>
        </motion.div>
      </section>

      {/* 3. Perjalanan Aktivitas */}
      <section id="education" className="py-24 bg-slate-50 max-w-6xl mx-auto px-6 md:px-8">
        <motion.div className="mb-16 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Perjalanan Aktivitas</h2>
          <p className="text-slate-500">Tempat saya belajar dan berkembang.</p>
        </motion.div>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 max-w-4xl mx-auto">
          {/* Logo UNSIKA */}
          <motion.div className="flex flex-col items-center text-center group" whileHover={{ y: -10 }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center p-6 mb-4 group-hover:shadow-xl group-hover:border-blue-200 transition-all duration-300">
              <a href="https://www.unsika.ac.id" target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                <img src="/unsika.png" alt="UNSIKA Logo" className="w-full h-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
              </a>
            </div>
            <h3 className="text-lg font-bold text-slate-900">UNSIKA</h3>
            <p className="text-slate-500 text-sm font-medium">Mahasiswa S1</p>
          </motion.div>

          {/* Logo Ruang Guru */}
          <motion.div className="flex flex-col items-center text-center group" whileHover={{ y: -10 }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <a href="https://www.ruangguru.com" target="_blank" rel="noopener noreferrer" className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center p-6 mb-4 group-hover:shadow-xl group-hover:border-blue-200 transition-all duration-300">
              <img src="/ruangguru.png" alt="Ruang Guru Logo" className="w-full h-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
            </a>
            <h3 className="text-lg font-bold text-slate-900">Ruang Guru</h3>
            <p className="text-slate-500 text-sm font-medium">Studi Independen</p>
          </motion.div>
        </div>
      </section>

      {/* 4. Spesialisasi */}
      <section className="bg-slate-900 py-24 text-slate-100">
        <motion.div className="max-w-6xl mx-auto px-6 md:px-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="mb-16 md:text-center">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Spesialisasi Teknis</h2>
            <p className="text-slate-400">Teknologi dan perangkat lunak yang saya gunakan sehari-hari.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-8">
              <h3 className="text-xl font-semibold text-blue-400 mb-6 border-b border-slate-700 pb-2">Pengembangan Web & IoT</h3>
              <AnimatedSkillBar skill="Next.js & React" rate={90} />
              <AnimatedSkillBar skill="Golang & API Development" rate={85} />
              <AnimatedSkillBar skill="IoT (ESP32 & MQTT)" rate={80} />
            </div>
            <div className="space-y-8">
              <h3 className="text-xl font-semibold text-indigo-400 mb-6 border-b border-slate-700 pb-2">Video Clipper & Kreatif</h3>
              <AnimatedSkillBar skill="Video Clipping (CapCut)" rate={95} />
              <AnimatedSkillBar skill="Highlight & Moment Selection" rate={90} />
              <AnimatedSkillBar skill="Pacing & Retention Editing" rate={85} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. Projects */}
      <section id="projects" className="py-24 max-w-6xl mx-auto px-6 md:px-8">
        <motion.div className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Arsip Proyek</h2>
          <p className="text-slate-500 text-lg">Karya yang telah dibangun dan diedit.</p>
        </motion.div>

        {/* Website */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <div className="w-3 h-8 bg-blue-600 rounded-full"></div> Pengembangan Website & Sistem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {webProjects.map((project, idx) => (
              <AnimatedProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        </div>

        {/* Video Editing */}
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <div className="w-3 h-8 bg-indigo-600 rounded-full"></div> Video Editing & Kreatif
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videoProjects.map((project, idx) => (
              <AnimatedProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Sertifikat & Pencapaian */}
      <section id="certificates" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div 
            className="mb-16 text-center"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Sertifikasi</h2>
            <p className="text-slate-500 text-lg">Validasi keahlian melalui kursus dan pelatihan profesional.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificates.map((cert, idx) => (
              <motion.a
                key={cert.id}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <FaAward size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium mb-1">{cert.issuer}</p>
                </div>
                
                <div className="mt-8 flex justify-between items-center border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cert.date}</span>
                  <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-bold">
                    LIHAT <FaExternalLinkAlt size={10} />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Hubungi Saya */}
      <section id="contact" className="bg-white py-24 border-t border-slate-200">
        <motion.div className="max-w-4xl mx-auto px-6 md:px-8 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Mari Berkolaborasi.</h2>
          <p className="text-slate-500 text-lg mb-12 max-w-2xl mx-auto">
            Tertarik untuk membahas proyek web, sistem IoT, atau butuh jasa *clipping* video? Temukan saya di platform berikut.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <ContactIcon link="mailto:nadhifhafizp@gmail.com" icon={<FaEnvelope size={28} />} hoverColor="hover:text-red-500" />
            <ContactIcon link="https://www.linkedin.com/in/nadhif-hafiz-pradiptya/" icon={<FaLinkedin size={28} />} hoverColor="hover:text-blue-600" />
            <ContactIcon link="https://github.com/nadhifhafizp" icon={<FaGithub size={28} />} hoverColor="hover:text-slate-900" />
            <ContactIcon link="https://www.instagram.com/nadhifhafizz/" icon={<FaInstagram size={28} />} hoverColor="hover:text-pink-600" />
            <ContactIcon link="https://discord.com/users/530184723578748965" icon={<FaDiscord size={28} />} hoverColor="hover:text-indigo-500" />
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-500">
          <p>© {new Date().getFullYear()} Nadhif Hafiz Pradiptya.</p>
          <div className="flex items-center gap-2">
            <span>Dibuat dengan Next.js & Framer Motion</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

// --- KOMPONEN BANTUAN DENGAN ANIMASI ---

function AnimatedSkillBar({ skill, rate }: { skill: string, rate: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold mb-3">
        <span className="text-slate-200">{skill}</span>
        <span className="text-blue-400">{rate}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <motion.div 
          className="bg-linear-to-r from-blue-600 to-indigo-500 h-2 rounded-full" 
          initial={{ width: 0 }}
          whileInView={{ width: `${rate}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  )
}

function AnimatedProjectCard({ project, index }: { project: any, index: number }) {
  return (
    <motion.a 
      href={project.link} // <-- Mengambil link dari data project
      target={project.link !== '#' ? "_blank" : "_self"} // <-- Buka di tab baru jika linknya valid (bukan '#')
      rel="noopener noreferrer"
      className="group cursor-pointer flex flex-col bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      
      <div className="aspect-video w-full bg-slate-100 rounded-2xl mb-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-slate-200/50 group-hover:bg-transparent transition-colors duration-500"></div>
        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <h4 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
        {project.title}
      </h4>
      <p className="text-slate-600 mb-6 leading-relaxed grow text-sm">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.techStack.map((tech: string, i: number) => (
          <span key={i} className="px-3 py-1 bg-slate-100 text-[11px] uppercase tracking-wider font-bold rounded-full text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
            {tech}
          </span>
        ))}
      </div>
    </motion.a>
  )
}

function ContactIcon({ link, icon, hoverColor }: { link: string, icon: React.ReactNode, hoverColor: string }) {
  return (
    <motion.a 
      href={link} 
      className={`w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 shadow-sm transition-colors duration-300 ${hoverColor}`}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.a>
  )
}