import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: PricingPlan;
  billingCycle: 'session' | 'monthly' | 'yearly';
  allPlans: PricingPlan[];
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedPlan, 
  billingCycle, 
  allPlans 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    isAnonymous: false,
    email: '',
    story: '',
    selectedPlan: selectedPlan?.title || '',
    selectedBilling: billingCycle,
    selectedCoin: 'USDC',
    selectedChain: 'ethereum',
    transactionHash: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const cryptoAddresses = {
    ethereum: {
      USDC: '0x742d35Cc6634C0532925a3b8D4Eb695e6C4cDCC0',
      USDT: '0x742d35Cc6634C0532925a3b8D4Eb695e6C4cDCC0'
    },
    solana: {
      USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateSlide1 = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.story.trim()) {
      newErrors.story = 'Please describe your story';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSlide2 = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.selectedPlan) {
      newErrors.selectedPlan = 'Please select a plan';
    }
    
    if (!formData.transactionHash.trim()) {
      newErrors.transactionHash = 'Transaction hash is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSlide1()) {
      setCurrentSlide(1);
    }
  };

  const handleSubmit = () => {
    if (validateSlide2()) {
      // Handle form submission
      console.log('Form submitted:', formData);
      alert('Booking submitted successfully!');
      onClose();
    }
  };

  const getPriceForPlan = (plan: PricingPlan) => {
    switch(formData.selectedBilling) {
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
    switch(formData.selectedBilling) {
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

  const selectedPlanData = allPlans.find(plan => plan.title === formData.selectedPlan);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/45 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Book Your Session</h2>
              <div className="flex items-center mt-2">
                <div className={`w-8 h-1 rounded-full mr-2 ${currentSlide === 0 ? 'bg-[#044341]' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-1 rounded-full ${currentSlide === 1 ? 'bg-[#044341]' : 'bg-gray-300'}`}></div>
                <span className="ml-3 text-sm text-gray-600">
                  Step {currentSlide + 1} of 2
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {currentSlide === 0 && (
                <motion.div
                  key="slide1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    
                    {/* Anonymous Option */}
                    <div className="mb-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isAnonymous}
                          onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                          className="w-4 h-4 text-[#044341] border-gray-300 rounded focus:ring-[#044341] focus:ring-2"
                        />
                        <span className="text-sm text-gray-700 font-medium">I prefer to remain anonymous</span>
                      </label>
                    </div>

                    {/* Name Fields */}
                    {!formData.isAnonymous && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#044341] focus:border-transparent"
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#044341] focus:border-transparent"
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#044341] focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Story */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Describe Your Story <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.story}
                        onChange={(e) => handleInputChange('story', e.target.value)}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#044341] focus:border-transparent ${
                          errors.story ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Tell us about your situation and what you're looking for help with..."
                      />
                      {errors.story && <p className="text-red-500 text-sm mt-1">{errors.story}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentSlide === 1 && (
                <motion.div
                  key="slide2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Checkout & Payment</h3>
                    
                    {/* Plan Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Plan <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {allPlans.map((plan) => (
                          <div
                            key={plan.title}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              formData.selectedPlan === plan.title
                                ? 'border-[#044341] bg-[#044341]/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleInputChange('selectedPlan', plan.title)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{plan.title}</h4>
                                <p className="text-sm text-gray-600">{plan.description}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-gray-900">
                                  ${getPriceForPlan(plan)}
                                </span>
                                <span className="text-sm text-gray-600">{getPriceSuffix()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.selectedPlan && <p className="text-red-500 text-sm mt-1">{errors.selectedPlan}</p>}
                    </div>

                    {/* Billing Cycle */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billing Cycle
                      </label>
                      <div className="flex space-x-4">
                        {['session', 'monthly', 'yearly'].map((cycle) => (
                          <button
                            key={cycle}
                            onClick={() => handleInputChange('selectedBilling', cycle)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              formData.selectedBilling === cycle
                                ? 'bg-[#044341] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Crypto Payment */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      
                      {/* Coin Selection */}
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-1">Select Coin</label>
                        <div className="flex space-x-4">
                          {['USDC', 'USDT'].map((coin) => (
                            <button
                              key={coin}
                              onClick={() => handleInputChange('selectedCoin', coin)}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                formData.selectedCoin === coin
                                  ? 'bg-[#044341] text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {coin}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Chain Selection */}
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-1">Select Chain</label>
                        <div className="flex space-x-4">
                          {['ethereum', 'solana'].map((chain) => (
                            <button
                              key={chain}
                              onClick={() => handleInputChange('selectedChain', chain)}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                formData.selectedChain === chain
                                  ? 'bg-[#044341] text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {chain.charAt(0).toUpperCase() + chain.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Payment Address */}
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-1">
                          Payment Address ({formData.selectedChain} - {formData.selectedCoin})
                        </label>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <code className="text-sm font-mono text-gray-800 break-all">
                            {cryptoAddresses[formData.selectedChain as keyof typeof cryptoAddresses][formData.selectedCoin as 'USDC' | 'USDT']}
                          </code>
                        </div>
                      </div>

                      {/* Transaction Hash */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Transaction Hash <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.transactionHash}
                          onChange={(e) => handleInputChange('transactionHash', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#044341] focus:border-transparent ${
                            errors.transactionHash ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter transaction hash after payment"
                        />
                        {errors.transactionHash && <p className="text-red-500 text-sm mt-1">{errors.transactionHash}</p>}
                      </div>

                      {/* Total Amount */}
                      {selectedPlanData && (
                        <div className="bg-[#044341]/5 p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Total Amount:</span>
                            <span className="text-xl font-bold text-[#044341]">
                              ${getPriceForPlan(selectedPlanData)} {formData.selectedCoin}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex justify-between">
            <div className="flex space-x-3">
              {currentSlide > 0 && (
                <button
                  onClick={() => setCurrentSlide(0)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              {currentSlide === 0 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-[#044341] text-white rounded-md hover:bg-[#044341]/90 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#044341] text-white rounded-md hover:bg-[#044341]/90 transition-colors"
                >
                  Submit Booking
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Updated PricingSection component with modal integration
const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'session' | 'monthly' | 'yearly'>('session');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | undefined>();

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

  const handleBookSession = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

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
      backgroundColor: "#033d3b",
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
          className="text-center mb-16"
          variants={cardVariants}
        > 
          <div className="pb-3 text-[#044341] font-semibold text-sm uppercase tracking-wide">
            OUR SERVICES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight pb-5">
            Start Well, <span className="text-[#044341]">Finish Strong</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
            Specialized therapy and support services designed for the unique challenges of blockchain technology, cryptocurrency, and decentralized innovation.
          </p>
          
          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-8">
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
              className="bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden relative group"
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
            >
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
                  onClick={() => handleBookSession(plan)}
                  className="w-full bg-[#044341] text-white py-3 px-6 rounded-md font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#044341] focus:ring-offset-2"
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

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlan={selectedPlan}
        billingCycle={billingCycle}
        allPlans={pricingPlans}
      />
    </div>
  );
};

export default PricingSection;