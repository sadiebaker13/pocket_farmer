import React, { useState } from 'react';
import { Lock, MapPin, Calendar, AlertCircle, Phone, Stethoscope, Briefcase, Bug, Hammer, CheckCircle2 } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { SubscriptionModal } from './SubscriptionModal';
import { calculateDistance } from '../utils/calculations';

export const ProviderLeads: React.FC = () => {
  const { state, setState, activeUserId } = useDatabase();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const user = state.users.find(u => u.id === activeUserId);

  if (!user || user.role !== 'Provider') {
    return (
      <div className="p-12 text-center">
        <div className="bg-stone-100 p-8 rounded-full inline-block mb-4">
          <Lock size={48} className="text-stone-300" />
        </div>
        <h2 className="text-xl font-bold text-stone-700">Provider Access Only</h2>
        <p className="text-stone-500 mt-2">Please switch to a Provider profile to view leads.</p>
      </div>
    );
  }

  const isPro = user.subscriptionTier === 'Pro';

  const handleUpgrade = () => {
    const updatedUser = { ...user, subscriptionTier: 'Pro' as const, subscriptionExpiry: new Date(Date.now() + 31536000000).toISOString() }; 
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === user.id ? updatedUser : u)
    }));
  };

  // Icon helper
  const getIcon = (type: string) => {
    switch (type) {
      case 'Veterinary': return <Stethoscope size={18} className="text-rose-600" />;
      case 'Pesticide': return <Bug size={18} className="text-emerald-600" />;
      case 'Herbicide': return <Bug size={18} className="text-orange-600" />;
      case 'Maintenance': return <Hammer size={18} className="text-blue-600" />;
      default: return <Briefcase size={18} className="text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <SubscriptionModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
        onUpgrade={handleUpgrade}
        userRole="Provider"
      />

      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Service Leads</h2>
        <p className="text-blue-100 max-w-xl">
          Farmers in your area are looking for professional services. 
          {isPro ? " You have full access to these requests." : " Upgrade to unlock contact details and full descriptions."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {state.serviceRequests.map(req => {
          const farm = state.farms.find(f => f.id === req.farm_id);
          // Provider mock location
          const provLoc: [number, number] = [48.7787, -123.7079]; 
          const distance = farm ? calculateDistance(provLoc[0], provLoc[1], farm.location[0], farm.location[1]) : 0;

          return (
            <div key={req.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden relative">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-stone-50 rounded-lg border border-stone-100">
                      {getIcon(req.service_type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-stone-800 flex items-center">
                        {req.service_type} Service Needed
                        {req.urgency === 'High' && <span className="ml-3 text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">Urgent</span>}
                      </h3>
                      <div className="text-xs text-stone-500 mt-1 flex items-center space-x-3">
                         <span className="flex items-center"><Calendar size={12} className="mr-1"/> {req.posted_at}</span>
                         <span className="flex items-center"><MapPin size={12} className="mr-1"/> {distance.toFixed(1)}km away</span>
                      </div>
                    </div>
                  </div>
                  
                  {isPro ? (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center">
                      <Phone size={16} className="mr-2" /> Contact
                    </button>
                  ) : (
                    <button onClick={() => setShowUpgrade(true)} className="bg-stone-200 text-stone-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center cursor-pointer hover:bg-stone-300 transition-colors">
                      <Lock size={16} className="mr-2" /> Unlock
                    </button>
                  )}
                </div>

                <div className="relative">
                  {/* Blocker for Free Tier */}
                  {!isPro && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center text-center">
                      <div className="bg-white p-4 rounded-xl shadow-lg border border-stone-100 max-w-sm">
                        <Lock size={24} className="text-blue-500 mx-auto mb-2" />
                        <h4 className="font-bold text-stone-800">Lead Details Locked</h4>
                        <p className="text-stone-500 text-xs mb-3 mt-1">
                          Join 500+ professionals growing their business with Pocket Farmer.
                        </p>
                        <button 
                          onClick={() => setShowUpgrade(true)}
                          className="bg-blue-600 text-white w-full py-2 rounded-lg font-bold text-sm hover:bg-blue-700"
                        >
                          Unlock for $5.99/mo
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className={`${!isPro ? 'select-none' : ''}`}>
                     <h4 className="text-sm font-bold text-stone-700 mb-1">Description:</h4>
                     <p className="text-stone-600 text-sm mb-4 leading-relaxed">
                       {req.description}
                     </p>
                     
                     <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                       <h4 className="text-xs font-bold text-stone-500 uppercase mb-2">Farm Details</h4>
                       <div className="flex items-center">
                          <div className="w-8 h-8 rounded bg-stone-200 mr-3">
                            {farm?.logo_url && <img src={farm.logo_url} className="w-full h-full object-cover rounded" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-stone-800">{farm?.name || "Unknown Farm"}</div>
                            <div className="text-xs text-stone-500">{farm?.location.join(', ')}</div>
                          </div>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {state.serviceRequests.length === 0 && (
          <div className="text-center py-12 text-stone-400">No open leads in your area.</div>
        )}
      </div>
    </div>
  );
};