
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Truck, 
  BookOpen, 
  Settings, 
  LogOut,
  Send,
  BarChart3,
  ExternalLink,
  Menu,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../AppContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cms, logout, toast } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSidebarOpen]);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
    { path: '/admin/parties', icon: Users, label: 'Parties' },
    { path: '/admin/fleet', icon: Truck, label: 'Fleet Tracker' },
    { path: '/admin/ledger', icon: BookOpen, label: 'Trade Ledger' },
    { path: '/admin/whatsapp', icon: Send, label: 'WA Broadcast' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/admin/cms', icon: Settings, label: 'Settings / CMS' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-x-hidden">
      {/* Toast Notification */}
      {toast.message && (
        <div className={`fixed top-6 right-6 z-[1000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 ${
          toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-rose-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="text-green-400" size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm tracking-tight">{toast.message}</span>
        </div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-[100] shadow-md">
        <div className="flex items-center gap-3">
          <img src={cms.logoUrl} alt="Logo" className="w-8 h-8 rounded" />
          <span className="font-bold tracking-tight">HARI ERP</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-slate-800 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay Backdrop for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-slate-900 text-white fixed h-full flex flex-col z-[90] transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-3">
          <img src={cms.logoUrl} alt="Logo" className="w-8 h-8 rounded" />
          <span className="font-bold tracking-tight text-lg">HARI ERP</span>
        </div>

        <nav className="flex-grow p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
            <ExternalLink size={20} />
            <span className="font-medium">View Website</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow md:ml-64 min-h-screen relative">
        {/* Top Desktop Header */}
        <header className="hidden md:flex justify-between items-center p-8 bg-white border-b sticky top-0 z-40">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {menuItems.find(i => i.path === location.pathname)?.label || 'Admin Panel'}
            </h2>
            <p className="text-slate-500 text-sm">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 p-2 rounded-lg border flex items-center gap-3">
              <span className="text-sm font-medium px-2 py-1 bg-green-100 text-green-700 rounded-md">Live</span>
              <span className="text-xs text-slate-500 font-mono">{new Date().toLocaleDateString('en-IN')}</span>
            </div>
            <img src={`https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Avatar" />
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
