import React, { useState } from 'react';
import { Package, AlertCircle, RefreshCw, PlusCircle, ArrowUpRight, Zap } from 'lucide-react';

export default function InventoryTracker({ inventory, onRestock }) {
  const [selectedProd, setSelectedProd] = useState('Bolt');
  const [addQty, setAddQty] = useState(80);
  const [restockNotice, setRestockNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRestockNotice(null);
    try {
      const res = await onRestock({
        product: selectedProd,
        stock_qty: parseInt(addQty)
      });
      setRestockNotice(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Package className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">3. Inventory Stock & Automatic Restock Trigger</h2>
            <p className="text-xs text-slate-400">Real-time stock monitoring & auto-resolution of material shortages</p>
          </div>
        </div>

        {/* Quick Restock Action Form */}
        <form onSubmit={handleRestockSubmit} className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <select
            value={selectedProd}
            onChange={e => setSelectedProd(e.target.value)}
            className="bg-slate-900 text-xs font-bold px-2 py-1.5 rounded-lg text-white border border-slate-700 focus:outline-none"
          >
            {inventory.map(inv => (
              <option key={inv.id} value={inv.product}>{inv.product}</option>
            ))}
          </select>
          <input
            type="number"
            min="10"
            max="2000"
            value={addQty}
            onChange={e => setAddQty(e.target.value)}
            className="w-20 bg-slate-900 text-xs font-bold px-2 py-1.5 rounded-lg text-white border border-slate-700 focus:outline-none font-mono"
            placeholder="+Qty"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-md shadow-emerald-500/20 transition active:scale-95 disabled:opacity-50"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Restock Stock</span>
          </button>
        </form>
      </div>

      {/* Restock Auto-Trigger Banner */}
      {restockNotice && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 space-y-2 animate-fade-in">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
            <Zap className="w-4 h-4 animate-bounce text-emerald-300" />
            <span>AUTOMATIC RESTOCK TRIGGER EXECUTED</span>
          </div>
          <p className="text-xs text-emerald-200">
            {restockNotice.message}
          </p>

          {restockNotice.auto_rescheduled_orders && restockNotice.auto_rescheduled_orders.length > 0 ? (
            <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-500/30 text-xs space-y-1">
              <span className="font-bold text-emerald-300 block">
                Auto-Transitioned Orders (Material Shortage ➔ Scheduled):
              </span>
              {restockNotice.auto_rescheduled_orders.map(o => (
                <div key={o.order_id} className="flex items-center justify-between text-[11px] font-mono text-slate-200">
                  <span>Order: <b>{o.order_id}</b> ({o.product})</span>
                  <span className="text-emerald-400">Assigned Machine: <b>{o.machine}</b> ({o.shift})</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400">No pending shortage orders for {restockNotice.product}. Stock updated.</p>
          )}
        </div>
      )}

      {/* Inventory Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {inventory.map(inv => {
          const isLow = inv.available_qty <= inv.reorder_level;
          return (
            <div key={inv.id} className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">{inv.product}</span>
                  {isLow ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Reorder Alert
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Sufficient
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs my-3">
                  <div className="bg-slate-900 p-2 rounded">
                    <span className="text-slate-400 text-[10px] block">Total Stock</span>
                    <span className="font-mono font-bold text-white text-sm">{inv.stock_qty}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded">
                    <span className="text-slate-400 text-[10px] block">Available</span>
                    <span className={`font-mono font-bold text-sm ${isLow ? 'text-red-400' : 'text-emerald-400'}`}>
                      {inv.available_qty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Allocated: {inv.allocated_qty}</span>
                  <span>Reorder Level: {inv.reorder_level}</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, (inv.available_qty / (inv.stock_qty || 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
