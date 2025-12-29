
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { FleetStatus, FleetTrip } from '../../types';
import { Truck, MapPin, Scale, Plus, Send, MoreVertical, CheckCircle2, Navigation, Edit2, X } from 'lucide-react';

export const FleetTracker: React.FC = () => {
  const { fleet, setFleet, parties, cms } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<FleetTrip | null>(null);
  
  const [formData, setFormData] = useState<Omit<FleetTrip, 'id' | 'date'>>({
    vehicleNumber: '',
    partyId: '',
    location: '',
    weight: 0,
    status: FleetStatus.LOADING,
    notes: ''
  });

  const openModal = (trip?: FleetTrip) => {
    if (trip) {
      setEditingTrip(trip);
      setFormData({
        vehicleNumber: trip.vehicleNumber,
        partyId: trip.partyId,
        location: trip.location,
        weight: trip.weight,
        status: trip.status,
        notes: trip.notes
      });
    } else {
      setEditingTrip(null);
      setFormData({ vehicleNumber: '', partyId: '', location: '', weight: 0, status: FleetStatus.LOADING, notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTrip) {
      setFleet(fleet.map(t => t.id === editingTrip.id ? { ...t, ...formData } : t));
    } else {
      const newTrip: FleetTrip = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString()
      };
      setFleet([newTrip, ...fleet]);
    }
    setIsModalOpen(false);
    setEditingTrip(null);
  };

  const updateStatus = (id: string, status: FleetStatus) => {
    setFleet(fleet.map(t => t.id === id ? { ...t, status } : t));
  };

  const notifyClient = (trip: FleetTrip) => {
    const party = parties.find(p => p.id === trip.partyId);
    if (!party) return;
    const msg = encodeURIComponent(`🚚 Fleet Update: Vehicle ${trip.vehicleNumber} is currently ${trip.status}. Location: ${trip.location}. Expected arrival: Shortly. - Hari Iron Traders`);
    window.open(`https://wa.me/${party.whatsapp.replace(/\D/g,'')}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Active Fleet Operations</h2>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-900/20 hover:bg-orange-700 transition-all"
        >
          <Plus size={18} /> NEW TRIP
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {fleet.map(trip => {
          const party = parties.find(p => p.id === trip.partyId);
          return (
            <div key={trip.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
              <div className="bg-slate-50 p-6 border-b flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border flex items-center justify-center text-orange-600">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 tracking-tight">{trip.vehicleNumber}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{party?.name || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                    trip.status === FleetStatus.COMPLETED ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {trip.status}
                  </div>
                  <button onClick={() => openModal(trip)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-orange-600 transition-all">
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={16} />
                    <span>{trip.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Scale size={16} />
                    <span>{trip.weight} Tonnes</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-slate-100 rounded-full">
                  <div className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all duration-1000" style={{
                    width: trip.status === FleetStatus.LOADING ? '25%' : trip.status === FleetStatus.ON_THE_WAY ? '50%' : trip.status === FleetStatus.UNLOADING ? '75%' : '100%'
                  }}></div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => notifyClient(trip)}
                    className="flex-grow flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg font-bold text-xs hover:bg-green-600"
                  >
                    <Send size={14} /> NOTIFY CLIENT
                  </button>
                  <select 
                    value={trip.status}
                    onChange={(e) => updateStatus(trip.id, e.target.value as FleetStatus)}
                    className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg font-bold text-xs outline-none"
                  >
                    {Object.values(FleetStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
        {fleet.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <Navigation size={48} className="mb-4 opacity-20" />
            <p>No active fleet trips tracked at the moment.</p>
          </div>
        )}
      </div>

      {/* New/Edit Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-in fade-in zoom-in">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingTrip ? 'Edit Trip' : 'Create New Fleet Trip'}</h3>
              <button onClick={() => {setIsModalOpen(false); setEditingTrip(null);}} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Number</label>
                  <input required type="text" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} className="w-full px-4 py-2 border rounded-xl" placeholder="TN 37 AB 1234" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Linked Party</label>
                  <select required value={formData.partyId} onChange={e => setFormData({...formData, partyId: e.target.value})} className="w-full px-4 py-2 border rounded-xl">
                    <option value="">Select Party</option>
                    {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Current Location</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border rounded-xl" placeholder="Coimbatore Yard" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Est. Weight (T)</label>
                  <input required type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div className="col-span-2">
                   <label className="block text-sm font-bold text-slate-700 mb-2">Trip Status</label>
                   <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as FleetStatus})} className="w-full px-4 py-2 border rounded-xl">
                      {Object.values(FleetStatus).map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
                {editingTrip ? 'UPDATE TRIP' : 'INITIATE TRIP'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
