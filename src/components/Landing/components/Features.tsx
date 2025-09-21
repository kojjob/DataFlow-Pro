import React from 'react';
import { motion } from 'framer-motion';
import {
  Workflow,
  Brain,
  FileText,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Lock,
  Globe,
  BarChart3
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Features: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const features = [
    {
      title: 'Visual ETL Pipeline Builder',
      description: 'Drag-and-drop interface for building complex data transformation pipelines without coding',
      image: '/api/placeholder/600/400',
      icon: <Workflow className="w-6 h-6" />,
      benefits: [
        'No-code data transformation',
        'Pre-built connectors for 200+ sources',
        'Real-time pipeline monitoring',
        'Automatic error handling'
      ],
      gradient: 'from-blue-500 to-cyan-500',
      reversed: false,
    },
    {
      title: 'AI-Powered Predictive Analytics',
      description: 'Machine learning models that automatically identify trends and predict future outcomes',
      image: '/api/placeholder/600/400',
      icon: <Brain className="w-6 h-6" />,
      benefits: [
        'Automated anomaly detection',
        'Revenue forecasting',
        'Churn prediction',
        'Natural language insights'
      ],
      gradient: 'from-purple-500 to-pink-500',
      reversed: true,
    },
    {
      title: 'Industry-Specific Templates',
      description: 'Pre-configured dashboards and KPIs tailored for your industry vertical',
      image: '/api/placeholder/600/400',
      icon: <FileText className="w-6 h-6" />,
      benefits: [
        'Manufacturing efficiency metrics',
        'Retail inventory optimization',
        'Healthcare compliance tracking',
        'Financial risk assessment'
      ],
      gradient: 'from-green-500 to-teal-500',
      reversed: false,
    },
    {
      title: 'Real-Time Collaboration',
      description: 'Work together on dashboards and insights with your team in real-time',
      image: '/api/placeholder/600/400',
      icon: <Users className="w-6 h-6" />,
      benefits: [
        'Live cursor tracking',
        'Commenting and annotations',
        'Version history',
        'Role-based permissions'
      ],
      gradient: 'from-orange-500 to-red-500',
      reversed: true,
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section id="features" className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Transform Your Data
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to help you extract maximum value from your data,
            with enterprise-grade security and compliance
          </p>
        </motion.div>

        <div ref={ref} className="space-y-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: index * 0.2 }}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                feature.reversed ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image/Visual Side */}
              <div className="flex-1">
                <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${feature.gradient} p-8`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    {/* Mock visual representation */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4 text-white">
                        {feature.icon}
                        <span className="font-semibold text-lg">Live Preview</span>
                      </div>
                      {/* Mock UI elements */}
                      <div className="space-y-3">
                        <div className="bg-white/30 h-4 rounded w-3/4"></div>
                        <div className="bg-white/30 h-4 rounded w-full"></div>
                        <div className="bg-white/30 h-4 rounded w-5/6"></div>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="bg-white/20 rounded-lg h-20"></div>
                          <div className="bg-white/20 rounded-lg h-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: feature.reversed ? -30 : 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                >
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {feature.description}
                  </p>

                  {/* Benefits list */}
                  <ul className="space-y-3 mb-6">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 p-1 bg-green-100 rounded-full">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Additional feature badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      <Zap className="w-3 h-3" />
                      Fast Setup
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <Shield className="w-3 h-3" />
                      Secure
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <TrendingUp className="w-3 h-3" />
                      Scalable
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security & Compliance Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 lg:p-12"
        >
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Enterprise-Grade Security & Compliance
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your data is protected with industry-leading security standards and compliance certifications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield />, title: 'SOC 2 Type II', desc: 'Certified' },
              { icon: <Lock />, title: 'End-to-End', desc: 'Encryption' },
              { icon: <Globe />, title: 'GDPR', desc: 'Compliant' },
              { icon: <BarChart3 />, title: '99.99%', desc: 'Uptime SLA' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 text-center">
                <div className="w-10 h-10 text-purple-600 mx-auto mb-3">
                  {item.icon}
                </div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;