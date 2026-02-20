import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X, ArrowUpRight } from 'lucide-react';

// --- CUSTOM HOOKS ---

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
};

// --- COMPONENTS ---

const CustomCursor = () => {
  const { x, y } = useMousePosition();
  const [hovered, setHovered] = useState(false);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorX = useSpring(useMotionValue(0), springConfig);
  const cursorY = useSpring(useMotionValue(0), springConfig);

  useEffect(() => {
    cursorX.set(x - 16); 
    cursorY.set(y - 16);
  }, [x, y, cursorX, cursorY]);

  useEffect(() => {
    const handleMouseOver = (e) => {
      if (e.target.closest('[data-hoverable="true"]')) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };
    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
      style={{ x: cursorX, y: cursorY }}
    >
      <motion.div 
        className="w-full h-full bg-white rounded-full"
        animate={{ 
          scale: hovered ? 2.5 : 1,
          opacity: 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </motion.div>
  );
};

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black text-white flex flex-col justify-between p-8 md:p-12 font-mono"
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="flex justify-between items-start">
        <span>EST. 2024</span>
        <span>PORTFOLIO</span>
      </div>
      
      <div className="text-9xl md:text-[12rem] font-bold leading-none tracking-tighter self-end overflow-hidden">
        <motion.span
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ display: 'inline-block' }}
        >
          {count}%
        </motion.span>
      </div>

      <div className="w-full h-[1px] bg-white/20 mt-4 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-white"
          style={{ width: `${count}%` }}
        />
      </div>
    </motion.div>
  );
};

const Navigation = ({ isOpen, toggle }) => {
  const links = ["WORK", "ABOUT", "SERVICES", "CONTACT"];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#0a0a0a] z-[60] flex flex-col justify-center items-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col gap-4 text-center">
            {links.map((link, i) => (
              <div key={link} className="overflow-hidden">
                <motion.a
                  href={`#${link.toLowerCase()}`}
                  className="text-6xl md:text-8xl font-black tracking-tighter hover:text-transparent hover:text-stroke-white transition-all duration-300 cursor-pointer block"
                  data-hoverable="true"
                  onClick={toggle}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%", transition: { delay: 0.1 + i * 0.1, duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                  exit={{ y: "100%", transition: { delay: i * 0.05, duration: 0.5 } }}
                >
                  {link}
                </motion.a>
              </div>
            ))}
          </div>

          <div className="overflow-hidden mt-12">
            <motion.button
              onClick={toggle}
              data-hoverable="true"
              className="text-sm md:text-base font-mono uppercase tracking-widest border border-white/30 rounded-full px-8 py-3 hover:bg-white hover:text-black transition-colors cursor-pointer"
              initial={{ y: "100%" }}
              animate={{ y: "0%", transition: { delay: 0.5, duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
              exit={{ y: "100%", transition: { duration: 0.4 } }}
            >
              Close Menu
            </motion.button>
          </div>
          
          <motion.div 
            className="absolute bottom-12 left-12 font-mono text-sm opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5, transition: { delay: 0.5 } }}
          >
            TOKYO — NEW YORK — PARIS
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const RollingText = ({ text, className = "" }) => {
  return (
    <motion.div
      className={`relative overflow-hidden flex whitespace-nowrap ${className}`}
      whileHover="hover"
      initial="initial"
      data-hoverable="true"
    >
      <div className="flex">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: 0 },
              hover: { y: "-100%", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: i * 0.03 } }
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
      <div className="absolute top-full left-0 flex text-gray-400">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: 0 },
              hover: { y: "-100%", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: i * 0.03 } }
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const { x, y } = useMousePosition();
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  
  const moveX = (x - windowWidth / 2) * 0.05;
  const moveY = (y - windowHeight / 2) * 0.05;
  const rotateX = (windowHeight / 2 - y) * 0.05; 
  const rotateY = (x - windowWidth / 2) * 0.05;

  return (
    <section className="relative h-screen flex flex-col justify-center px-6 md:px-12 overflow-hidden bg-white text-black" style={{ perspective: "1000px" }}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_6rem] -z-10" />

      <motion.div 
        className="flex flex-col z-10 mix-blend-difference text-white w-full"
        style={{ x: moveX, y: moveY, rotateX, rotateY }}
      >
        <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter flex flex-col w-full cursor-default">
          <RollingText text="CREATIVE" className="w-fit" />
          
          <motion.div
            className="relative block ml-[10vw] w-fit"
            whileHover="hover"
            initial="initial"
            data-hoverable="true"
          >
            <span className="italic text-transparent text-stroke-white block">
              DEVELOPER
            </span>
            <motion.span
              className="italic text-white absolute top-0 left-0 overflow-hidden whitespace-nowrap block"
              variants={{
                initial: { width: "0%" },
                hover: { width: "100%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }
              }}
            >
              DEVELOPER
            </motion.span>
          </motion.div>

          <RollingText text="& DESIGNER" className="self-end" />
        </h1>
      </motion.div>

      <div className="absolute bottom-12 left-0 w-full px-6 md:px-12 flex justify-between font-mono text-sm uppercase">
        <div className="flex flex-col">
          <span>Available for</span>
          <span>Freelance Work</span>
        </div>
        <div className="animate-bounce">
          Scroll to explore
        </div>
      </div>
    </section>
  );
};

const ProjectGallery = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);

  const projects = [
    { title: "VOGUE REDESIGN", category: "Editorial", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" },
    { title: "NIKE AIR CAMPAIGN", category: "E-Commerce", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop" },
    { title: "LUMIERE MUSEUM", category: "Cultural", img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1974&auto=format&fit=crop" },
    { title: "SYNTH WAVE", category: "Audio", img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" }
  ];

  return (
    <section ref={targetRef} className="h-[300vh] bg-[#0a0a0a] text-white relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-12 px-12 md:px-24">
          <div className="flex flex-col justify-center min-w-[30vw]">
             <h2 className="text-6xl md:text-8xl font-black tracking-tight mb-6">SELECTED<br/>WORKS</h2>
             <p className="font-mono text-gray-400 max-w-sm">
               A curation of digital experiences crafted with precision, motion, and purpose.
             </p>
          </div>

          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <div className="group relative w-[70vw] md:w-[45vw] aspect-[4/3] bg-gray-900 overflow-hidden flex-shrink-0 cursor-pointer" data-hoverable="true">
      <img 
        src={project.img} 
        alt={project.title} 
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out" 
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
      
      <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <div>
          <p className="font-mono text-xs mb-2 text-white/70">{project.category.toUpperCase()}</p>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">{project.title}</h3>
        </div>
        <div className="bg-white text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight size={24} />
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const services = ["Art Direction", "Web Design", "Creative Dev", "Brand Identity"];
  
  return (
    <section className="bg-white text-black py-32 px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="text-xl md:text-2xl font-mono leading-relaxed">
          <p className="mb-8">
            I build digital products that refuse to be ignored. Focusing on micro-interactions and macro-impact, I bridge the gap between design and engineering.
          </p>
          <button className="flex items-center gap-4 text-sm uppercase tracking-widest border-b border-black pb-2 hover:pl-4 transition-all" data-hoverable="true">
            Read full bio <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="border-t border-black">
          {services.map((service, i) => (
            <div key={i} className="border-b border-black py-8 flex justify-between items-center group cursor-pointer" data-hoverable="true">
              <span className="text-4xl md:text-6xl font-bold tracking-tighter group-hover:translate-x-4 transition-transform duration-300">
                {service}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                0{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white py-24 px-6 md:px-12 flex flex-col justify-between h-[80vh]">
      <div className="text-[12vw] leading-none font-black tracking-tighter text-center md:text-left">
        LET'S<br/>TALK
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 font-mono text-sm uppercase">
        <div className="flex flex-col gap-2">
          <span className="text-gray-500">Socials</span>
          <a href="#" className="hover:text-gray-400" data-hoverable="true">Instagram</a>
          <a href="#" className="hover:text-gray-400" data-hoverable="true">Twitter / X</a>
          <a href="#" className="hover:text-gray-400" data-hoverable="true">LinkedIn</a>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-500">Contact</span>
          <a href="mailto:hello@studio.com" className="hover:text-gray-400" data-hoverable="true">hello@studio.com</a>
          <span>+1 555 0192</span>
        </div>
        <div className="flex flex-col justify-end">
          <span>© 2024 Studio. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN LAYOUT COMPONENT ---

function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-white selection:bg-black selection:text-white ${loading ? 'overflow-hidden h-screen' : ''}`}>
      <style>{`
        .text-stroke-black {
          -webkit-text-stroke: 1px black;
        }
        .text-stroke-white {
          -webkit-text-stroke: 1px white;
          color: transparent;
        }
        body {
          cursor: none; 
        }
        @media (pointer: coarse) {
          body { cursor: auto; }
          .custom-cursor { display: none; }
        }
      `}</style>

      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="custom-cursor block">
        <CustomCursor />
      </div>

      <Navigation isOpen={menuOpen} toggle={() => setMenuOpen(!menuOpen)} />

      <motion.header 
        className="fixed top-0 left-0 w-full p-6 md:p-12 flex justify-between items-center z-50 mix-blend-difference text-white pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <div className="font-bold text-xl tracking-tighter pointer-events-auto" data-hoverable="true">
          M/D
        </div>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="pointer-events-auto flex items-center gap-2 font-mono text-sm uppercase group" 
          data-hoverable="true"
        >
          <span className="hidden md:block group-hover:mr-2 transition-all">
            {menuOpen ? 'Close' : 'Menu'}
          </span>
          <div className="bg-white text-black p-2 rounded-full">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </div>
        </button>
      </motion.header>

      {!loading && (
        <main>
          <Hero />
          <ProjectGallery />
          <Services />
          <Footer />
        </main>
      )}
    </div>
  );
}

// Render the Application
const root = createRoot(document.getElementById('root'));
root.render(<Portfolio />);
