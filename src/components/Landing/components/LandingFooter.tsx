import React from 'react';
import { motion } from 'framer-motion';
import {
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks: Record<string, Array<{ label: string; href: string; badge?: string }>> = {
    Product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API Documentation', href: '/api-docs' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Changelog', href: '/changelog' },
    ],
    Company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '/careers', badge: 'Hiring' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
    Resources: [
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
      { label: 'Webinars', href: '/webinars' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'White Papers', href: '/resources' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' },
      { label: 'Security', href: '/security' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <Github className="w-5 h-5" />, href: 'https://github.com', label: 'GitHub' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="rounded-2xl p-8 lg:p-12 mb-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                Stay updated with our newsletter
              </h3>
              <p className="text-blue-100">
                Get the latest product updates, tips, and industry insights delivered to your inbox
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-indigo-800 font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              DataFlow Pro
            </h2>
            <p className="text-gray-400 mb-6">
              Enterprise analytics platform that transforms your raw data into actionable insights.
              Trusted by 2,500+ companies worldwide.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>123 Tech Street, San Francisco, CA 94105</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>hello@dataflowpro.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} DataFlow Pro. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-indigo-700 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Language/Currency Selector */}
            <div className="flex items-center gap-4 text-sm">
              <select className="bg-gray-800 text-gray-400 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
              </select>
              <select className="bg-gray-800 text-gray-400 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600">
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-wrap justify-center items-center gap-6 text-gray-500 text-sm">
              <span>🔒 SSL Secured</span>
              <span>SOC 2 Type II</span>
              <span>GDPR Compliant</span>
              <span>ISO 27001</span>
              <span>HIPAA Ready</span>
              <span>PCI DSS</span>
            </div>
          </div>

          {/* Performance Badge */}
          <div className="mt-4 text-center text-gray-500 text-xs">
            <p>
              Built with ❤️ using React • Fast loading times • 99.9% uptime guarantee
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;