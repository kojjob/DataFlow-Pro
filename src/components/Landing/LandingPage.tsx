import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import LandingHeader from './components/LandingHeader';
import Hero from './components/Hero';
import Testimonials from './components/Testimonials';
import ROISection from './components/ROISection';
import DashboardShowcase from './components/DashboardShowcase';
import Features from './components/Features';
import HappyCustomers from './components/HappyCustomers';
import Pricing from './components/Pricing';
import CTASection from './components/CTASection';
import LandingFooter from './components/LandingFooter';

const LandingPage: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LandingHeader />
      <Hero />
      <Testimonials />
      <ROISection />
      <DashboardShowcase />
      <Features />
      <HappyCustomers />
      <Pricing />
      <CTASection />
      <LandingFooter />
    </motion.div>
  );
};

export default LandingPage;