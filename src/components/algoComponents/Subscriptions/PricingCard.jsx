
import React from 'react';
import { Check, X, Zap, Star } from 'lucide-react';

const PricingCard = ({ plan, billingCycle, isCurrent, onUpgrade }) => {
  
  const isPopular = plan.isPopular;
  const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
  const duration = billingCycle === 'monthly' ? '/mo' : '/yr';

  return (
    // ✅ Main Card Container: Light (White) | Dark (Slate-900)
    <div className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 h-full group
        ${isPopular 
            ? 'bg-white dark:bg-slate-900 border-blue-500 shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 scale-105 z-10' 
            : 'bg-white dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-600 hover:shadow-lg dark:hover:bg-slate-900'
        }
    `}>
        
        {/* Popular Badge */}
        {isPopular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                <Star size={10} fill="white" /> Most Popular
            </div>
        )}

        {/* Header */}
        <div className="mb-5">
            <h3 className={`text-lg font-bold ${isPopular ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{plan.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{plan.description}</p>
        </div>

        {/* Price */}
        <div className="mb-6">
            <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {price === 0 ? 'Free' : `₹${price.toLocaleString()}`}
                </span>
                {price !== 0 && <span className="text-sm text-gray-500 font-medium mb-1">{duration}</span>}
            </div>
            {billingCycle === 'yearly' && price > 0 && (
                <p className="text-[10px] text-green-600 dark:text-green-400 font-bold mt-1">
                    You save ₹{((plan.price.monthly * 12) - plan.price.yearly).toLocaleString()} a year
                </p>
            )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-slate-800 w-full mb-6"></div>

        {/* Features List */}
        <ul className="space-y-3 mb-8 flex-1">
            {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                        <div className={`mt-0.5 p-0.5 rounded-full ${isPopular ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'}`}>
                            <Check size={12} strokeWidth={3} />
                        </div>
                    ) : (
                        <div className="mt-0.5 p-0.5 rounded-full bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-slate-600">
                            <X size={12} strokeWidth={3} />
                        </div>
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600 line-through'}`}>
                        {feature.text}
                    </span>
                </li>
            ))}
        </ul>

        {/* Action Button */}
        <button 
            onClick={() => onUpgrade(plan)}
            disabled={isCurrent}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
                ${isCurrent 
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 cursor-default border border-gray-200 dark:border-slate-700' 
                    : (isPopular 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-95' 
                        : 'bg-gray-900 dark:bg-white text-white dark:text-slate-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-lg hover:scale-[1.02] active:scale-95')
                }
            `}
        >
            {isCurrent ? (
                <>Current Plan</>
            ) : (
                <>{plan.price.monthly === 0 ? 'Get Started' : 'Upgrade Plan'} <Zap size={16} className={isPopular ? "fill-white/20" : ""} /></>
            )}
        </button>

    </div>
  );
};

export default PricingCard;