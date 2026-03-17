export const springs = {
  standard: { type: "spring", damping: 28, stiffness: 220 },
  soft: { type: "spring", damping: 22, stiffness: 160 },
  quick: { type: "spring", damping: 32, stiffness: 400 },
};

export const staggerContainer = (staggerMs = 60) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerMs / 1000,
      delayChildren: 0.05,
    },
  },
});

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.standard,
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const crossfade = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: springs.standard,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export const overlayScale = {
  initial: { opacity: 0, scale: 0.97 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: springs.soft,
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

export const codeLineStagger = (index) => ({
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...springs.quick,
      delay: index * 0.03,
    },
  },
});

export const annotationSlide = (index) => ({
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...springs.standard,
      delay: 0.1 + index * 0.03,
    },
  },
});

export const barGrow = (index, width) => ({
  hidden: { width: 0, opacity: 0 },
  visible: {
    width,
    opacity: 1,
    transition: {
      ...springs.standard,
      delay: index * 0.06,
    },
  },
});

export const hoverLift = {
  rest: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  hover: {
    y: -2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: springs.quick,
  },
};

export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1 },
  tap: { scale: 0.97 },
};
