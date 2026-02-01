import React, { useState } from 'react';
import { 
  Briefcase, Database, Wand2, MessageSquare,
  ShoppingBasket, Stethoscope, UserCircle, Sprout
} from 'lucide-react';

// Component Imports
import { ProfileManager } from './components/ProfileManager';
import { Marketplace } from './components/Marketplace';
import { IsoBoard } from './components/IsoBoard';
import { JobBoard } from './components/JobBoard';
import { ServicesDirectory } from './components/ServicesDirectory';
import { EntityManager } from './components/EntityManager';
import { AiGenerator } from './components/AiGenerator';
import { FarmAssistant } from './components/FarmAssistant';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-emerald-600 text-white shadow-md' 
          : 'text-stone-600 hover:bg-stone-100'
      }`}
    >
      <Icon size={18} />
      <span className="font-bold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('profile')}>
              <div className="bg-emerald-600 p-2 rounded-lg shadow-sm">
                <Sprout className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-stone-800 tracking-tight">Pocket Farmer</span>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              <NavItem id="profile" icon={UserCircle} label="My Farm" />
              <NavItem id="market" icon={ShoppingBasket} label="Market" />
              <NavItem id="iso" icon={MessageSquare} label="ISO Board" />
              <NavItem id="jobs" icon={Briefcase} label="Jobs" />
              <NavItem id="services" icon={Stethoscope} label="Services" />
            </nav>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setActiveTab('generator')}
                className={`hidden md:flex items-center text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    activeTab === 'generator' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'text-emerald-700 bg-emerald-50 border-emerald-100 hover:bg-emerald-100'
                }`}
              >
                <Wand2 size={14} className="mr-1" /> AI Gen
              </button>
              <button 
                onClick={() => setActiveTab('data')}
                className={`p-2 rounded-lg transition-colors ${activeTab === 'data' ? 'text-emerald-600 bg-emerald-50' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'}`}
                title="Database Manager"
              >
                <Database size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden border-t border-stone-100 overflow-x-auto bg-white">
           <div className="flex p-2 space-x-2 min-w-max">
              <NavItem id="profile" icon={UserCircle} label="My Farm" />
              <NavItem id="market" icon={ShoppingBasket} label="Market" />
              <NavItem id="iso" icon={MessageSquare} label="ISO" />
              <NavItem id="jobs" icon={Briefcase} label="Jobs" />
              <NavItem id="services" icon={Stethoscope} label="Services" />
              <NavItem id="generator" icon={Wand2} label="AI" />
              <NavItem id="data" icon={Database} label="Data" />
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && <ProfileManager />}
        {activeTab === 'market' && <Marketplace onNavigate={setActiveTab} />}
        {activeTab === 'iso' && <IsoBoard />}
        {activeTab === 'jobs' && <JobBoard />}
        {activeTab === 'services' && <ServicesDirectory />}
        {activeTab === 'data' && <EntityManager />}
        {activeTab === 'generator' && <AiGenerator onNavigate={() => setActiveTab('data')} />}
      </main>

      {/* Chat Assistant */}
      <FarmAssistant />
      
      <style>{`
        .input-field {
          width: 100%;
          border: 1px solid #e7e5e4;
          border-radius: 0.5rem;
          padding: 0.6rem 1rem;
          font-size: 0.875rem;
          color: #1c1917;
          background-color: #fff;
          outline: none;
        }
        .input-field:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};