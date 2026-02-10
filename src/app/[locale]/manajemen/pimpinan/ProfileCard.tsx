"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

interface ProfileCardProps {
  name: string;
  position: string;
  photo: string;
  variants?: Variants;
  size?: "large" | "medium";
}

export default function ProfileCard({
  name,
  position,
  photo,
  variants,
  size = "medium",
}: ProfileCardProps) {
  const isLarge = size === "large";
  const imageSize = isLarge ? "w-40 h-40" : "w-28 h-28";
  const cardClasses = isLarge
    ? "bg-white rounded-2xl shadow-lg p-8 text-center cursor-default hover:shadow-xl hover:-translate-y-1 transition-transform duration-300"
    : "bg-white rounded-xl p-6 shadow-md border border-transparent hover:shadow-lg hover:-translate-y-2 hover:border-unaicBlue transition-all duration-300 cursor-default";

  return (
    <motion.div variants={variants} className={cardClasses}>
      <div
        className={`mx-auto rounded-full overflow-hidden border-4 ${imageSize} ${isLarge ? "border-unaicGold mb-6" : "border-transparent hover:border-unaicBlue mb-4"}`}
      >
        <Image src={photo} alt={name} width={isLarge ? 160 : 112} height={isLarge ? 160 : 112} className="w-full h-full object-cover" />
      </div>
      <h3 className={`font-heading font-semibold text-unaicNavy mb-1 ${isLarge ? "text-xl" : "text-lg text-center"}`}>
        {name}
      </h3>
      <p className={`text-gray-600 ${isLarge ? "" : "text-center"}`}>{position}</p>
    </motion.div>
  );
}