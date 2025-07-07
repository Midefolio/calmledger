import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex C.",
    role: "Solidity Developer",
    content: "Working in DeFi means constant pressure and 24/7 markets. CalmLedger helps me track my stress levels during intense development cycles and major protocol launches. It's specifically designed for our unique challenges.",
    avatar: "AC",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus T.",
    role: "Crypto Trader",
    content: "The volatility of crypto markets was destroying my mental health. CalmLedger's mood tracking helps me identify when market stress affects my decision-making. Now I trade with better emotional control.",
    avatar: "MT",
    rating: 5
  },
  {
    id: 3,
    name: "Sarah K.",
    role: "Web3 Startup Founder",
    content: "Building in Web3 is incredibly demanding - fundraising, regulatory uncertainty, and technical complexity. CalmLedger gives me the mental clarity tools I need to lead effectively in this space.",
    avatar: "SK",
    rating: 5
  },
  {
    id: 4,
    name: "David L.",
    role: "Blockchain Engineer",
    content: "The unique psychological challenges of working with cutting-edge technology finally have a dedicated solution. CalmLedger understands the Web3 mindset and provides relevant mental health support.",
    avatar: "DL",
    rating: 5
  }
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({ 
  testimonial, 
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100 h-full flex flex-col hover:shadow-md transition-shadow duration-300"
    >
      <StarRating rating={testimonial.rating} />
      
      <blockquote className="text-gray-700 text-sm leading-relaxed mb-6 flex-grow font-medium">
        "{testimonial.content}"
      </blockquote>
      
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#044341] to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
          {testimonial.avatar}
        </div>
        <div>
          <div className="font-bold text-gray-900 text-sm">
            {testimonial.name}
          </div>
          <div className="text-gray-500 text-xs">
            {testimonial.role}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CalmLedgerTestimonials: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 lg:sticky lg:top-8"
          >
            <div className="inline-block">
              <span className="text-[#044341] font-bold text-sm tracking-wider uppercase">
                USER TESTIMONIALS
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Mental Clarity for the{' '}
              <br className="hidden sm:block" />
              <span className="block text-[#044341]">Web3 Mind</span>
            </h2>
            
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl">
              At Calm Ledger, we bridge the gap between traditional mental health care and the unique needs of the Web3 ecosystem. Our mission is to ensure that the brilliant minds building the future of the internet have the psychological tools and support they need to thrive both personally and professionally..
            </p>
          </motion.div>

          {/* Right Content - Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.id} 
                testimonial={testimonial} 
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalmLedgerTestimonials;