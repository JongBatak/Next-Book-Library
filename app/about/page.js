'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import BookShowcase from '@/components/BookShowcase';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const statsRef = useRef([]);
  const timelineRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title animation
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: 'power4.out'
      });

      // Stagger cards animation
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 80,
        rotation: -5,
        stagger: 0.2,
        duration: 1,
        ease: 'back.out(1.7)'
      });

      // Stats counter animation
      statsRef.current.forEach((stat, index) => {
        if (!stat) return;
        const valueElement = stat.querySelector('.stat-value');
        const endValue = parseInt(valueElement.textContent);
        
        gsap.from(valueElement, {
          scrollTrigger: {
            trigger: stat,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          textContent: 0,
          duration: 2,
          delay: index * 0.1,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function() {
            valueElement.textContent = Math.floor(this.targets()[0].textContent);
          }
        });
      });

      // Timeline items animation
      timelineRef.current.forEach((item, index) => {
        if (!item) return;
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          x: index % 2 === 0 ? -100 : 100,
          duration: 1,
          ease: 'power3.out'
        });
      });

      // Floating animation for cards
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.to(card, {
          y: '-=20',
          duration: 2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const values = [
    { icon: '📚', title: 'Knowledge', description: 'Empowering minds through accessible digital resources' },
    { icon: '🌟', title: 'Excellence', description: 'Committed to delivering the highest quality service' },
    { icon: '🤝', title: 'Community', description: 'Building connections through shared learning experiences' },
    { icon: '💡', title: 'Innovation', description: 'Leveraging technology to revolutionize reading' }
  ];

  const stats = [
    { value: 50000, label: 'Books Available' },
    { value: 25000, label: 'Active Members' },
    { value: 150, label: 'Daily Visitors' },
    { value: 95, label: '% Satisfaction' }
  ];

  const timeline = [
    { year: '2020', title: 'Foundation', description: 'E-Library Digitopia was established with a vision to democratize access to knowledge.' },
    { year: '2021', title: 'Digital Expansion', description: 'Launched our digital platform with 10,000+ ebooks and audiobooks.' },
    { year: '2022', title: 'Community Growth', description: 'Reached 10,000 active members and introduced community reading groups.' },
    { year: '2023', title: 'Innovation Hub', description: 'Integrated AI-powered recommendations and interactive learning features.' },
    { year: '2024', title: 'Global Reach', description: 'Expanded internationally, serving readers across 50+ countries.' }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated CSS Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div ref={titleRef} className="text-center max-w-5xl">
            <h1 className="text-7xl md:text-9xl font-bold text-white mb-6 leading-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              We're more than just a library. We're a community of learners, dreamers, and knowledge seekers 
              dedicated to making information accessible to everyone, everywhere.
            </p>
          </div>
        </section>

        {/* 3D Book Showcase - Full Section */}
        <BookShowcase />

        {/* Values Section */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold text-white text-center mb-16">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  ref={el => cardsRef.current[index] = el}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-purple-500 transition-all duration-300 group"
                >
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-white/70 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  ref={el => statsRef.current[index] = el}
                  className="text-center"
                >
                  <div className="stat-value text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-white text-center mb-16">Our Journey</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
              
              {timeline.map((item, index) => (
                <div
                  key={index}
                  ref={el => timelineRef.current[index] = el}
                  className={`relative mb-16 ${index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'}`}
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-purple-500 transition-all duration-300">
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-slate-900"></div>
                    <div className="text-4xl font-bold text-purple-400 mb-3">{item.year}</div>
                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-white/70 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6">Join Our Community</h2>
            <p className="text-xl text-white/80 mb-8">
              Be part of something bigger. Start your journey with us today.
            </p>
            <Link
              href="/catalog"
              className="inline-block px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-2xl"
            >
              Explore Catalog
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
