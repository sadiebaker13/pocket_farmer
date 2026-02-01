import React, { useState } from 'react';
import { 
  ShieldCheck, UserCircle, Settings, MapPin, MessageSquare, Tractor, 
  Edit3, PackagePlus, Briefcase, HardHat, Radar, AlertCircle, Crown, Lock, Minus, Plus, Trash2,
  CloudSun, Wind, Droplets, Thermometer, Stethoscope, ArrowRight
} from 'lucide-react';
import { Listing, ListingType, Season, ServiceRequest } from '../types';
import { FarmAnalytics } from './FarmAnalytics';
import { useDatabase } from '../context/DatabaseContext';
import { useFarmData } from '../hooks/useFarmData';
import { calculateDistance } from '../utils/calculations';
import { DEFAULT_INVENTORY, LISTING_TYPES, SEASONS } from '../utils/constants';
import { SubscriptionModal } from './SubscriptionModal';
import { AdBanner } from './AdBanner';
import { JobBoard } from './JobBoard';

export const ProfileManager: React.FC = () => {
  const { state, setState, activeUserId, setActiveUserId } = useDatabase();
  const [showListingForm, setShowListingForm] = useState(false);
  const [showServiceReqForm, setShowServiceReqForm] = useState(false);
  const [newListing, setNewListing] = useState<Partial<Listing>>({});
  const [newReq, setNewReq] = useState<Partial<ServiceRequest>>({});
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const { user, farm, workRel, teamMembers, isOwner, isEmployee, farmListings, matchingIsos } = useFarmData(state, activeUserId);

  // Listing Handlers
  const handleAddListing = () => {
    if (!farm) return;
    if (!newListing.name?.trim()) { alert("Please enter a valid item name."); return; }
    if (!newListing.type) { alert("Please select a product type."); return; }
    if (!newListing.season) { alert("Please select a season."); return; }
    if (!newListing.price?.trim()) { alert("Please enter a price."); return; }

    const newId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `listing:${Math.random().toString(36).substr(2, 9)}`;
    const listing: Listing = {
      id: newId, farm_id: farm.id, name: newListing.name, type: newListing.type as ListingType,
      season: newListing.season as Season, price: newListing.price, inventory: DEFAULT_INVENTORY, status: 'Active'
    };
    setState(prev => ({ ...prev, listings: [...prev.listings, listing] }));
    setShowListingForm(false); setNewListing({});
  };

  const updateInventory = (id: string, delta: number) => {
    setState(prev => ({ ...prev, listings: prev.listings.map(l => l.id === id ? { ...l, inventory: Math.max(0, l.inventory + delta) } : l) }));
  };

  const deleteListing = (id: string) => {
    if(confirm('Are you sure you want to remove this listing?')) {
      setState(prev => ({ ...prev, listings: prev.listings.filter(l => l.id !== id) }));
    }
  };

  // Service Request Handlers
  const handleAddRequest = () => {
    if (!farm) return;
    if (!newReq.description?.trim()) return;
    const newId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `req:${Math.random().toString(36).substr(2, 9)}`;
    const req: ServiceRequest = {
      id: newId, farm_id: farm.id, 
      service_type: (newReq.service_type || "Other") as any,
      description: newReq.description,
      status: 'Open', urgency: (newReq.urgency || "Medium") as any,
      posted_at: new Date().toISOString().split('T')[0]
    };
    setState(prev => ({ ...prev, serviceRequests: [...prev.serviceRequests, req] }));
    setShowServiceReqForm(false); setNewReq({});
  };

  const handleUpgrade = () => {
    if (!user) return;
    const updatedUser = { ...user, subscriptionTier: 'Pro' as const, subscriptionExpiry: new Date(Date.now() + 31536000000).toISOString() }; 
    setState(prev => ({ ...prev, users: prev.users.map(u => u.id === user.id ? updatedUser : u) }));
  };

  if (!user) return <div className="p-8 text-center text-stone-500">No users found. Please generate seed data.</div>;

  const isPro = user.subscriptionTier === 'Pro';

  return (
    <div className="flex flex-col min-h-screen">
      <AdBanner user={user} onUpgrade={() => setShowUpgradeModal(true)} />
      
      <div className="space-y-6 py-6">
        <SubscriptionModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgrade}
          userRole={user.role}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar: "Login" Simulation */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              <h3 className="text-sm font-bold text-stone-500 uppercase mb-4">Simulate Login</h3>
              <select 
                className="input-field mb-4"
                value={activeUserId}
                onChange={(e) => setActiveUserId(e.target.value)}
              >
                {state.users.map(u => (
                  <option key={u.id} value={u.id}>{u.name.first} {u.name.last} ({u.role})</option>
                ))}
              </select>
              <div className="text-xs text-stone-400">
                Select a user to view their "Pocket Farmer" profile perspective.
              </div>
              
              {/* Role Badge */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded uppercase">{user.role}</span>
                {user.secondary_roles?.map(r => (
                   <span key={r} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded uppercase">{r}</span>
                ))}
                {isPro && (
                  <span className={`px-2 py-1 text-xs font-bold rounded uppercase flex items-center border ${user.role === 'Provider' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200'}`}>
                    <Crown size={12} className={`mr-1 ${user.role === 'Provider' ? 'fill-blue-500 text-blue-500' : 'fill-amber-500 text-amber-500'}`}/> 
                    {user.role === 'Provider' ? 'Pro Provider' : 'Expert'}
                  </span>
                )}
              </div>

              <button className="mt-4 w-full text-xs font-bold text-emerald-600 border border-emerald-200 py-2 rounded hover:bg-emerald-50">
                + Register New User
              </button>
            </div>

            {user.role === 'Farmer' && (
              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 relative overflow-hidden">
                <div className="flex items-center space-x-2 mb-2 text-emerald-800 font-bold relative z-10">
                  <ShieldCheck size={20} />
                  <span>Farmer Verified</span>
                </div>
                <div className="text-sm text-emerald-700 space-y-1 relative z-10">
                  <p>ID: {user.farmer_id}</p>
                  <p>Score: {user.satisfaction_score} / 5.0</p>
                  <p>Insurance: {user.insurance?.provider}</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <ShieldCheck size={100} className="text-emerald-900" />
                </div>
              </div>
            )}

            {/* Weather Widget (New Feature) */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden relative">
               <div className="p-4 bg-sky-50 border-b border-sky-100 flex justify-between items-center">
                 <h4 className="text-sm font-bold text-sky-800 flex items-center">
                   <CloudSun size={16} className="mr-2"/> Weather
                 </h4>
                 {isPro && <span className="text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded font-bold">LIVE</span>}
               </div>
               <div className="p-4 relative min-h-[140px]">
                 {isPro ? (
                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <div>
                         <div className="text-3xl font-bold text-stone-800">72°F</div>
                         <div className="text-xs text-stone-500">Partly Cloudy</div>
                       </div>
                       <CloudSun size={40} className="text-amber-400" />
                     </div>
                     <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                       <div className="flex items-center bg-stone-50 p-2 rounded"><Droplets size={12} className="mr-1 text-blue-400"/> 45% Hum</div>
                       <div className="flex items-center bg-stone-50 p-2 rounded"><Wind size={12} className="mr-1 text-stone-400"/> 8mph NW</div>
                     </div>
                   </div>
                 ) : (
                   <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4">
                     <Lock size={24} className="text-stone-300 mb-2"/>
                     <p className="text-stone-600 font-bold text-xs mb-1">Weather Forecast Locked</p>
                     <button onClick={() => setShowUpgradeModal(true)} className="text-sky-600 text-xs font-bold hover:underline">
                       Unlock Expert Mode
                     </button>
                   </div>
                 )}
               </div>
            </div>

            {!isPro && user.role !== 'Employee' && (
              <div className={`bg-gradient-to-br p-6 rounded-xl text-white relative overflow-hidden shadow-lg ${user.role === 'Provider' ? 'from-blue-900 to-indigo-900' : 'from-stone-900 to-stone-800'}`}>
                 <div className="relative z-10">
                   <div className="flex items-center mb-3 text-amber-400">
                     <Crown size={20} className="mr-2" />
                     <h3 className="font-bold text-lg">{user.role === 'Provider' ? 'Go Professional' : 'Expert Mode'}</h3>
                   </div>
                   <p className="text-stone-300 text-sm mb-4">
                     {user.role === 'Provider' 
                       ? "Unlock unlimited leads, verification badge, and direct messaging." 
                       : "Ad-free, advanced analytics, and weather forecasting."}
                   </p>
                   <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full bg-white text-stone-900 font-bold py-2 rounded-lg text-sm hover:bg-amber-50 transition-colors"
                   >
                     Upgrade for ${user.role === 'Provider' ? '5.99' : '4.99'}/mo
                   </button>
                 </div>
              </div>
            )}
          </div>

          {/* Main Profile Area */}
          <div className="md:col-span-2 space-y-6">
            {/* User Card */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-start space-x-6">
              <div className="w-24 h-24 rounded-full bg-stone-100 overflow-hidden border-4 border-white shadow-lg relative group">
                {user.photo_url ? <img src={user.photo_url} alt="" className="w-full h-full object-cover" /> : <UserCircle size={96} className="text-stone-300" />}
                {isPro && (
                  <div className={`absolute bottom-0 right-0 p-1 rounded-full border-2 border-white ${user.role === 'Provider' ? 'bg-blue-500' : 'bg-amber-500'}`} title="Pro User">
                    <Crown size={12} className="fill-white text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-stone-800 flex items-center">
                      {user.name.first} {user.name.last}
                    </h2>
                    <p className="text-stone-500 font-medium">
                      {workRel ? `${workRel.role} at ${farm?.name}` : user.role}
                    </p>
                  </div>
                  <button className="text-stone-400 hover:text-emerald-600"><Settings size={20} /></button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-stone-600">
                    <div className="flex items-center"><MapPin size={16} className="mr-2 opacity-50"/> Location services active</div>
                    <div className="flex items-center"><MessageSquare size={16} className="mr-2 opacity-50"/> Direct messages enabled</div>
                </div>
              </div>
            </div>

            {/* Farm / Workplace Card */}
            {farm ? (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="bg-stone-100 h-24 relative">
                  {farm.logo_url && <img src={farm.logo_url} alt="" className="w-full h-full object-cover opacity-50" />}
                  <div className="absolute -bottom-10 left-6 w-20 h-20 bg-white rounded-lg shadow-md border-2 border-white p-1">
                    {farm.logo_url ? <img src={farm.logo_url} alt="" className="w-full h-full object-cover rounded" /> : <Tractor size={40} className="m-auto text-stone-300"/>}
                  </div>
                </div>
                <div className="pt-12 px-6 pb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 flex items-center">
                        {farm.name}
                        {isOwner && <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full">Owner</span>}
                        {isEmployee && <span className="ml-2 px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full">Employee</span>}
                        {isPro && <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full font-bold border border-amber-200">EXPERT</span>}
                      </h3>
                      <p className="text-sm text-stone-500">{farm.specialties.join(", ")}</p>
                    </div>
                    {isOwner && (
                      <div className="flex space-x-2">
                         <button className="text-xs font-bold text-stone-600 border border-stone-200 px-3 py-1 rounded hover:bg-stone-50 flex items-center">
                            <Edit3 size={12} className="mr-1"/> Edit Bio
                         </button>
                      </div>
                    )}
                  </div>

                  {/* Farmer Ops Panel (Visible to Owner Only) */}
                  {isOwner && (
                     <div className="mt-6 bg-stone-50 p-4 rounded-lg border border-stone-200">
                       <h4 className="text-sm font-bold text-stone-800 mb-3 flex items-center">
                         <Tractor size={16} className="mr-2 text-emerald-600"/> Farm Management Ops
                       </h4>
                       <div className="flex space-x-3">
                          <button onClick={() => setShowListingForm(!showListingForm)} className="flex-1 bg-white border border-stone-200 text-emerald-700 font-medium py-2 rounded-lg text-sm hover:bg-emerald-50 flex items-center justify-center shadow-sm">
                            <PackagePlus size={16} className="mr-2"/> Post New Listing
                          </button>
                          <button onClick={() => setShowServiceReqForm(!showServiceReqForm)} className="flex-1 bg-white border border-stone-200 text-blue-700 font-medium py-2 rounded-lg text-sm hover:bg-blue-50 flex items-center justify-center shadow-sm">
                            <Stethoscope size={16} className="mr-2"/> Request Service
                          </button>
                          <button className="flex-1 bg-white border border-stone-200 text-stone-700 font-medium py-2 rounded-lg text-sm hover:bg-stone-100 flex items-center justify-center shadow-sm">
                            <Briefcase size={16} className="mr-2"/> Post Job
                          </button>
                       </div>
                       
                       {/* Listings Form */}
                       {showListingForm && (
                         <div className="mt-4 p-4 bg-white border border-stone-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                            <h5 className="font-bold text-xs uppercase text-stone-400 mb-2">New Product Listing</h5>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <input className="input-field" placeholder="Item Name" value={newListing.name || ''} onChange={e => setNewListing({...newListing, name: e.target.value})} />
                              <select className="input-field" value={newListing.type || ''} onChange={e => setNewListing({...newListing, type: e.target.value as ListingType})}>
                                <option value="">Type...</option>
                                {LISTING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                              <input className="input-field" placeholder="Price" value={newListing.price || ''} onChange={e => setNewListing({...newListing, price: e.target.value})} />
                              <select className="input-field" value={newListing.season || ''} onChange={e => setNewListing({...newListing, season: e.target.value as Season})}>
                                <option value="">Season...</option>
                                {SEASONS.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                            <button onClick={handleAddListing} className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-emerald-700">Publish Listing</button>
                         </div>
                       )}

                       {/* Service Request Form */}
                       {showServiceReqForm && (
                         <div className="mt-4 p-4 bg-white border border-stone-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                            <h5 className="font-bold text-xs uppercase text-stone-400 mb-2">New Service Request</h5>
                            <div className="space-y-3 mb-3">
                               <select className="input-field" value={newReq.service_type || ''} onChange={e => setNewReq({...newReq, service_type: e.target.value as any})}>
                                 <option value="">Select Service Type...</option>
                                 <option value="Veterinary">Veterinary</option>
                                 <option value="Pesticide">Pesticide</option>
                                 <option value="Herbicide">Herbicide</option>
                                 <option value="Maintenance">Maintenance</option>
                                 <option value="Other">Other</option>
                               </select>
                               <select className="input-field" value={newReq.urgency || ''} onChange={e => setNewReq({...newReq, urgency: e.target.value as any})}>
                                 <option value="">Urgency...</option>
                                 <option value="Low">Low</option>
                                 <option value="Medium">Medium</option>
                                 <option value="High">High</option>
                               </select>
                               <textarea 
                                 className="input-field" rows={3} placeholder="Describe the issue..."
                                 value={newReq.description || ''} onChange={e => setNewReq({...newReq, description: e.target.value})}
                               />
                            </div>
                            <button onClick={handleAddRequest} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-700">Broadcast to Providers</button>
                         </div>
                       )}
                     </div>
                  )}
                  
                  {/* Employee View Restraints */}
                  {isEmployee && (
                    <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-100 text-amber-800 text-sm">
                      <p className="flex items-center font-bold"><HardHat size={16} className="mr-2"/> Employee Access</p>
                      <p className="mt-1">You are logged in as a farm hand. You can view schedules, jobs, and tools, but cannot edit core farm operations.</p>
                    </div>
                  )}

                  {/* PRO FEATURE: Real-time Inventory Management */}
                  {isOwner && (
                    <div className="mt-6 border border-stone-200 rounded-lg overflow-hidden">
                      <div className={`p-4 ${isPro ? 'bg-amber-50' : 'bg-stone-50'} border-b border-stone-200 flex justify-between items-center`}>
                         <h4 className={`text-sm font-bold flex items-center ${isPro ? 'text-amber-800' : 'text-stone-500'}`}>
                           <PackagePlus size={16} className={`mr-2 ${isPro ? 'text-amber-600' : 'text-stone-400'}`}/> 
                           Real-time Inventory
                           {isPro && <span className="ml-2 text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300">EXPERT</span>}
                         </h4>
                         {!isPro && <Lock size={14} className="text-stone-400"/>}
                      </div>
                      
                      <div className="relative">
                        {!isPro && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
                             <Lock size={32} className="text-stone-300 mb-2"/>
                             <p className="text-stone-800 font-bold text-sm mb-1">Inventory Management is Locked</p>
                             <button onClick={() => setShowUpgradeModal(true)} className="bg-stone-900 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg hover:bg-black transition-colors">
                               Unlock for $4.99/mo
                             </button>
                          </div>
                        )}
                        <div className="divide-y divide-stone-100">
                           {farmListings.map(item => (
                             <div key={item.id} className="p-3 flex items-center justify-between hover:bg-stone-50 transition-colors">
                               <div><div className="font-bold text-sm text-stone-800">{item.name}</div><div className="text-xs text-stone-500">{item.price} • {item.season}</div></div>
                               <div className="flex items-center space-x-3">
                                  <div className="flex items-center bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm">
                                     <button disabled={!isPro || item.inventory <= 0} onClick={() => updateInventory(item.id, -1)} className="p-1.5 hover:bg-stone-100 text-stone-500 disabled:opacity-30"><Minus size={14} /></button>
                                     <span className="w-10 text-center text-xs font-bold text-stone-800">{item.inventory}</span>
                                     <button disabled={!isPro} onClick={() => updateInventory(item.id, 1)} className="p-1.5 hover:bg-stone-100 text-emerald-600 disabled:opacity-30"><Plus size={14} /></button>
                                  </div>
                                  <button disabled={!isPro} onClick={() => deleteListing(item.id)} className="text-stone-300 hover:text-rose-500 disabled:opacity-0"><Trash2 size={16} /></button>
                               </div>
                             </div>
                           ))}
                           {farmListings.length === 0 && <div className="p-8 text-center text-stone-400 text-sm italic">No listings posted yet.</div>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VISUALIZATION DASHBOARD (Owners Only - PRO ONLY) */}
                  {isOwner && (
                    <div className="relative mt-6">
                      {!isPro && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[3px] z-10 flex items-center justify-center rounded-xl border border-stone-200">
                           <div className="bg-white p-4 rounded-xl shadow-lg text-center border border-stone-100">
                             <div className="bg-emerald-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"><Lock size={18} className="text-emerald-600"/></div>
                             <h4 className="font-bold text-stone-800 text-sm">Analytics Locked</h4>
                             <button onClick={() => setShowUpgradeModal(true)} className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded-lg font-bold mt-2">Upgrade</button>
                           </div>
                        </div>
                      )}
                      <div className={!isPro ? 'opacity-20 pointer-events-none' : ''}><FarmAnalytics listings={farmListings} /></div>
                    </div>
                  )}
                  
                  {/* Team */}
                  {teamMembers.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-stone-100">
                      <h4 className="text-xs font-bold text-stone-400 uppercase mb-3">Team & Owners</h4>
                      <div className="flex -space-x-2">
                        {teamMembers.map(rel => {
                          const cw = state.users.find(u => u.id === rel.in);
                          return <div key={rel.id} className={`w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-stone-200`}><img src={cw?.photo_url} alt="" className="w-full h-full object-cover" /></div>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              (user.role === 'Farmer' || user.role === 'Employee') && (
                <div className="bg-stone-50 p-8 text-center rounded-xl border border-dashed border-stone-300">
                  <Tractor className="mx-auto text-stone-300 mb-2" size={32} />
                  <p className="text-stone-500">No Farm Linked</p>
                  <button className="text-emerald-600 font-bold text-sm mt-2">Create or Join a Farm</button>
                </div>
              )
            )}

            {/* Employee Specific Job Widget */}
            {user.role === 'Employee' && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100 shadow-sm mt-6">
                 <h3 className="font-bold text-emerald-800 mb-4 flex items-center">
                   <Briefcase size={20} className="mr-2"/> Recent Opportunities
                 </h3>
                 <div className="grid grid-cols-1 gap-3">
                   {state.jobPosts.slice(0, 2).map(job => (
                     <div key={job.id} className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm flex justify-between items-center">
                       <div>
                         <div className="font-bold text-sm text-stone-800">{job.title}</div>
                         <div className="text-xs text-stone-500">{job.compensation}</div>
                       </div>
                       <button className="text-emerald-600 text-xs font-bold border border-emerald-200 px-3 py-1 rounded hover:bg-emerald-50">
                         View
                       </button>
                     </div>
                   ))}
                   <button className="w-full py-2 text-center text-xs font-bold text-emerald-700 hover:underline flex items-center justify-center">
                     Browse all jobs <ArrowRight size={12} className="ml-1"/>
                   </button>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* The Match-Maker Radar (Farmers Only) */}
        {farm && isOwner && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 text-slate-300">
              <h3 className="text-emerald-400 font-mono text-sm font-bold flex items-center mb-4 uppercase">
                <Radar size={16} className="mr-2" /> Match-Maker Logic (SurrealDB)
              </h3>
              <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed">
{`-- Find ISOs that match my Farm
SELECT item_name, quantity, customer.name AS requested_by,
    (distance::latlng(location, ${farm.id}.location)) AS distance
FROM iso WHERE category INSIDE ${JSON.stringify(farm.specialties)}
    AND distance::latlng(location, ${farm.id}.location) < 20000;`}
              </pre>
            </div>
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
               <h3 className="text-stone-800 font-bold mb-4 flex items-center"><AlertCircle size={20} className="mr-2 text-rose-500" /> Nearby Demand (Live)</h3>
               <div className="space-y-3">
                 {matchingIsos.length > 0 ? matchingIsos.map(iso => (
                   <div key={iso.id} className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                      <div className="flex justify-between items-start"><span className="font-bold text-rose-800">{iso.item_name}</span><span className="text-xs font-semibold bg-white px-2 py-1 rounded text-rose-600 border border-rose-100">{iso.urgency} Priority</span></div>
                      <div className="text-xs text-rose-700 mt-1 flex space-x-3"><span>Qty: {iso.quantity_needed}</span><span>•</span><span>{calculateDistance(farm.location[0], farm.location[1], iso.location[0], iso.location[1]).toFixed(1)}km away</span></div>
                   </div>
                 )) : <p className="text-stone-400 text-sm">No active ISOs match your specialties within 20km.</p>}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};