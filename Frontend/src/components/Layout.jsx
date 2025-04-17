import React, { useRef, useEffect } from 'react'
import { useLocomotiveScroll } from 'react-locomotive-scroll'

const Layout = ({ children }) => {
  const { scroll } = useLocomotiveScroll()
  const contentRef = useRef(null)
  
  useEffect(() => {
    if (scroll) {
      // Refresh locomotive scroll after content changes
      scroll.update();
    }
  }, [scroll, children]);

  return (
    <div data-scroll-section ref={contentRef}>
      {children}
    </div>
  )
}

export default Layout 