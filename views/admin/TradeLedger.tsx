
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { LedgerEntry } from '../../types';
import { Plus, Download, ArrowUpRight, ArrowDownLeft, Trash2, Search, Edit2, X, Calendar, Tag } from 'lucide-react';

export const TradeLedger: React.FC = () => {
  const { ledger, setLedger, parties, cms } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const rates = cms.rates || [];

  const [formData, setFormData] = useState<Omit<LedgerEntry, 'id' | 'date' | 'amount'>>({
    partyId: '',
    type: 'Buy',
    itemName: 'MS Heavy Scrap',
    weight: 0,
    rate: 0
  });

  const openModal = (entry?: LedgerEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        partyId: entry.partyId,
        type: entry.type,
        itemName: entry.itemName,
        weight: entry.weight,
        rate: entry.rate
      });
    } else {
      setEditingEntry(null);
      setFormData({ partyId: '', type: 'Buy', itemName: 'MS Heavy Scrap', weight: 0, rate: 0 });
    }
    setIsModalOpen(true);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      setLedger(ledger.map(l => l.id === editingEntry.id ? { ...l, ...formData, amount: formData.weight * formData.rate } : l));
    } else {
      const newEntry: LedgerEntry = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        amount: formData.weight * formData.rate
      };
      setLedger([newEntry, ...ledger]);
    }
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const deleteEntry = (id: string) => {
    if (confirm('Delete this ledger entry?')) {
      setLedger(ledger.filter(l => l.id !== id));
    }
  };

  const filtered = ledger.filter(l => {
    const party = parties.find(p => p.id === l.partyId);
    return party?.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.itemName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const exportCSV = () => {
    const headers = ['Date', 'Party', 'Type', 'Item', 'Weight', 'Rate', 'Amount'];
    const rows = filtered.map(l => [
      new Date(l.date).toLocaleDateString(),
      parties.find(p => p.id === l.partyId)?.name || 'Unknown',
      l.type,
      l.itemName,
      l.weight,
      l.rate,
      l.amount
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "ledger_report.csv");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border">
        <div className="relative flex-grow w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 md:py-2 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" 
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={exportCSV} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 md:py-2.5 rounded-xl font-bold hover:bg-slate-200 text-sm">
            <Download size={18} /> <span className="hidden sm:inline">EXPORT</span>
          </button>
          <button 
            onClick={() => openModal()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 md:py-2.5 rounded-xl font-bold hover:bg-slate-800 shadow-lg text-sm"
          >
            <Plus size={18} /> <span className="hidden sm:inline">ADD TRANSACTION</span>
            <span className="sm:hidden">ADD</span>
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
              <th className="px-6 py-4">Date & Party</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Item Details</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(entry => {
              const party = parties.find(p => p.id === entry.partyId);
              return (
                <tr key={entry.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{party?.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-400">{new Date(entry.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 font-black uppercase text-[10px] ${entry.type === 'Buy' ? 'text-blue-600' : 'text-orange-600'}`}>
                      {entry.type === 'Buy' ? <ArrowDownLeft size={14}/> : <ArrowUpRight size={14}/>}
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-700">{entry.itemName}</p>
                    <p className="text-xs text-slate-500">{entry.weight} kg @ ₹{entry.rate}/kg</p>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">
                    ₹{entry.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => openModal(entry)} className="p-1.5 text-slate-400 hover:text-blue-500">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteEntry(entry.id)} className="p-1.5 text-slate-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Option A) */}
      <div className="md:hidden space-y-4">
        {filtered.map(entry => {
          const party = parties.find(p => p.id === entry.partyId);
          return (
            <div key={entry.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${entry.type === 'Buy' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                    {entry.type === 'Buy' ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 leading-tight">{party?.name || 'Unknown'}</p>
                    <p className="text-[10px] font-bold text-slate-400">{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openModal(entry)} className="p-2 text-slate-400 hover:text-blue-500"><Edit2 size={16}/></button>
                  <button onClick={() => deleteEntry(entry.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Item Info</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{entry.itemName}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{entry.weight}kg @ ₹{entry.rate}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Net Amount</p>
                  <p className="text-sm font-black text-white">₹{entry.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-slate-400 italic bg-white rounded-2xl border">No transactions found.</div>
      )}

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-xl font-bold uppercase tracking-tight">{editingEntry ? 'Edit Entry' : 'New Trade Entry'}</h3>
              <button onClick={() => {setIsModalOpen(false); setEditingEntry(null);}} className="hover:bg-white/10 p-2 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Select Party</label>
                  <select required value={formData.partyId} onChange={e => setFormData({...formData, partyId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold focus:ring-2 focus:ring-orange-500 outline-none">
                    <option value="">-- Choose Party --</option>
                    {parties.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Transaction Type</label>
                  <div className="flex gap-2">
                    <label className={`flex-grow flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${formData.type === 'Buy' ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                      <input type="radio" checked={formData.type === 'Buy'} onChange={() => setFormData({...formData, type: 'Buy'})} className="hidden" />
                      <span className={`font-black text-xs ${formData.type === 'Buy' ? 'text-blue-600' : 'text-slate-400'}`}>BUY</span>
                    </label>
                    <label className={`flex-grow flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${formData.type === 'Sell' ? 'bg-orange-50 border-orange-200' : 'bg-white'}`}>
                      <input type="radio" checked={formData.type === 'Sell'} onChange={() => setFormData({...formData, type: 'Sell'})} className="hidden" />
                      <span className={`font-black text-xs ${formData.type === 'Sell' ? 'text-orange-600' : 'text-slate-400'}`}>SELL</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Item Category</label>
                  <select value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold focus:ring-2 focus:ring-orange-500 outline-none">
                    {rates.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    <option value="Other">Other Scrap</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Weight (kg)</label>
                  <input required type="number" value={formData.weight || ''} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Rate (₹/kg)</label>
                  <input required type="number" value={formData.rate || ''} onChange={e => setFormData({...formData, rate: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" placeholder="0.00" />
                </div>
              </div>
              
              <div className="bg-slate-900 p-6 rounded-2xl flex flex-col items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Total Valuation</span>
                <span className="text-3xl font-black text-white">₹{(formData.weight * formData.rate).toLocaleString()}</span>
              </div>

              <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/20 uppercase tracking-widest text-xs">
                {editingEntry ? 'SAVE CHANGES' : 'POST TO LEDGER'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
