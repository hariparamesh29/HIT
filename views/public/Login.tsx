
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../AppContext';
import { Lock, User, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, cms } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/admin');
    } else {
      setError('Invalid credentials or inactive account. Access restricted.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-orange-600 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <img src={cms.logoUrl} alt="Logo" className="w-14 h-14 object-cover rounded" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">{cms.companyName}</h1>
          <p className="text-orange-100 font-bold text-sm mt-1">ERP SECURE GATEWAY</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Username / Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  placeholder="admin"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-100 animate-in shake duration-300">
              <AlertCircle size={20} />
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest">
            Authorize & Access
          </button>
          
          <div className="text-center">
            <button onClick={() => navigate('/')} className="text-xs font-bold text-slate-400 hover:text-orange-600 transition-colors">
              &larr; Return to Website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
