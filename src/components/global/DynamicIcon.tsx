import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

const DynamicIcon = ({ name, size = 24, className }: DynamicIconProps) => {
  const IconComponent = LucideIcons[name as IconName];

  if (!IconComponent) {
    // Fallback icon atau null jika ikon tidak ditemukan
    return <LucideIcons.HelpCircle size={size} className={className} />;
  }

  // @ts-expect-error IconComponent is dynamically assigned and may not satisfy TypeScript's expectations
  return <IconComponent size={size} className={className} />;
};

export default DynamicIcon;