'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import MaskedText from './ui/MaskedText';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-white py-32 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left - Big Statement */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="text-sm tracking-[0.3em] uppercase text-gray-500 font-light">
                About Us
              </span>
            </motion.div>

            <div className="space-y-4">
              <MaskedText delay={0.2}>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1]">
                  WE ARE THE
                </h2>
              </MaskedText>
              <MaskedText delay={0.4}>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif italic text-gray-900 leading-[1.1]">
                  Future of Reading
                </h2>
              </MaskedText>
            </div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-gray-200"
            >
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900">50K+</h3>
                <p className="text-sm text-gray-500 mt-2">Books</p>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900">24/7</h3>
                <p className="text-sm text-gray-500 mt-2">Access</p>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900">15K+</h3>
                <p className="text-sm text-gray-500 mt-2">Members</p>
              </div>
            </motion.div>
          </div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="space-y-6">
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                E-Library Digitopia is more than just a digital library—it's a gateway to limitless knowledge. 
                We've curated an extensive collection spanning academic journals, fiction, non-fiction, 
                research papers, and multimedia resources.
              </p>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Our mission is to democratize access to information, empowering students, researchers, 
                and lifelong learners with the tools they need to excel. With advanced search capabilities, 
                personalized recommendations, and seamless cross-device syncing, learning has never been 
                more accessible.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                {[
                  'Digital Downloads',
                  'Audio Books',
                  'Research Databases',
                  'Study Rooms',
                  'Mobile App',
                  'AI Recommendations'
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="pt-8"
              >
                <button className="group relative px-10 py-4 bg-gray-900 text-white font-medium overflow-hidden transition-all duration-300 hover:px-12">
                  <span className="relative z-10 flex items-center gap-2">
                    Learn More
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
