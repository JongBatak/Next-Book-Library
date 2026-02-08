'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function AnimatedBook() {
  const bookRef = useRef(null);
  const leftPagesRef = useRef(null);
  const rightPagesRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const rotationAnimRef = useRef(null);

  useEffect(() => {
    // Initial continuous rotation animation (lurus 90 derajat)
    rotationAnimRef.current = gsap.to(bookRef.current, {
      rotateY: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    });

    // Floating animation
    gsap.to(bookRef.current, {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Mouse move handler
    const handleMouseMove = (e) => {
      if (!containerRef.current || !bookRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const bookCenterX = rect.left + rect.width / 2;
      const bookCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - bookCenterX, 2) + 
        Math.pow(e.clientY - bookCenterY, 2)
      );

      // Parameter: buku bereaksi dalam radius 300px
      const interactionRadius = 300;

      if (distance < interactionRadius) {
        // Cursor dekat - pause rotation, face forward, dan buka buku
        if (rotationAnimRef.current) {
          rotationAnimRef.current.pause();
        }

        // Face forward (rotateY = 0) untuk ngebuka buku
        gsap.to(bookRef.current, {
          rotateY: 0,
          duration: 0.5,
          ease: 'power2.out'
        });

        // Buka buku ke tengah
        if (!isHovering) {
          setIsHovering(true);
          gsap.to(leftPagesRef.current, {
            rotateY: -140,
            duration: 1,
            ease: 'power2.out'
          });
          gsap.to(rightPagesRef.current, {
            rotateY: 140,
            duration: 1,
            ease: 'power2.out'
          });
        }
      } else {
        // Cursor jauh - tutup buku dan lanjutkan rotasi
        if (isHovering) {
          setIsHovering(false);
          gsap.to(leftPagesRef.current, {
            rotateY: 0,
            duration: 1,
            ease: 'power2.out'
          });
          gsap.to(rightPagesRef.current, {
            rotateY: 0,
            duration: 1,
            ease: 'power2.out'
          });

          // Resume spinning
          setTimeout(() => {
            if (rotationAnimRef.current) {
              rotationAnimRef.current.resume();
            }
          }, 1000);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rotationAnimRef.current) {
        rotationAnimRef.current.kill();
      }
    };
  }, [isHovering]);

  return (
    <div className="flex items-center justify-center h-full" ref={containerRef}>
      <div 
        ref={bookRef}
        className="book-container"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="book">
          {/* Book Cover Front */}
          <div className="book-cover front">
            <div className="cover-content">
              <div className="cover-title">E-LIBRARY</div>
              <div className="cover-subtitle">PRESTASI</div>
              <div className="cover-decoration">
                <div className="line"></div>
                <div className="circle"></div>
                <div className="line"></div>
              </div>
            </div>
          </div>

          {/* Book Spine - TEBAL */}
          <div className="book-spine">
            <div className="spine-text">E-LIBRARY PRESTASI</div>
          </div>

          {/* Book Cover Back - HIGH IQ */}
          <div className="book-cover back">
            <div className="cover-content">
              <div className="cover-title-back">HIGH IQ</div>
            </div>
          </div>

          {/* Left Pages (opens to left) */}
          <div ref={leftPagesRef} className="page-stack left">
            {/* Stack of pages */}
            {Array.from({ length: 25 }).map((_, i) => (
              <div 
                key={`left-${i}`}
                className="page left-page"
                style={{
                  transform: `translateZ(${36 - i * 1.5}px)`,
                  backgroundColor: `hsl(40, 20%, ${92 - i * 0.6}%)`
                }}
              ></div>
            ))}
            {/* Inner page with lines - visible when open */}
            <div className="inner-page left-side">
              <div className="page-lines">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="line"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Pages (opens to right) */}
          <div ref={rightPagesRef} className="page-stack right">
            {/* Stack of pages */}
            {Array.from({ length: 25 }).map((_, i) => (
              <div 
                key={`right-${i}`}
                className="page right-page"
                style={{
                  transform: `translateZ(${36 - i * 1.5}px)`,
                  backgroundColor: `hsl(40, 20%, ${92 - i * 0.6}%)`
                }}
              ></div>
            ))}
            {/* Inner page with I LOVE YOU - visible when open */}
            <div className="inner-page right-side">
              <div className="love-message">
                <div className="love-text">I LOVE YOU</div>
                <svg className="heart-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .book-container {
          width: 400px;
          height: 500px;
          perspective: 3000px;
          cursor: pointer;
        }

        .book {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }

        .book-cover {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
        }

        .book-cover.front {
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          transform: translateZ(72px);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 5px solid #5b21b6;
          z-index: 20;
        }

        .book-cover.back {
          background: linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%);
          transform: translateZ(-72px) rotateY(180deg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 5px solid #4c1d95;
          z-index: 20;
        }

        .book-spine {
          position: absolute;
          width: 144px;
          height: 100%;
          background: linear-gradient(to right, 
            #4c1d95 0%, 
            #5b21b6 10%,
            #6d28d9 50%, 
            #5b21b6 90%,
            #4c1d95 100%
          );
          transform: rotateY(-90deg) translateZ(0px);
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            inset 0 0 30px rgba(0, 0, 0, 0.6),
            inset 10px 0 20px rgba(0, 0, 0, 0.3),
            inset -10px 0 20px rgba(0, 0, 0, 0.3);
          z-index: 15;
        }

        .spine-text {
          color: white;
          font-size: 16px;
          font-weight: bold;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          letter-spacing: 4px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        .page-stack {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: none;
          pointer-events: none;
        }

        .page-stack.left {
          left: 0;
          transform-origin: right center;
        }

        .page-stack.right {
          right: 0;
          transform-origin: left center;
        }

        .page {
          position: absolute;
          width: 50%;
          height: 100%;
          background: #f5f5f0;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }

        .page.left-page {
          right: 0;
          border-right: 1px solid #e0e0e0;
        }

        .page.right-page {
          left: 0;
          border-left: 1px solid #e0e0e0;
        }

        .inner-page {
          position: absolute;
          width: 50%;
          height: 100%;
          background: #faf9f7;
          padding: 40px 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
          border-radius: 3px;
          transform: translateZ(38px);
        }

        .inner-page.left-side {
          right: 0;
          border-right: 2px solid #d0d0d0;
        }

        .inner-page.right-side {
          left: 0;
          border-left: 2px solid #d0d0d0;
        }

        .page-lines {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .page-lines .line {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, 
            transparent 0%, 
            #d0d0d0 10%, 
            #d0d0d0 90%, 
            transparent 100%
          );
        }

        .love-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .love-text {
          font-size: 48px;
          font-weight: 900;
          letter-spacing: 4px;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
        }

        .heart-icon {
          width: 80px;
          height: 80px;
          color: #ec4899;
          filter: drop-shadow(0 4px 20px rgba(236, 72, 153, 0.5));
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.15);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.1);
          }
        }

        .cover-content {
          padding: 50px;
          text-align: center;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .cover-title {
          font-size: 52px;
          font-weight: 900;
          letter-spacing: 6px;
          margin-bottom: 15px;
          text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.7);
        }

        .cover-subtitle {
          font-size: 38px;
          font-weight: 600;
          letter-spacing: 8px;
          margin-bottom: 50px;
          text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.7);
        }

        .cover-title-back {
          font-size: 72px;
          font-weight: 900;
          letter-spacing: 8px;
          text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.7);
        }

        .cover-decoration {
          display: flex;
          align-items: center;
          gap: 25px;
          opacity: 0.95;
        }

        .cover-decoration .line {
          width: 60px;
          height: 4px;
          background: white;
        }

        .cover-decoration .circle {
          width: 18px;
          height: 18px;
          border: 4px solid white;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
