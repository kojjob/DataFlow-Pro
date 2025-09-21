import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const LandingHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent`}>
              DataFlow Pro
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-indigo-800' : 'text-gray-800 hover:text-indigo-800'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-indigo-800' : 'text-gray-800 hover:text-indigo-800'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-indigo-800' : 'text-gray-800 hover:text-indigo-800'
              }`}
            >
              Testimonials
            </button>
            <Link
              to="/about"
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-indigo-800' : 'text-gray-800 hover:text-indigo-800'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700 hover:text-indigo-800' : 'text-gray-800 hover:text-indigo-800'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-indigo-800 font-medium hover:text-indigo-900 transition-colors"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-gradient-to-r from-blue-900 to-indigo-800 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
            >
              Start Free Trial
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white rounded-lg shadow-lg p-4 mt-2"
          >
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('features')}
                className="text-left py-2 text-gray-700 hover:text-indigo-800 font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-left py-2 text-gray-700 hover:text-indigo-800 font-medium"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-left py-2 text-gray-700 hover:text-indigo-800 font-medium"
              >
                Testimonials
              </button>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-left py-2 text-gray-700 hover:text-indigo-800 font-medium"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-left py-2 text-gray-700 hover:text-indigo-800 font-medium"
              >
                Contact
              </Link>
              <hr className="border-gray-200" />
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left py-2 text-indigo-800 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('/signup');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 bg-gradient-to-r from-blue-900 to-indigo-800 text-white font-medium rounded-lg"
              >
                Start Free Trial
              </button>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default LandingHeader;