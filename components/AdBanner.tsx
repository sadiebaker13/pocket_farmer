import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Stethoscope, Megaphone, ShoppingBasket, Star, Tractor, HardHat, GraduationCap, Hammer } from 'lucide-react';
import { User } from '../types';

interface AdBannerProps {
  user: User;
  onUpgrade: () => void;
}

const FARMER_ADS = [
  {
    id: 1,
    icon: ShieldCheck,
    title: "AgriShield Insurance",
    text: "Protect your harvest against hail and drought. Policies starting at $200/mo.",
    color: "bg-blue-50 border-blue-100 text-blue-800",
    iconColor: "text-blue-600"
  },
  {
    id: 2,
    icon: Stethoscope,
    title: "Hudson Vet Services",
    text: "24/7 Mobile Veterinary Clinic for large animals. First exam 50% off.",
    color: "bg-rose-50 border-rose-100 text-rose-800",
    iconColor: "text-rose-600"
  },
  {
    id: 3,
    icon: Tractor,
    title: "Valley Equipment Rentals",
    text: "Need a combine for the weekend? Rent local heavy machinery easily.",
    color: "bg-orange-50 border-orange-100 text-orange-800",
    iconColor: "text-orange-600"
  }
];

const CUSTOMER_ADS = [
  {
    id: 1,
    icon: Megaphone,
    title: "Cowichan Valley Organics",
    text: "Fresh Strawberries harvested this morning! Visit our stand today.",
    color: "bg-emerald-50 border-emerald-100 text-emerald-800",
    iconColor: "text-emerald-600"
  },
  {
    id: 2,
    icon: ShoppingBasket,
    title: "Maple Bay Vineyards",
    text: "Case Sale: Pinot Noir 2022. Buy 12 bottles, get 15% off.",
    color: "bg-purple-50 border-purple-100 text-purple-800",
    iconColor: "text-purple-600"
  },
  {
    id: 3,
    icon: Star,
    title: "Hidden Grove Farm",
    text: "Grass-fed Beef Boxes are back in stock. Limited quantity!",
    color: "bg-amber-50 border-amber-100 text-amber-800",
    iconColor: "text-amber-600"
  }
];

const EMPLOYEE_ADS = [
  {
    id: 1,
    icon: HardHat,
    title: "WorkWear Pro",
    text: "Steel-toe boots sale! 20% off for agricultural workers.",
    color: "bg-slate-50 border-slate-100 text-slate-800",
    iconColor: "text-slate-600"
  },
  {
    id: 2,
    icon: GraduationCap,
    title: "AgriTech Certification",
    text: "Boost your hourly rate. Get certified in Drone Operation this weekend.",
    color: "bg-indigo-50 border-indigo-100 text-indigo-800",
    iconColor: "text-indigo-600"
  },
  {
    id: 3,
    icon: Hammer,
    title: "GigWorker Insurance",
    text: "Personal injury protection for odd jobs and seasonal work.",
    color: "bg-teal-50 border-teal-100 text-teal-800",
    iconColor: "text-teal-600"
  }
];

export const AdBanner: React.FC<AdBannerProps> = ({ user, onUpgrade }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Providers get no ads
  if (user.role === 'Provider') return null;

  // Pro users get no ads
  if (user.subscriptionTier === 'Pro') return null;

  let ads = CUSTOMER_ADS;
  if (user.role === 'Farmer') ads = FARMER_ADS;
  else if (user.role === 'Employee') ads = EMPLOYEE_ADS;

  const activeAds = ads; 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(timer);
  }, [activeAds.length]);

  const currentAd = activeAds[currentIndex];
  const Icon = currentAd.icon;

  return (
    <div className={`border-b p-3 relative transition-colors duration-500 ${currentAd.color}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div key={currentAd.id} className="flex-1 flex items-center animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-white/60 p-1.5 rounded-lg mr-3 shadow-sm">
            <Icon size={16} className={currentAd.iconColor} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-70 mr-2 border border-current px-1 rounded">
              {user.role === 'Farmer' ? 'Sponsor' : (user.role === 'Employee' ? 'Featured' : 'Boosted')}
            </span>
            <span className="text-sm font-medium">
              <span className="font-bold mr-1">{currentAd.title}:</span>
              {currentAd.text}
            </span>
            <a href="#" className="ml-2 text-xs underline opacity-80 hover:opacity-100">View</a>
          </div>
        </div>
        
        <button 
          onClick={onUpgrade}
          className="ml-4 text-xs opacity-60 hover:opacity-100 flex items-center bg-white/50 px-2 py-1 rounded border border-current shadow-sm whitespace-nowrap"
        >
          <X size={12} className="mr-1" /> Remove Ads
        </button>
      </div>
      
      {/* Progress Bar for Rotation */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-current opacity-20 transition-all duration-100 ease-linear w-full">
         <div 
           className="h-full bg-current opacity-50" 
           style={{ 
             width: '100%', 
             animation: 'shrink 5s linear infinite' 
           }} 
         />
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};