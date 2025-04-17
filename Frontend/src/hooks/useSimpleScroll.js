import { useEffect, useState, useRef } from 'react';

const useSimpleScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [direction, setDirection] = useState('down');
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Determine scroll direction
    if (currentScrollY > lastScrollY.current) {
      setDirection('down');
    } else {
      setDirection('up');
    }
    
    // Update scroll position
    setScrollY(currentScrollY);
    
    // Set scrolling state
    setIsScrolling(true);
    
    // Clear the timeout if it exists
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    // Set a timeout to detect when scrolling stops
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
    
    // Update last scroll position
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return {
    scrollY,
    isScrolling,
    direction
  };
};

export default useSimpleScroll; 