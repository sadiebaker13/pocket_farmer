import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Listing } from '../types';
import { CHART_COLORS } from '../utils/constants';

interface FarmAnalyticsProps {
  listings: Listing[];
}

export const FarmAnalytics = React.memo<FarmAnalyticsProps>(({ listings }) => {
  // Prep Pie Data (Listings by Type)
  const typeData = listings.reduce((acc, curr) => {
    const found = acc.find(i => i.name === curr.type);
    if (found) found.value += 1;
    else acc.push({ name: curr.type, value: 1 });
    return acc;
  }, [] as { name: string; value: number }[]);

  // Prep Bar Data (Inventory Levels - Top 5)
  const inventoryData = listings
    .map(l => ({ name: l.name.length > 10 ? l.name.substring(0, 10) + '...' : l.name, value: l.inventory }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  if (listings.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-in fade-in slide-in-from-bottom-4">
       {/* Inventory Mix */}
       <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
         <h4 className="text-sm font-bold text-stone-800 mb-4 flex items-center">
            <Activity size={16} className="mr-2 text-emerald-600"/> Inventory Mix
         </h4>
         <div className="h-48 w-full text-xs">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={typeData}
                 cx="50%"
                 cy="50%"
                 innerRadius={40}
                 outerRadius={60}
                 paddingAngle={5}
                 dataKey="value"
               >
                 {typeData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                 ))}
               </Pie>
               <Tooltip />
               <Legend />
             </PieChart>
           </ResponsiveContainer>
         </div>
       </div>

       {/* Stock Levels */}
       <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
         <h4 className="text-sm font-bold text-stone-800 mb-4 flex items-center">
            <TrendingUp size={16} className="mr-2 text-emerald-600"/> Top Stock Levels
         </h4>
         <div className="h-48 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f0fdf4'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
         </div>
       </div>
    </div>
  );
});