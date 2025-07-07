import React, { useEffect, useState } from 'react';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
     const [showToTop, setShowToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowToTop(true);
      } else {
        setShowToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="fex items-ceter mb-6">
                <img src="/logo4.png" alt="" className="h-15 -ml-5 w-50 object-cover" />
              <div>
                
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Specialized mental health services for Web3 developers, traders, and blockchain entrepreneurs navigating the digital frontier.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-[#044341] rounded-full flex items-center justify-center hover:bg[#044341] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#044341] rounded-full flex items-center justify-center hover:bg[#044341] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#044341] rounded-full flex items-center justify-center hover:bg[#044341] transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6 text-[#044341]">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-[#044341] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">456 Blockchain Ave, Crypto Valley, CA 94102,</p>
                  <p className="text-gray-300 text-sm">United States</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-[#044341] flex-shrink-0" />
                <a href="mailto:support@calmledger.com" className="text-gray-300 text-sm hover:text-white transition-colors">
                  support@calmledger.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-[#044341] flex-shrink-0" />
                <a href="tel:555-WEB3-CALM" className="text-gray-300 text-sm hover:text-white transition-colors">
                  (555) WEB3-CALM
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6 text-[#044341]">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">Web3 Therapy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">Trader Support</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">Developer Wellness</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">Blockchain Burnout</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">Crypto Anxiety</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            Copyright © 2025 CalmLedger. All Rights Reserved.
          </p>
        </div>
      </div>


         {/* Scroll to Top Button */}
      {showToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#044341] hover:bg-[#066662] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-50 group"
          aria-label="Scroll to top"
        >
          <ArrowUp 
            size={24} 
            className="group-hover:-translate-y-1 transition-transform duration-300" 
          />
        </button>
      )}
    </footer>
  );
};

export default Footer;