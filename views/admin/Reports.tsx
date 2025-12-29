
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { Download, Calendar, ArrowRight, BarChart, Tag, Weight } from 'lucide-react';

export const Reports: React.FC = () => {
  const { ledger, parties } = useApp();
  const [range, setRange] = useState({ start: '', end: '' });

  const filtered = ledger.filter(l => {
    if (!range.start || !range.end) return true;
    
    // Normalize dates to start/end of day for accurate filtering
    const entryDate = new Date(l.date).getTime();
    const startDate = new Date(range.start).setHours(0, 0, 0, 0);
    const endDate = new Date(range.end).setHours(23, 59, 59, 999);
    
    return entryDate >= startDate && entryDate <= endDate;
  });

  const stats = {
    totalBuy: filtered.filter(l => l.type === 'Buy').reduce((sum, l) => sum + l.amount, 0),
    totalSell: filtered.filter(l => l.type === 'Sell').reduce((sum, l) => sum + l.amount, 0),
    avgRate: filtered.length > 0 ? filtered.reduce((sum, l) => sum + l.rate, 0) / filtered.length : 0,
    totalWeight: filtered.reduce((sum, l) => sum + l.weight, 0)
  };

  const exportCSV = () => {
    const csv = "Date,Party,Type,Item,Weight,Rate,Amount\n" + 
      filtered.map(l => `${new Date(l.date).toLocaleDateString()},${parties.find(p => p.id === l.partyId)?.name},${l.type},${l.itemName},${l.weight},${l.rate},${l.amount}`).join("\n");
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    link.download = `hari_report_${range.start || 'all'}_to_${range.end || 'all'}.csv`;
    link.click();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Filters */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-2 md:gap-3 bg-slate-50 p-3 rounded-2xl border w-full md:flex-grow">
          <Calendar size={18} className="text-slate-400 hidden sm:block" />
          <div className="flex flex-col flex-1">
            <span className="text-[8px] font-black uppercase text-slate-400">From</span>
            <input type="date" value={range.start} onChange={e => setRange({...range, start: e.target.value})} className="bg-transparent outline-none text-xs font-bold w-full" />
          </div>
          <ArrowRight size={14} className="text-slate-300" />
          <div className="flex flex-col flex-1">
            <span className="text-[8px] font-black uppercase text-slate-400">To</span>
            <input type="date" value={range.end} onChange={e => setRange({...range, end: e.target.value})} className="bg-transparent outline-none text-xs font-bold w-full" />
          </div>
        </div>
        <button onClick={exportCSV} className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 md:py-3 rounded-2xl font-black shadow-lg shadow-orange-900/20 hover:bg-orange-700 transition-all text-xs uppercase tracking-widest">
          <Download size={18} /> DOWNLOAD DATA (CSV)
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Volume', value: `${(stats.totalWeight/1000).toFixed(2)} Tons`, color: 'text-slate-800' },
          { label: 'Total Purchase', value: `₹${stats.totalBuy.toLocaleString()}`, color: 'text-blue-600' },
          { label: 'Total Sales', value: `₹${stats.totalSell.toLocaleString()}`, color: 'text-green-600' },
          { label: 'Net Profit', value: `₹${(stats.totalSell - stats.totalBuy).toLocaleString()}`, color: 'text-orange-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center sm:items-start text-center sm:text-left">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</p>
            <p className={`text-xl md:text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Report Container */}
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="font-bold flex items-center gap-2 text-slate-800">
            <BarChart size={18} /> Detailed Records
          </h3>
          <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full border border-slate-200">{filtered.length} Entries Found</span>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b">
              <tr className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
                <th className="px-8 py-4">Transaction Date</th>
                <th className="px-8 py-4">Party Involved</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4 text-right">Volume</th>
                <th className="px-8 py-4 text-right">Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-8 py-5 text-slate-500">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-8 py-5 font-bold text-slate-800">{parties.find(p => p.id === item.partyId)?.name || 'Unknown'}</td>
                  <td className="px-8 py-5 uppercase font-black text-[10px] tracking-tighter">
                    <span className={item.type === 'Buy' ? 'text-blue-500' : 'text-orange-500'}>{item.type}</span> - {item.itemName}
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-slate-700">{item.weight} kg</td>
                  <td className="px-8 py-5 text-right font-black text-slate-900">₹{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Option A) */}
        <div className="md:hidden divide-y">
          {filtered.map(item => (
            <div key={item.id} className="p-5 space-y-4 hover:bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-black text-slate-800 leading-tight">{parties.find(p => p.id === item.partyId)?.name || 'Unknown'}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">{new Date(item.date).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${item.type === 'Buy' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                  {item.type}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Tag size={12} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600 truncate">{item.itemName}</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Weight size={12} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-800">{item.weight} kg</span>
                </div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400">Total Value</span>
                <span className="text-sm font-black text-white">₹{item.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center italic text-slate-400">No data available for the selected range.</div>
        )}
      </div>
    </div>
  );
};
