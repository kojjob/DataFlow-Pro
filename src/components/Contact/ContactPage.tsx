import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Headphones,
  FileText,
  Users,
  HelpCircle,
  Calendar,
  Building,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LandingHeader from '../Landing/components/LandingHeader';
import LandingFooter from '../Landing/components/LandingFooter';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    contactType: 'general',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      content: 'hello@dataflowpro.com',
      subContent: 'support@dataflowpro.com',
      action: 'Send Email',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      subContent: 'Mon-Fri 9AM-6PM PST',
      action: 'Schedule Call',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Live Chat',
      content: 'Chat with our team',
      subContent: 'Average response: 2 min',
      action: 'Start Chat',
      color: 'from-indigo-600 to-blue-600',
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: '24/7 Support',
      content: 'Enterprise customers',
      subContent: 'Dedicated support line',
      action: 'Get Support',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const offices = [
    {
      city: 'San Francisco',
      type: 'Headquarters',
      address: '123 Tech Street, Suite 500',
      location: 'San Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      email: 'sf@dataflowpro.com',
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
    },
    {
      city: 'New York',
      type: 'Sales Office',
      address: '456 Business Ave, Floor 20',
      location: 'New York, NY 10001',
      phone: '+1 (555) 234-5678',
      email: 'ny@dataflowpro.com',
      image: 'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=400&h=300&fit=crop',
    },
    {
      city: 'London',
      type: 'EMEA Office',
      address: '789 King\'s Road',
      location: 'London, UK SW1A 1AA',
      phone: '+44 20 1234 5678',
      email: 'london@dataflowpro.com',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
    },
    {
      city: 'Singapore',
      type: 'APAC Office',
      address: '101 Marina Bay, Tower 2',
      location: 'Singapore 018983',
      phone: '+65 6234 5678',
      email: 'singapore@dataflowpro.com',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop',
    },
  ];

  const faqs = [
    {
      question: 'What is the best way to reach your sales team?',
      answer: 'You can reach our sales team through the contact form, email at sales@dataflowpro.com, or schedule a demo directly from our website.',
    },
    {
      question: 'Do you offer 24/7 support?',
      answer: 'Yes, we offer 24/7 support for our Enterprise customers. Standard plans include support during business hours (9AM-6PM PST).',
    },
    {
      question: 'How quickly can I expect a response?',
      answer: 'We typically respond to inquiries within 2 hours during business hours. Priority support customers receive responses within 30 minutes.',
    },
    {
      question: 'Can I schedule an in-person meeting?',
      answer: 'Absolutely! We\'d love to meet you at any of our offices. Please use the scheduling link to book a meeting with our team.',
    },
  ];

  const socialLinks = [
    { icon: <Linkedin className="w-6 h-6" />, name: 'LinkedIn', href: 'https://linkedin.com/company/dataflowpro' },
    { icon: <Twitter className="w-6 h-6" />, name: 'Twitter', href: 'https://twitter.com/dataflowpro' },
    { icon: <Facebook className="w-6 h-6" />, name: 'Facebook', href: 'https://facebook.com/dataflowpro' },
    { icon: <Instagram className="w-6 h-6" />, name: 'Instagram', href: 'https://instagram.com/dataflowpro' },
    { icon: <Youtube className="w-6 h-6" />, name: 'YouTube', href: 'https://youtube.com/@dataflowpro' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: '',
          contactType: 'general',
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden mt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 opacity-70"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <MessageSquare className="w-4 h-4" />
              Get in Touch
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              We'd Love to
              <span className="block bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent">
                Hear From You
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-600 mb-8">
              Whether you have a question about features, pricing, need a demo, or anything else,
              our team is ready to answer all your questions.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-indigo-800" />
                <span>Response within 2 hours</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <Globe className="w-5 h-5 text-indigo-800" />
                <span>Global support team</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <Users className="w-5 h-5 text-indigo-800" />
                <span>Expert consultants</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-400 rounded-full opacity-10 animate-pulse delay-75"></div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-900 font-semibold mb-1">{method.content}</p>
                <p className="text-gray-600 text-sm mb-4">{method.subContent}</p>
                <button className="text-indigo-800 font-semibold hover:text-indigo-900 inline-flex items-center gap-1">
                  {method.action}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">How can we help? *</label>
                    <select
                      name="contactType"
                      value={formData.contactType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunities</option>
                      <option value="demo">Request a Demo</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                      placeholder="Tell us more about your needs..."
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Thank you! We'll get back to you within 2 hours.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Something went wrong. Please try again or email us directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Quick Resources */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Resources</h3>
                  <div className="space-y-4">
                    <a href="/help" className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Help Center</div>
                        <div className="text-sm text-gray-600">Browse our knowledge base</div>
                      </div>
                    </a>
                    <a href="/docs" className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Documentation</div>
                        <div className="text-sm text-gray-600">Technical guides and API docs</div>
                      </div>
                    </a>
                    <a href="/demo" className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-800">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Schedule Demo</div>
                        <div className="text-sm text-gray-600">See DataFlow Pro in action</div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Connect With Us</h3>
                  <p className="text-gray-600 mb-6">Follow us on social media for updates, tips, and industry insights.</p>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gradient-to-br hover:from-blue-900 hover:to-indigo-800 hover:text-white transition-all duration-300"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Offices Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Global Offices</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Visit us at any of our offices around the world
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {offices.map((office, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={office.image}
                    alt={office.city}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{office.city}</h3>
                    <p className="text-sm opacity-90">{office.type}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-indigo-800 mt-1" />
                      <div>
                        <p className="text-gray-900 font-semibold">{office.address}</p>
                        <p className="text-gray-600 text-sm">{office.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-indigo-800" />
                      <p className="text-gray-700">{office.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-indigo-800" />
                      <p className="text-gray-700">{office.email}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Quick answers to common questions about contacting us
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              to="/help"
              className="inline-flex items-center gap-2 text-indigo-800 font-semibold hover:text-indigo-900"
            >
              Visit our Help Center
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of companies transforming their data into insights
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-indigo-800 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Start Free Trial
              </Link>
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-800 transition-all duration-300"
              >
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default ContactPage;