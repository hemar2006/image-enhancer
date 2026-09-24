import React from 'react';
import { Cpu, Calendar, Play, Wrench, CheckCircle, Clock, Zap } from 'lucide-react';

export default function MachineScheduler({ machines, schedule, onUpdateMachineStatus, onRunPlanning }) {

  const getMachineBadge = (status) => {
    switch (status) {
      case 'running':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Running</span>;
      case 'maintenance':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Maintenance</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Idle</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 4. Machines & Load Balancing */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Cpu className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">4. Machine Selection & Load Balancing</h2>
                <p className="text-xs text-slate-400">Least-loaded machine allocation & maintenance avoidance</p>
              </div>
            </div>

            <button
              onClick={onRunPlanning}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Run AI Planner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {machines.map(m => (
              <div key={m.machine_id} className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">{m.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{m.machine_id} ({m.type})</span>
                  </div>
                  {getMachineBadge(m.status)}
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">Active Load:</span>
                  <span className="font-mono font-bold text-blue-400">{m.current_load} Jobs</span>
                </div>

                {/* Status Switcher Buttons */}
                <div className="flex space-x-1 pt-1">
                  {['idle', 'running', 'maintenance'].map(st => (
                    <button
                      key={st}
                      onClick={() => onUpdateMachineStatus(m.machine_id, st)}
                      className={`flex-1 py-1 text-[10px] font-bold rounded transition capitalize ${
                        m.status === st
                          ? 'bg-slate-800 text-white border border-slate-600 shadow'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Production Schedule */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 pb-5 border-b border-slate-800">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">5. Production Schedule</h2>
              <p className="text-xs text-slate-400">Shift allocation & timeline execution</p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                  <th className="py-2.5 px-3">Schedule ID</th>
                  <th className="py-2.5 px-3">Machine</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Shift</th>
                  <th className="py-2.5 px-3">Start Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {schedule.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-slate-500 italic">No production schedules active.</td>
                  </tr>
                ) : (
                  schedule.map(sch => (
                    <tr key={sch.schedule_id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-purple-400">{sch.schedule_id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{sch.machine_name}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-medium">{sch.product} ({sch.quantity} units)</td>
                      <td className="py-2.5 px-3 text-slate-400">{sch.shift}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{sch.start_time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
