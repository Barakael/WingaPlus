import React from 'react';

interface BrandLogoProps {
  variant?: 'auth' | 'navbar';
}

const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'navbar' }) => {
  const isAuth = variant === 'auth';

  return (
    <div
      className={[
        'inline-flex items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-lg ring-1 ring-black/5 dark:border-slate-700/80 dark:bg-slate-900/90 dark:ring-white/10',
        isAuth ? 'px-4 py-3' : 'px-3 py-2',
      ].join(' ')}
    >
      <img
        src="/logo.png"
        alt="Winga Pro"
        className={[
          'block w-auto object-contain',
          isAuth ? 'h-16 sm:h-20' : 'h-8 sm:h-9',
        ].join(' ')}
      />
    </div>
  );
};

export default BrandLogo;