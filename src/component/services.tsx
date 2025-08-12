import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from '@solana/spl-token';

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

interface WalletAdapter {
  name: string;
  icon: string;
  adapter: any;
  installed: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedPlan, 
  billingCycle, 
  allPlans 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [connectedWallet, setConnectedWallet] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentError, setPaymentError] = useState<string>('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [balanceInfo, setBalanceInfo] = useState<{sol: number, usdc: number | null}>({sol: 0, usdc: null});
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    isAnonymous: false,
    email: '',
    story: '',
    selectedPlan: selectedPlan?.title || '',
    selectedBilling: billingCycle,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Solana configuration - Using Devnet
  const connection = new Connection('https://api.devnet.solana.com');
  const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // USDC Devnet
  const RECIPIENT_ADDRESS = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // Replace with your devnet wallet

  // Available wallet adapters
  const getAvailableWallets = (): WalletAdapter[] => {
    const wallets: WalletAdapter[] = [];
    const windowAny = window as any;

    // Phantom
    if (windowAny.solana?.isPhantom) {
      wallets.push({
        name: 'Phantom',
        icon: '👻',
        adapter: windowAny.solana,
        installed: true
      });
    }

    // Solflare
    if (windowAny.solflare?.isSolflare) {
      wallets.push({
        name: 'Solflare',
        icon: '🔥',
        adapter: windowAny.solflare,
        installed: true
      });
    }

    // Backpack
    if (windowAny.backpack?.isBackpack) {
      wallets.push({
        name: 'Backpack',
        icon: '🎒',
        adapter: windowAny.backpack,
        installed: true
      });
    }

    // Glow
    if (windowAny.glowSolana?.isGlow) {
      wallets.push({
        name: 'Glow',
        icon: '✨',
        adapter: windowAny.glowSolana,
        installed: true
      });
    }

    // Slope
    if (windowAny.Slope) {
      wallets.push({
        name: 'Slope',
        icon: '📐',
        adapter: windowAny.Slope,
        installed: true
      });
    }

    // Add uninstalled wallets for download links
    const installedNames = wallets.map(w => w.name);
    
    if (!installedNames.includes('Phantom')) {
      wallets.push({
        name: 'Phantom',
        icon: '👻',
        adapter: null,
        installed: false
      });
    }

    if (!installedNames.includes('Solflare')) {
      wallets.push({
        name: 'Solflare',
        icon: '🔥',
        adapter: null,
        installed: false
      });
    }

    if (!installedNames.includes('Backpack')) {
      wallets.push({
        name: 'Backpack',
        icon: '🎒',
        adapter: null,
        installed: false
      });
    }

    return wallets;
  };

  const availableWallets = getAvailableWallets();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (walletConnected && walletAddress) {
      fetchBalance();
    }
  }, [walletConnected, walletAddress]);

  const checkWalletConnection = async () => {
    try {
      // Check each available wallet for existing connection
      for (const wallet of availableWallets) {
        if (wallet.installed && wallet.adapter) {
          try {
            const response = await wallet.adapter.connect({ onlyIfTrusted: true });
            if (response.publicKey) {
              setWalletConnected(true);
              setWalletAddress(response.publicKey.toString());
              setConnectedWallet(wallet.name);
              return;
            }
          } catch (error) {
            // Silent fail for auto-connect
          }
        }
      }
    } catch (error) {
      console.log('No wallet auto-connected');
    }
  };

  const fetchBalance = async () => {
    if (!walletAddress) return;

    try {
      const publicKey = new PublicKey(walletAddress);
      
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

  const connectWallet = async (walletName: string) => {
    const wallet = availableWallets.find(w => w.name === walletName);
    
    if (!wallet) {
      setPaymentError(`${walletName} wallet not found`);
      return;
    }

    if (!wallet.installed) {
      // Open wallet download page
      const downloadUrls: {[key: string]: string} = {
        'Phantom': 'https://phantom.app/',
        'Solflare': 'https://solflare.com/',
        'Backpack': 'https://backpack.app/',
        'Glow': 'https://glow.app/',
        'Slope': 'https://slope.finance/'
      };
      
      window.open(downloadUrls[walletName] || 'https://solana.com/ecosystem/explore?categories=wallet', '_blank');
      return;
    }

    try {
      setPaymentError('');
      const response = await wallet.adapter.connect();
      setWalletConnected(true);
      setWalletAddress(response.publicKey.toString());
      setConnectedWallet(walletName);
      setShowWalletModal(false);
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        setPaymentError('Connection rejected by user');
      } else if (error.message?.includes('User rejected')) {
        setPaymentError('Connection rejected by user');
      } else {
        setPaymentError(`Failed to connect ${walletName} wallet`);
      }
    }
  };

  const disconnectWallet = async () => {
    try {
      const wallet = availableWallets.find(w => w.name === connectedWallet);
      if (wallet?.adapter?.disconnect) {
        await wallet.adapter.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
    
    setWalletConnected(false);
    setWalletAddress('');
    setConnectedWallet('');
    setPaymentStatus('idle');
    setPaymentError('');
    setBalanceInfo({ sol: 0, usdc: null });
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
    
    if (!walletConnected) {
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
    if (!walletConnected || !formData.selectedPlan) return;

    const selectedPlanData = allPlans.find(plan => plan.title === formData.selectedPlan);
    if (!selectedPlanData) return;

    setPaymentStatus('processing');
    setPaymentError('');

    try {
      const wallet = availableWallets.find(w => w.name === connectedWallet);
      if (!wallet?.adapter) {
        throw new Error('Wallet adapter not found');
      }

      const fromPubkey = new PublicKey(walletAddress);
      
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
      const fromTokenAccount = await getAssociatedTokenAddress(USDC_MINT, fromPubkey);
      const toTokenAccount = await getAssociatedTokenAddress(USDC_MINT, RECIPIENT_ADDRESS);

      // Check if sender's token account exists
      let transaction = new Transaction();
      
      try {
        await connection.getAccountInfo(fromTokenAccount);
      } catch (error) {
        // Create associated token account if it doesn't exist
        const createATAInstruction = createAssociatedTokenAccountInstruction(
          fromPubkey, // payer
          fromTokenAccount, // associated token account
          fromPubkey, // owner
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
          fromPubkey, // payer (sender pays for recipient's account creation)
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
        fromPubkey,
        usdcAmount,
        [],
        TOKEN_PROGRAM_ID
      );

      transaction.add(transferInstruction);
      
      // Set recent blockhash and fee payer
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // Sign and send transaction
      const signedTransaction = await wallet.adapter.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      console.log('Transaction sent:', signature);
      
      // Wait for confirmation with timeout
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }
      
      setPaymentStatus('success');
      
      // Refresh balance after successful payment
      setTimeout(() => {
        fetchBalance();
      }, 2000);
      
      // Handle form submission after successful payment
      console.log('Payment successful! Transaction:', signature);
      console.log('Booking data:', formData);
      
      setTimeout(() => {
        alert(`Booking submitted successfully! Transaction: ${signature}`);
        onClose();
        setPaymentStatus('idle');
      }, 3000);

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
      } else if (error.code === 4001) {
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    
                    {/* Anonymous Option */}
                    <div className="mb-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isAnonymous}
                          onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                          className="w-4 h-4 text-[#044341] border-gray-300 rounded focus:ring-[#044341] focus:ring-2"
                        />
                        <span className="text-sm text-gray-700 font-medium">I prefer to remain anonymous</span>
                      </label>
                    </div>

                    {/* Name Fields */}
                    {!formData.isAnonymous && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#044341] focus:border-transparent"
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#044341] focus:border-transparent"
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>
                    )}

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
                                <h4 className="font-medium text-gray-900">{plan.title}</h4>
                                <p className="text-sm text-gray-600">{plan.description}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-gray-900">
                                  ${getPriceForPlan(plan)}
                                </span>
                                <span className="text-sm text-gray-600">{getPriceSuffix()}</span>
                              </div>
                            </div>
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
                      
                      {!walletConnected ? (
                        <button
                          onClick={() => setShowWalletModal(true)}
                          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#044341] hover:bg-[#044341]/5 transition-all"
                        >
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-2 bg-[#044341]/10 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-[#044341]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-900">Connect Solana Wallet</p>
                            <p className="text-xs text-gray-500">Pay with USDC on Solana Devnet</p>
                          </div>
                        </button>
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
                                <p className="text-sm font-medium text-green-900">{connectedWallet} Connected</p>
                                <p className="text-xs text-green-700 font-mono">
                                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                                </p>
                                {balanceInfo.sol > 0 && (
                                  <div className="text-xs text-green-600 mt-1">
                                    SOL: {balanceInfo.sol.toFixed(4)} | USDC: {balanceInfo.usdc?.toFixed(2) || '0.00'}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={disconnectWallet}
                              className="text-xs text-green-700 hover:text-green-900 underline"
                            >
                              Disconnect
                            </button>
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
                    {selectedPlanData && walletConnected && (
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
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={paymentStatus === 'processing'}
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={paymentStatus === 'processing'}
              >
                Cancel
              </button>
              {currentSlide === 0 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-[#044341] text-white rounded-md hover:bg-[#044341]/90 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!walletConnected || paymentStatus === 'processing'}
                  className="px-6 py-2 bg-[#044341] text-white rounded-md hover:bg-[#044341]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentStatus === 'processing' ? 'Processing...' : 'Pay with USDC'}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Wallet Selection Modal */}
        {showWalletModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
            onClick={() => setShowWalletModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Connect Wallet</h3>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                {availableWallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => connectWallet(wallet.name)}
                    className={`w-full flex items-center justify-between p-3 border rounded-lg transition-all ${
                      wallet.installed 
                        ? 'border-gray-200 hover:border-[#044341] hover:bg-[#044341]/5' 
                        : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{wallet.icon}</span>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{wallet.name}</p>
                        <p className="text-xs text-gray-500">
                          {wallet.installed ? 'Detected' : 'Not installed'}
                        </p>
                      </div>
                    </div>
                    {wallet.installed ? (
                      <svg className="w-5 h-5 text-[#044341]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Devnet Environment</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      This is using Solana Devnet. Use devnet SOL and USDC for testing.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

// Updated PricingSection component with modal integration
const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'session' | 'monthly' | 'yearly'>('session');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | undefined>();

  const pricingPlans: PricingPlan[] = [
    {
      title: "DEVELOPER SUPPORT",
      sessionPrice: "200",
      monthlyPrice: "750",
      yearlyPrice: "8100",
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
      sessionPrice: "350",
      monthlyPrice: "1260",
      yearlyPrice: "13650",
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
      sessionPrice: "500",
      monthlyPrice: "1800",
      yearlyPrice: "19500",
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
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
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
  );
};

export default PricingSection;