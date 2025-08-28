import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  threshold?: number;
}

export function LazyImage({ 
  src, 
  alt, 
  placeholder, 
  fallback, 
  className = "", 
  containerClassName = "",
  threshold = 0.1,
  ...props 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(false);
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${containerClassName}`}>
      {isInView && (
        <>
          <motion.img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`transition-opacity duration-300 ${className} ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
            {...props}
          />
          
          {/* Loading placeholder */}
          {!isLoaded && !isError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              {placeholder || (
                <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-orange rounded-full animate-spin" />
              )}
            </div>
          )}
          
          {/* Error fallback */}
          {isError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              {fallback || (
                <div className="text-gray-400 dark:text-gray-600 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 opacity-50">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                  <p className="text-xs">Failed to load</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Initial placeholder while not in view */}
      {!isInView && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
      )}
    </div>
  );
}