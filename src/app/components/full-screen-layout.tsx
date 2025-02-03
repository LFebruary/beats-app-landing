"use client";

import type React from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";

interface FullScreenLayoutProps {
  children: React.ReactNode;
}

export default function FullScreenLayout({ children }: FullScreenLayoutProps) {
  return (
    <div className="relative w-full min-h-screen bg-primary text-white">
      <div className="fixed inset-0 z-0">
        <BackgroundAnimation />
      </div>
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}

function BackgroundAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <motion.div ref={ref} className="absolute inset-0" style={{ opacity }}>
      <motion.svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255, 0, 0, 0.3)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          fill="url(#grid)"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: isInView ? [0.2, 0.3, 0.2] : 0,
            scale: isInView ? [1, 1.05, 1] : 0.9,
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 5,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isInView ? [0.5, 0.7, 0.5] : 0,
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 8,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
