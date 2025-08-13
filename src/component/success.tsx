import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


const BookingSuccessPage: React.FC<any> = () => {
  const [copied, setCopied] = useState(false);
  const [currentTime] = useState(new Date());
  const sessionData = JSON.parse(localStorage.getItem('calm_session') || '{}')
   const Navigate = useNavigate();
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTransactionId = (signature: string) => {
    return `${signature?.slice(0, 8)}...${signature?.slice(-8)}`;
  };

  const getNextSteps = () => {
    switch(sessionData?.selectedPlan?.billingCycle) {
      case 'session':
        return [
          "Check your email for session scheduling instructions",
          "You'll receive a calendar link within 24 hours",
          "Prepare any questions or topics you'd like to discuss",
          "Ensure you have a stable internet connection for video calls"
        ];
      case 'monthly':
        return [
          "Check your email for your monthly plan welcome package",
          "You'll receive scheduling links for all 4 sessions this month",
          "Access to 24/7 crisis support will be activated within 2 hours",
          "Your first session can be scheduled immediately"
        ];
      case 'yearly':
        return [
          "Welcome to your annual wellness program!",
          "Check your email for your comprehensive plan details",
          "All 48 sessions are now available for scheduling",
          "Your dedicated therapist will contact you within 48 hours",
          "Quarterly progress reviews will be automatically scheduled"
        ];
      default:
        return [
          "Check your email for further instructions",
          "You'll receive a calendar link within 24 hours"
        ];
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 sm:py-12 px-3 sm:px-4 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Success Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          variants={itemVariants}
        >
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
            variants={checkmarkVariants}
          >
            <motion.svg 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </motion.svg>
          </motion.div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Booking Confirmed!
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Your payment has been successfully processed on Solana. We're excited to support you on your wellness journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Payment Details Card */}
          <motion.div
            className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            variants={itemVariants}
          >
            <div className="bg-[#044341] text-white p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payment Details
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-sm sm:text-base text-gray-600">Plan</span>
                <span className="font-semibold text-sm sm:text-base text-gray-900 text-right">{sessionData?.selectedPlan?.title}</span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-sm sm:text-base text-gray-600">Amount Paid</span>
                <span className="font-semibold text-sm sm:text-base text-gray-900">${sessionData?.selectedPlan?.price} USDC</span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-sm sm:text-base text-gray-600">Billing Cycle</span>
                <span className="font-semibold text-sm sm:text-base text-gray-900 capitalize">{sessionData?.selectedPlan?.billingCycle}</span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-sm sm:text-base text-gray-600">Payment Method</span>
                <span className="font-semibold text-sm sm:text-base text-gray-900">Solana (USDC)</span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-2">
                <span className="text-sm sm:text-base text-gray-600">Transaction Date</span>
                <span className="font-semibold text-xs sm:text-sm text-gray-900 text-right leading-tight">
                  {currentTime.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="border-t pt-3 sm:pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Transaction ID</span>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="font-mono text-xs sm:text-sm text-gray-900">
                      {formatTransactionId(sessionData?.transactionSignature)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(sessionData?.transactionSignature)}
                      className="p-1 text-gray-400 hover:text-[#044341] transition-colors"
                      title="Copy full transaction ID"
                    >
                      {copied ? (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 break-all">
                  View on Solscan: 
                  <a 
                    href={`https://solscan.io/tx/${sessionData?.transactionSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#044341] hover:underline ml-1"
                  >
                    {formatTransactionId(sessionData?.transactionSignature)}
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Next Steps Card */}
          <motion.div
            className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            variants={itemVariants}
          >
            <div className="bg-[#044341] text-white p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                What's Next?
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <ul className="space-y-3 sm:space-y-4">
                {getNextSteps().map((step, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#044341] text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{step}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div
          className="mt-6 sm:mt-8 bg-[#044341]/5 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 text-center"
          variants={itemVariants}
        >
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Need Help or Have Questions?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
            Our support team is here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="bg-[#044341] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-semibold text-sm sm:text-base hover:bg-[#044341]/90 transition-all duration-300 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </button>
            <button className="border-2 border-[#044341] text-[#044341] px-4 sm:px-6 py-2 sm:py-3 rounded-md font-semibold text-sm sm:text-base hover:bg-[#044341] hover:text-white transition-all duration-300 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              FAQ Center
            </button>
          </div>
        </motion.div>

        {/* User Receipt Summary */}
        <motion.div
          className="mt-6 sm:mt-8 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Booking Summary</h3>
            <span className="text-xs sm:text-sm text-gray-500 break-all">
              Confirmation sent to: {sessionData?.userDetails?.email}
            </span>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              
              <div className="flex flex-col sm:flex-row">
                <span className="text-gray-600 sm:mr-2">Client Email:</span>
                <span className="font-semibold text-gray-900 break-all">{sessionData?.userDetails?.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="text-gray-600 sm:mr-2">Plan Type:</span>
                <span className="font-semibold text-gray-900">{sessionData?.selectedPlan?.title}</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="text-gray-600 sm:mr-2">Status:</span>
                <span className="text-green-600 font-semibold">Confirmed</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4"
          variants={itemVariants}
        >
          <motion.button
            className="bg-[#044341] text-white px-6 sm:px-8 py-3 rounded-md font-semibold text-sm sm:text-base lg:text-lg hover:bg-[#044341]/90 transition-all duration-300 w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.print()}
          >
            Download Receipt
          </motion.button>
          <motion.button
            className="border-2 border-[#044341] text-[#044341] px-6 sm:px-8 py-3 rounded-md font-semibold text-sm sm:text-base lg:text-lg hover:bg-[#044341] hover:text-white transition-all duration-300 w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={()=> {Navigate('/'); localStorage.removeItem('calm_session')}}
          >
           Back Home
          </motion.button>
        </motion.div>

      

        {/* Footer Message */}
        <motion.div
          className="mt-12 text-center"
          variants={itemVariants}
        >
          <p className="text-gray-600 text-sm">
            Thank you for choosing calmledger mental health services. Your wellness journey starts now.
          </p>
          <div className="flex justify-center space-x-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#044341] rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookingSuccessPage;