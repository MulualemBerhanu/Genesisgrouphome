'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [currentBranch, setCurrentBranch] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [formStatus, setFormStatus] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Number of images for each branch
  const totalImages = {
    'Group Home 1': 50,
    'Group Home 2': 50
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageClick = (branch, index) => {
    setCurrentBranch(branch);
    setCurrentImageIndex(index);
    setSelectedImage(`/images/${branch}/image${index}.jpg`);
    setIsLightboxOpen(true);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex > 1 && currentBranch) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(`/images/${currentBranch}/image${newIndex}.jpg`);
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (currentBranch) {
      const maxImages = totalImages[currentBranch];
      if (currentImageIndex < maxImages) {
        const newIndex = currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
        setSelectedImage(`/images/${currentBranch}/image${newIndex}.jpg`);
      }
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleKeyPress = (e) => {
    if (isLightboxOpen) {
      if (e.key === 'ArrowLeft') handlePrevImage(e);
      if (e.key === 'ArrowRight') handleNextImage(e);
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'f') toggleFullScreen();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isLightboxOpen, currentImageIndex, currentBranch]);

  const renderGalleryGrid = (branch) => {
    return Array.from({ length: 6 }, (_, i) => (
      <motion.div
        key={`${branch}-${i + 1}`}
        className="relative group overflow-hidden rounded-xl shadow-lg aspect-square cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        onClick={() => handleImageClick(branch, i + 1)}
      >
        <Image
          src={`/images/${branch}/image${i + 1}.jpg`}
          alt={`${branch} Image ${i + 1}`}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-sm font-medium">Click to View</p>
          </div>
        </div>
      </motion.div>
    ));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setFormStatus({
        show: true,
        message: '✅ Your message has been sent! We\'ll get back to you soon.',
        type: 'success'
      });

      form.reset();

      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, show: false }));
      }, 5000);

    } catch (error) {
      setFormStatus({
        show: true,
        message: '❌ Failed to send message. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* Notification Banner */}
      <div className="bg-primary-green text-white text-sm py-2 fixed w-full top-0 z-50">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </span>
              <span className="font-medium text-xs md:text-sm">Contact us 24/7: (503) 740-1256</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <div className="flex flex-col md:flex-row items-center md:gap-4">
                <span className="hover:text-primary-yellow transition-colors text-xs md:text-sm">Genesisghpdx@gmail.com</span>
                <span className="hidden md:block text-primary-yellow">|</span>
                <span className="hover:text-primary-yellow transition-colors text-xs md:text-sm">Genesisgrouphomepdx@gmail.com</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Header */}
      <motion.header 
        className="bg-primary-yellow border-b sticky top-0 md:top-[40px] z-40 shadow-sm mt-[80px] md:mt-[40px]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href="/">
                <div className="relative">
                  <Image
                    src="/images/changed_logo.png" 
                    alt="Genesis Group Home LLC" 
                    width={200} 
                    height={50} 
                    className="h-auto mix-blend-darken filter contrast-125 saturate-150 md:w-[280px] md:h-[70px]" 
                    priority
                    style={{ 
                      objectFit: 'contain',
                      maxWidth: '100%',
                      display: 'block'
                    }}
                  />
                </div>
              </Link>
            </motion.div>
            
            {/* Mobile Menu Button */}
            <motion.button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-6 h-0.5 bg-primary-green mb-1.5 transition-all"></div>
              <div className="w-6 h-0.5 bg-primary-green mb-1.5 transition-all"></div>
              <div className="w-6 h-0.5 bg-primary-green transition-all"></div>
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { 
                  href: "#", 
                  label: "Home", 
                  icon: "🏠",
                  description: "Welcome to Genesis"
                },
                { 
                  href: "#about", 
                  label: "About Us", 
                  icon: "ℹ️",
                  description: "Our Story & Mission"
                },
                { 
                  href: "#services", 
                  label: "Our Services", 
                  icon: "🤝",
                  description: "How We Help"
                },
                { 
                  href: "#community", 
                  label: "Our Community", 
                  icon: "👥",
                  description: "Life at Genesis"
                },
                { 
                  href: "#contact", 
                  label: "Contact", 
                  icon: "📞",
                  description: "Get in Touch"
                }
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <Link 
                    href={link.href}
                    className="relative text-gray-700 hover:text-primary-green transition-colors py-2 flex items-center gap-2 group"
                  >
                    <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                      {link.icon}
                    </span>
                    <span className="relative">
                      {link.label}
                      <motion.span
                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-green rounded-full"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </span>
                  </Link>
                  
                  {/* Hover Popup */}
                  <motion.div
                    className="absolute invisible group-hover:visible -bottom-24 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg p-4 min-w-[200px] pointer-events-none"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{link.icon}</span>
                        <h4 className="font-bold text-primary-green">{link.label}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{link.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <motion.div 
              className={`absolute top-full left-0 right-0 bg-primary-yellow border-b shadow-lg md:hidden z-50 ${
                isMobileMenuOpen ? "block" : "hidden"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <nav className="container py-4 flex flex-col gap-4">
                {[
                  { href: "#", label: "Home", icon: "🏠" },
                  { href: "#about", label: "About Us", icon: "ℹ️" },
                  { href: "#services", label: "Our Services", icon: "🤝" },
                  { href: "#community", label: "Our Community", icon: "👥" },
                  { href: "#contact", label: "Contact", icon: "📞" }
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link 
                      href={link.href}
                      className="flex items-center gap-3 text-gray-700 hover:text-primary-green hover:bg-primary-yellow/50 px-4 py-2 rounded-lg transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-sm opacity-70">{link.icon}</span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Parallax Background Layers */}
        <div className="fixed inset-0 z-0">
          {/* Main Background Image */}
          <Image
            src="/images/hero-bg.jpg"
            alt="Caring hands"
            fill
            className="object-cover transform scale-110 transition-transform duration-1000"
            priority
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-green/30 to-transparent"></div>
          
          {/* Animated Patterns */}
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5">
            <motion.div
              className="w-full h-full"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 h-full">
          <div className="container h-full flex flex-col">
            {/* Top Content */}
            <motion.div 
              className="flex-1 flex items-center justify-center pt-12 pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center max-w-4xl mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-6"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary-yellow opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-yellow"></span>
                    </span>
                    Transforming Lives Through Care
                  </span>
                </motion.div>

                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <span className="relative inline-block">
                    24-Hour Residential Services
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-primary-yellow"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    />
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Creating a supportive environment where dignity meets independence, 
                  fostering growth and empowerment for every individual.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Link href="#contact">
                    <motion.button
                      className="btn bg-primary-yellow text-primary-green hover:bg-white hover:text-primary-green transition-colors group relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Contact Us
                        <motion.span
                          className="inline-block"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </span>
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Bottom Content */}
            <div className="pb-32">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4 -mt-12 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {[
                  {
                    icon: "❤️",
                    title: "Compassionate Care",
                    description: "24/7 dedicated support"
                  },
                  {
                    icon: "🏠",
                    title: "Home-Like Environment",
                    description: "Comfortable and nurturing"
                  },
                  {
                    icon: "🤝",
                    title: "Personalized Support",
                    description: "Tailored to individual needs"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white border border-white/10"
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    <span className="text-4xl mb-4 block">{feature.icon}</span>
                    <h3 className="text-xl font-bold mb-2 text-primary-yellow drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-white/30 rounded-full p-1"
              initial={{ y: 0 }}
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-1.5 bg-white rounded-full"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            <span className="text-white/50 text-sm">Scroll to explore</span>
          </motion.div>
        </div>
      </section>

      <div className="relative z-0 bg-white">
        {/* About Us Section */}
        <section id="about" className="section bg-primary-yellow relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
          
          <div className="container">
            {/* Section Header */}
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary-green/80 text-sm font-medium tracking-wider uppercase mb-4 block">Who We Are</span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary-green mb-6">About Us</h2>
              <div className="w-20 h-1.5 bg-primary-green/20 mx-auto rounded-full mb-8">
                <div className="w-10 h-full bg-primary-green rounded-full" />
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Left Column - Mission & Main Content */}
              <motion.div 
                className="lg:col-span-5 space-y-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Mission Statement */}
                <div className="bg-gradient-to-br from-primary-green/10 to-transparent rounded-2xl p-8 border-l-4 border-primary-green shadow-lg">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-primary-green mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-primary-green/10 rounded-full flex items-center justify-center">
                        🎯
                      </span>
                      Our Mission
                    </h3>
                    <p className="font-serif text-gray-700 italic leading-relaxed">
                      Our Mission is to provide ongoing commitment, collaborations and support to people to achieve their fullest potential and enjoy the utmost quality of life that they desire.
                    </p>
                  </motion.div>
                </div>

                {/* Main Content */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <p className="font-serif text-gray-700 leading-relaxed">
                    Genesis Group Home LLC is dedicated to providing the utmost quality of life to individuals with intellectual/developmental disabilities (I/DD) and/or mental health disorders that reside in homelike supported environments by maintaining communication directly with the individuals and all members of that individual&apos;s team. Genesis Group Home LLC, its directors and employees will know and follow the laws and rules as put into place by the Oregon Administrative Rules (OAR&apos;s). At Genesis Group Home LLC, we strive to go above and beyond the requirements of the Home and Community Based Services (HCBS) by providing a person-centered emphasis to each individual.
                  </p>
                </div>

                {/* Stats or Highlights */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { number: "24/7", label: "Care Available" },
                    { number: "100%", label: "Commitment" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/80 rounded-xl p-4 text-center shadow-md"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="text-2xl font-bold text-primary-green mb-1">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Column - Images & Executive Director */}
              <motion.div
                className="lg:col-span-7 space-y-6"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Image Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <Image 
                      src="/images/about-1.png" 
                      alt="Caring moment" 
                      width={400} 
                      height={400} 
                      className="rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 w-full h-auto" 
                    />
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <h4 className="text-primary-green font-bold mb-2">24/7 Support</h4>
                      <p className="text-sm text-gray-600">Round-the-clock professional care and assistance</p>
                    </div>
                  </div>
                  <div className="space-y-6 mt-12">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <h4 className="text-primary-green font-bold mb-2">Certified Team</h4>
                      <p className="text-sm text-gray-600">Expert healthcare professionals dedicated to your care</p>
                    </div>
                    <Image 
                      src="/images/about-2.png" 
                      alt="Home care" 
                      width={400} 
                      height={400} 
                      className="rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 w-full h-auto" 
                    />
                  </div>
                </div>

                {/* Executive Director Card */}
                <motion.div 
                  className="bg-white/90 rounded-2xl p-8 shadow-lg backdrop-blur-sm border border-primary-green/10"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary-green">Executive Director</h3>
                      <p className="text-sm text-gray-600">Leadership & Vision</p>
                    </div>
                  </div>
                  <p className="font-serif text-gray-700 leading-relaxed">
                    Dedicated healthcare professional with over 20 years of patient care experience, specializing in the management and operation of group homes for individuals with developmental disabilities. Proven track record as an Executive Director, with expertise in leading staff, administering medication, and ensuring high-quality, compassionate care. Certified as a Medication Aide (2005) and Certified Nursing Assistant (2004) in Oregon. Skilled in creating safe, supportive environments that promote independence and well-being for residents. Committed to enhancing the lives of individuals with developmental disabilities through personalized care and effective management practices in a private group home setting.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="section relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
          
          <div className="container relative">
            {/* Section Header */}
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary-green/80 text-sm font-medium tracking-wider uppercase mb-4 block">Our Services</span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary-green mb-6">What We Offer</h2>
              <div className="w-20 h-1.5 bg-primary-green/20 mx-auto rounded-full mb-8">
                <div className="w-10 h-full bg-primary-green rounded-full" />
              </div>
              <p className="max-w-2xl mx-auto text-gray-600">
                Comprehensive care services tailored to enhance the quality of life for our residents
              </p>
            </motion.div>

            {/* Services Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  variants={fadeIn}
                  whileHover={{ y: -5 }}
                >
                  {/* Large Background Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
                    <div className="text-[150px] text-primary-green transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      {index === 0 ? "👤" :
                       index === 1 ? "💊" :
                       index === 2 ? "🤝" :
                       index === 3 ? "🏥" :
                       index === 4 ? "🍽️" :
                       index === 5 ? "🎨" :
                       index === 6 ? "🚗" :
                       "♿"}
                    </div>
                  </div>

                  {/* Service Icon */}
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-yellow to-primary-yellow/50 flex items-center justify-center mb-6 mx-auto transform group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                      <span className="text-3xl filter drop-shadow-md">{
                        index === 0 ? "👤" :
                        index === 1 ? "💊" :
                        index === 2 ? "🤝" :
                        index === 3 ? "🏥" :
                        index === 4 ? "🍽️" :
                        index === 5 ? "🎨" :
                        index === 6 ? "🚗" :
                        "♿"
                      }</span>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-green/5 rounded-bl-[100px] transform translate-x-12 -translate-y-12 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-yellow/10 rounded-tr-[100px] transform -translate-x-12 translate-y-12 group-hover:-translate-x-8 group-hover:translate-y-8 transition-transform duration-500" />

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-primary-green text-center mb-4 group-hover:text-primary-green/80 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-center text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-green/20 rounded-2xl transition-colors duration-300" />
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom Decorative Element */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary-green/20 to-transparent" />
          </div>
        </section>

        {/* Our Community Section */}
        <section id="community" className="section bg-primary-yellow relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
          
          <div className="container">
            {/* Section Header */}
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary-green/80 text-sm font-medium tracking-wider uppercase mb-4 block">Our Locations</span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary-green mb-6">Our Community</h2>
              <div className="w-20 h-1.5 bg-primary-green/20 mx-auto rounded-full mb-8">
                <div className="w-10 h-full bg-primary-green rounded-full" />
              </div>
            </motion.div>

            {/* Gallery Grid Container */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* First Branch */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Branch Title */}
                <div className="text-center">
                  <motion.h3 
                    className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-primary-green to-primary-yellow bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    Genesis Group Home
                  </motion.h3>
                  <p className="text-primary-green/80 font-medium">16937 SE Harrison St Portland OR 97233</p>
                  <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-primary-green mx-auto mt-4 rounded-full" />
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {renderGalleryGrid('Group Home 1')}
                </div>

                {/* View More/Less Button */}
                <motion.button
                  onClick={() => handleImageClick('Group Home 1', 1)}
                  className="relative w-full group overflow-hidden rounded-xl shadow-lg aspect-[5/1] cursor-pointer bg-primary-green/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-primary-green font-medium">Click to View Gallery</p>
                  </div>
                  <div className="h-full flex items-center justify-center">
                    <span className="text-primary-green font-medium group-hover:opacity-0 transition-opacity duration-300">
                      View More Photos
                    </span>
                  </div>
                </motion.button>
              </motion.div>

              {/* Second Branch */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-8"
              >
                {/* Branch Title */}
                <div className="text-center">
                  <motion.h3 
                    className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary-green via-yellow-400 to-primary-yellow bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    Genesis Group Home
                  </motion.h3>
                  <p className="text-primary-green/80 font-medium">2749 SE 170th Ave Portland OR 97236</p>
                  <div className="w-32 h-1 bg-gradient-to-r from-primary-green to-yellow-400 mx-auto mt-4 rounded-full" />
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {renderGalleryGrid('Group Home 2')}
                </div>

                {/* View More/Less Button */}
                <motion.button
                  onClick={() => handleImageClick('Group Home 2', 1)}
                  className="relative w-full group overflow-hidden rounded-xl shadow-lg aspect-[5/1] cursor-pointer bg-primary-green/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-primary-green font-medium">Click to View Gallery</p>
                  </div>
                  <div className="h-full flex items-center justify-center">
                    <span className="text-primary-green font-medium group-hover:opacity-0 transition-opacity duration-300">
                      View More Photos
                    </span>
                  </div>
                </motion.button>
              </motion.div>
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center mt-[120px]"
                onClick={() => setIsLightboxOpen(false)}
              >
                <div className="relative mx-auto max-w-7xl px-4 h-[calc(100vh-180px)] flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={selectedImage}
                        alt="Gallery image"
                        width={1200}
                        height={800}
                        className="rounded-lg shadow-2xl object-contain max-h-full max-w-full"
                        onClick={(e) => e.stopPropagation()}
                        priority
                      />
                    </div>

                    {/* Close Button */}
                    <button
                      className="absolute top-4 right-4 bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition-all duration-200 hover:rotate-90 transform"
                      onClick={() => setIsLightboxOpen(false)}
                    >
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Navigation Arrows */}
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:text-primary-yellow transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage(e);
                      }}
                    >
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:text-primary-yellow transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage(e);
                      }}
                    >
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-green/10 to-primary-yellow/20 z-0"></div>
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-center mb-4">Get In Touch</h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                We&apos;re here to answer any questions you may have about our services. Reach out to us and we&apos;ll respond as soon as we can.
              </p>

              <div className="grid md:grid-cols-2 gap-12 mb-12">
                {/* Contact Information */}
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-primary-green mb-4">Contact Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-primary-green mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Phone</h4>
                          <p className="text-gray-600">(503) 740-1256</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="text-primary-green mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Email</h4>
                          <p className="text-gray-600">Genesisghpdx@gmail.com</p>
                          <p className="text-gray-600">Genesisgrouphomepdx@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-primary-green mb-4">Business Hours</h3>
                    <p className="text-gray-600">
                      Open 24/7 for inquiries and support
                    </p>
                  </div>
                </div>

                {/* Contact Form */}
                <motion.div 
                  className="bg-white p-8 rounded-xl shadow-lg"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    {formStatus.show && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg ${
                          formStatus.type === 'success' 
                            ? 'bg-green-50 text-green-800' 
                            : 'bg-red-50 text-red-800'
                        }`}
                      >
                        {formStatus.message}
                      </motion.div>
                    )}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-colors"
                        required
                      ></textarea>
                    </div>
                    <motion.button 
                      type="submit" 
                      className="w-full btn btn-primary bg-primary-green text-white hover:bg-primary-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary-green text-white p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      )}

      {/* Footer */}
      <footer className="bg-primary-green text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Genesis Group Home LLC</h3>
              <p>Professional home care services you can trust.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-primary-yellow">Home</Link></li>
                <li><Link href="#about" className="hover:text-primary-yellow">About Us</Link></li>
                <li><Link href="#services" className="hover:text-primary-yellow">Services</Link></li>
                <li><Link href="#contact" className="hover:text-primary-yellow">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Contact Info</h4>
              <ul className="space-y-2">
                <li>Phone: (503) 740-1256</li>
                <li>Email: Genesisghpdx@gmail.com</li>
                <li>Alternative Email: Genesisgrouphomepdx@gmail.com</li>
                <li>Address: 123 Care Street, Portland, OR</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Follow Us</h4>
              <div className="flex space-x-4">
                {/* Social media icons would go here */}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

const services = [
  {
    title: "Personal Care",
    description: "We provide compassionate personal care, assisting with bathing, grooming, dressing, hygiene, and mobility while promoting independence and dignity in a supportive home-like environment."
  },
  {
    title: "Medication Management",
    description: "We ensure safe and accurate medication administration, with trained staff overseeing proper dosage and compliance. We work closely with healthcare providers to monitor medication needs and promote overall well-being."
  },
  {
    title: "Companionship",
    description: "Our goal is to provide companionship in a warm, home-like environment where residents feel valued and connected. We offer meaningful social interaction, friendly conversations, and emotional support to enhance their well-being and sense of belonging."
  },
  {
    title: "Medical Visits",
    description: "We accompany residents to all medical appointments, assist with scheduling and follow-ups, and support their needs to ensure they receive the highest quality care. Additionally, we work closely with a registered nurse consultant to address any medical delegation needs."
  },
  {
    title: "Meal Preparation",
    description: "Meals are tailored to each resident's individual dietary needs, with a focus on balanced nutrition based on personal dietitian recommendations."
  },
  {
    title: "Planned Community Activities",
    description: "Our residents engage in community walks, library visits, park outings, community events, theater trips, and dining out for lunch or dinner. Activities are tailored to each resident's abilities and preferences, ensuring an enjoyable and inclusive experience."
  },
  {
    title: "Transportation Services",
    description: "We ensure our residents have reliable transportation for medical, dental, and other essential appointments, as well as for shopping, outings, and community engagement opportunities."
  },
  {
    title: "Accessibility",
    description: "Our home is fully wheelchair accessible, featuring step-free entry, widened doorways, an accessible shower with grab bars, and spacious common areas for easy mobility. We also provide a wide, accessible backyard for outdoor activities and relaxation. Additionally, our wheelchair-accessible vans ensure safe and convenient transportation for residents"
  }
  // Add more services as needed
];
