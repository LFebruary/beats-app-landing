"use client";

import { Lacquer } from "next/font/google";
import {
  motion,
  useAnimate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type React from "react";

const lacquer = Lacquer({
  weight: "400",
  subsets: ["latin"],
});

export default function AnimatedLogo() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] =
    useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = useMemo(() => ({ stiffness: 1000, damping: 100 }), []);
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const tailX = useTransform(springX, (latest) => latest - 20);
  const tailY = useTransform(springY, (latest) => latest - 20);

  useEffect(() => {
    const flickerAnimation = async () => {
      await animate([
        [".logo-text", { opacity: 1 }, { duration: 0.1 }],
        [".logo-text", { opacity: 0.3 }, { duration: 0.05 }],
        [".logo-text", { opacity: 1 }, { duration: 0.05 }],
        [".logo-text", { opacity: 0.5 }, { duration: 0.05 }],
        [".logo-text", { opacity: 1 }, { duration: 0.2 }],
        [".logo-text", { opacity: 0.2 }, { duration: 0.05 }],
        [".logo-text", { opacity: 1 }, { duration: 0.3 }],
        [".logo-text", { opacity: 0.4 }, { duration: 0.05 }],
        [".logo-text", { opacity: 1 }, { duration: 0.1 }],
      ]);
      setIsInitialAnimationComplete(true);
    };

    flickerAnimation();
  }, [animate]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { left, top } = containerRef.current!.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    },
    [mouseX, mouseY]
  );

  const handleClick = useCallback(() => {
    const logoLetters = scope.current.querySelectorAll(".logo-letter");
    logoLetters.forEach((letter, index) => {
      animate(
        letter,
        { y: [0, -20, 0], opacity: [1, 0.5, 1] },
        {
          duration: 0.5,
          type: "spring",
          stiffness: 500,
          damping: 10,
          delay: index * 0.03,
        }
      );
    });
  }, [animate, scope]);

  const letterVariants = useMemo(
    () => ({
      hidden: { y: 20, opacity: 0 },
      visible: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: {
          delay: i * 0.05,
          duration: 0.3,
          ease: [0.33, 1, 0.68, 1],
        },
      }),
    }),
    []
  );

  const sloganVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 0.7,
        y: 0,
        transition: {
          delay: 1.2,
          duration: 0.4,
          ease: "easeOut",
        },
      },
    }),
    []
  );

  const logoLetters = useMemo(
    () =>
      "BEAT.OUENS.CLUB".split("").map((letter, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          className="logo-letter relative inline-block"
          style={{
            color: "#fff",
            transition: "text-shadow 0.3s ease-in-out",
            textShadow: isHovered
              ? `
                0 0 2px hsl(var(--primary) / 0.95),
                0 0 4px hsl(var(--primary) / 0.75),
                0 0 6px hsl(var(--primary) / 0.55),
                0 0 8px hsl(var(--primary) / 0.35)
              `
              : `
                0 0 2px rgba(255,255,255,0.95),
                0 0 4px rgba(255,255,255,0.75),
                0 0 6px rgba(255,255,255,0.55),
                0 0 8px rgba(255,255,255,0.35)
              `,
          }}
        >
          {letter}
          {isInitialAnimationComplete && (
            <motion.span
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                color: "transparent",
                WebkitTextStroke: "1px hsl(var(--primary))",
                textShadow: "none",
              }}
            >
              {letter}
            </motion.span>
          )}
        </motion.span>
      )),
    [letterVariants, isInitialAnimationComplete, isHovered]
  );

  return (
    <motion.div
      ref={containerRef}
      className="flex flex-col items-center justify-center gap-8 p-4 relative"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="absolute w-10 h-10 rounded-full bg-primary/20 pointer-events-none"
        style={{
          x: springX,
          y: springY,
        }}
      />
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-primary/10 pointer-events-none"
        style={{
          x: tailX,
          y: tailY,
        }}
      />
      <div ref={scope} className="relative">
        <motion.h1
          className={`logo-text ${lacquer.className} text-5xl md:text-6xl lg:text-7xl tracking-tight flex flex-wrap justify-center gap-x-2`}
        >
          {logoLetters}
        </motion.h1>
      </div>

      <motion.div
        variants={sloganVariants}
        className={`${lacquer.className} text-sm tracking-[0.3em] text-white/70 uppercase`}
        style={{
          textShadow: `
            0 0 2px rgba(255,255,255,0.3),
            0 0 4px rgba(255,255,255,0.2)
          `,
        }}
      >
        Local Beats, Global Heat
      </motion.div>
    </motion.div>
  );
}
