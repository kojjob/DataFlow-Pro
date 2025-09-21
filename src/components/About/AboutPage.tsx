import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  Award,
  Globe,
  Zap,
  Shield,
  BarChart3,
  Heart,
  Rocket,
  Building2,
  GraduationCap,
  Lightbulb,
  ChevronRight,
  CheckCircle,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LandingHeader from '../Landing/components/LandingHeader';
import LandingFooter from '../Landing/components/LandingFooter';

const AboutPage: React.FC = () => {
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

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: '2,500+', label: 'Happy Customers' },
    { icon: <Globe className="w-8 h-8" />, value: '45+', label: 'Countries Served' },
    { icon: <BarChart3 className="w-8 h-8" />, value: '10M+', label: 'Data Points Analyzed Daily' },
    { icon: <Award className="w-8 h-8" />, value: '15+', label: 'Industry Awards' },
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Customer First',
      description: 'Every decision we make starts with how it will benefit our customers.',
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Innovation',
      description: 'We constantly push boundaries to deliver cutting-edge solutions.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Trust & Security',
      description: 'We protect your data with enterprise-grade security and compliance.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Collaboration',
      description: 'We believe in the power of working together to achieve greatness.',
    },
  ];

  const timeline = [
    {
      year: '2019',
      title: 'The Beginning',
      description: 'Founded with a mission to democratize data analytics for SMEs.',
      icon: <Rocket className="w-5 h-5" />,
    },
    {
      year: '2020',
      title: 'Product Launch',
      description: 'Released our first AI-powered analytics platform.',
      icon: <Zap className="w-5 h-5" />,
    },
    {
      year: '2021',
      title: 'Global Expansion',
      description: 'Expanded to 20+ countries and reached 500 customers.',
      icon: <Globe className="w-5 h-5" />,
    },
    {
      year: '2022',
      title: 'Series B Funding',
      description: 'Raised $50M to accelerate product development and growth.',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      year: '2023',
      title: 'Enterprise Ready',
      description: 'Launched enterprise features and reached 2,500+ customers.',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      year: '2024',
      title: 'AI Revolution',
      description: 'Integrated advanced AI models for predictive analytics.',
      icon: <Lightbulb className="w-5 h-5" />,
    },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-founder',
      bio: 'Former data scientist at Google with 15+ years of experience in AI and analytics.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-founder',
      bio: 'Previously led engineering teams at Amazon, expert in scalable data systems.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      name: 'Emily Johnson',
      role: 'VP of Product',
      bio: 'Product visionary with experience building analytics products at Microsoft.',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
    },
    {
      name: 'David Kim',
      role: 'VP of Engineering',
      bio: 'Engineering leader with expertise in distributed systems and real-time analytics.',
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
    },
  ];

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
              <Building2 className="w-4 h-4" />
              About DataFlow Pro
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Transforming How Businesses
              <span className="block bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent">
                Understand Their Data
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-600 mb-8">
              We're on a mission to democratize data analytics and make powerful insights accessible
              to businesses of all sizes. Our platform combines cutting-edge AI with intuitive design
              to deliver actionable intelligence that drives growth.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}
              >
                Get in Touch
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                Join Our Team
                <Heart className="w-5 h-5 text-red-500" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-400 rounded-full opacity-10 animate-pulse delay-75"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl text-indigo-800 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From a simple idea to a global platform serving thousands of businesses
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  It Started with a Problem
                </h3>
                <p className="text-gray-600 mb-4">
                  In 2019, our founders Sarah and Michael were working as data consultants
                  for various SMEs. They noticed a recurring pattern: small and medium businesses
                  were drowning in data but starving for insights.
                </p>
                <p className="text-gray-600 mb-4">
                  Traditional analytics tools were either too expensive, too complex, or both.
                  Companies needed weeks to generate reports that should take minutes. Critical
                  decisions were being made on gut feeling rather than data.
                </p>
                <p className="text-gray-600 mb-6">
                  That's when they decided to build DataFlow Pro - a platform that would make
                  enterprise-grade analytics accessible to every business, regardless of size
                  or technical expertise.
                </p>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Making data analytics accessible to all</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                  alt="Team collaboration"
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-900 to-indigo-800 rounded-2xl opacity-20"></div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl opacity-20"></div>
              </motion.div>
            </div>

            {/* Timeline */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="relative"
            >
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-900 to-indigo-800"></div>
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`flex items-center mb-12 ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'
                    }`}
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-indigo-800">
                          {item.icon}
                        </div>
                        <span className="text-indigo-800 font-semibold">{item.year}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer support
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-indigo-800 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Passionate experts dedicated to revolutionizing data analytics
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-indigo-800 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-6">Want to join our amazing team?</p>
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}
            >
              View Open Positions
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Recognition & Awards</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                title: 'Best Analytics Platform 2024',
                org: 'TechCrunch Awards',
                icon: <Award className="w-8 h-8" />,
              },
              {
                title: 'Top 10 Fastest Growing SaaS',
                org: 'Forbes Cloud 100',
                icon: <TrendingUp className="w-8 h-8" />,
              },
              {
                title: 'Innovation Excellence Award',
                org: 'Gartner Magic Quadrant',
                icon: <Star className="w-8 h-8" />,
              },
            ].map((award, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full text-indigo-800 mb-4 shadow-lg">
                  {award.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{award.title}</h3>
                <p className="text-gray-600">{award.org}</p>
              </motion.div>
            ))}
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
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of companies using DataFlow Pro to make data-driven decisions
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-indigo-800 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Start Free Trial
              </Link>
              <Link
                to="/demo"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-800 transition-all duration-300"
              >
                Schedule Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default AboutPage;