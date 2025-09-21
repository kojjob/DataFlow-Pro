import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, DollarSign } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  quote: string;
  avatar: string;
  metrics: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[];
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    title: 'Operations Director',
    company: 'Precision Manufacturing Ltd',
    quote: 'DataFlow Pro helped us achieve 30% downtime reduction and £180,000 annual savings through predictive maintenance insights.',
    avatar: 'SM',
    metrics: [
      { label: 'Downtime Reduction', value: '30%', icon: <TrendingUp className="w-4 h-4" /> },
      { label: 'Annual Savings', value: '£180K', icon: <DollarSign className="w-4 h-4" /> },
    ],
  },
  {
    id: 2,
    name: 'Marcus Thompson',
    title: 'CEO',
    company: 'Thompson Retail Group',
    quote: 'Our inventory costs dropped 15% while sales increased 20% using DataFlow Pro\'s demand forecasting.',
    avatar: 'MT',
    metrics: [
      { label: 'Sales Increase', value: '20%', icon: <TrendingUp className="w-4 h-4" /> },
      { label: 'Cost Reduction', value: '15%', icon: <DollarSign className="w-4 h-4" /> },
    ],
  },
  {
    id: 3,
    name: 'Dr. Emily Chen',
    title: 'Practice Manager',
    company: 'City Health Partners',
    quote: 'Patient satisfaction improved 35% and operational efficiency increased 25% since implementing DataFlow Pro.',
    avatar: 'EC',
    metrics: [
      { label: 'Satisfaction', value: '35%', icon: <Star className="w-4 h-4" /> },
      { label: 'Efficiency', value: '25%', icon: <TrendingUp className="w-4 h-4" /> },
    ],
  },
];

const Testimonials: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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
    <section id="testimonials" className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            See how DataFlow Pro transforms businesses across industries
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                    <p className="text-sm text-purple-600 font-medium">{testimonial.company}</p>
                  </div>
                </div>
              </div>

              <blockquote className="text-gray-700 mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex flex-wrap gap-3">
                {testimonial.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {metric.icon}
                    <span>{metric.value} {metric.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex mt-6 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;