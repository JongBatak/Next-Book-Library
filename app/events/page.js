'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function EventsPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const eventsRef = useRef([]);
  const featuredRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      const heroTl = gsap.timeline();
      heroTl
        .from('.hero-title', {
          opacity: 0,
          scale: 0.5,
          duration: 1.2,
          ease: 'back.out(1.7)'
        })
        .from('.hero-subtitle', {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.6');

      // Particle floating animation
      particlesRef.current.forEach((particle, index) => {
        if (!particle) return;
        gsap.to(particle, {
          y: `random(-100, 100)`,
          x: `random(-100, 100)`,
          duration: `random(3, 6)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.1
        });
      });

      // Events cards animation
      eventsRef.current.forEach((event, index) => {
        if (!event) return;
        
        gsap.from(event, {
          scrollTrigger: {
            trigger: event,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          scale: 0.8,
          rotationY: 90,
          duration: 1,
          delay: index * 0.1,
          ease: 'back.out(1.7)'
        });

        // Hover animation
        event.addEventListener('mouseenter', () => {
          gsap.to(event, {
            scale: 1.05,
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        event.addEventListener('mouseleave', () => {
          gsap.to(event, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });

      // Featured event animation
      if (featuredRef.current) {
        gsap.from(featuredRef.current, {
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          x: -100,
          rotation: -10,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)'
        });

        // Glowing pulse effect
        gsap.to(featuredRef.current, {
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.4)',
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Infinite text scroll animation
      const scrollTexts = document.querySelectorAll('.scroll-text');
      scrollTexts.forEach((text) => {
        gsap.to(text, {
          x: '-100%',
          duration: 20,
          repeat: -1,
          ease: 'none'
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const upcomingEvents = [
    {
      title: 'Digital Reading Revolution',
      date: 'March 15, 2026',
      time: '10:00 AM - 12:00 PM',
      type: 'Workshop',
      category: 'Technology',
      description: 'Learn how to maximize your digital reading experience with e-readers and apps.',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400&h=300',
      attendees: 45
    },
    {
      title: 'Book Club: Sci-Fi Edition',
      date: 'March 20, 2026',
      time: '6:00 PM - 8:00 PM',
      type: 'Book Club',
      category: 'Community',
      description: 'Join us for an exciting discussion on contemporary science fiction literature.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=400&h=300',
      attendees: 32
    },
    {
      title: 'Author Meet & Greet',
      date: 'March 25, 2026',
      time: '3:00 PM - 5:00 PM',
      type: 'Special Event',
      category: 'Meet & Greet',
      description: 'Meet bestselling authors and get your books signed in this exclusive event.',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=400&h=300',
      attendees: 120
    },
    {
      title: 'Kids Reading Hour',
      date: 'March 28, 2026',
      time: '2:00 PM - 3:30 PM',
      type: 'Kids Event',
      category: 'Children',
      description: 'Interactive storytelling session for children aged 5-12 with fun activities.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400&h=300',
      attendees: 28
    },
    {
      title: 'Poetry Night',
      date: 'April 2, 2026',
      time: '7:00 PM - 9:00 PM',
      type: 'Performance',
      category: 'Arts',
      description: 'An evening of spoken word, poetry readings, and creative expression.',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400&h=300',
      attendees: 55
    },
    {
      title: 'Library Tech Showcase',
      date: 'April 8, 2026',
      time: '11:00 AM - 4:00 PM',
      type: 'Exhibition',
      category: 'Technology',
      description: 'Explore the latest in library technology, AR/VR reading experiences, and AI recommendations.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400&h=300',
      attendees: 200
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            ref={el => particlesRef.current[i] = el}
            className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section ref={heroRef} className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="text-9xl font-bold text-white animate-pulse">EVENTS</div>
          </div>
          
          <div className="text-center max-w-5xl relative z-10">
            <h1 className="hero-title text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-6 leading-tight">
              Upcoming Events
            </h1>
            <p className="hero-subtitle text-2xl md:text-3xl text-white/90 leading-relaxed">
              Join us for workshops, book clubs, author meet-ups, and more exciting library events!
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Featured Event */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold text-white text-center mb-16">Featured Event</h2>
            <div
              ref={featuredRef}
              className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-purple-500/50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-block px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-bold mb-4">
                    ⭐ FEATURED
                  </div>
                  <h3 className="text-5xl font-bold text-white mb-4">Library Tech Showcase</h3>
                  <p className="text-white/80 text-lg mb-6">
                    Experience the future of reading! Explore AR/VR book experiences, AI-powered recommendations, 
                    and cutting-edge library technology.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-white/70">
                      <span className="text-2xl">📅</span>
                      <span>April 8, 2026</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <span className="text-2xl">⏰</span>
                      <span>11:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <span className="text-2xl">👥</span>
                      <span>200 Attendees</span>
                    </div>
                  </div>
                  <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-xl">
                    Register Now
                  </button>
                </div>
                <div className="relative h-80 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800&h=600"
                    alt="Featured Event"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scrolling text banner */}
        <section className="py-8 bg-black/30 backdrop-blur-sm overflow-hidden">
          <div className="flex whitespace-nowrap">
            <div className="scroll-text flex gap-8 text-4xl font-bold text-white/20">
              <span>📚 BOOK CLUBS</span>
              <span>🎨 WORKSHOPS</span>
              <span>✍️ AUTHOR EVENTS</span>
              <span>🎭 PERFORMANCES</span>
              <span>👶 KIDS EVENTS</span>
              <span>📚 BOOK CLUBS</span>
              <span>🎨 WORKSHOPS</span>
              <span>✍️ AUTHOR EVENTS</span>
              <span>🎭 PERFORMANCES</span>
              <span>👶 KIDS EVENTS</span>
            </div>
            <div className="scroll-text flex gap-8 text-4xl font-bold text-white/20">
              <span>📚 BOOK CLUBS</span>
              <span>🎨 WORKSHOPS</span>
              <span>✍️ AUTHOR EVENTS</span>
              <span>🎭 PERFORMANCES</span>
              <span>👶 KIDS EVENTS</span>
              <span>📚 BOOK CLUBS</span>
              <span>🎨 WORKSHOPS</span>
              <span>✍️ AUTHOR EVENTS</span>
              <span>🎭 PERFORMANCES</span>
              <span>👶 KIDS EVENTS</span>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold text-white text-center mb-16">All Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  ref={el => eventsRef.current[index] = el}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500 transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
                      {event.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-white/70 mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <span>📅</span>
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <span>⏰</span>
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <span>👥</span>
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    <button className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6">Never Miss an Event</h2>
            <p className="text-xl text-white/80 mb-8">
              Subscribe to our newsletter and get notified about upcoming events and special programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 backdrop-blur-xl focus:outline-none focus:border-purple-500 flex-1 max-w-md"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
