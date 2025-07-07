import React from 'react';
import { motion } from 'framer-motion';
import { Check, Smile, ThumbsUp, Users } from 'lucide-react';

const MentalHealthHero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const imageVariants:any = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="pb-30 bg-gradient-to-br from-purple-300 via-blue-200 to-indigo-300 px-4 py-8 md:py-16">
      <motion.div 
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-6 lg:space-y-8"
            variants={itemVariants}
          >
            <motion.div variants={itemVariants}>
              <p className="text-[#044341] font-semibold text-sm md:text-base mb-2 tracking-wide">
              Our Approach 
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 leading-tight">
                Restoring Hope, One Day At A Time
              </h1>
            </motion.div>

            <motion.p 
              className="text-[#044341] text-lg md:text-xl leading-relaxed max-w-lg"
              variants={itemVariants}
            >
              Through consistent care and compassionate guidance, we help individuals in the web3 ecosystem rediscover strength, build resilience, and move forward toward a brighter, healthier future at their own pace.
            </motion.p>

            <motion.div 
              className="space-y-4"
              variants={itemVariants}
            >
              {[
                "Compassionate & Experienced Professionals",
                "Holistic Approach To Well-Being",
                "Safe & Supportive Environment"
              ].map((text, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-[#044341] rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-800 font-medium text-lg">
                    {text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                className="bg-[#044341] hover:bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Make An Appointment
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            {/* Main Image */}
            <motion.div 
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
              variants={imageVariants}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="w-full h-full bg-cover bg-center" style={{
                  backgroundImage: `url(img2.png)`
                }}>
                   
                </div>
              </div>
            </motion.div>

            {/* Floating Stats Cards */}
            <motion.div 
              className="absolute -right-4 top-8 bg-[#044341] text-white p-4 rounded-xl shadow-lg"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Smile className="w-6 h-6" />
                <span className="text-2xl font-bold">100%</span>
              </div>
              <p className="text-sm opacity-90">Satisfaction</p>
            </motion.div>

            <motion.div 
              className="absolute -right-4 top-32 bg-[#044341] text-white p-4 rounded-xl shadow-lg"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <ThumbsUp className="w-6 h-6" />
                <span className="text-2xl font-bold">257+</span>
              </div>
              <p className="text-sm opacity-90">Happy Patient</p>
            </motion.div>

            <motion.div 
              className="absolute -right-4 top-56 bg-[#044341] text-white p-4 rounded-xl shadow-lg"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-6 h-6" />
                <span className="text-2xl font-bold">10+</span>
              </div>
              <p className="text-sm opacity-90">Expert Therapist</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MentalHealthHero;