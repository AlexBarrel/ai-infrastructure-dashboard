import React from 'react';

export default function Navbar({ activeRegion, setActiveRegion }) {
  const regions = ['US-East (N. Virginia)', 'EU-Central (Frankfurt)', 'AP-East (Tokyo)'];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="bg-cyan-500 text-slate-950 font-bold p-2.5 rounded-xl shadow-lg shadow-cyan-500/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide flex items-center gap-2">
            AI Engine & LLM Observatory
          </h1>
          <p className="text-xs text-slate-400">Real-Time Global API Health & Latency Monitor</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Выбор региона */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400">Region:</span>
          <select 
            value={activeRegion} 
            onChange={(e) => setActiveRegion(e.target.value)}
            className="bg-transparent text-cyan-400 font-medium focus:outline-none cursor-pointer"
          >
            {regions.map((reg) => (
              <option key={reg} value={reg} className="bg-slate-900 text-white">
                {reg}
              </option>
            ))}
          </select>
        </div>

        {/* Статус системы */}
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium text-emerald-400">Systems Operational</span>
        </div>
      </div>
    </nav>
  );
}