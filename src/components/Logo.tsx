
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  onClick?: () => void;
  clickable?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "h-10 w-10", 
  showText = true, 
  onClick,
  clickable = false 
}) => {
  const content = (
    <>
      <img 
        src="/lovable-uploads/3500a1ab-63b4-4cce-8323-b9b82f0e1fc1.png" 
        alt="Ιατρικό Λογότυπο" 
        className={className}
      />
      {showText && (
        <span className="text-xl font-bold text-greek-blue">Ενημέρωση προμηθευτών</span>
      )}
    </>
  );

  if (clickable && onClick) {
    return (
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onClick}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {content}
    </div>
  );
};

export default Logo;
