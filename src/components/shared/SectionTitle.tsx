"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionTitleProps {
  title?: string;
  children?: React.ReactNode;
  subtitle?: string;
  description?: string;
  align?: "left" | "center";
  color?: "navy" | "white";
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  children,
  subtitle,
  description,
  align = "center",
  color = "navy",
  className = "",
}) => {
  const isLeft = align === "left";
  const textColor = color === "navy" ? "text-unaicNavy" : "text-white";
  const descColor = color === "navy" ? "text-gray-600" : "text-blue-100";
  const subtitleColor = "text-unaicGold";

  return (
    <div className={`mb-12 ${isLeft ? "text-left" : "text-center"} ${className}`}>
      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`flex items-center gap-2 mb-3 ${isLeft ? "" : "justify-center"}`}
        >
          {isLeft && <span className="w-8 h-1 bg-unaicGold rounded-full"></span>}
          <span className={`${subtitleColor} font-bold uppercase tracking-[0.2em] text-sm`}>
            {subtitle}
          </span>
          {!isLeft && <span className="w-8 h-1 bg-unaicGold rounded-full"></span>}
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight ${textColor}`}
      >
        {title || children}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`mt-4 text-lg font-light leading-relaxed max-w-3xl ${descColor} ${isLeft ? "" : "mx-auto"
            }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionTitle;
