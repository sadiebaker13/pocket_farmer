import React, { useState } from 'react';
import { X, Crown, CheckCircle, CreditCard, CloudSun, BarChart3, Zap, Briefcase, BadgeCheck, Network } from 'lucide-react';
import { UserRole } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  userRole?: UserRole;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onUpgrade, userRole }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isProvider = userRole === 'Provider';
  const price = isProvider ? "5.99" : "4.99";
  const title = isProvider ? "Upgrade to Professional Provider" : "Upgrade to Expert Mode";

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      onUpgrade();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-amber-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-center border-b border-amber-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-amber-100">
            <Crown size={32} className="text-amber-500 fill-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">{title}</h2>
          <p className="text-stone-600">
            {isProvider ? "Connect with farmers and grow your business." : "Maximize your yield with professional tools."}
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-3">
            {isProvider ? (
              <>
                 <div className="flex items-center text-sm text-stone-700">
                  <Briefcase size={16} className="text-blue-500 mr-3 flex-shrink-0" />
                  <span><strong>Unlimited Leads</strong> Access</span>
                </div>
                <div className="flex items-center text-sm text-stone-700">
                  <BadgeCheck size={16} className="text-blue-500 mr-3 flex-shrink-0" />
                  <span><strong>Verified</strong> Provider Badge</span>
                </div>
                <div className="flex items-center text-sm text-stone-700">
                  <Network size={16} className="text-blue-500 mr-3 flex-shrink-0" />
                  <span>Direct Messaging with Farmers</span>
                </div>
                <div className="flex items-center text-sm text-stone-700">
                  <Zap size={16} className="text-blue-500 mr-3 flex-shrink-0" />
                  <span><strong>Ad-Free</strong> Dashboard</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center text-sm text-stone-700">
                  <CloudSun size={16} className="text-emerald-500 mr-3 flex-shrink-0" />
                  <span><strong>Hyper-local Weather</strong> Forecasting</span>
                </div>
                <div className="flex items-center text-sm text-stone-700">
                  <BarChart3 size={16} className="text-emerald-500 mr-3 flex-shrink-0" />
                  <span><strong>Advanced Analytics</strong> & Market Trends</span>
                </div>
                <div className="flex items-center text-sm text-stone-700">
                  <CheckCircle size={16} className="text-emerald-500 mr-3 flex-shrink-0" />
                  <span>Real-time Inventory Management</span>
                </div>
                <div className="flex items-center text-sm text-stone-700">
                  <Zap size={16} className="text-emerald-500 mr-3 flex-shrink-0" />
                  <span><strong>Ad-Free</strong> Experience</span>
                </div>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-stone-100">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-3xl font-bold text-stone-800">${price}</span>
                <span className="text-stone-500">/mo</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${isProvider ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>Cancel anytime</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group ${isProvider ? 'bg-blue-600 hover:bg-blue-700' : 'bg-stone-900 hover:bg-black'}`}
            >
              {isProcessing ? (
                <span>Processing...</span>
              ) : (
                <>
                  <CreditCard size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                  <span>{isProvider ? "Upgrade to Professional" : "Start Expert Trial"}</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-stone-400 mt-4">
              Secure payment via Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};