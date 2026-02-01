import React, { useState, useMemo } from 'react';
import { Store, Tag, ExternalLink, Filter, Search, Sprout, Wrench, Package } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { ProductCategory } from '../types';

export const SuppliesShop: React.FC = () => {
  const { state } = useDatabase();
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return state.products.filter(p => {
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [state.products, categoryFilter, searchTerm]);

  const handleBuyClick = (url: string, productName: string) => {
    // In a real app, this is where we would log the affiliate click event for analytics
    console.log(`Tracking affiliate click for: ${productName}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-stone-800 to-stone-700 rounded-xl p-8 text-white flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            <Store className="mr-3 text-emerald-400" size={28} /> 
            Farm Supplies & Equipment
          </h2>
          <p className="text-stone-300 max-w-lg">
            Curated seeds, tools, and heavy equipment from our trusted partners. 
            <span className="text-emerald-300 font-semibold ml-1">Purchases support the Pocket Farmer platform.</span>
          </p>
        </div>
        <div className="hidden md:block absolute -right-6 -bottom-6 opacity-10">
          <Store size={200} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {(['All', 'Seeds', 'Equipment', 'Tools', 'Inputs'] as const).map(cat => (
             <button
               key={cat}
               onClick={() => setCategoryFilter(cat as ProductCategory | 'All')}
               className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
                 categoryFilter === cat 
                   ? 'bg-stone-800 text-white border-stone-800' 
                   : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
               }`}
             >
               {cat}
             </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64">
           <input 
             type="text" 
             placeholder="Search supplies..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
           />
           <Search className="absolute left-3 top-2.5 text-stone-400" size={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 relative bg-stone-100">
               <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
               <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-stone-700 shadow-sm flex items-center">
                 {product.category === 'Seeds' && <Sprout size={12} className="mr-1 text-emerald-600"/>}
                 {product.category === 'Equipment' && <Wrench size={12} className="mr-1 text-orange-600"/>}
                 {product.category === 'Tools' && <Wrench size={12} className="mr-1 text-blue-600"/>}
                 {product.category === 'Inputs' && <Package size={12} className="mr-1 text-purple-600"/>}
                 {product.category}
               </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-auto">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{product.retailer}</span>
                   <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-sm">${product.price.toFixed(2)}</span>
                </div>
                <h3 className="font-bold text-stone-800 text-lg mb-2 leading-tight">{product.name}</h3>
                <p className="text-stone-600 text-sm line-clamp-2 mb-4">{product.description}</p>
              </div>
              
              <div className="pt-4 border-t border-stone-100 mt-2">
                <button 
                  onClick={() => handleBuyClick(product.affiliate_link, product.name)}
                  className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-2.5 rounded-lg flex items-center justify-center transition-all group"
                >
                  <span>Buy Now</span>
                  <ExternalLink size={16} className="ml-2 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p className="text-[10px] text-center text-stone-400 mt-2">
                  Link opens in new tab • Affiliate Partner
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {filteredProducts.length === 0 && (
           <div className="col-span-full py-12 text-center text-stone-500">
              <Store size={48} className="mx-auto text-stone-300 mb-2" />
              <p>No products found matching your search.</p>
           </div>
        )}
      </div>
    </div>
  );
};