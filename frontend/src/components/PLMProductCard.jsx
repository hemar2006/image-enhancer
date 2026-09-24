import React, { useState } from 'react';
import { Box, FileCode, Layers, Send, Check, Shield, AlertCircle, FileText } from 'lucide-react';

export default function PLMProductCard({ products, onRequestProduction }) {
  const [selectedId, setSelectedId] = useState(products[0]?.product_id || 'PLM-GEAR-001');
  const [reqQty, setReqQty] = useState(100);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const currentProduct = products.find(p => p.product_id === selectedId) || products[0];

  const handleSendRequest = async () => {
    if (!currentProduct) return;
    setLoading(true);
    setSuccessMsg('');
    try {
      await onRequestProduction({
        product_id: currentProduct.product_id,
        quantity: parseInt(reqQty),
        due_date: '2026-10-20'
      });
      setSuccessMsg(`Production request for ${currentProduct.name} (${reqQty} units) submitted to ERP!`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentProduct) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Box className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">1. PLM Product Specifications</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">PTC Windchill CAD Document & Bill of Materials (BOM) Catalog</p>
        </div>

        {/* Product Selector Tabs */}
        <div className="flex space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {products.map(p => (
            <button
              key={p.product_id}
              onClick={() => { setSelectedId(p.product_id); setSuccessMsg(''); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedId === p.product_id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Spec Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Card Metadata */}
        <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Name</span>
            <span className="text-base font-bold text-white">{currentProduct.name}</span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
            <span className="text-xs text-slate-400">Product ID</span>
            <span className="text-xs font-mono font-bold bg-slate-800 px-2 py-1 rounded text-blue-400">
              {currentProduct.product_id}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
            <span className="text-xs text-slate-400">Revision</span>
            <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Rev {currentProduct.revision}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
            <span className="text-xs text-slate-400">Material Spec</span>
            <span className="text-xs font-semibold text-slate-200">{currentProduct.material}</span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
            <span className="text-xs text-slate-400">Lifecycle State</span>
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> RELEASED
            </span>
          </div>
        </div>

        {/* CAD & Document Reference */}
        <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">CAD Document Reference</h3>
            </div>
            <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">File:</span>
                <span className="text-emerald-300 font-semibold font-mono">{currentProduct.cad_document}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">File Size:</span>
                <span className="text-slate-300">{currentProduct.cad_file_size}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Lead Designer:</span>
                <span className="text-slate-300">{currentProduct.designer}</span>
              </div>
            </div>
          </div>

          {/* Quick Submit Request */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="number"
                value={reqQty}
                onChange={e => setReqQty(e.target.value)}
                min="10"
                max="2000"
                className="w-24 bg-slate-900 text-xs font-bold px-3 py-2 rounded-lg border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendRequest}
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-lg shadow-blue-500/20 transition active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to ERP</span>
              </button>
            </div>
            {successMsg && (
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in">
                <Check className="w-3 h-3" /> {successMsg}
              </p>
            )}
          </div>
        </div>

        {/* Interactive Bill of Materials (BOM) */}
        <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Bill of Materials (BOM)</h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {currentProduct.bom.length} Components
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {currentProduct.bom.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800/80 text-xs">
                  <div>
                    <span className="font-semibold text-slate-200">{item.name}</span>
                    <p className="text-[10px] text-slate-400">{item.material}</p>
                  </div>
                  <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    x{item.qty_per_assembly}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
