import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletMultiButton, WalletDisconnectButton, WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';
import { useNavigate } from 'react-router-dom';

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
  const { connection } = useConnection();
  const Navigate = useNavigate();
  const { publicKey, sendTransaction, connected, connecting, disconnect } = useWallet();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentError, setPaymentError] = useState<string>('');
  const [balanceInfo, setBalanceInfo] = useState<{sol: number, usdc: number | null}>({sol: 0, usdc: null});
  
  const [formData, setFormData] = useState({
    isAnonymous: false,
    email: '',
    selectedPlan: selectedPlan?.title || '',
    selectedBilling: billingCycle,
  });


  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Solana configuration - Using Devnet
  const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // USDC Devnet
  const RECIPIENT_ADDRESS = new PublicKey('6AXc78Nve6CPqpewJzGgGQSwrNzunguLc7R737aS2Kar'); // Replace with your devnet wallet

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
      // Clear any previous payment errors when wallet changes
      setPaymentError('');
      setPaymentStatus('idle');
    } else {
      // Clear balance and errors when wallet disconnects
      setBalanceInfo({ sol: 0, usdc: null });
      setPaymentError('');
      setPaymentStatus('idle');
    }
  }, [connected, publicKey, connection]);

  const fetchBalance = async () => {
    if (!publicKey) return;

    try {
      // Clear any previous errors when fetching new balance
      setPaymentError('');
      
      // Get SOL balance
      const solBalance = await connection.getBalance(publicKey);
      const solAmount = solBalance / LAMPORTS_PER_SOL;

      // Get USDC balance
      let usdcAmount = null;
      try {
        const usdcTokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);
        const usdcAccountInfo = await connection.getTokenAccountBalance(usdcTokenAccount);
        usdcAmount = parseFloat(usdcAccountInfo.value.uiAmount || '0');
      } catch (error) {
        // USDC account doesn't exist
        usdcAmount = 0;
      }

      setBalanceInfo({ sol: solAmount, usdc: usdcAmount });
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalanceInfo({ sol: 0, usdc: null });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setPaymentStatus('idle');
      setPaymentError('');
      setBalanceInfo({ sol: 0, usdc: null });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSlide2 = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.selectedPlan) {
      newErrors.selectedPlan = 'Please select a plan';
    }
    
    if (!connected) {
      newErrors.wallet = 'Please connect your Solana wallet';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSlide1()) {
      setCurrentSlide(1);
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

  const processPayment = async () => {
    if (!connected || !publicKey || !formData.selectedPlan) return;

    const selectedPlanData = allPlans.find(plan => plan.title === formData.selectedPlan);
    if (!selectedPlanData) return;

    setPaymentStatus('processing');
    setPaymentError('');

    try {
      // Convert USD price to USDC amount (USDC has 6 decimals on devnet)
      const usdPrice = parseFloat(getPriceForPlan(selectedPlanData));
      const usdcAmount = Math.floor(usdPrice * 1000000); // Convert to micro-USDC
      
      // Check if user has sufficient USDC balance
      if (balanceInfo.usdc !== null && balanceInfo.usdc < usdPrice) {
        throw new Error(`Insufficient USDC balance. Required: ${usdPrice} USDC, Available: ${balanceInfo.usdc || 0} USDC`);
      }

      // Check SOL balance for transaction fees (minimum 0.01 SOL recommended)
      if (balanceInfo.sol < 0.01) {
        throw new Error(`Insufficient SOL for transaction fees. Required: ~0.01 SOL, Available: ${balanceInfo.sol.toFixed(4)} SOL`);
      }

      // Get associated token addresses
      const fromTokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);
      const toTokenAccount = await getAssociatedTokenAddress(USDC_MINT, RECIPIENT_ADDRESS);

      // Build transaction
      let transaction = new Transaction();
      
      // Check if sender's token account exists
      try {
        await connection.getAccountInfo(fromTokenAccount);
      } catch (error) {
        // Create associated token account if it doesn't exist
        const createATAInstruction = createAssociatedTokenAccountInstruction(
          publicKey, // payer
          fromTokenAccount, // associated token account
          publicKey, // owner
          USDC_MINT // mint
        );
        transaction.add(createATAInstruction);
      }

      // Check if recipient's token account exists
      try {
        await connection.getAccountInfo(toTokenAccount);
      } catch (error) {
        // Create recipient's associated token account if it doesn't exist
        const createRecipientATAInstruction = createAssociatedTokenAccountInstruction(
          publicKey, // payer (sender pays for recipient's account creation)
          toTokenAccount, // associated token account
          RECIPIENT_ADDRESS, // owner (recipient)
          USDC_MINT // mint
        );
        transaction.add(createRecipientATAInstruction);
      }

      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        publicKey,
        usdcAmount,
        [],
        TOKEN_PROGRAM_ID
      );

      transaction.add(transferInstruction); 
      const signature = await sendTransaction(transaction, connection);
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }
      setPaymentStatus('success');
     const sessionDetails = {
        transactionSignature:signature,
        selectedPlan: {
          title:formData.selectedPlan,
          price:usdPrice,
          billingCycle:formData?.selectedBilling
        },
        userDetails: {
          email: formData.email,
          isAnonymous: false
        }
      }
      localStorage.setItem('calm_session', JSON.stringify(sessionDetails))
      setPaymentStatus('idle');
      Navigate('/success')
     

    } catch (error: any) {
      console.error('Payment failed:', error);
      setPaymentStatus('error');
      
      // Enhanced error handling
      let errorMessage = 'Payment failed. Please try again.';
      
      if (error.message?.includes('Insufficient')) {
        errorMessage = error.message;
      } else if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message?.includes('failed to send transaction')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message?.includes('Transaction was not confirmed')) {
        errorMessage = 'Transaction timeout. Please check your wallet and try again.';
      } else if (error.name === 'WalletSendTransactionError') {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setPaymentError(errorMessage);
    }
  };

  const handleSubmit = () => {
    if (validateSlide2()) {
      processPayment();
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Provide Email Address</h3>
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
                                <h4 className="text-xs md:text-sm font-medium text-gray-900">{plan.title}</h4>
                              </div>
                              <div className="text-right">
                                <span className="text-xs md:text-lg font-bold text-gray-900">
                                  ${getPriceForPlan(plan)}
                                </span>
                                <span className="text-sm text-gray-600">{getPriceSuffix()}</span>
                              </div>
                            </div>
                             <p className="text-xs md:text-sm text-gray-600">{plan.description}</p>
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

                    {/* Solana Wallet Connection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Solana Wallet <span className="text-red-500">*</span>
                      </label>
                      
                      {!connected ? (
                        <div className="w-full flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#044341] hover:bg-[#044341]/5 transition-all">
                          <div className="text-center mb-4">
                            <div className="w-12 h-12 mx-auto mb-2 bg-[#044341]/10 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-[#044341]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-900">Connect Solana Wallet</p>
                            <p className="text-xs text-gray-500">Pay with USDC on Solana Devnet</p>
                          </div>
                          
                          <div className="wallet-adapter-button-trigger">
                            <WalletMultiButton className="!bg-[#044341] hover:!bg-[#044341]/90 !rounded-md !text-sm !py-2 !px-4" />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-green-900">Wallet Connected</p>
                                <p className="text-xs text-green-700 font-mono">
                                  {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
                                </p>
                                {balanceInfo.sol > 0 && (
                                  <div className="text-xs text-green-600 mt-1">
                                    SOL: {balanceInfo.sol.toFixed(4)} | USDC: {balanceInfo.usdc?.toFixed(2) || '0.00'}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <WalletDisconnectButton className="!bg-transparent !border !border-green-300 !text-green-700 hover:!bg-green-100 !text-xs !py-1 !px-2 !rounded" />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {errors.wallet && <p className="text-red-500 text-sm mt-1">{errors.wallet}</p>}
                      {paymentError && <p className="text-red-500 text-sm mt-1">{paymentError}</p>}
                    </div>

                    {/* Payment Status */}
                    {paymentStatus === 'processing' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
                          <p className="text-sm text-blue-900">Processing payment...</p>
                        </div>
                      </div>
                    )}

                    {paymentStatus === 'success' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-sm text-green-900">Payment successful!</p>
                        </div>
                      </div>
                    )}

                    {/* Total Amount */}
                    {selectedPlanData && connected && (
                      <div className="bg-[#044341]/5 p-4 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Total Amount:</span>
                          <span className="text-xl font-bold text-[#044341]">
                            ${getPriceForPlan(selectedPlanData)} USDC
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Payment will be processed on Solana Devnet</p>
                      </div>
                    )}
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
                  className="px-4 text-xs py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={paymentStatus === 'processing'}
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                disabled={paymentStatus === 'processing'}
              >
                Cancel
              </button>
              {currentSlide === 0 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 text-xs bg-[#044341] text-white rounded-md hover:bg-[#044341]/90 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!connected || paymentStatus === 'processing' || connecting}
                  className="px-2 text-xs py-2 bg-[#044341] text-white rounded-md hover:bg-[#044341]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentStatus === 'processing' ? 'Processing...' : 'Pay with USDC'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Main PricingSection component with WalletProvider setup
const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'session' | 'monthly' | 'yearly'>('session');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | undefined>();

  // Solana network configuration
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => 'https://api.devnet.solana.com', []);
  
  // Wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  const pricingPlans: PricingPlan[] = [
    {
      title: "DEVELOPER SUPPORT",
      sessionPrice: "1",
      monthlyPrice: "1",
      yearlyPrice: "1",
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
      sessionPrice: "1",
      monthlyPrice: "1",
      yearlyPrice: "1",
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
      sessionPrice: "1",
      monthlyPrice: "1",
      yearlyPrice: "1",
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
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
            {/* Add wallet adapter styles */}
            <style jsx global>{`
            
              
              .wallet-adapter-button:hover {
                background-color: rgba(4, 67, 65, 0.9) !important;
              }
              .wallet-adapter-button:not([disabled]):hover {
                background-color: rgba(4, 67, 65, 0.9) !important;
              }
              .wallet-adapter-modal {
                font-family: inherit !important;
              }
              
              .wallet-adapter-modal-wrapper {
                border-radius: 0.75rem !important;
              }
            `}</style>

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
                  All sessions include secure, encrypted video calls and follow HIPAA compliance standards. Payments processed securely on Solana Devnet with USDC.
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
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default PricingSection;