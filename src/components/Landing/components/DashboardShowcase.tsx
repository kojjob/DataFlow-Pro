import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Users, FileText, Activity } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const DashboardShowcase: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const dashboards = [
    {
      title: 'Financial Analytics',
      description: 'Track EBITDA, profit margins, and key financial KPIs in real-time',
      icon: <BarChart3 className="w-6 h-6" />,
      gradient: 'from-blue-500 to-cyan-500',
      metrics: ['Revenue Growth', 'Cash Flow', 'ROI Analysis'],
    },
    {
      title: 'Workforce Analytics',
      description: 'Monitor diversity, performance, and organizational metrics',
      icon: <Users className="w-6 h-6" />,
      gradient: 'from-green-500 to-teal-500',
      metrics: ['Team Performance', 'Engagement Score', 'Retention Rate'],
    },
    {
      title: 'Executive Dashboard',
      description: 'Comprehensive overview with interactive visualizations',
      icon: <PieChart className="w-6 h-6" />,
      gradient: 'from-purple-500 to-pink-500',
      metrics: ['KPI Tracking', 'Goal Progress', 'Strategic Initiatives'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Powerful Analytics at Your Fingertips
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive dashboards that transform complex data into clear, actionable insights
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-8"
        >
          {dashboards.map((dashboard, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Dashboard Preview */}
                <div className={`h-64 bg-gradient-to-br ${dashboard.gradient} p-6 relative`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4 text-white">
                      {dashboard.icon}
                      <h3 className="font-semibold text-lg">{dashboard.title}</h3>
                    </div>

                    {/* Mock Dashboard Elements */}
                    <div className="space-y-3">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-2 bg-white/40 rounded w-20"></div>
                          <TrendingUp className="w-4 h-4 text-white/60" />
                        </div>
                        <div className="h-6 bg-white/30 rounded w-3/4"></div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                          <div className="h-12 flex items-end gap-1">
                            {[60, 80, 45, 90, 70].map((height, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-white/40 rounded-t"
                                style={{ height: `${height}%` }}
                              ></div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex items-center justify-center">
                          <Activity className="w-8 h-8 text-white/40" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                  <p className="text-gray-600 mb-4">{dashboard.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {dashboard.metrics.map((metric, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center text-purple-600 font-medium group-hover:gap-2 transition-all">
                    <span>View Dashboard</span>
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-gray-600">
            <FileText className="w-5 h-5" />
            <span>Export reports in PDF, Excel, and CSV formats</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardShowcase;