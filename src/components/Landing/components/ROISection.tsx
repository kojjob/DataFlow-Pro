import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Target, Award } from 'lucide-react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const ROISection: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const stats = [
    {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      value: 700,
      suffix: '+',
      label: 'Hours Saved Annually',
      description: 'Automated reporting and analytics',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      value: 40,
      suffix: '%',
      label: 'Efficiency Improvement',
      description: 'Streamlined workflows and processes',
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      value: 96,
      suffix: '%',
      label: 'Prediction Accuracy',
      description: 'AI-powered forecasting models',
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      value: 90,
      suffix: ' days',
      label: 'Time to ROI',
      description: 'Proven rapid value delivery',
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Proven ROI Within 90 Days
          </h2>
          <p className="text-lg sm:text-xl text-purple-100 max-w-3xl mx-auto">
            Our platform delivers measurable results that impact your bottom line immediately
          </p>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <div className="text-4xl font-bold mb-2">
                {inView && (
                  <CountUp
                    start={0}
                    end={stat.value}
                    duration={2.5}
                    suffix={stat.suffix}
                  />
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
              <p className="text-sm text-purple-100">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4">
            <div className="text-left">
              <div className="text-sm text-purple-100">Average Customer ROI</div>
              <div className="text-2xl font-bold">3.2x in First Year</div>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div className="text-left">
              <div className="text-sm text-purple-100">Implementation Time</div>
              <div className="text-2xl font-bold">&lt; 2 Weeks</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ROISection;