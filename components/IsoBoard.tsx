import React, { useState } from 'react';
import { Wand2, Users, RefreshCw, Clock } from 'lucide-react';
import { ISORequest, ListingType } from '../types';
import { parseIsoRequest } from '../services/geminiService';
import { useDatabase } from '../context/DatabaseContext';

export const IsoBoard: React.FC = () => {
  const { state, setState } = useDatabase();
  const [naturalInput, setNaturalInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSmartPost = async () => {
    if (!naturalInput.trim()) return;
    setIsProcessing(true);
    try {
      const parsed = await parseIsoRequest(naturalInput);
      const newId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `iso:${Math.random().toString(36).substr(2, 6)}`;
      const newIso: ISORequest = {
        id: newId,
        customer_id: state.users.find(u => u.role === 'Customer')?.id || "user:unknown",
        item_name: parsed.item_name || "Unknown Item",
        category: (parsed.category as ListingType) || "Other",
        description: parsed.description || naturalInput,
        quantity_needed: parsed.quantity_needed || "Unspecified",
        posted_at: new Date().toISOString().split('T')[0],
        expires_at: new Date(Date.now() + 12096e5).toISOString().split('T')[0], // +2 weeks
        location: [48.7787, -123.7079], // Mock location
        trade_preference: parsed.trade_preference,
        urgency: (parsed.urgency as any) || "Medium"
      };

      setState(prev => ({
        ...prev,
        isoRequests: [newIso, ...prev.isoRequests]
      }));
      setNaturalInput('');
    } catch (e) {
      console.error("AI Parsing failed", e);
      alert("Failed to understand request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-stone-800">ISO Requests</h2>
           <p className="text-stone-500">Community "In Search Of" board for missing goods.</p>
        </div>
      </div>

      {/* Smart Input */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-xl shadow-md text-white">
         <h3 className="font-bold mb-2 flex items-center"><Wand2 size={18} className="mr-2" /> Smart Post</h3>
         <p className="text-emerald-100 text-sm mb-4">
           Can't find what you need? Just describe it naturally (e.g., "I've checked everywhere for sheep wool, need 10kg by Friday!"). 
           Our AI will format it and notify relevant local farmers.
         </p>
         <div className="relative">
           <textarea 
             className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/40"
             placeholder="Describe your request..."
             rows={2}
             value={naturalInput}
             onChange={(e) => setNaturalInput(e.target.value)}
           />
           <button 
             onClick={handleSmartPost}
             disabled={isProcessing || !naturalInput}
             className="absolute bottom-3 right-3 bg-white text-emerald-700 px-4 py-1.5 rounded-md text-xs font-bold shadow-sm hover:bg-emerald-50 disabled:opacity-50 transition-colors"
           >
             {isProcessing ? 'Analyzing...' : 'Post Request'}
           </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {state.isoRequests.map(iso => {
          const user = state.users.find(u => u.id === iso.customer_id);
          return (
            <div key={iso.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 relative overflow-hidden">
              {iso.urgency === 'High' && <div className="absolute top-0 right-0 bg-rose-100 text-rose-600 px-3 py-1 rounded-bl-lg text-xs font-bold">High Urgency</div>}
              
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-stone-800">{iso.item_name}</h3>
                  <div className="flex items-center space-x-2 text-xs text-stone-500 mt-1 mb-3">
                    <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600 font-medium">{iso.category}</span>
                    <span>•</span>
                    <span>Qty: {iso.quantity_needed}</span>
                  </div>
                  <p className="text-stone-600 text-sm mb-4">{iso.description}</p>
                  
                  {iso.trade_preference && (
                     <div className="bg-amber-50 border border-amber-100 p-2 rounded-lg flex items-center text-xs text-amber-800 mb-4 w-fit">
                       <RefreshCw size={12} className="mr-2" /> 
                       <span className="font-semibold mr-1">Willing to trade:</span> {iso.trade_preference}
                     </div>
                  )}

                  <div className="flex items-center text-xs text-stone-400 space-x-4">
                    <span className="flex items-center"><Clock size={12} className="mr-1" /> Expires: {iso.expires_at}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden flex-shrink-0 mt-8">
                   {user?.photo_url ? <img src={user.photo_url} alt="" className="w-full h-full object-cover" /> : <Users size={20} className="m-2.5 text-stone-400" />}
                </div>
              </div>
            </div>
          );
        })}
        {state.isoRequests.length === 0 && (
          <div className="text-stone-400 col-span-2 text-center py-8">No current requests.</div>
        )}
      </div>
    </div>
  );
};