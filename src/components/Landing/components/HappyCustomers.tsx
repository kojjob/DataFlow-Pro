import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const HappyCustomers: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Company logos placeholder - in production, these would be actual logo images
  const companies = [
    { name: 'Microsoft', logo: 'MS' },
    { name: 'Google', logo: 'G' },
    { name: 'Amazon', logo: 'AWS' },
    { name: 'Meta', logo: 'M' },
    { name: 'Apple', logo: 'A' },
    { name: 'Netflix', logo: 'N' },
    { name: 'Tesla', logo: 'T' },
    { name: 'IBM', logo: 'IBM' },
    { name: 'Oracle', logo: 'O' },
    { name: 'Salesforce', logo: 'SF' },
    { name: 'Adobe', logo: 'Ad' },
    { name: 'Spotify', logo: 'S' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="py-20 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Join over 2,500 companies that trust DataFlow Pro to power their data-driven decisions
          </p>
        </motion.div>

        {/* Logo Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 items-center"
        >
          {companies.map((company, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center"
            >
              <div className="w-32 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <span className="text-2xl font-bold text-gray-600">{company.logo}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scrolling Logo Banner */}
        <div className="mt-16 relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

          <div className="overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 30,
                  ease: 'linear',
                },
              }}
            >
              {/* Duplicate the companies array for seamless scrolling */}
              {[...companies, ...companies].map((company, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-40 h-20 bg-gray-50 rounded-lg flex items-center justify-center"
                >
                  <span className="text-xl font-semibold text-gray-500">{company.logo}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: '2,500+', label: 'Happy Customers' },
            { value: '50M+', label: 'Data Points Analyzed Daily' },
            { value: '99.9%', label: 'Uptime Guarantee' },
            { value: '4.9/5', label: 'Customer Rating' },
          ].map((stat, index) => (
            <div key={index}>
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
              >
                {stat.value}
              </motion.div>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8"
        >
          {['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA', 'PCI DSS'].map((badge, index) => (
            <div
              key={index}
              className="px-6 py-3 bg-gray-100 rounded-lg text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
            >
              {badge} Compliant
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HappyCustomers;