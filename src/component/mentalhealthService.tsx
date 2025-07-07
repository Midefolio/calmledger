import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Headphones, Settings } from 'lucide-react';

interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const MentalHealthServices: React.FC = () => {
  const services: ServiceCard[] = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Personalized",
      subtitle: "Wellness Plans",
      description: "Tailored guidance crafted to meet your unique needs and goals effectively.",
      bgColor: "bg-pink-200",
      textColor: "text-pink-800"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert-Led",
      subtitle: "Counseling Sessions",
      description: "Professional support designed to guide emotional well-being every single day.",
      bgColor: "bg-pink-300",
      textColor: "text-pink-900"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Support",
      subtitle: "Community",
      description: "Always-connected space offering care, encouragement, and shared growth.",
      bgColor: "bg-blue-600",
      textColor: "text-white"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Interactive",
      subtitle: "Self-Care Tools",
      description: "Empowering digital resources to build healthy habits independently.",
      bgColor: "bg-blue-700",
      textColor: "text-white"
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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className={`
                ${service.bgColor} ${service.textColor} 
                rounded-2xl p-6 lg:p-8 shadow-lg
                transition-shadow duration-300 hover:shadow-xl
                cursor-pointer
              `}
            >
              <motion.div
                variants={cardHoverVariants}
                className="space-y-4"
              >
                {/* Icon */}
                <div className="flex justify-start">
                  <div className={`
                    p-3 rounded-xl 
                    ${service.bgColor === 'bg-pink-200' || service.bgColor === 'bg-pink-300' 
                      ? 'bg-white/20' 
                      : 'bg-white/10'
                    }
                  `}>
                    {service.icon}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold leading-tight">
                    {service.title}
                  </h3>
                  <h4 className="text-lg sm:text-xl font-bold leading-tight">
                    {service.subtitle}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base leading-relaxed opacity-90">
                  {service.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom spacing for better visual balance */}
        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
           
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MentalHealthServices;