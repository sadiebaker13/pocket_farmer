import React, { useState } from 'react';
import { 
  ShieldCheck, UserCircle, Settings, MapPin, MessageSquare, Tractor, 
  Edit3, PackagePlus, Briefcase, HardHat, Radar, AlertCircle 
} from 'lucide-react';
import { Listing, ListingType, Season } from '../types';
import { FarmAnalytics } from './FarmAnalytics';
import { useDatabase } from '../context/DatabaseContext';
import { useFarmData } from '../hooks/useFarmData';
import { calculateDistance } from '../utils/calculations';

export const ProfileManager: React.FC = () => {
  const { state, setState } = useDatabase();
  const [activeUser, setActiveUser] = useState<string>(state.users[0]?.id || "");
  const [showListingForm, setShowListingForm] = useState(false);
  const [newListing, setNewListing] = useState<Partial<Listing>>({});
  
  const { user, farm, workRel, teamMembers, isOwner, isEmployee, farmListings, matchingIsos } = useFarmData(state, activeUser);

  const handleAddListing = () => {
    if (!farm) return;
    const newId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `listing:${Math.random().toString(36).substr(2, 9)}`;
    const listing: Listing = {
      id: newId,
      farm_id: farm.id,
      name: newListing.name || 'New Item',
      type: (newListing.type as ListingType) || 'Other',
      season: (newListing.season as Season) || 'Year-Round',
      price: newListing.price || 'Inquire',
      inventory: 10,
      status: 'Active'
    };
    setState(prev => ({ ...prev, listings: [...prev.listings, listing] }));
    setShowListingForm(false);
    setNewListing({});
  };

  if (!user) return <div className="p-8 text-center text-stone-500">No users found. Please generate seed data.</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar: "Login" Simulation */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="text-sm font-bold text-stone-500 uppercase mb-4">Simulate Login</h3>
            <select 
              className="input-field mb-4"
              value={activeUser}
              onChange={(e) => setActiveUser(e.target.value)}
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
            </div>

            <button className="mt-4 w-full text-xs font-bold text-emerald-600 border border-emerald-200 py-2 rounded hover:bg-emerald-50">
              + Register New User
            </button>
          </div>

          {user.role === 'Farmer' && (
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <div className="flex items-center space-x-2 mb-2 text-emerald-800 font-bold">
                <ShieldCheck size={20} />
                <span>Farmer Verified</span>
              </div>
              <div className="text-sm text-emerald-700 space-y-1">
                <p>ID: {user.farmer_id}</p>
                <p>Score: {user.satisfaction_score} / 5.0</p>
                <p>Insurance: {user.insurance?.provider}</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Profile Area */}
        <div className="md:col-span-2 space-y-6">
          {/* User Card */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-start space-x-6">
            <div className="w-24 h-24 rounded-full bg-stone-100 overflow-hidden border-4 border-white shadow-lg">
              {user.photo_url ? <img src={user.photo_url} alt="" className="w-full h-full object-cover" /> : <UserCircle size={96} className="text-stone-300" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-stone-800">{user.name.first} {user.name.last}</h2>
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
                        <button 
                          onClick={() => setShowListingForm(!showListingForm)}
                          className="flex-1 bg-white border border-stone-200 text-emerald-700 font-medium py-2 rounded-lg text-sm hover:bg-emerald-50 flex items-center justify-center shadow-sm"
                        >
                          <PackagePlus size={16} className="mr-2"/> Post New Listing
                        </button>
                        <button className="flex-1 bg-white border border-stone-200 text-stone-700 font-medium py-2 rounded-lg text-sm hover:bg-stone-100 flex items-center justify-center shadow-sm">
                          <Briefcase size={16} className="mr-2"/> Post Job
                        </button>
                     </div>
                     
                     {showListingForm && (
                       <div className="mt-4 p-4 bg-white border border-stone-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <input 
                              className="input-field" placeholder="Item Name (e.g. Wool)" 
                              value={newListing.name || ''} 
                              onChange={e => setNewListing({...newListing, name: e.target.value})}
                            />
                            <select 
                              className="input-field" 
                              value={newListing.type || ''}
                              onChange={e => setNewListing({...newListing, type: e.target.value as ListingType})}
                            >
                              <option value="">Type...</option>
                              {['Fruit', 'Veggie', 'Meat', 'Dairy', 'Textile', 'Raw Material'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <input 
                              className="input-field" placeholder="Price (e.g. $5/lb)" 
                              value={newListing.price || ''} 
                              onChange={e => setNewListing({...newListing, price: e.target.value})}
                            />
                            <select 
                              className="input-field" 
                              value={newListing.season || ''}
                              onChange={e => setNewListing({...newListing, season: e.target.value as Season})}
                            >
                              <option value="">Season...</option>
                              {['Spring', 'Summer', 'Fall', 'Winter', 'Year-Round'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <button onClick={handleAddListing} className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-emerald-700">
                            Publish Listing
                          </button>
                       </div>
                     )}
                   </div>
                )}
                
                {/* Employee View Restraints */}
                {isEmployee && (
                  <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-100 text-amber-800 text-sm">
                    <p className="flex items-center font-bold"><HardHat size={16} className="mr-2"/> Employee Access</p>
                    <p className="mt-1">You are logged in as a farm hand. You cannot post listings or edit farm details. Please contact the owner for Ops changes.</p>
                  </div>
                )}

                {/* VISUALIZATION DASHBOARD (Owners Only) */}
                {isOwner && <FarmAnalytics listings={farmListings} />}

                {/* "LinkedIn" Coworkers & Owners */}
                {teamMembers.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-stone-100">
                    <h4 className="text-xs font-bold text-stone-400 uppercase mb-3">Team & Owners</h4>
                    <div className="flex -space-x-2">
                      {teamMembers.map(rel => {
                        const cw = state.users.find(u => u.id === rel.in);
                        const isCwOwner = rel.role === 'Owner';
                        return (
                          <div key={rel.id} className={`w-8 h-8 rounded-full border-2 border-white overflow-hidden ${isCwOwner ? 'ring-2 ring-emerald-400 z-10' : 'bg-stone-200'}`} title={`${cw?.name.first} - ${rel.role}`}>
                            {cw?.photo_url ? <img src={cw.photo_url} alt="" className="w-full h-full object-cover" /> : <UserCircle size={32} />}
                          </div>
                        );
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
        </div>
      </div>

      {/* The Match-Maker Radar */}
      {farm && isOwner && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 text-slate-300">
            <h3 className="text-emerald-400 font-mono text-sm font-bold flex items-center mb-4 uppercase">
              <Radar size={16} className="mr-2" /> Match-Maker Logic (SurrealDB)
            </h3>
            <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed">
{`-- Find ISOs that match my Farm
SELECT 
    item_name, 
    quantity, 
    customer.name AS requested_by,
    (distance::latlng(location, ${farm.id}.location)) AS distance
FROM iso 
WHERE 
    category INSIDE ${JSON.stringify(farm.specialties)}
    AND distance::latlng(location, ${farm.id}.location) < 20000
    AND expires_at > time::now();`}
            </pre>
          </div>

          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
             <h3 className="text-stone-800 font-bold mb-4 flex items-center">
               <AlertCircle size={20} className="mr-2 text-rose-500" /> Nearby Demand (Live)
             </h3>
             <div className="space-y-3">
               {matchingIsos.length > 0 ? matchingIsos.map(iso => (
                 <div key={iso.id} className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-rose-800">{iso.item_name}</span>
                      <span className="text-xs font-semibold bg-white px-2 py-1 rounded text-rose-600 border border-rose-100">{iso.urgency} Priority</span>
                    </div>
                    <div className="text-xs text-rose-700 mt-1 flex space-x-3">
                      <span>Qty: {iso.quantity_needed}</span>
                      <span>•</span>
                      <span>{calculateDistance(farm.location[0], farm.location[1], iso.location[0], iso.location[1]).toFixed(1)}km away</span>
                    </div>
                 </div>
               )) : (
                 <p className="text-stone-400 text-sm">No active ISOs match your specialties within 20km.</p>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};