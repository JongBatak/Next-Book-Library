'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative bg-black text-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold mb-4">E-LIBRARY</h3>
            <p className="text-4xl font-serif italic text-gray-400 mb-6">Digitopia</p>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Your gateway to unlimited knowledge. Access our vast collection of books, 
              journals, and resources from anywhere in the world.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-8">
              {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                >
                  <span className="text-xs font-bold">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Browse Catalog', 'Digital Resources', 'Study Rooms', 'Events', 'Research Help', 'Mobile App'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-6">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Library@prestasi.edu</li>
              <li>+62 21 1234 5678</li>
              <li className="pt-4">
                <p>Jl. Prestasi No. 123</p>
                <p>Jakarta 12345</p>
                <p>Indonesia</p>
              </li>
            </ul>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {label: 'Books', value: '12,345'}, {label: 'Members', value: '3,210'},
            {label: 'Borrowed', value: '1,234'}, {label: 'Events', value: '89'}
          ].map(s => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="bg-gray-900 p-4 rounded">
              <div className="text-sm text-gray-400">{s.label}</div>
              <div className="text-xl font-bold">{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-12 mb-12">
          <div className="max-w-2xl">
            <h4 className="text-2xl font-bold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for new arrivals, events, and library updates.
            </p>
            <form className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-black font-bold hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 E-Library Prestasi. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
}
