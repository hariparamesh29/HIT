
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { Send, CheckSquare, Square, MessageCircle, AlertCircle } from 'lucide-react';

export const WhatsAppBroadcast: React.FC = () => {
  const { parties, cms } = useApp();
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<'Price Update' | 'Holiday Alert' | 'Delay' | 'Custom'>('Price Update');
  const [customMessage, setCustomMessage] = useState('');

  const rates = cms.rates || [];

  const toggleParty = (id: string) => {
    setSelectedParties(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => setSelectedParties(parties.map(p => p.id));
  const deselectAll = () => setSelectedParties([]);

  const getAutoMessage = () => {
    switch(messageType) {
      case 'Price Update':
        const enabledRates = rates.filter(r => r.enabled).map(r => `${r.name}: ₹${r.rate}/${r.unit}`).join('\n');
        return `*HARI IRON TRADERS - TODAY'S SCRAP RATES*\n\n${enabledRates}\n\n_Rates subject to market volatility._\nContact: ${cms.phone}`;
      case 'Holiday Alert':
        return `*NOTICE: HOLIDAY ALERT*\n\nHari Iron Traders will remain closed tomorrow due to a local holiday. Normal operations will resume the following day.\n\nRegards,\nHari Iron Traders`;
      case 'Delay':
        return `*SERVICE UPDATE*\n\nPlease expect a delay of 2-3 hours in fleet arrival today due to heavy traffic/logistics congestion. We regret the inconvenience.`;
      default:
        return customMessage;
    }
  };

  const handleSend = () => {
    if (selectedParties.length === 0) {
      alert('Please select at least one party.');
      return;
    }
    const msg = encodeURIComponent(getAutoMessage());
    
    // In a real app, we'd use a bulk WhatsApp API. Here we provide the links.
    const firstPartyId = selectedParties[0];
    const party = parties.find(p => p.id === firstPartyId);
    if (party) {
      window.open(`https://wa.me/${party.whatsapp.replace(/\D/g,'')}?text=${msg}`, '_blank');
      alert(`Opening WhatsApp for ${party.name}. (Bulk sending usually requires API integration like Twilio/MessageBird)`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Party Selection */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Select Recipients</h3>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-[10px] font-black uppercase text-blue-600 hover:underline">All</button>
              <button onClick={deselectAll} className="text-[10px] font-black uppercase text-slate-400 hover:underline">None</button>
            </div>
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
            {parties.map(party => (
              <label key={party.id} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-all ${selectedParties.includes(party.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50 border-slate-100'}`}>
                <div onClick={(e) => { e.preventDefault(); toggleParty(party.id); }}>
                  {selectedParties.includes(party.id) ? <CheckSquare className="text-blue-600" size={20} /> : <Square className="text-slate-300" size={20} />}
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-slate-800 text-sm">{party.name}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase">{party.type}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Right: Message Content */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
          <h3 className="font-bold text-slate-800">Broadcast Content</h3>
          <div className="flex gap-2 flex-wrap">
            {['Price Update', 'Holiday Alert', 'Delay', 'Custom'].map(type => (
              <button 
                key={type}
                onClick={() => setMessageType(type as any)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all ${messageType === type ? 'bg-orange-600 text-white border-orange-600 shadow-md' : 'text-slate-500 border-slate-200'}`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-dashed min-h-[200px] relative">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Message Preview</h4>
            {messageType === 'Custom' ? (
              <textarea 
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full bg-transparent border-none outline-none resize-none text-slate-700 text-sm leading-relaxed"
                rows={8}
              ></textarea>
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-slate-700 text-sm leading-relaxed">{getAutoMessage()}</pre>
            )}
            <div className="absolute bottom-4 right-4 text-green-500 opacity-20">
              <MessageCircle size={60} />
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl flex gap-3 text-orange-700">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-[10px] leading-tight">Recipients must have your number saved to receive broadcast messages without being flagged as spam by WhatsApp.</p>
          </div>

          <button 
            onClick={handleSend}
            disabled={selectedParties.length === 0}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-slate-800 transition-all"
          >
            <Send size={18} /> SEND TO {selectedParties.length} PARTIES
          </button>
        </div>
      </div>
    </div>
  );
};
