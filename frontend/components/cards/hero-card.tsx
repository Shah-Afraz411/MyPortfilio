"use client";

import { motion } from "framer-motion";

export function HeroCard() {
  return (
    <div className="w-full max-w-5xl px-8 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-2"
      >
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium leading-tight tracking-tight">
          <motion.span
            className="block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Syed Afraz
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            is an <span className="relative inline-block">
              <span className="relative z-10">AI</span>
              <motion.span
                className="absolute inset-0 bg-accent -z-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                style={{ transformOrigin: "left" }}
              />
            </span>
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            Engineer &
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="relative inline-block">
              <span className="relative z-10">ML</span>
              <motion.span
                className="absolute inset-0 bg-accent -z-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                style={{ transformOrigin: "left" }}
              />
            </span> Specialist
          </motion.span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-8 text-xl text-muted-foreground max-w-2xl"
      >
        AI Engineer & ML Specialist building scalable intelligent systems
      </motion.p>
    </div>
  );
}
