
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { InquiryStatus } from '../../types';
import { Search, Filter, Download, MessageCircle, ExternalLink, CheckCircle, Phone } from 'lucide-react';

export const InquiryManager: React.FC = () => {
  const { inquiries, setInquiries } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = inquiries.filter(i => {
    const matchesSearch = i.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || i.phone.includes(searchTerm);
    const matchesFilter = statusFilter === 'All' || i.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (id: string, newStatus: InquiryStatus) => {
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Client Name', 'Phone', 'WhatsApp', 'Product', 'Message', 'Source', 'Status'];
    const rows = filtered.map(i => [
      new Date(i.date).toLocaleDateString(),
      i.clientName,
      i.phone,
      i.whatsapp,
      i.product,
      i.message.replace(/,/g, ' '),
      i.source,
      i.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inquiries_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-grow w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 md:py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
          />
        </div>
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="flex-grow md:flex-grow-0 px-4 py-3 md:py-2 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold"
          >
            <option value="All">All Status</option>
            <option value={InquiryStatus.NEW}>New</option>
            <option value={InquiryStatus.CONTACTED}>Contacted</option>
            <option value={InquiryStatus.CLOSED}>Closed</option>
          </select>
          <button onClick={exportToCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 md:py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors text-sm">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
              <th className="px-6 py-4">Date & Client</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Interest</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{item.clientName}</p>
                  <p className="text-xs text-slate-400">{new Date(item.date).toLocaleString('en-IN')}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <a href={`tel:${item.phone}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><ExternalLink size={14} /></a>
                    <a href={`https://wa.me/${item.whatsapp.replace(/\D/g,'')}`} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><MessageCircle size={14} /></a>
                    <span className="text-slate-600 font-medium">{item.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-700">{item.product}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.message}</p>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as InquiryStatus)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase outline-none cursor-pointer ${
                      item.status === InquiryStatus.NEW ? 'bg-rose-100 text-rose-600' : 
                      item.status === InquiryStatus.CONTACTED ? 'bg-blue-100 text-blue-600' : 
                      'bg-green-100 text-green-600'
                    }`}
                  >
                    <option value={InquiryStatus.NEW}>New</option>
                    <option value={InquiryStatus.CONTACTED}>Contacted</option>
                    <option value={InquiryStatus.CLOSED}>Closed</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-orange-600 transition-colors">
                    <CheckCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Option A) */}
      <div className="md:hidden space-y-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-black text-slate-800">{item.clientName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
              <select 
                value={item.status}
                onChange={(e) => handleStatusChange(item.id, e.target.value as InquiryStatus)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase outline-none ${
                  item.status === InquiryStatus.NEW ? 'bg-rose-100 text-rose-600' : 
                  item.status === InquiryStatus.CONTACTED ? 'bg-blue-100 text-blue-600' : 
                  'bg-green-100 text-green-600'
                }`}
              >
                <option value={InquiryStatus.NEW}>New</option>
                <option value={InquiryStatus.CONTACTED}>Contacted</option>
                <option value={InquiryStatus.CLOSED}>Closed</option>
              </select>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-xl">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Inquiry Details</p>
              <p className="text-sm font-bold text-slate-700">{item.product}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.message}</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a href={`tel:${item.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold text-xs">
                <Phone size={14} /> Call
              </a>
              <a href={`https://wa.me/${item.whatsapp.replace(/\D/g,'')}`} className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-bold text-xs">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-slate-400 italic bg-white rounded-2xl border">No inquiries found matching your search.</div>
      )}
    </div>
  );
};
