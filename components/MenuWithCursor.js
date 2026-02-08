'use client';

import { useState } from 'react';
import BubbleMenu from './Bubble/BubbleMenu';
import TargetCursor from './Cursor/TargetCrusor';

export default function MenuWithCursor({ items, logo }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = (isOpen) => {
    setIsMenuOpen(isOpen);
  };

  return (
    <>
      {/* TargetCursor hanya aktif saat menu terbuka */}
      {isMenuOpen && (
        <TargetCursor
          targetSelector=".pill-link"
          spinDuration={2}
          hideDefaultCursor={true}
          hoverDuration={0.3}
          parallaxOn={true}
        />
      )}
      
      <BubbleMenu
        logo={logo}
        items={items}
        onMenuClick={handleMenuToggle}
        menuAriaLabel="Toggle navigation"
        menuBg="#ffffff"
        menuContentColor="#111111"
        useFixedPosition={true}
        animationEase="back.out(1.5)"
        animationDuration={0.5}
        staggerDelay={0.12}
      />
    </>
  );
}
