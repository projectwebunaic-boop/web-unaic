"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  backgroundImage?: string;
}

export default function HeroSection({
  title,
  subtitle,
  children,
  className = "",
  backgroundImage,
}: HeroSectionProps) {
  return (
    <section
      className={`relative w-full bg-gradient-to-r from-unaicBlue to-unaicNavy flex flex-col justify-center items-center text-center px-4 overflow-hidden ${className}`}
    >
      {/* Background Image & Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-unaicNavy/80 mix-blend-multiply" />
        </div>
      )}

      {/* Decorative Wave */}
      <svg
        className="absolute bottom-0 left-0 w-full h-24 md:h-32 z-10"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="white"
          fillOpacity="0.3"
          d="M0,224L48,197.3C96,171,192,117,288,117.3C384,117,480,171,576,197.3C672,224,768,224,864,197.3C960,171,1056,117,1152,117.3C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="relative z-20 max-w-4xl mx-auto pt-44 pb-20 md:pt-48 md:pb-32"
      >
        <h1 className="font-heading text-white font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-4 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white text-lg sm:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">
            {subtitle}
          </p>
        )}
        {children}
      </motion.div>
    </section>
  );
}
