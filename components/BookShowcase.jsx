'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

const BookScene = dynamic(() => import('@/components/3d/BookScene'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse text-white/60 text-lg">Loading 3D Experience...</div>
    </div>
  )
});

gsap.registerPlugin(ScrollTrigger);

export default function BookShowcase() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power3.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">World</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            A medieval fantasy book that brings stories to life. Interact, rotate, and discover every detail.
          </p>
        </div>

        {/* 3D Model Container - Full Width */}
        <div className="w-full h-[70vh] min-h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 shadow-2xl">
          <BookScene />
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            <span className="inline-block mr-4">🖱️ Drag to rotate</span>
            <span className="inline-block mr-4">🔍 Scroll to zoom</span>
            <span className="inline-block">✨ Explore every angle</span>
          </p>
        </div>
      </div>
    </section>
  );
}
