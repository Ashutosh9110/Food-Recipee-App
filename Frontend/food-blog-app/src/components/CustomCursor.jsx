import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || 
          e.target.tagName === 'BUTTON' || 
          e.target.classList.contains('card') ||
          e.target.closest('.card')) {
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
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-white mix-blend-difference pointer-events-none z-50"
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{
          type: 'spring',
          damping: 20,
          mass: 0.3,
          stiffness: 300
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-24 h-24 rounded-full border border-white mix-blend-difference pointer-events-none z-40"
        animate={{
          x: position.x - 48,
          y: position.y - 48,
          opacity: isHovering ? 1 : 0.3
        }}
        transition={{
          type: 'spring',
          damping: 40,
          mass: 0.6,
          stiffness: 200
        }}
      />
    </>
  );
} 