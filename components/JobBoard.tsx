import React from 'react';
import { Plus, Tractor, RefreshCw, Briefcase, CheckCircle2 } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

export const JobBoard: React.FC = () => {
  const { state, setState, activeUserId } = useDatabase();
  const user = state.users.find(u => u.id === activeUserId);
  const isFarmer = user?.role === 'Farmer';
  const isEmployee = user?.role === 'Employee';

  const handleApply = (jobId: string) => {
    // Check if already applied
    const existing = state.jobApplications.find(app => app.job_id === jobId && app.applicant_id === activeUserId);
    if (existing) {
      alert("You have already applied for this job.");
      return;
    }

    const newId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `app:${Math.random().toString(36).substr(2, 9)}`;
    
    setState(prev => ({
      ...prev,
      jobApplications: [
        ...prev.jobApplications,
        {
          id: newId,
          job_id: jobId,
          applicant_id: activeUserId,
          status: 'Applied',
          applied_at: new Date().toISOString().split('T')[0]
        }
      ]
    }));
    
    // In a real app, this would trigger a notification to the farmer
    alert("Application sent successfully! The farm owner will contact you shortly.");
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end">
         <div>
            <h2 className="text-2xl font-bold text-stone-800">Community Labor & Exchange</h2>
            <p className="text-stone-500">Find gigs, odd jobs, and barter opportunities.</p>
         </div>
         {isFarmer && (
           <button className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
              <Plus size={16} className="mr-2" /> Post Job
           </button>
         )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.jobPosts.map(job => {
            const farm = state.farms.find(f => f.id === job.farm_id);
            const hasApplied = state.jobApplications.some(app => app.job_id === job.id && app.applicant_id === activeUserId);

            return (
              <div key={job.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:border-amber-300 transition-colors flex flex-col h-full">
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
                 <p className="text-stone-600 text-sm mb-4 flex-grow">{job.description}</p>
                 
                 <div className="space-y-3 mt-auto">
                    <div className="bg-stone-50 p-3 rounded-lg flex items-center space-x-2">
                         <div className="p-1.5 bg-green-100 text-green-700 rounded-md">
                           <RefreshCw size={16} />
                         </div>
                         <div>
                           <div className="text-xs text-stone-400 uppercase font-bold">Compensation</div>
                           <div className="text-sm font-medium text-stone-800">{job.compensation}</div>
                         </div>
                    </div>

                    {isEmployee ? (
                        <button 
                          onClick={() => handleApply(job.id)}
                          disabled={hasApplied}
                          className={`w-full font-bold py-2 rounded-lg text-sm flex items-center justify-center transition-colors
                            ${hasApplied 
                              ? 'bg-stone-200 text-stone-500 cursor-not-allowed' 
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                        >
                          {hasApplied ? 'Applied' : <><CheckCircle2 size={16} className="mr-2" /> Easy Apply</>}
                        </button>
                    ) : (
                        <button className="w-full text-sm font-bold text-stone-700 border border-stone-300 px-3 py-2 rounded hover:bg-white transition-colors">
                            {isFarmer ? 'Manage Posting' : 'Contact Farm'}
                        </button>
                    )}
                 </div>
              </div>
            );
          })}
          {state.jobPosts.length === 0 && <div className="col-span-2 text-center text-stone-400 py-12">No jobs posted currently.</div>}
       </div>
    </div>
  );
};