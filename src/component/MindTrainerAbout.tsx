import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Code, TrendingUp, Users, Brain, Dot, PlayCircle } from 'lucide-react';

const Web3AboutSection: React.FC = () => {
  const services = [
    { text: "Free Consultation", icon: <CheckCircle className="w-5 h-5" /> },
    { text: "Mental Satisfaction", icon: <CheckCircle className="w-5 h-5" /> },
    { text: "Emergency Service", icon: <CheckCircle className="w-5 h-5" /> },
    { text: "Psychologists Services", icon: <CheckCircle className="w-5 h-5" /> }
  ];

  const whoWeServe = [
    {
      text: "Developers & Engineers in the web3 ecosystem",
      icon: <Code className="w-5 h-5 text-[#044341]" />
    },
    {
      text: "Traders & Investors",
      icon: <TrendingUp className="w-5 h-5 text-green-600" />
    },
    {
      text: "Web3 Entrepreneurs & Leaders",
      icon: <Users className="w-5 h-5 text-purple-600" />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-cnter">
          {/* Left side - Images */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            {/* Main image container */}
            <div className="relative">
              {/* Main background image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-300 via-blue-200 to-indigo-300 h-full">
                <img src="/img3.png" className='object-cover w-full h-[80vh]' alt="" />


                {/* Experience badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute bottom-6 right-6 bg-pink-400 text-white px-6 py-3 rounded-2xl shadow-lg"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">5+ Years</div>
                    <div className="text-sm">Of Experience</div>
                  </div>
                </motion.div>
              </div>

              {/* Circular overlay image - positioned top left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20, y: -20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="absolute -top-8 -left-8 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
              >
                <div className="relative w-full h-full">
                  {/* Circular image with border */}
                  <div className="w-full h-full rounded-full overflow-hidden shadow-xl border-4 border-white bg-gradient-to-br from-blue-200 to-purple-200">
                    {/* Placeholder for circular counseling image */}
                     <img src="/img5.png" className='h-full w-full object-cover' alt="" />
                  </div>

                  {/* Decorative yellow accent */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 rounded-full border-2 border-white shadow-lg"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="text-[#044341] font-semibold text-sm uppercase tracking-wide">
                ABOUT US
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Your Journey To Mental Wellness Starts Here
              </h2>
            </motion.div>

            {/* Main content */}
            <motion.div variants={itemVariants} className="space-y-6">
              <p className="text-gray-500 text-lg leading-relaxed">
                In today's rapidly evolving digital landscape, we recognize that the minds driving innovation in blockchain, cryptocurrency, and decentralized technologies face unique psychological challenges. That's why we've specialized in providing mental clarity for the Web3 mind.
              </p>

              {/* Who We Serve */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Who We Serve ?
                </h3>
                <ul className="space-y-3">
                  {whoWeServe.map((item, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      className="flex items-center text-gray-700"
                    >
                      <Dot className='h-10 w-10 text-[#044341]' />
                      <span className="text-lg"> {item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* <p className="text-gray-500 text-sm leading-relaxed">
                At Calm Ledger, we bridge the gap between traditional mental health care and the unique needs of the Web3 ecosystem. Our mission is to ensure that the brilliant minds building the future of the internet have the psychological tools and support they need to thrive both personally and professionally.
              </p> */}
            </motion.div>

            {/* Quote */}
            <motion.div variants={itemVariants} className="relative">
              <div className="border-l-4 border-[#044341] pl-6 py-4">
                <p className="text-gray-800 italic text-lg leading-relaxed">
                  Your mental health is the foundation of your innovation.
                  Let us help you build it strong
                </p>
              </div>
            </motion.div>

            {/* Signature and CTA */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="text-3xl font-bold text-gray-600 italic">
                Calm Ledger
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#044341] flex items-center gap-1 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg"
              >
               About Us In 30sec <PlayCircle/>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Web3AboutSection;