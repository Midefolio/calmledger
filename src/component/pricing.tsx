import React from 'react';
import { motion } from 'framer-motion';

interface PricingPlan {
  title: string;
  price: string;
  description: string;
  features?: string[];
}

const PricingSection: React.FC = () => {
  const pricingPlans: PricingPlan[] = [
    {
      title: "SESSION FEE",
      price: "150",
      description: "Per session fee include free practice book."
    },
    {
      title: "WEEKLY FEE",
      price: "300",
      description: "Weekly session fee include 5% free prices."
    },
    {
      title: "MONTHLY FEE",
      price: "400",
      description: "Monthly session fee include 10% free prices."
    },
    {
      title: "ANNUAL FEE",
      price: "1000",
      description: "Annual session fee include 20% free prices."
    }
  ];

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
      backgroundColor: "#1e40af",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div className="min-h-sreen bggradient-to-br from-gray-900 via-gray-800 to-black py-16 pb-10 px-4 sm:px-6 lg:px-8">
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
         
          
          
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-xl overflow-hidden relative group"
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
            >
              {/* Card Content */}
              <div className="p-8 text-center">
                <h3 className="text-gray-800 font-semibold text-lg mb-6 tracking-wide">
                  {plan.title}
                </h3>
                
                <div className="mb-6">
                  <span className="text-4xl md:text-5xl font-bold">
                    {plan.price}
                  </span>
                  <span className="text-2xl text-[#1747a6] font-semibold">$</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-8 leading-relaxed min-h-[3rem] flex items-center justify-center">
                  {plan.description}
                </p>
                
                <motion.button
                  className="w-full bg-blue-700 text-white py-3 px-6 rounded-md font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1747a6] focus:ring-offset-2"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Book Now
                </motion.button>
              </div>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1747a6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Decorative Elements */}
        <motion.div 
          className="mt-16 flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#1747a6] rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PricingSection;