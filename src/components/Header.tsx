import React, { useState } from 'react';

interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const [imgLeftError, setImgLeftError] = useState(false);
  const [imgRightError, setImgRightError] = useState(false);
  const logoUrl = '/src/assets/images/tigershift_logo_1790873112272.jpg';

  const renderTigerBadge = (hasError: boolean, setError: (val: boolean) => void) => {
    if (hasError) {
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm text-white font-bold text-xs ring-2 ring-orange-200">
          🐯
        </div>
      );
    }
    return (
      <img
        src={logoUrl}
        alt="TigerShift Mascot"
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
        className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-orange-400/50 hover:scale-105 transition-transform"
      />
    );
  };

  return (
    <header className="w-full flex items-center justify-between py-2 px-1">
      <button
        onClick={onLogoClick}
        type="button"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-full"
        title="TigerShift Mascot Logo"
      >
        {renderTigerBadge(imgLeftError, setImgLeftError)}
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
          TigerShift
        </h1>
      </div>

      <button
        onClick={onLogoClick}
        type="button"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-full"
        title="TigerShift Mascot Logo"
      >
        {renderTigerBadge(imgRightError, setImgRightError)}
      </button>
    </header>
  );
};
