import React, { useRef, useState, useEffect } from 'react';

export default function ResponsiveScale({ children, defaultWidth, defaultHeight, className = '', style = {} }) {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [innerHeight, setInnerHeight] = useState(defaultHeight || 0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        let newScale = 1;
        if (width < defaultWidth) {
          newScale = width / defaultWidth;
        }
        setScale(newScale);
        
        if (!defaultHeight && innerRef.current) {
          setInnerHeight(innerRef.current.getBoundingClientRect().height / newScale);
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    // Initial measurement
    if (!defaultHeight && innerRef.current) {
      setInnerHeight(innerRef.current.getBoundingClientRect().height / scale);
    }

    return () => observer.disconnect();
  }, [defaultWidth, defaultHeight]);

  const finalHeight = defaultHeight || innerHeight;

  return (
    <div 
      ref={containerRef} 
      className={`scale-wrapper ${className}`} 
      style={{ 
        position: 'relative',
        width: '100%', 
        overflow: 'visible', 
        height: scale < 1 && finalHeight ? finalHeight * scale : (finalHeight || 'auto'),
        ...style 
      }}
    >
      <div 
        ref={innerRef}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: defaultWidth, 
          height: defaultHeight || 'auto',
          transform: `scale(${scale})`, 
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}
