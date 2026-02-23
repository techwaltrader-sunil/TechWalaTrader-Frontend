
import React, { useState } from 'react';
import PricingCard from '../../components/algoComponents/Subscriptions/PricingCard';
import { ShieldCheck, HelpCircle, Zap } from 'lucide-react';

const Subscriptions = () => {
  
  // State for Billing Cycle
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  // --- MOCK DATA FOR PLANS ---
  const plans = [
    {
      id: 'basic',
      name: 'Starter',
      description: 'Perfect for beginners learning algo trading.',
      price: { monthly: 0, yearly: 0 },
      isPopular: false,
      features: [
        { text: "1 Active Strategy", included: true },
        { text: "Paper Trading Only", included: true },
        { text: "Standard Support", included: true },
        { text: "Live Trading with Broker", included: false },
        { text: "Multi-Leg Strategies", included: false },
        { text: "TradingView Webhooks", included: false },
      ]
    },
    {
      id: 'pro',
      name: 'Pro Trader',
      description: 'For serious traders who want automation.',
      price: { monthly: 999, yearly: 9999 }, // ~2 months free on yearly
      isPopular: true, // This will highlight the card
      features: [
        { text: "5 Active Strategies", included: true },
        { text: "Live Trading (All Brokers)", included: true },
        { text: "TradingView Webhooks", included: true },
        { text: "Multi-Leg Strategies", included: true },
        { text: "Priority Support", included: true },
        { text: "100ms Execution Speed", included: true },
      ]
    },
    {
      id: 'business',
      name: 'Elite / Business',
      description: 'Unlimited power for high volume traders.',
      price: { monthly: 2499, yearly: 24999 },
      isPopular: false,
      features: [
        { text: "Unlimited Strategies", included: true },
        { text: "Ultra-Low Latency", included: true },
        { text: "Dedicated Account Manager", included: true },
        { text: "API Access", included: true },
        { text: "Multiple Broker Accounts", included: true },
        { text: "Custom Strategy Development", included: true },
      ]
    }
  ];

  // Dummy current plan
  const currentPlanId = 'basic'; 

  const handleUpgrade = (plan) => {
      alert(`Redirecting to payment gateway for ${plan.name} (${billingCycle})...`);
  };

  return (
    // ✅ Main Container: Light (Gray-50) | Dark (Slate-950)
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white font-sans transition-colors duration-300">
        
        {/* 1. Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 pt-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-gray-600 dark:from-white dark:via-blue-100 dark:to-gray-400 bg-clip-text text-transparent transition-colors">
                Choose the Right Plan for Your Trading
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                Unlock the full potential of algorithmic trading with our flexible pricing plans. 
                Cancel anytime, no hidden fees.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
                <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Monthly</span>
                
                {/* Switch UI */}
                <button 
                    onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                    className="w-14 h-7 bg-gray-200 dark:bg-slate-800 rounded-full p-1 relative transition-colors border border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500"
                >
                    <div className={`w-5 h-5 bg-blue-600 rounded-full shadow-md transition-all duration-300 absolute top-1 
                        ${billingCycle === 'monthly' ? 'left-1' : 'left-[34px]'}
                    `}></div>
                </button>

                <span className={`text-sm font-bold transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                    Yearly
                    <span className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-200 dark:border-green-500/20 animate-pulse font-bold">
                        Save 20%
                    </span>
                </span>
            </div>
        </div>

        {/* 2. Pricing Cards Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 items-center">
            {plans.map((plan) => (
                <PricingCard 
                    key={plan.id} 
                    plan={plan} 
                    billingCycle={billingCycle}
                    isCurrent={plan.id === currentPlanId}
                    onUpgrade={handleUpgrade}
                />
            ))}
        </div>

        {/* 3. Trust / Footer Section */}
        <div className="max-w-4xl mx-auto mt-20 border-t border-gray-200 dark:border-slate-800 pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center transition-colors">
             <div className="flex flex-col items-center gap-2">
                 <div className="p-3 bg-white dark:bg-slate-900 rounded-full text-blue-600 dark:text-blue-500 shadow-sm border border-gray-100 dark:border-slate-800"><ShieldCheck size={24} /></div>
                 <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Secure Payments</h4>
                 <p className="text-xs text-gray-500">256-bit SSL encryption via Razorpay</p>
             </div>
             <div className="flex flex-col items-center gap-2">
                 <div className="p-3 bg-white dark:bg-slate-900 rounded-full text-purple-600 dark:text-purple-500 shadow-sm border border-gray-100 dark:border-slate-800"><Zap size={24} /></div>
                 <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Instant Activation</h4>
                 <p className="text-xs text-gray-500">Get access immediately after payment</p>
             </div>
             <div className="flex flex-col items-center gap-2">
                 <div className="p-3 bg-white dark:bg-slate-900 rounded-full text-green-600 dark:text-green-500 shadow-sm border border-gray-100 dark:border-slate-800"><HelpCircle size={24} /></div>
                 <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">24/7 Support</h4>
                 <p className="text-xs text-gray-500">We are here to help you anytime</p>
             </div>
        </div>

    </div>
  );
};

export default Subscriptions;