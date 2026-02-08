'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function MaskedText({ children, delay = 0, once = true, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: "0%" } : { y: "100%" }}
        transition={{
          duration: 1,
          delay,
          ease: [0.33, 1, 0.68, 1] // Custom cubic-bezier for premium feel
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
