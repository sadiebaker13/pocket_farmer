import React, { useState } from 'react';
import { Wand2, RefreshCw } from 'lucide-react';
import { DatabaseState } from '../types';
import { generateSeedData } from '../services/geminiService';
import { useDatabase } from '../context/DatabaseContext';

interface AiGeneratorProps {
  onNavigate: () => void;
}

export const AiGenerator: React.FC<AiGeneratorProps> = ({ onNavigate }) => {
  const { setState } = useDatabase();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError('');
    try {
      const newData = await generateSeedData(prompt);
      setState(prev => ({
        ...prev,
        users: [...prev.users, ...(newData.users || [])],
        farms: [...prev.farms, ...(newData.farms || [])],
        listings: [...prev.listings, ...(newData.listings || [])],
        jobPosts: [...prev.jobPosts, ...(newData.jobPosts || [])],
        isoRequests: [...prev.isoRequests, ...(newData.isoRequests || [])],
        services: [...prev.services, ...(newData.services || [])],
        worksAt: [...prev.worksAt, ...(newData.worksAt || [])],
        exchangeOffers: [...prev.exchangeOffers, ...(newData.exchangeOffers || [])],
      }));
      onNavigate();
    } catch (err) {
      console.error(err);
      setError("Failed to generate data. Check API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Wand2 size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800">AI Seed Generator</h2>
        <p className="text-stone-500 max-w-md mx-auto mt-2">
          Describe a farming community scenario (e.g., "A harsh winter in Northern BC with 3 dairy farms and a shortage of hay"), and our AI will generate realistic graph data for you.
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your scenario here..."
          className="w-full p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[120px] shadow-sm resize-none"
        />
        
        {error && <div className="text-rose-500 text-sm font-medium bg-rose-50 p-2 rounded">{error}</div>}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center transition-all shadow-md hover:shadow-lg transform active:scale-95"
        >
          {loading ? (
            <>
              <RefreshCw className="animate-spin mr-2" size={20} /> Generating World...
            </>
          ) : (
            <>
              <Wand2 className="mr-2" size={20} /> Generate Data
            </>
          )}
        </button>
      </div>
    </div>
  );
};