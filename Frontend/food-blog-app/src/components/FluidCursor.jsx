import React, { useEffect, useRef, useState } from 'react';
import useFluidCursor from '../hooks/useFluideCursor';

const FluidCursor = () => {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Skip fluid cursor on mobile devices due to performance concerns
    if (canvasRef.current && !isMobile) {
      // Set canvas to fill the screen
      const setCanvasSize = () => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        }
      };

      setCanvasSize();
      window.addEventListener('resize', setCanvasSize);

      // Initialize fluid cursor
      useFluidCursor();

      return () => {
        window.removeEventListener('resize', setCanvasSize);
        window.removeEventListener('resize', checkMobile);
      };
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  // Don't render canvas on mobile devices
  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      id="fluid"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
};

export default FluidCursor; 