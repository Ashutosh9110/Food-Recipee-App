import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Only show cursor after first mouse movement
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || 
          e.target.tagName === 'BUTTON' || 
          e.target.classList.contains('card') ||
          e.target.closest('.card') ||
          e.target.closest('a') ||
          e.target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  // Don't render the cursor if it's not visible yet
  if (!isVisible) return null;

  const cursorStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, -50%)',
    position: 'fixed',
    width: '8px',
    height: '8px',
    backgroundColor: 'white',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 9999,
    mixBlendMode: 'difference',
    transition: 'opacity 0.15s ease-in-out',
    filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.5))'
  };

  const ringStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
    position: 'fixed',
    width: '40px',
    height: '40px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 9998,
    transition: 'all 0.15s ease-in-out',
    opacity: isHovering ? 0.8 : 0.5
  };

  return (
    <div className="cursor-container" style={{ pointerEvents: 'none' }}>
      <div className="cursor-dot" style={cursorStyle} />
      <div className="cursor-ring" style={ringStyle} />
    </div>
  );
} 