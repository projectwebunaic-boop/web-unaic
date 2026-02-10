import { motion } from "framer-motion";
import { Link } from '@/i18n/routing';
import { Button } from "@/components/shared/Button";

interface StaffCardProps {
  id: string;
  name: string;
  position: string;
  unit: string;
  image: string;
  category: 'dosen' | 'karyawan';
  slug?: string;
}

export default function StaffCard({ id, name, position, unit, image, category, slug }: StaffCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-[#002C6E] mb-2 line-clamp-2">{name}</h3>
        <p className="text-sm font-medium text-[#FFD700] mb-1">{position}</p>
        <p className="text-sm text-gray-600 mb-4">{unit}</p>
        {category === 'dosen' && slug && (
          <Link href={`/akademik/dosen/${slug}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-[#FFD700] text-[#002C6E] hover:bg-[#FFD700] hover:text-[#002C6E]"
            >
              Lihat Profil
            </Button>
          </Link>
        )}
        {category === 'karyawan' && (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-[#FFD700] text-[#002C6E] hover:bg-[#FFD700] hover:text-[#002C6E]"
            disabled
          >
            Lihat Profil
          </Button>
        )}
      </div>
    </motion.div>
  );
}
