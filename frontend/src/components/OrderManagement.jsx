import React, { useState } from 'react';
import { ShoppingCart, Upload, Plus, CheckCircle, Trash2, AlertTriangle, FileText, Check, Clock } from 'lucide-react';

export default function OrderManagement({ orders, onUpload, onCreate, onComplete, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);

  // Manual Form State
  const [newOrder, setNewOrder] = useState({
    order_id: '',
    product: 'Gear',
    quantity: 100,
    due_date: '2026-10-30'
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setExtractionResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await onUpload(formData);
      setExtractionResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreate({
        order_id: newOrder.order_id || undefined,
        product: newOrder.product,
        quantity: parseInt(newOrder.quantity),
        due_date: newOrder.due_date
      });
      setShowModal(false);
      setNewOrder({ order_id: '', product: 'Gear', quantity: 100, due_date: '2026-10-30' });
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" /> Scheduled
          </span>
        );
      case 'material_shortage':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3" /> Material Shortage
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ShoppingCart className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">2. Production Orders & AI Extraction</h2>
            <p className="text-xs text-slate-400">Automated ERP entry via CSV / XLSX / PDF / OCR Document Processing</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* File Upload Button */}
          <label className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 cursor-pointer transition active:scale-95">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Processing AI Document...' : 'AI Upload (CSV/PDF/Image)'}</span>
            <input type="file" onChange={handleFileUpload} accept=".csv,.xlsx,.pdf,.png,.jpg,.jpeg" className="hidden" />
          </label>

          {/* Manual Order Modal Trigger */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* AI Extraction Banner Feedback */}
      {extractionResult && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
              <FileText className="w-4 h-4" />
              <span>AI Document Extraction Summary for ({extractionResult.filename})</span>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">
              Confidence: {Math.round(extractionResult.extraction.confidence * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Order ID</span>
              <span className="font-mono font-bold text-white">{extractionResult.extraction.order_id || 'Not Detected'}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Product</span>
              <span className="font-bold text-white">{extractionResult.extraction.product || 'Not Detected'}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Quantity</span>
              <span className="font-bold text-white">{extractionResult.extraction.quantity || 'Not Detected'}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Material</span>
              <span className="font-bold text-white">{extractionResult.extraction.material || 'N/A'}</span>
            </div>
          </div>

          {extractionResult.extraction.missing_fields.length > 0 && (
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Missing Required Fields: <b>{extractionResult.extraction.missing_fields.join(', ')}</b>. Reported to operator instead of inventing data.</span>
            </div>
          )}
        </div>
      )}

      {/* Orders Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Source Document</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {orders.map((ord) => (
              <tr key={ord.order_id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-mono font-bold text-blue-400">{ord.order_id}</td>
                <td className="py-3 px-4 font-semibold text-slate-200">{ord.product}</td>
                <td className="py-3 px-4 font-mono text-slate-300">{ord.quantity}</td>
                <td className="py-3 px-4 text-slate-400">{ord.due_date}</td>
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{ord.source_file || 'Manual'}</td>
                <td className="py-3 px-4">{getStatusBadge(ord.status)}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  {ord.status !== 'completed' && (
                    <button
                      onClick={() => onComplete(ord.order_id)}
                      title="Complete Order"
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(ord.order_id)}
                    title="Delete Order"
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Create New Production Order</h3>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Order ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ORD-GEAR-99"
                  value={newOrder.order_id}
                  onChange={e => setNewOrder({...newOrder, order_id: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 text-xs px-3 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Product</label>
                <select
                  value={newOrder.product}
                  onChange={e => setNewOrder({...newOrder, product: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 text-xs px-3 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Gear">Gear</option>
                  <option value="Bolt">Bolt</option>
                  <option value="Shaft">Shaft</option>
                  <option value="Valve Body">Valve Body</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  value={newOrder.quantity}
                  onChange={e => setNewOrder({...newOrder, quantity: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 text-xs px-3 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={newOrder.due_date}
                  onChange={e => setNewOrder({...newOrder, due_date: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 text-xs px-3 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
