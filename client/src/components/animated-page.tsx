import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedPageProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: 10,
    filter: "blur(4px)",
  },
  in: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
  },
  out: {
    opacity: 0,
    x: -10,
    filter: "blur(4px)",
  }
};

const pageTransition = {
  type: "tween",
  ease: [0.165, 0.84, 0.44, 1],
  duration: 0.5
};

export default function AnimatedPage({ children }: AnimatedPageProps) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}