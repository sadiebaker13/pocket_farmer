import React from 'react';
import { Filter, Tractor, Leaf, ShoppingBasket } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useMarketplace } from '../hooks/useMarketplace';

interface MarketplaceProps {
  onNavigate: (tab: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onNavigate }) => {
  const { state } = useDatabase();
  const { filters, setFilters, filteredListings } = useMarketplace(state);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center">
          <Filter size={20} className="mr-2 text-emerald-600" /> Customer Gateway Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-2 uppercase">Type</label>
            <select 
              className="input-field"
              value={filters.type}
              onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="All">All Types</option>
              {['Fruit', 'Veggie', 'Meat', 'Dairy', 'Egg', 'Grain', 'Sweetener', 'Textile', 'Raw Material'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-2 uppercase">Season</label>
            <select 
              className="input-field"
              value={filters.season}
              onChange={e => setFilters(prev => ({ ...prev, season: e.target.value }))}
            >
              <option value="All">All Seasons</option>
              {['Spring', 'Summer', 'Fall', 'Winter'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
             <label className="block text-xs font-semibold text-stone-500 mb-2 uppercase">Radius ({filters.radius}km)</label>
             <input 
               type="range" 
               min="1" 
               max="100" 
               value={filters.radius} 
               onChange={e => setFilters(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
               className="w-full accent-emerald-600"
             />
             <div className="flex justify-between text-xs text-stone-400 mt-1">
               <span>1km</span>
               <span>100km</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map(item => {
          const farm = state.farms.find(f => f.id === item.farm_id);
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-32 bg-stone-100 relative overflow-hidden">
                {farm?.logo_url && (
                   <img src={farm.logo_url} alt={farm.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold text-emerald-700 shadow-sm">
                  {item.price}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-stone-800">{item.name}</h4>
                    <p className="text-xs text-stone-500 flex items-center mt-1">
                      <Tractor size={12} className="mr-1" /> {farm?.name}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                  <div className="flex space-x-2 text-xs text-stone-500">
                    <span className="flex items-center"><Leaf size={12} className="mr-1" /> {item.season}</span>
                  </div>
                  <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">View Details</button>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Customer Journey: Fallback to ISO */}
        {filteredListings.length === 0 && (
          <div className="col-span-full py-16 text-center text-stone-500 bg-white rounded-xl border border-dashed border-stone-300">
            <ShoppingBasket className="mx-auto text-stone-300 mb-3" size={48} />
            <h3 className="text-lg font-bold text-stone-800">No Listings Found</h3>
            <p className="mb-6 max-w-md mx-auto">We couldn't find any produce matching your criteria nearby. Try expanding your search radius or ask the community.</p>
            <button 
              onClick={() => onNavigate('iso')}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
            >
              Post an ISO Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};