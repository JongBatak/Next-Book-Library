'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MaskedText from './ui/MaskedText';
import Image from 'next/image';

export default function Hero() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y: imageY }}
        className="absolute inset-0 w-full h-[120%]"
      >
        <Image
          src="/garden-bg.png"
          alt="Library Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </motion.div>

      {/* Content Container */}
      <motion.div 
        style={{ y: contentY, opacity }}
        className="relative h-full flex items-center justify-center px-6 md:px-12"
      >
        <div className="max-w-7xl w-full">
          {/* Small Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 md:mb-6"
          >
            <p className="text-white/80 text-xs md:text-sm tracking-[0.3em] font-light uppercase">
              Unlock Your
            </p>
          </motion.div>

          {/* Main Headlines with Masked Reveal */}
          <div className="space-y-2 md:space-y-4 mb-8 md:mb-12">
            <MaskedText delay={0.3}>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-none tracking-tight">
                KNOWLEDGE
              </h1>
            </MaskedText>

            <MaskedText delay={0.5}>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white/95 leading-none italic">
                at Digitopia
              </h2>
            </MaskedText>
          </div>

          {/* Subtext */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12 md:mb-16"
          >
            <p className="text-white/70 text-base md:text-lg max-w-2xl leading-relaxed font-light">
              Access thousands of books, journals, and digital resources anytime, anywhere.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <MagneticButton />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs uppercase tracking-wider">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"
          />
        </div>
      </motion.div>

      {/* Marquee Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm py-4 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-12 text-white/60 text-sm font-light tracking-[0.2em]">
              <span>OPEN 24 HOURS</span>
              <span>•</span>
              <span>DIGITAL ACCESS</span>
              <span>•</span>
              <span>FREE WIFI</span>
              <span>•</span>
              <span>STUDY ROOMS</span>
              <span>•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Magnetic Button Component
function MagneticButton() {
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'translate(0, 0)';
    }
  };

  return (
    <div
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href="/catalog"
        ref={buttonRef}
        className="group relative inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-white text-black font-medium text-sm md:text-base tracking-wide overflow-hidden transition-all duration-300 ease-out"
      >
        <span className="relative z-10">Explore Catalog</span>
        <motion.span
          className="relative z-10"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.span>
        
        {/* Hover Effect */}
        <span className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400 ease-out" />
        
        <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 gap-3">
          <span>Explore Catalog</span>
          <span>→</span>
        </span>
      </a>
    </div>
  );
}
