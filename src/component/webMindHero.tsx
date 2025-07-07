import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ number, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="text-center max-w-sm mx-auto"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="mb-6"
      >
        <div className="text-6xl font-bold text-white/30 mb-2">{number}</div>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-white/80 text-lg leading-relaxed">{description}</p>
      </motion.div>
    </motion.div>
  );
};

const Web3MindsHero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-20"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <p className="text-white/80 text-lg font-medium tracking-wide uppercase mb-4">
              HOW WE WORK ?
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Here For Your{' '}
              <span className="text-blue-200">DeFi Mind</span>,
              <br />
              Here For Your{' '}
              <span className="text-blue-200">Crypto Heart</span>
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <p className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed">
              We offer compassionate care, combining mental wellness and Web3 wisdom 
              to help you thrive in the decentralized world.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#044341] font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg"
            >
              Get Consult Now
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <FeatureCard
            number="01"
            title="Listen & Understand"
            description="Your Web3 journey matters. We're dedicated to supporting both your mental clarity and emotional strength every step forward in DeFi."
            delay={0.5}
          />
          
          <FeatureCard
            number="02"
            title="Create A Tailored Plan"
            description="From market volatility stress to crypto burnout, our team stands ready to support your healing and overall well-being in Web3."
            delay={0.7}
          />
          
          <FeatureCard
            number="03"
            title="Support & Empower"
            description="Empowering you to navigate Web3 with care that nurtures your mind, body, and emotional peace every single day."
            delay={0.9}
          />
        </div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-32 right-16 w-6 h-6 bg-white/20 rounded-full blur-sm"
      />
      
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-32 left-16 w-4 h-4 bg-white/30 rounded-full blur-sm"
      />
    </div>
  );
};

export default Web3MindsHero;