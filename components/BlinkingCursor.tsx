'use client';

import { motion } from "motion/react";

export function Cursor() {
  return (
    <motion.div
      className="bg-green-accent w-5 h-3 sm:w-10 sm:h-6 translate-y-4"
      data-name="Cursor"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 1.06,
        times: [0, 0.5, 0.5, 1],
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}
