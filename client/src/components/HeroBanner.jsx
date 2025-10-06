// src/components/HeroBanner.jsx - Premium anime-themed hero section
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePrefersReducedMotion } from '../hooks/useAnimation';
import { ArrowRight, Play, Star, TrendingUp } from 'lucide-react';

const HeroBanner = () => {
  const heroRef = useRef(null);
  const prefersReduced = usePrefersReducedMotion();
  
  useEffect(() => {
    if (prefersReduced) return;
    
    // Animate floating particles with direct anime.js import
    const animateParticles = async () => {
      try {
        const animeModule = await import('animejs');
        const anime = animeModule.default || animeModule;
        
        if (anime && typeof anime === 'function') {
          anime({
            targets: '.floating-particle',
            translateY: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
            duration: 4000,
            loop: true,
            delay: (el, i) => i * 200,
            easing: 'easeInOutSine'
          });
        }
      } catch {
        // Silently skip animations if anime.js fails to load
        console.log('Animations disabled - anime.js not available');
      }
    };
    
    animateParticles();
  }, [prefersReduced]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };
  
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };
  
  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary/80 via-transparent to-accent-purple/20" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-particle absolute w-2 h-2 bg-accent-neon rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              variants={floatingVariants}
              animate="animate"
              transition={{
                delay: i * 0.2,
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
          ))}
        </div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-accent-magenta/30 rotate-45 rounded-lg" />
        <div className="absolute bottom-20 left-20 w-24 h-24 border border-accent-gold/30 rotate-12 rounded-full" />
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-primary opacity-20 rounded-lg rotate-45" />
      </div>
      
      {/* Hero Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism mb-8"
          variants={itemVariants}
        >
          <Star className="w-4 h-4 text-accent-gold" />
          <span className="text-sm font-medium text-text-secondary">
            Premium Anime Experience
          </span>
          <TrendingUp className="w-4 h-4 text-accent-neon" />
        </motion.div>
        
        {/* Main Title */}
        <motion.h1
          className="text-6xl md:text-8xl font-display font-bold mb-6 leading-tight"
          variants={itemVariants}
        >
          <span className="gradient-text">Otaku</span>
          <br />
          <span className="text-text-primary">World</span>
        </motion.h1>
        
        {/* Subtitle with Typing Effect */}
        <motion.p
          className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Discover, track, and explore the ultimate anime universe. 
          Join millions of otaku in the most advanced anime platform.
        </motion.p>
        
        {/* Stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mb-12"
          variants={itemVariants}
        >
          {[
            { label: 'Anime Series', value: '50,000+' },
            { label: 'Active Users', value: '2M+' },
            { label: 'Reviews', value: '10M+' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-accent-neon font-display">
                {stat.value}
              </div>
              <div className="text-sm text-text-tertiary">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <Link to="/anime">
            <motion.button
              className="group relative px-8 py-4 bg-gradient-primary text-white font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-neon"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Anime
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </Link>
          
          <Link to="/trending">
            <motion.button
              className="group px-8 py-4 glass-morphism text-text-primary font-medium rounded-xl border border-white/20 hover:border-accent-neon/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Trending
              </span>
            </motion.button>
          </Link>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <div className="flex flex-col items-center gap-2 text-text-tertiary">
            <span className="text-xs font-medium">Scroll to explore</span>
            <motion.div
              className="w-6 h-10 border-2 border-current rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-3 bg-current rounded-full mt-2"
                animate={{ scaleY: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroBanner;