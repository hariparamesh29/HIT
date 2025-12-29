
import React from 'react';
import { useApp } from '../../AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, MessageSquare, Truck, DollarSign,
  ShoppingCart, Package
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { ledger, fleet, parties, inquiries } = useApp();

  // Simple analytics
  const totalPurchases = ledger.filter(l => l.type === 'Buy').reduce((sum, l) => sum + l.amount, 0);
  const totalSales = ledger.filter(l => l.type === 'Sell').reduce((sum, l) => sum + l.amount, 0);
  const profit = totalSales - totalPurchases;
  
  const activeFleet = fleet.filter(f => f.status !== 'Completed').length;
  const activeParties = parties.filter(p => p.status === 'Active').length;
  const newInquiries = inquiries.filter(i => i.status === 'New').length;

  const kpis = [
    { label: 'Total Purchases', value: `₹${(totalPurchases/100000).toFixed(2)}L`, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Sales', value: `₹${(totalSales/100000).toFixed(2)}L`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Estimated Profit', value: `₹${(profit/100000).toFixed(2)}L`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Active Trips', value: activeFleet, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active Parties', value: activeParties, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'New Inquiries', value: newInquiries, icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const chartData = [
    { name: 'Mon', buy: 40000, sell: 45000 },
    { name: 'Tue', buy: 30000, sell: 38000 },
    { name: 'Wed', buy: 20000, sell: 25000 },
    { name: 'Thu', buy: 27800, sell: 39080 },
    { name: 'Fri', buy: 18900, sell: 48000 },
    { name: 'Sat', buy: 23900, sell: 38000 },
    { name: 'Sun', buy: 0, sell: 0 },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} mb-3 md:mb-4`}>
              <kpi.icon size={24} />
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-xl md:text-2xl font-black text-slate-800">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Buy vs Sell Chart */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <h3 className="font-bold text-slate-800">Buy vs Sell Trend</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-500">BUY</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-500">SELL</span>
              </div>
            </div>
          </div>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip />
                <Area type="monotone" dataKey="buy" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" />
                <Area type="monotone" dataKey="sell" stroke="#f97316" fillOpacity={0.1} fill="#f97316" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Performance */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <h3 className="font-bold text-slate-800">Profit Margin Trend</h3>
            <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded">Daily AVG: ₹12.5k</span>
          </div>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip />
                <Line type="monotone" dataKey={(v) => v.sell - v.buy} name="Profit" stroke="#f97316" strokeWidth={3} dot={{r: 4, fill: '#f97316'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Fleet Status */}
        <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Ongoing Fleet Trips</h3>
          <div className="space-y-5">
            {fleet.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No active trips</p>
            ) : (
              fleet.map(trip => (
                <div key={trip.id} className="flex items-center gap-4 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${trip.status === 'On the Way' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                    <Truck size={18} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{trip.vehicleNumber}</p>
                    <p className="text-slate-500 text-[10px] truncate">{trip.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1">{trip.status}</p>
                    <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{width: trip.status === 'Loading' ? '25%' : trip.status === 'On the Way' ? '60%' : '90%'}}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Recent Inquiries</h3>
          </div>
          <table className="w-full text-left min-w-[400px]">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                <th className="pb-4">Customer</th>
                <th className="pb-4">Product</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {inquiries.slice(0, 5).map(inquiry => (
                <tr key={inquiry.id} className="text-xs">
                  <td className="py-4 font-bold text-slate-800">{inquiry.clientName}</td>
                  <td className="py-4 text-slate-600">{inquiry.product}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${inquiry.status === 'New' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="py-4 text-right text-slate-400 font-mono">{new Date(inquiry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
