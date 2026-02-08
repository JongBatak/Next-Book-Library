'use client';

import { motion } from 'framer-motion';

export default function MaskedText({ children, delay = 0 }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{
          duration: 1,
          delay,
          ease: [0.33, 1, 0.68, 1]
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}