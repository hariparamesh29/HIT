
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { PartyType, Party } from '../../types';
import { UserPlus, Edit2, Trash2, X, Plus, Search } from 'lucide-react';

export const PartyMaster: React.FC = () => {
  const { parties, setParties } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  
  const [formData, setFormData] = useState<Omit<Party, 'id'>>({
    name: '',
    type: PartyType.BUYER,
    industry: '',
    phone: '',
    whatsapp: '',
    address: '',
    status: 'Active'
  });

  const resetForm = () => {
    setFormData({ name: '', type: PartyType.BUYER, industry: '', phone: '', whatsapp: '', address: '', status: 'Active' });
    setEditingParty(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingParty) {
      setParties(parties.map(p => p.id === editingParty.id ? { ...formData, id: p.id } : p));
    } else {
      const newParty: Party = { ...formData, id: Math.random().toString(36).substr(2, 9) };
      setParties([...parties, newParty]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const startEdit = (party: Party) => {
    setEditingParty(party);
    setFormData({ ...party });
    setIsModalOpen(true);
  };

  const deleteParty = (id: string) => {
    if (confirm('Are you sure you want to delete this party?')) {
      setParties(parties.filter(p => p.id !== id));
    }
  };

  const filtered = parties.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search party..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
          />
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
        >
          <UserPlus size={18} />
          ADD NEW PARTY
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(party => (
          <div key={party.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`px-2 py-1 rounded text-[10px] font-black uppercase ${party.type === PartyType.BUYER ? 'bg-blue-100 text-blue-600' : party.type === PartyType.SUPPLIER ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                {party.type}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(party)} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 size={16} /></button>
                <button onClick={() => deleteParty(party.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{party.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{party.industry}</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <i className="fas fa-phone w-4"></i> {party.phone}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <i className="fab fa-whatsapp w-4 text-green-500"></i> {party.whatsapp}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <i className="fas fa-map-marker-alt w-4"></i> {party.address}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingParty ? 'Edit Party' : 'Add New Party'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-2 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Party Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as PartyType})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500">
                    <option value={PartyType.BUYER}>Buyer</option>
                    <option value={PartyType.SUPPLIER}>Supplier</option>
                    <option value={PartyType.BOTH}>Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
                  <input type="text" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp</label>
                  <input type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                  <textarea rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                </div>
              </div>
              <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-700 transition-all">
                {editingParty ? 'UPDATE PARTY' : 'CREATE PARTY'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
