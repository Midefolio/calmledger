import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom"; // or your routing library
import { useState } from "react";

interface NavLink {
    name: string;
    path: string;
    label: string;
}

const NavBar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Array of navigation links
    const navLinks: NavLink[] = [
        { name: "home", path: "/", label: "Home" },
        { name: "about", path: "/about", label: "About us" },
        { name: "services & Pricing", path: "/services", label: "Services & Pricing" },
        { name: "contact", path: "/contact", label: "Contact" }
    ];

    // Get active link from current URL
    const getActiveLink = (path: string): boolean => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="flex flex-col shadow-sm fixed z-5090 w-full backdrop-blur-2xl">
                {/* Top Bar - Hidden on mobile */}
                <div className="hidden md:flex font-sans w-full px-4 lg:px-40 justify-between bg-[#044341]">
                    <div className="flex gap-4 items-center">
                        {/* X (Twitter) Logo */}
                        <motion.a
                            whileHover={{ scale: 1.2, color: "#3b82f6" }}
                            href="https://x.com/vlux_essence"
                            className="text-gray-100 text-xs transition-all duration-300"
                            aria-label="X (Twitter)"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </motion.a>

                        {/* Facebook Logo */}
                        <motion.a
                            whileHover={{ scale: 1.2, color: "#3b82f6" }}
                            href="https://www.facebook.com/vlux_essence"
                            className="text-gray-100 text-xs transition-all duration-300"
                            aria-label="Facebook"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </motion.a>

                        {/* YouTube Logo */}
                        <motion.a
                            whileHover={{ scale: 1.2, color: "#3b82f6" }}
                            href="https://www.youtube.com/@vlux_essence"
                            className="text-gray-100 text-xs transition-all duration-300"
                            aria-label="YouTube"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </motion.a>

                        <span className="text-white"> @calm_ledger</span>
                    </div>
                    <div className="flex gap-4 lg:gap-10 items-center text-white font-sans text-xs lg:text-sm">
                        <span className="hidden lg:inline">Mon-Sun 10.00 - 17.00</span>
                        <span> +880-1911623458</span>
                        <button className="p-2 lg:p-4 bg-white text-black font-bold uppercase text-xs lg:text-sm">
                            Book a session
                        </button>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="flex font-sans w-full items-center px-4 lg:px-40 py-2 justify-between bg-hite">
                    <div className="logo">
                        <img src="/logo4.png" alt="" className="h-15 w-50 -ml-5 object-cover" />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-10 text-gray-200">
                        {navLinks.map((link) => {
                            const isActive = getActiveLink(link.path);
                            return (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    className={`uppercase pb-3 relative group font-bold transition-all duration-300 hover:text-[#044341] hover:scale-105 ${isActive ? 'text-[#fff] font-semibold' : ''
                                        }`}
                                >
                                    {link.label}
                                    <span
                                        className={`absolute left-0 bottom-0 h-0.5 bg-[#044341] transition-all duration-300 group-hover:w-full ${isActive ? 'w-full' : 'w-0'
                                            }`}
                                    ></span>
                                </a>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleMobileMenu}
                        className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative z-50"
                        aria-label="Toggle mobile menu"
                    >
                        <motion.span
                            animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                            className="block w-6 h-0.5 bg-gray-600 mb-1.5 origin-center transition-all duration-300"
                        />
                        <motion.span
                            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="block w-6 h-0.5 bg-gray-600 mb-1.5 transition-all duration-300"
                        />
                        <motion.span
                            animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                            className="block w-6 h-0.5 bg-gray-600 origin-center transition-all duration-300"
                        />
                    </motion.button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <div className="bg-whie">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/90 w-[100vw] h-[100vh] bg-opacity-50 z-40 md:hidden"
                                onClick={closeMobileMenu}
                            />

                            {/* Mobile Menu */}
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden"
                            >
                                <div className="flex flex-col h-fll bg-white">
                                    {/* Mobile Menu Header */}
                                    <div className="flex items-center justify-between p-6 border-b">
                                        <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                                        <button
                                            onClick={closeMobileMenu}
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            aria-label="Close menu"
                                        >
                                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Mobile Navigation Links */}
                                    <div className="flex flex-col py-6 bg-white flex-1">
                                        {navLinks.map((link, index) => {
                                            const isActive = getActiveLink(link.path);
                                            return (
                                                <motion.a
                                                    key={link.name}
                                                    href={link.path}
                                                    onClick={closeMobileMenu}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className={`px-6 py-4 text-lg font-semibold transition-all duration-300 border-l-4 ${isActive 
                                                        ? 'text-[#044341] border-[#044341] bg-blue-50' 
                                                        : 'text-gray-700 border-transparent hover:text-[#044341] hover:border-blue-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {link.label}
                                                </motion.a>
                                            );
                                        })}
                                    </div>

                                    {/* Mobile Contact Info */}
                                    <div className="px-6 py-6 border-t bg-gray-50">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <span className="text-gray-700 font-medium">+880-1911623458</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-gray-700 font-medium">Mon-Sun 10.00 - 17.00</span>
                                            </div>
                                            <button className="w-full mt-4 p-3 bg-[#044341] text-white font-bold uppercase rounded-lg hover:bg-[#044341] transition-colors">
                                                Book a session
                                            </button>
                                        </div>

                                        {/* Mobile Social Links */}
                                        <div className="flex gap-4 mt-6 justify-center">
                                            <motion.a
                                                whileHover={{ scale: 1.2 }}
                                                href="https://x.com/vlux_essence"
                                                className="text-gray-600 hover:text-[#044341] transition-colors"
                                                aria-label="X (Twitter)"
                                            >
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            </motion.a>

                                            <motion.a
                                                whileHover={{ scale: 1.2 }}
                                                href="https://www.facebook.com/vlux_essence"
                                                className="text-gray-600 hover:text-[#044341] transition-colors"
                                                aria-label="Facebook"
                                            >
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </motion.a>

                                            <motion.a
                                                whileHover={{ scale: 1.2 }}
                                                href="https://www.youtube.com/@vlux_essence"
                                                className="text-gray-600 hover:text-[#044341] transition-colors"
                                                aria-label="YouTube"
                                            >
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                </svg>
                                            </motion.a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

export default NavBar;