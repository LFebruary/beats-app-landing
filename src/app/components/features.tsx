"use client";

import { motion, useScroll, useTransform, useInView } from "motion/react";
import { Music, Users, Download, TrendingUp } from "lucide-react";
import { type JSX, useRef } from "react";
import { Lacquer } from "next/font/google";

const lacquer = Lacquer({
  weight: "400",
  subsets: ["latin"],
  preload: true,
});

type Feature = {
  icon: JSX.Element;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <Music className="w-8 h-8" />,
    title: "Crazy Beat Library",
    description:
      "Access a curated collection of beats that's gonna take your game to the next level.",
  },
  {
    icon: <Download className="w-8 h-8" />,
    title: "Easy Licensing",
    description: "No bullshit, just grab your beats and go make hits",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Producer Community",
    description:
      "Connect with other musicians in the game and build something great.",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Analytics Dashboard",
    description:
      "Keep tabs on how your beats are performing, and stay on top of it all.",
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        delay: index * 0.1,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1 + 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: index * 0.1 + 0.4, duration: 0.6 },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        delay: index * 0.1 + 0.3,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="p-6 bg-card bg-primary rounded-lg shadow-lg border-2 border-primary/20 overflow-hidden"
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 20px rgba(255,0,0,0.2)",
        transition: { duration: 0.2 },
      }}
    >
      <motion.div
        className="text-primary mb-4 neon-text"
        variants={iconVariants}
      >
        {feature.icon}
      </motion.div>
      <motion.h3
        className={`text-xl font-bold mb-2 text-foreground neon-text ${lacquer.className}`}
        variants={titleVariants}
        style={{
          textShadow: `
            0 0 1px rgba(255,255,255,0.7),
            0 0 2px rgba(255,255,255,0.7),
            0 0 3px rgba(255,255,255,0.7)
          `,
          letterSpacing: "0.05em",
        }}
      >
        {feature.title}
      </motion.h3>
      <motion.p className="text-muted-foreground" variants={textVariants}>
        {feature.description}
      </motion.p>
    </motion.div>
  );
}

export default function Features() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.2, 1, 0.2]
  );

  return (
    <section className="py-20 px-4 relative overflow-hidden" ref={containerRef}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background z-0"
        style={{
          y: backgroundY,
          opacity: backgroundOpacity,
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}
