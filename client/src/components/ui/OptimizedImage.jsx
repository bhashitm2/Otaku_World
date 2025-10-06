// src/components/ui/OptimizedImage.jsx - High-performance image component
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/useAnimation';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  placeholder = '/placeholder-anime.jpg',
  fallback = '/placeholder-anime.jpg',
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  ...props
}) => {
  const [isError, setIsError] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  
  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc || baseSrc.includes('placeholder')) return '';
    
    const sizes = [320, 640, 1024, 1280];
    return sizes
      .map(size => `${baseSrc}?w=${size} ${size}w`)
      .join(', ');
  };
  
  const handleError = () => {
    setIsError(true);
  };
  
  // Use fallback if src is empty, null, or just whitespace
  const effectiveSrc = (!src || src.trim() === '') ? fallback : src;
  
  const imageProps = {
    src: isError ? fallback : effectiveSrc,
    alt,
    className: `transition-opacity duration-300 ${className}`,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    width,
    height,
    sizes,
    onError: handleError,
    ...props
  };
  
  // Add srcSet for modern image optimization
  if (src && !isError && !src.includes('placeholder')) {
    imageProps.srcSet = generateSrcSet(src);
  }
  
  // Animation variants
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: prefersReduced ? 0 : 0.3,
        ease: 'easeOut'
      }
    }
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* LQIP Placeholder */}
      <div 
        className="absolute inset-0 bg-surface-secondary animate-pulse"
        style={{
          backgroundImage: `url(${placeholder})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(5px)',
        }}
      />
      
      {/* Main Image */}
      <motion.img
        {...imageProps}
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        className={`relative z-10 ${imageProps.className}`}
      />
      
      {/* Error State */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-secondary text-text-tertiary">
          <div className="text-center">
            <div className="text-2xl mb-2">🖼️</div>
            <div className="text-xs">Image unavailable</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Picture component with WebP/AVIF support
export const PictureImage = ({
  src,
  alt,
  className = '',
  webpSrc,
  avifSrc,
  ...props
}) => {
  const [isError, setIsError] = useState(false);
  
  const handleError = () => {
    setIsError(true);
  };
  
  if (isError) {
    return (
      <OptimizedImage
        src="/placeholder-anime.jpg"
        alt={alt}
        className={className}
        {...props}
      />
    );
  }
  
  return (
    <picture className={className}>
      {/* Modern formats first */}
      {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      
      {/* Fallback */}
      <OptimizedImage
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleError}
        {...props}
      />
    </picture>
  );
};

// Lazy image with intersection observer
export const LazyImage = ({ src, alt, className = '', threshold = 0.1, ...props }) => {
  const [inView, setInView] = useState(false);
  const [ref, setRef] = useState(null);
  
  React.useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref);
        }
      },
      { threshold }
    );
    
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);
  
  return (
    <div ref={setRef} className={`relative ${className}`}>
      {inView ? (
        <OptimizedImage src={src} alt={alt} className="w-full h-full" {...props} />
      ) : (
        <div className="w-full h-full bg-surface-secondary animate-pulse flex items-center justify-center">
          <div className="text-text-tertiary text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;