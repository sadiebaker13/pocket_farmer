import React, { useState } from 'react';
import { Database, FileJson, FileCode, Network, Trash2, Plus } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

export const EntityManager: React.FC = () => {
  const { state, setState } = useDatabase();
  const [activeType, setActiveType] = useState<'users' | 'farms' | 'listings' | 'jobPosts'>('users');
  const [viewMode, setViewMode] = useState<'tables' | 'graph'>('tables');
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const addItem = () => {
    const id = `${activeType.slice(0, -1)}:${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().slice(0,8) : Math.random().toString(36).substr(2, 9)}`;
    const newItem = { ...formData, id };
    
    // Quick formatting
    if (activeType === 'farms' && typeof newItem.specialties === 'string') {
        newItem.specialties = newItem.specialties.split(',').map((s: string) => s.trim());
    }
    if (activeType === 'users' && newItem.satisfaction_score) {
        newItem.satisfaction_score = parseFloat(newItem.satisfaction_score);
    }

    setState(prev => ({
      ...prev,
      [activeType]: [...prev[activeType], newItem]
    }));
    setFormData({});
  };

  const deleteItem = (id: string) => {
    setState(prev => ({
      ...prev,
      [activeType]: prev[activeType].filter((item: any) => item.id !== id)
    }));
  };

  const handleJsonExport = () => {
    const flatData = Object.values(state).flat();
    const dataStr = JSON.stringify(flatData, null, 2);
    downloadFile(dataStr, `pocket_farmer_flat_${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleSurrealExport = () => {
    const date = new Date().toISOString();
    let script = `-- Pocket Farmer SurrealQL Export (Schema + Data)\n-- Generated: ${date}\n\n`;

    // 1. Schema Definitions
    script += "-- 1. SCHEMA DEFINITION\n";
    script += "BEGIN TRANSACTION;\n\n";

    // User Table
    script += "-- Table: user\n";
    script += "DEFINE TABLE user SCHEMAFULL;\n";
    script += "DEFINE FIELD name ON TABLE user TYPE object;\n";
    script += "DEFINE FIELD name.first ON TABLE user TYPE string;\n";
    script += "DEFINE FIELD name.last ON TABLE user TYPE string;\n";
    script += "DEFINE FIELD email ON TABLE user TYPE string ASSERT string::is::email($value);\n";
    script += "DEFINE FIELD role ON TABLE user TYPE string;\n";
    script += "DEFINE FIELD subscriptionTier ON TABLE user TYPE string;\n";
    script += "DEFINE FIELD insurance ON TABLE user TYPE option<object>;\n";
    script += "DEFINE FIELD photo_url ON TABLE user TYPE option<string>;\n";

    // Farm Table
    script += "\n-- Table: farm\n";
    script += "DEFINE TABLE farm SCHEMAFULL;\n";
    script += "DEFINE FIELD name ON TABLE farm TYPE string;\n";
    script += "DEFINE FIELD location ON TABLE farm TYPE array;\n";
    script += "DEFINE FIELD specialties ON TABLE farm TYPE array;\n";
    script += "DEFINE FIELD logo_url ON TABLE farm TYPE option<string>;\n";

    // Listing Table
    script += "\n-- Table: listing\n";
    script += "DEFINE TABLE listing SCHEMAFULL;\n";
    script += "DEFINE FIELD name ON TABLE listing TYPE string;\n";
    script += "DEFINE FIELD type ON TABLE listing TYPE string;\n";
    script += "DEFINE FIELD price ON TABLE listing TYPE string;\n";
    script += "DEFINE FIELD inventory ON TABLE listing TYPE number;\n";
    script += "DEFINE FIELD season ON TABLE listing TYPE string;\n";
    script += "DEFINE FIELD farm_id ON TABLE listing TYPE record(farm);\n";

    // Job Post Table
    script += "\n-- Table: job_post\n";
    script += "DEFINE TABLE job_post SCHEMAFULL;\n";
    script += "DEFINE FIELD title ON TABLE job_post TYPE string;\n";
    script += "DEFINE FIELD description ON TABLE job_post TYPE string;\n";
    script += "DEFINE FIELD type ON TABLE job_post TYPE string;\n";
    script += "DEFINE FIELD compensation ON TABLE job_post TYPE string;\n";
    script += "DEFINE FIELD farm_id ON TABLE job_post TYPE record(farm);\n";

    script += "\nCOMMIT TRANSACTION;\n\n";

    // 2. Data Creation
    script += "-- 2. DATA IMPORT\n";
    script += "BEGIN TRANSACTION;\n\n";

    // Nodes
    const entities = [
      ...state.users,
      ...state.farms,
      ...state.listings,
      ...state.jobPosts,
      ...state.serviceRequests,
      ...state.isoRequests,
      ...state.services,
      ...state.products
    ];

    entities.forEach(item => {
        // Simple sanitization for SQL string if needed, but JSON.stringify usually handles it
        script += `CREATE ${item.id} CONTENT ${JSON.stringify(item)};\n`;
    });

    script += "\n-- 3. EDGES\n";
    // Edges
    state.worksAt.forEach(rel => {
      const content = { role: rel.role, started_at: rel.started_at };
      script += `RELATE ${rel.in}->works_at->${rel.out} CONTENT ${JSON.stringify(content)};\n`;
    });

    script += "\nCOMMIT TRANSACTION;";
    downloadFile(script, `pocket_farmer_export_${date.split('T')[0]}.surql`);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h3 className="font-bold text-stone-800 flex items-center"><Database size={16} className="mr-2 text-emerald-600"/> Data Manager</h3>
           <p className="text-xs text-stone-500">Manage entities, view graph connections, and export schemas.</p>
        </div>
        <div className="flex space-x-2">
          <div className="bg-stone-100 p-1 rounded-lg flex">
             <button 
               onClick={() => setViewMode('tables')} 
               className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${viewMode === 'tables' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}
             >
               Tables
             </button>
             <button 
               onClick={() => setViewMode('graph')} 
               className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${viewMode === 'graph' ? 'bg-white shadow text-stone-800' : 'text-stone-500'}`}
             >
               Connections
             </button>
          </div>
          <button onClick={handleJsonExport} className="bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 px-3 py-2 rounded-lg text-xs font-bold flex items-center shadow-sm">
            <FileJson size={14} className="mr-2" /> JSON Dump
          </button>
          <button onClick={handleSurrealExport} className="bg-stone-800 hover:bg-stone-900 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center shadow-sm">
            <FileCode size={14} className="mr-2" /> Export Schema+Data
          </button>
        </div>
      </div>

      {viewMode === 'tables' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col h-[600px]">
          <div className="flex border-b border-stone-200 overflow-x-auto">
            {(['users', 'farms', 'listings', 'jobPosts'] as const).map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex-1 py-3 text-sm font-medium capitalize px-4 whitespace-nowrap transition-colors ${
                  activeType === type ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(state[activeType] as any[]).map((item) => (
              <div key={item.id} className="p-3 bg-stone-50 border border-stone-100 rounded-lg group hover:border-emerald-200 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-stone-800 text-sm">{item.id}</div>
                    <div className="text-xs text-stone-500 mt-1">
                      {activeType === 'users' && `${item.name?.first} ${item.name?.last} • ${item.role}`}
                      {activeType === 'farms' && item.name}
                      {activeType === 'listings' && `${item.name} (${item.season})`}
                      {activeType === 'jobPosts' && `${item.title}`}
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="text-stone-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-stone-800 mb-6 capitalize">Add New {activeType.slice(0, -1)}</h3>
          <div className="grid grid-cols-2 gap-4">
            {activeType === 'users' && (
              <>
                <input name="name.first" placeholder="First Name" onChange={handleInputChange} className="input-field" />
                <input name="name.last" placeholder="Last Name" onChange={handleInputChange} className="input-field" />
                <input name="dob" placeholder="DOB (YYMMDD)" onChange={handleInputChange} className="input-field" />
                <select name="role" onChange={handleInputChange} className="input-field">
                  <option value="">Role...</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Customer">Customer</option>
                  <option value="Provider">Provider</option>
                </select>
                <input name="farmer_id" placeholder="PF-XXXXX (Farmers)" onChange={handleInputChange} className="input-field" />
                <input name="satisfaction_score" type="number" step="0.1" placeholder="Score (0-5)" onChange={handleInputChange} className="input-field" />
                <input name="photo_url" placeholder="Photo URL" onChange={handleInputChange} className="input-field col-span-2" />
              </>
            )}
            {activeType === 'listings' && (
              <>
                <input name="name" placeholder="Item Name" onChange={handleInputChange} className="input-field" />
                <input name="farm_id" placeholder="Farm ID" onChange={handleInputChange} className="input-field" />
                <select name="type" onChange={handleInputChange} className="input-field">
                   <option value="">Type...</option>
                   {['Fruit', 'Veggie', 'Meat', 'Dairy', 'Textile', 'Raw Material'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select name="season" onChange={handleInputChange} className="input-field">
                   <option value="">Season...</option>
                   {['Spring', 'Summer', 'Fall', 'Winter', 'Year-Round'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input name="price" placeholder="Price or Trade" onChange={handleInputChange} className="input-field" />
              </>
            )}
          </div>
          <div className="mt-6 flex justify-end">
             <button onClick={addItem} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors">
               <Plus size={18} className="mr-2" /> Add Record
             </button>
          </div>
        </div>
        </div>
      ) : (
        <div className="bg-stone-900 rounded-xl p-6 border border-stone-800 text-stone-300 min-h-[500px]">
           <h4 className="text-emerald-400 font-mono font-bold mb-6 flex items-center uppercase text-sm">
             <Network size={16} className="mr-2" /> Graph Visualization (Active Relations)
           </h4>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* EMPLOYMENT EDGES */}
             <div>
               <h5 className="text-stone-500 font-bold text-xs uppercase mb-3 border-b border-stone-800 pb-2">Employment Edges (works_at)</h5>
               <div className="space-y-2">
                 {state.worksAt.map((rel, i) => {
                   const u = state.users.find(x => x.id === rel.in);
                   const f = state.farms.find(x => x.id === rel.out);
                   return (
                     <div key={i} className="flex items-center space-x-2 text-sm font-mono bg-stone-800/50 p-2 rounded">
                       <span className="text-emerald-300">{u?.name.last || rel.in}</span>
                       <span className="text-stone-600">--[{rel.role}]--></span>
                       <span className="text-amber-300">{f?.name || rel.out}</span>
                     </div>
                   );
                 })}
                 {state.worksAt.length === 0 && <span className="text-stone-700 italic text-sm">No employment edges found.</span>}
               </div>
             </div>

             {/* INVENTORY HIERARCHY (Simulated Edges) */}
             <div>
               <h5 className="text-stone-500 font-bold text-xs uppercase mb-3 border-b border-stone-800 pb-2">Inventory Links (Foreign Keys)</h5>
               <div className="space-y-2">
                 {state.listings.map((l, i) => {
                   const f = state.farms.find(x => x.id === l.farm_id);
                   return (
                     <div key={i} className="flex items-center space-x-2 text-sm font-mono bg-stone-800/50 p-2 rounded">
                       <span className="text-amber-300">{f?.name || l.farm_id}</span>
                       <span className="text-stone-600">--[Owns]--></span>
                       <span className="text-blue-300">{l.name}</span>
                     </div>
                   );
                 })}
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};