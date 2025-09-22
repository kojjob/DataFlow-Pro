import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle2, X } from 'lucide-react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  const metrics = [
    { value: 2500, suffix: '+', label: 'Happy Customers' },
    { value: 200, suffix: '+', label: 'Data Connectors' },
    { value: 99.9, suffix: '%', label: 'Uptime', decimals: 1 },
  ];

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              Transform Raw Data into{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Actionable Insights
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed"
            >
              Enterprise-grade data analytics platform designed for SMEs. Reduce costs by 30%,
              increase efficiency by 40%, and achieve ROI within 90 days.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDemo(true)}
                className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg border-2 border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Metrics */}
            <motion.div
              ref={ref}
              variants={itemVariants}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              {metrics.map((metric, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {inView && (
                      <CountUp
                        start={0}
                        end={metric.value}
                        duration={2.5}
                        decimals={metric.decimals || 0}
                        suffix={metric.suffix}
                      />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{metric.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Hero Image */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-purple-600 to-pink-600 p-8">
                {/* Dashboard Preview Placeholder */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-white/30 rounded w-32"></div>
                      <div className="h-4 bg-white/30 rounded w-20"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/20 rounded-lg p-4">
                          <div className="h-3 bg-white/40 rounded w-full mb-2"></div>
                          <div className="h-8 bg-white/50 rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white/20 rounded-lg h-40 flex items-center justify-center">
                      <div className="text-white/60 text-sm">Analytics Dashboard</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-800">Real-time Analytics</span>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 4,
                delay: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-800">AI-Powered Insights</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDemo(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Product Demo</h3>
                <button
                  onClick={() => setShowDemo(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Demo video will be embedded here</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;