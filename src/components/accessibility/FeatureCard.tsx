import React from 'react';
import DynamicIcon from '../global/DynamicIcon';

interface FeatureCardProps {
  icon: string;
  title: string;
  states: { name: string }[];
  currentStateIndex: number;
  onClick: () => void;
  isToggle?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, states, currentStateIndex, onClick, isToggle = false }) => {
  const currentStateName = states[currentStateIndex]?.name || (currentStateIndex ? 'Aktif' : 'Nonaktif');

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 text-center bg-white rounded-xl border border-[#eaeaea] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 aspect-square focus:ring-2 focus:ring-[#FFD600] focus:outline-none"
    >
      <DynamicIcon name={icon} size={32} className="text-unaicNavy mb-2" />
      <h3 className="font-bold text-sm text-[#002B6B] mb-2 leading-tight">{title}</h3>
      <p className="text-xs text-gray-600 mb-2">{currentStateName}</p>
      {!isToggle && (
        <div className="flex gap-1">
          {states.map((_, index) => (
            <span
              key={index}
              className={`block w-1.5 h-1.5 rounded-full transition-colors ${currentStateIndex === index ? 'bg-[#FFD600]' : 'bg-gray-300'}`}
            ></span>
          ))}
        </div>
      )}
    </button>
  );
};

export default FeatureCard;
