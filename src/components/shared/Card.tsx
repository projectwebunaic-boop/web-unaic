import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { FiArrowRight } from "react-icons/fi";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}

export default function Card({ icon, title, description, link, linkText }: CardProps) {
  const cardContent = (
    <>
      <motion.div className="flex h-16 w-16 items-center justify-center rounded-full bg-unaicNavy/10" whileHover={{ rotate: 12, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
        {icon}
      </motion.div>
      <h3 className="mt-4 text-xl font-bold text-unaicNavy">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {link && linkText && (
        <div className="mt-6 flex items-center gap-1 font-medium text-unaicGold transition hover:text-unaicNavy">
          {linkText} <FiArrowRight />
        </div>
      )}
    </>
  );

  const cardClasses = "flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-unaicGold/20 hover:border-b-4 hover:border-unaicGold";

  return link ? (
    <Link href={link} className={cardClasses}>
      {cardContent}
    </Link>
  ) : (
    <div className={cardClasses}>{cardContent}</div>
  );
}