import React from 'react';
import { BadgeCheck, Stethoscope, Hammer } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

export const ServicesDirectory: React.FC = () => {
  const { state } = useDatabase();

  return (
    <div className="space-y-6">
       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
         <h2 className="text-2xl font-bold mb-2">Professional Services</h2>
         <p className="text-blue-100">Connect with local vets, pesticide applicators, and farm maintenance pros.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {state.services.map(svc => (
           <div key={svc.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 hover:border-blue-200 transition-colors relative overflow-hidden">
             
             {svc.verified && (
               <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 px-3 py-1 rounded-bl-lg text-xs font-bold flex items-center">
                 <BadgeCheck size={14} className="mr-1" /> Verified
               </div>
             )}

             <div className="flex items-center space-x-3 mb-4">
               <div className={`p-2 rounded-lg ${svc.service_type === 'Veterinary' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                 {svc.service_type === 'Veterinary' ? <Stethoscope size={24} /> : <Hammer size={24} />}
               </div>
               <div>
                 <h3 className="font-bold text-stone-800">{svc.name}</h3>
                 <span className="text-xs text-stone-500">{svc.service_type}</span>
               </div>
             </div>
             <p className="text-sm text-stone-600 mb-4 h-12 overflow-hidden">{svc.description}</p>
             <div className="pt-4 border-t border-stone-100 text-sm font-medium text-stone-800 flex justify-between items-center">
               <span>{svc.contact_info}</span>
               <button className="text-blue-600 text-xs font-bold hover:underline">Contact</button>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};