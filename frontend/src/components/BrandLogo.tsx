import React from 'react';

interface BrandLogoProps {
  variant?: 'auth' | 'navbar';
}

const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'navbar' }) => {
  const isAuth = variant === 'auth';
  const sizeClass = isAuth ? 'h-20 sm:h-24 mx-auto' : 'h-10 sm:h-12';

  return (
    <>
      <img
        src="/logo.png"
        alt="Winga Pro"
        className={['block dark:hidden w-auto object-contain', sizeClass].join(' ')}
      />
      <img
        src="/dark.png"
        alt="Winga Pro"
        className={['hidden dark:block w-auto object-contain', sizeClass].join(' ')}
      />
    </>
  );
};

export default BrandLogo;