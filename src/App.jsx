import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

export default function App() {
  const [activeRegion, setActiveRegion] = useState('US-East (N. Virginia)');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar activeRegion={activeRegion} setActiveRegion={setActiveRegion} />
      <main>
        <Dashboard activeRegion={activeRegion} />
      </main>
      <footer className="text-center py-6 text-xs text-slate-600 border-t border-slate-900 mt-12">
        AI Observatory & Latency Telemetry Dashboard — Portfolio Project © 2026
      </footer>
    </div>
  );
}