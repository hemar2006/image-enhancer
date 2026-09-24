import React from 'react';
import { BarChart3, PieChart as PieIcon, Activity, CheckCircle, AlertTriangle, Cpu } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export default function AnalyticsDashboard({ reports }) {
  if (!reports) return null;

  const {
    total_orders = 0,
    scheduled_orders = 0,
    completed_orders = 0,
    material_shortages = 0,
    machine_utilization_pct = 0,
    fulfillment_rate_pct = 0,
    order_status_breakdown = [],
    machine_loads = []
  } = reports;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-2 pb-5 border-b border-slate-800">
        <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <BarChart3 className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-white">7. Manufacturing Analytics & KPI Dashboard</h2>
          <p className="text-xs text-slate-400">Real-time performance metrics and Recharts visualization</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Orders</span>
          <span className="text-xl font-bold text-white block">{total_orders}</span>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold">Scheduled</span>
          <span className="text-xl font-bold text-emerald-400 block">{scheduled_orders}</span>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-blue-400 uppercase font-semibold">Completed</span>
          <span className="text-xl font-bold text-blue-400 block">{completed_orders}</span>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-red-400 uppercase font-semibold">Shortages</span>
          <span className="text-xl font-bold text-red-400 block">{material_shortages}</span>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-purple-400 uppercase font-semibold">Machine Util.</span>
          <span className="text-xl font-bold text-purple-400 block">{machine_utilization_pct}%</span>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-amber-400 uppercase font-semibold">Fulfillment</span>
          <span className="text-xl font-bold text-amber-400 block">{fulfillment_rate_pct}%</span>
        </div>
      </div>

      {/* Recharts Visualization Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* Pie Chart: Order Breakdown */}
        <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 flex flex-col items-center">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 self-start">
            Production Order Status Breakdown
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={order_status_breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {order_status_breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Machine Workload */}
        <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
            Machine Workload & Capacity Utilization
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={machine_loads}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="machine_id" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                <Bar dataKey="load" name="Active Jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" name="Shift Capacity (Hrs)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
