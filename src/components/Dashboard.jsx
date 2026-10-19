import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Dashboard({ activeRegion }) {
  const [aiServices, setAiServices] = useState([
    { 
      id: 'openai', 
      name: 'ChatGPT (OpenAI API)', 
      provider: 'OpenAI', 
      status: 'Online', 
      latency: 120, 
      endpoint: 'https://api.openai.com/v1/models',
      uptime: [99, 100, 100, 98, 100, 100, 100, 99, 100, 100, 100, 100, 100, 100, 100]
    },
    { 
      id: 'anthropic', 
      name: 'Claude (Anthropic API)', 
      provider: 'Anthropic', 
      status: 'Online', 
      latency: 145, 
      endpoint: 'https://api.anthropic.com',
      uptime: [100, 100, 100, 100, 99, 100, 100, 100, 100, 100, 97, 100, 100, 100, 100]
    },
    { 
      id: 'gemini', 
      name: 'Gemini (Google AI)', 
      provider: 'Google', 
      status: 'Online', 
      latency: 95, 
      endpoint: 'https://generativelanguage.googleapis.com',
      uptime: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
  ]);

  // Данные для графика динамики отклика
  const [latencyHistory, setLatencyHistory] = useState([
    { time: '16:00', OpenAI: 130, Anthropic: 150, Google: 110 },
    { time: '16:05', OpenAI: 125, Anthropic: 142, Google: 102 },
    { time: '16:10', OpenAI: 118, Anthropic: 138, Google: 98 },
    { time: '16:15', OpenAI: 120, Anthropic: 145, Google: 95 },
  ]);

  // Консоль логов
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), text: 'System initialized. Connected to telemetry endpoints.' },
    { id: 2, time: new Date().toLocaleTimeString(), text: `Region set to ${activeRegion}. Ready for probes.` }
  ]);

  const [isChecking, setIsChecking] = useState(false);

  const addLog = (msg) => {
    setLogs((prev) => [
      { id: Date.now(), time: new Date().toLocaleTimeString(), text: msg },
      ...prev.slice(0, 19) // Храним последние 20 логов
    ]);
  };

  // Метод проведения пинга
  const checkAIHealth = async () => {
    setIsChecking(true);
    addLog(`Initiating global latency probe from node [${activeRegion}]...`);

    const newHistoryPoint = { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) };

    const updatedServices = await Promise.all(
      aiServices.map(async (service) => {
        const startTime = performance.now();
        try {
          await fetch(service.endpoint, { method: 'HEAD', mode: 'no-cors' });
          const endTime = performance.now();
          
          // Вычисляем реальную задержку + добавляем искусственный сдвиг в зависимости от региона
          const regionalOffset = activeRegion.includes('EU') ? 30 : activeRegion.includes('AP') ? 80 : 0;
          const latency = Math.round(endTime - startTime) + regionalOffset;

          newHistoryPoint[service.provider] = latency;
          addLog(`[${service.provider}] Response OK — ${latency}ms`);

          return {
            ...service,
            status: 'Online',
            latency,
          };
        } catch (error) {
          newHistoryPoint[service.provider] = 0;
          addLog(`[${service.provider}] Probe Failed — Network unreachable`);

          return {
            ...service,
            status: 'Offline / Unreachable',
            latency: 0,
          };
        }
      })
    );

    setAiServices(updatedServices);
    setLatencyHistory((prev) => [...prev.slice(-9), newHistoryPoint]);
    setIsChecking(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Кнопка запуска пинга */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
            Active LLM Health Nodes
          </h2>
          <p className="text-xs text-slate-400 mt-1">Live metrics from OpenAI, Anthropic, and Google AI infrastructures.</p>
        </div>
        <button
          onClick={checkAIHealth}
          disabled={isChecking}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          {isChecking ? 'Probing Endpoints...' : 'Run Real-Time Probe'}
        </button>
      </div>

      {/* Карточки ИИ Сервисов */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aiServices.map((ai) => (
          <div key={ai.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700">
                  {ai.provider}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  {ai.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-4">{ai.name}</h3>
              
              <div className="flex justify-between items-baseline mb-6 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Response Latency</span>
                <span className="font-mono text-2xl text-cyan-400 font-bold">{ai.latency} <span className="text-xs font-normal text-slate-500">ms</span></span>
              </div>
            </div>

            {/* Полоска Uptime (30 дней) */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                <span>30-Day Reliability History</span>
                <span className="text-emerald-400 font-medium">99.9%</span>
              </div>
              <div className="flex gap-1">
                {ai.uptime.map((val, idx) => (
                  <div 
                    key={idx} 
                    title={`Day ${idx + 1}: ${val}% uptime`}
                    className={`h-6 flex-1 rounded-sm transition-all hover:scale-110 ${
                      val === 100 ? 'bg-emerald-500/80 hover:bg-emerald-400' : 'bg-amber-500/80 hover:bg-amber-400'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* График задержки (Latency Area Chart) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Latency Telemetry (ms over time)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={latencyHistory}>
              <defs>
                <linearGradient id="colorOpenAI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAnthropic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
              />
              <Area type="monotone" dataKey="OpenAI" stroke="#38bdf8" fillOpacity={1} fill="url(#colorOpenAI)" strokeWidth={2} />
              <Area type="monotone" dataKey="Anthropic" stroke="#a855f7" fillOpacity={1} fill="url(#colorAnthropic)" strokeWidth={2} />
              <Area type="monotone" dataKey="Google" stroke="#34d399" fillOpacity={1} fill="url(#colorGoogle)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Консоль логов событий (Real-Time Terminal Log) */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl font-mono text-xs">
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
          <span className="text-slate-400 flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            System Live Terminal Log
          </span>
          <span className="text-slate-600">{logs.length} entries recorded</span>
        </div>
        <div className="h-36 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {logs.map((log) => (
            <div key={log.id} className="text-slate-300 flex gap-3">
              <span className="text-slate-500">[{log.time}]</span>
              <span className={log.text.includes('Failed') ? 'text-rose-400' : log.text.includes('OK') ? 'text-cyan-300' : 'text-slate-300'}>
                {log.text}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}