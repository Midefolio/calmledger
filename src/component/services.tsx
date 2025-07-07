import React from 'react';
import { motion } from 'framer-motion';

interface PricingPlan {
  title: string;
  sessionPrice: string;
  monthlyPrice: string;
  yearlyPrice: string;
  description: string;
  sessionFeatures: string[];
  monthlyFeatures: string[];
  yearlyFeatures: string[];
  popular?: boolean;
}

const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = React.useState<'session' | 'monthly' | 'yearly'>('session');

  const pricingPlans: PricingPlan[] = [
    {
      title: "DEVELOPER SUPPORT",
      sessionPrice: "200",
      monthlyPrice: "750",
      yearlyPrice: "8100",
      description: "Perfect for Web3 developers dealing with burnout and stress.",
      sessionFeatures: [
        "1 therapy session",
        "Code-life balance strategies",
        "Stress management toolkit",
        "Session notes & summary"
      ],
      monthlyFeatures: [
        "4 therapy sessions per month",
        "Code-life balance strategies",
        "Stress management toolkit",
        "24/7 crisis support"
      ],
      yearlyFeatures: [
        "48 therapy sessions per year",
        "Code-life balance strategies",
        "Stress management toolkit",
        "24/7 crisis support",
        "Quarterly progress reviews"
      ]
    },
    {
      title: "TRADER WELLNESS",
      sessionPrice: "350",
      monthlyPrice: "1260",
      yearlyPrice: "13650",
      description: "Specialized support for crypto traders and investors.",
      sessionFeatures: [
        "1 therapy session",
        "Market anxiety management",
        "FOMO/Fear mitigation",
        "Risk psychology coaching"
      ],
      monthlyFeatures: [
        "4 therapy sessions per month",
        "Market anxiety management",
        "FOMO/Fear mitigation",
        "Risk psychology coaching",
        "Sleep & routine optimization"
      ],
      yearlyFeatures: [
        "48 therapy sessions per year",
        "Market anxiety management",
        "FOMO/Fear mitigation",
        "Risk psychology coaching",
        "Sleep & routine optimization",
        "Quarterly trading psychology reviews"
      ],
      popular: true
    },
    {
      title: "ENTREPRENEUR PACKAGE",
      sessionPrice: "500",
      monthlyPrice: "1800",
      yearlyPrice: "19500",
      description: "Comprehensive support for Web3 founders and leaders.",
      sessionFeatures: [
        "1 therapy session",
        "Leadership stress management",
        "Decision fatigue support",
        "Session action plan"
      ],
      monthlyFeatures: [
        "2 therapy sessions per month",
        "Leadership stress management",
        "Decision fatigue support",
        "Team dynamics counseling",
        "Investor pressure coping",
        "Vision clarity sessions"
      ],
      yearlyFeatures: [
        "24 therapy sessions per year",
        "Leadership stress management",
        "Decision fatigue support",
        "Team dynamics counseling",
        "Investor pressure coping",
        "Vision clarity sessions",
        "Annual leadership assessment"
      ]
    },
    {
      title: "BLOCKCHAIN TEAM",
      sessionPrice: "1200",
      monthlyPrice: "4320",
      yearlyPrice: "46800",
      description: "Team-based mental health support for blockchain companies.",
      sessionFeatures: [
        "1 team session",
        "Team stress assessment",
        "Workplace wellness guidance",
        "Session summary report"
      ],
      monthlyFeatures: [
        "1 team session per month",
        "Individual assessments",
        "Workplace wellness program",
        "Crunch time support",
        "Culture building guidance",
        "Burnout prevention strategy"
      ],
      yearlyFeatures: [
        "12 team sessions per year",
        "Individual assessments",
        "Workplace wellness program",
        "Crunch time support",
        "Culture building guidance",
        "Burnout prevention strategy",
        "Annual team health audit"
      ]
    }
  ];

  const getPriceForCycle = (plan: PricingPlan) => {
    switch(billingCycle) {
      case 'session':
        return plan.sessionPrice;
      case 'monthly':
        return plan.monthlyPrice;
      case 'yearly':
        return plan.yearlyPrice;
      default:
        return plan.sessionPrice;
    }
  };

  const getPriceSuffix = () => {
    switch(billingCycle) {
      case 'session':
        return '/session';
      case 'monthly':
        return '/month';
      case 'yearly':
        return '/year';
      default:
        return '/session';
    }
  };

  const getSavingsText = (plan: PricingPlan) => {
    if (billingCycle === 'yearly') {
      const monthlyAnnual = parseInt(plan.monthlyPrice) * 12;
      const yearlyPrice = parseInt(plan.yearlyPrice);
      const savings = Math.round(((monthlyAnnual - yearlyPrice) / monthlyAnnual) * 100);
      return `Save ${savings}%`;
    }
    return null;
  };

  const getFeaturesForCycle = (plan: PricingPlan) => {
    switch(billingCycle) {
      case 'session':
        return plan.sessionFeatures;
      case 'monthly':
        return plan.monthlyFeatures;
      case 'yearly':
        return plan.yearlyFeatures;
      default:
        return plan.sessionFeatures;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#1d4ed8",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div 
          className="text-cnter mb-16"
          variants={cardVariants}
        > 
           <div className="pb-3 text-[#044341] font-semibold text-sm uppercase tracking-wide">
                OUR SERVICES
              </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight pb-5">
           Start Well, <span className="text-[#044341]">Finish Strong</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-ato mb-8">
            Specialized therapy and support services designed for the unique challenges of blockchain technology, cryptocurrency, and decentralized innovation.
          </p>
          
          {/* Billing Cycle Toggle */}
          <div className="flex justify-cente mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('session')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'session' 
                    ? 'bg-[#044341] text-white' 
                    : 'text-gray-600 hover:text-[#044341]'
                }`}
              >
                Per Session
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-[#044341] text-white' 
                    : 'text-gray-600 hover:text-[#044341]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'yearly' 
                    ? 'bg-[#044341] text-white' 
                    : 'text-gray-600 hover:text-[#044341]'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          key={billingCycle}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={`${index}-${billingCycle}`}
              className={`bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden relative group
              }`}
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
            >
              {/* Popular Badge */}
              {/* {plan.popular && (
                <div className="absolute top-4 left-1/2 transform z-300 -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-[#044341] text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )} */}

              {/* Card Content */}
              <div className="p-6 text-center">
                <h3 className="text-gray-800 font-semibold text-lg mb-4 tracking-wide">
                  {plan.title}
                </h3>
                
                <div className="mb-4 relative">
                  {getSavingsText(plan) && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {getSavingsText(plan)}
                    </div>
                  )}
                  <span className="text-4xl md:text-5xl font-bold text-gray-900">
                    ${getPriceForCycle(plan)}
                  </span>
                  <span className="text-gray-600 text-sm">{getPriceSuffix()}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 leading-relaxed min-h-[3rem] flex items-center justify-center">
                  {plan.description}
                </p>
                
                {/* Features List */}
                <div className="mb-6 text-left">
                  <ul className="space-y-2">
                    {getFeaturesForCycle(plan).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 text-[#044341] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <motion.button
                  className={`w-full bg-[#044341] text-white py-3 px-6 rounded-md font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#044341] focus:ring-offset-2 ${
                    billingCycle === 'yearly' ? 'animate-pulse' : ''
                  }`}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {billingCycle === 'session' ? 'Book Session' : 
                   billingCycle === 'monthly' ? 'Start Monthly Plan' : 
                   'Get Yearly Plan'}
                </motion.button>
              </div>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#044341]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-gray-600 text-sm mb-4">
            All sessions include secure, encrypted video calls and follow HIPAA compliance standards
          </p>
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#044341] rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PricingSection;