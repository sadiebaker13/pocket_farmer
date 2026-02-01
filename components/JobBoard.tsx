import React from 'react';
import { Plus, Tractor, RefreshCw } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

export const JobBoard: React.FC = () => {
  const { state } = useDatabase();

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end">
         <div>
            <h2 className="text-2xl font-bold text-stone-800">Community Labor & Exchange</h2>
            <p className="text-stone-500">Find gigs, odd jobs, and barter opportunities.</p>
         </div>
         <button className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
            <Plus size={16} className="mr-2" /> Post Job
         </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.jobPosts.map(job => {
            const farm = state.farms.find(f => f.id === job.farm_id);
            return (
              <div key={job.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:border-amber-300 transition-colors">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-lg text-stone-800">{job.title}</h3>
                   <span className={`px-2 py-1 text-xs rounded-full font-semibold 
                      ${job.type === 'Gig' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                      {job.type}
                   </span>
                 </div>
                 <div className="flex items-center text-xs text-stone-500 mb-4">
                   <Tractor size={12} className="mr-1" /> 
                   <span>{farm?.name || 'Unknown Farm'}</span>
                 </div>
                 <p className="text-stone-600 text-sm mb-4">{job.description}</p>
                 
                 <div className="bg-stone-50 p-3 rounded-lg flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                     <div className="p-1.5 bg-green-100 text-green-700 rounded-md">
                       <RefreshCw size={16} />
                     </div>
                     <div>
                       <div className="text-xs text-stone-400 uppercase font-bold">Compensation</div>
                       <div className="text-sm font-medium text-stone-800">{job.compensation}</div>
                     </div>
                   </div>
                   <button className="text-sm font-bold text-stone-700 border border-stone-300 px-3 py-1.5 rounded hover:bg-white transition-colors">
                     Negotiate
                   </button>
                 </div>
              </div>
            );
          })}
          {state.jobPosts.length === 0 && <div className="col-span-2 text-center text-stone-400 py-12">No jobs posted currently.</div>}
       </div>
    </div>
  );
};