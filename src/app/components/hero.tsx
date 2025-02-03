"use client";

import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Lacquer } from "next/font/google";

const lacquer = Lacquer({
  weight: "400",
  subsets: ["latin"],
  preload: true,
});

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();
  const [hoverBeat, setHoverBeat] = useState(false);
  const [hoverGevaarlik, setHoverGevaarlik] = useState(false);
  const [hoverHeading, setHoverHeading] = useState(false);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
        duration: 0.6,
      },
    },
  };

  const underlineVariants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.section
      ref={ref}
      className="text-center py-20"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.h1
        className={`text-3xl md:text-5xl font-bold mb-6 text-primary ${lacquer.className}`}
        variants={itemVariants}
        onMouseEnter={() => setHoverHeading(true)}
        onMouseLeave={() => setHoverHeading(false)}
        style={{
          transition: "text-shadow 0.3s ease-in-out",
          textShadow: hoverHeading
            ? `
              0 0 4px hsl(var(--primary) / 0.5),
              0 0 8px hsl(var(--primary) / 0.5),
              0 0 12px hsl(var(--primary) / 0.5),
              0 0 16px hsl(var(--primary) / 0.5)
            `
            : `
              0 0 2px rgba(255,255,255,0.95),
              0 0 4px rgba(255,255,255,0.75),
              0 0 6px rgba(255,255,255,0.55),
              0 0 8px rgba(255,255,255,0.35)
            `,
        }}
      >
        Discover the Future of Beat Making
      </motion.h1>
      <motion.div variants={itemVariants}>
        <p className="text-lg md:text-xl text-white-600 max-w-2xl mx-auto mb-4">
          Welcome to{" "}
          <span
            className="relative inline-block"
            onMouseEnter={() => setHoverBeat(true)}
            onMouseLeave={() => setHoverBeat(false)}
          >
            <Link href="/" className="text-red-600 font-semibold relative z-10">
              beat.ouens.club
            </Link>
            <motion.span
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600"
              initial="hidden"
              animate={hoverBeat ? "visible" : "hidden"}
              variants={underlineVariants}
            />
          </span>
          , where music production meets innovation.
        </p>
        <p className="text-lg md:text-xl text-white-600 max-w-2xl mx-auto">
          Join our community of producers and artists creating beats that{" "}
          <span
            className="relative inline-block"
            onMouseEnter={() => setHoverGevaarlik(true)}
            onMouseLeave={() => setHoverGevaarlik(false)}
          >
            <span className="text-red-600 font-semibold relative z-10">
              are kak gevaarlik
            </span>
            <motion.span
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600"
              initial="hidden"
              animate={hoverGevaarlik ? "visible" : "hidden"}
              variants={underlineVariants}
            />
          </span>
          .
        </p>
      </motion.div>
    </motion.section>
  );
}
