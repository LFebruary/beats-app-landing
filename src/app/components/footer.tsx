"use client";

import { motion } from "motion/react";
import { Lacquer } from "next/font/google";

const lacquer = Lacquer({
  weight: "400",
  subsets: ["latin"],
  preload: true,
});

export default function Footer() {
  return (
    <motion.footer
      className="bg-red-600 py-8 mt-20 max-w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4, duration: 0.6 }}
    >
      <div className="container mx-auto text-center">
        <motion.p
          className={`text-lg font-bold mb-4 text-white w-full ${lacquer.className}`}
          whileHover={{ fontSize: 32 }}
        >
          It&apos;s gonna be nxa
        </motion.p>
        <p className="text-sm text-white/80">
          © {new Date().getFullYear()} beat.ouens.club by Lyle February
          (LyleOG).
        </p>
        <p>All rights reserved.</p>
      </div>
    </motion.footer>
  );
}
