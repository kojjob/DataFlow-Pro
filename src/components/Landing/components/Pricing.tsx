import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small teams getting started with data analytics',
      monthlyPrice: 79,
      annualPrice: 67,
      features: [
        'Up to 5 users',
        '10 data sources',
        '5 dashboards',
        'Basic analytics',
        'Email support',
        '1GB storage',
        'Daily data refresh',
        'Mobile app access',
      ],
      notIncluded: ['AI insights', 'Custom ETL pipelines', 'White-label options'],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'Advanced features for growing businesses',
      monthlyPrice: 249,
      annualPrice: 199,
      features: [
        'Up to 25 users',
        'Unlimited data sources',
        'Unlimited dashboards',
        'Advanced analytics',
        'Priority support',
        '100GB storage',
        'Real-time data sync',
        'AI-powered insights',
        'Custom ETL pipelines',
        'API access',
        'Version history',
        'Team collaboration',
      ],
      notIncluded: ['White-label options', 'Dedicated account manager'],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Complete solution for large organizations',
      monthlyPrice: null,
      annualPrice: null,
      customPricing: true,
      features: [
        'Unlimited users',
        'Unlimited everything',
        'Enterprise analytics',
        '24/7 phone support',
        'Unlimited storage',
        'Real-time streaming',
        'Advanced AI models',
        'Custom integrations',
        'White-label options',
        'Dedicated account manager',
        'On-premise deployment',
        'Custom SLA',
        'Training & onboarding',
        'Priority feature requests',
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      popular: false,
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
    <section id="pricing" className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-16 h-8 bg-purple-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <motion.div
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
                animate={{ x: billingCycle === 'annual' ? 32 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </button>
            <span className={`text-lg ${billingCycle === 'annual' ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
              Annual
              <span className="ml-2 text-sm text-green-600 font-semibold">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-purple-600' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-bl-lg">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-white" />
                    <span className="text-sm font-semibold">Most Popular</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  {plan.customPricing ? (
                    <div className="text-4xl font-bold text-gray-900">Custom</div>
                  ) : (
                    <>
                      <div className="flex items-baseline">
                        <span className="text-2xl text-gray-600">$</span>
                        <span className="text-5xl font-bold text-gray-900">
                          {billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                        </span>
                        <span className="text-gray-600 ml-2">/month</span>
                      </div>
                      {billingCycle === 'annual' && (
                        <p className="text-sm text-gray-500 mt-1">
                          Billed ${((plan.annualPrice || 0) * 12).toLocaleString()} annually
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => plan.customPricing ? navigate('/contact') : navigate('/signup')}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                {/* Features List */}
                <div className="mt-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 p-0.5 bg-green-100 rounded-full">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Not Included */}
                {plan.notIncluded.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-3">
                      {plan.notIncluded.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 opacity-50">
                          <div className="mt-0.5 p-0.5 bg-gray-100 rounded-full">
                            <span className="block w-4 h-4 text-gray-400 text-center leading-4">×</span>
                          </div>
                          <span className="text-gray-500 text-sm line-through">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">
            All plans include SSL encryption, 99.9% uptime guarantee, and GDPR compliance
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Compare all features →
            </button>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              View FAQ →
            </button>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Contact support →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;