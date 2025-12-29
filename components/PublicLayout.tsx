
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';

export const PublicLayout: React.FC = () => {
  const { cms } = useApp();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeRates = (cms.rates || []).filter(r => r.enabled).sort((a, b) => a.order - b.order);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About Us' },
    { path: '/why-choose-us', label: 'Why Choose Us' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Price Ticker */}
      <div className="bg-slate-900 text-white overflow-x-auto md:overflow-hidden py-2 text-sm border-b border-slate-700 ticker-container scrollbar-hide">
        <div className="ticker-animate flex gap-12 min-w-max md:min-w-0">
          {/* Repeat twice for seamless infinite scroll on desktop, while allowing manual scroll on mobile */}
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <span className="text-orange-400 font-bold px-4">LATEST SCRAP RATES:</span>
              {activeRates.map(rate => (
                <div key={rate.id} className="flex items-center gap-2 whitespace-nowrap px-4 border-r border-slate-700 last:border-0">
                  <span className="font-semibold text-slate-100">{rate.name}:</span>
                  <span className="text-green-400 font-mono">₹{rate.rate.toFixed(2)}/{rate.unit}</span>
                </div>
              ))}
              <span className="text-slate-400 italic px-4">
                Rates are subject to market volatility. Confirm before final transaction.
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[60] bg-white/95 backdrop-blur-md shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
            <img src={cms.logoUrl} alt="Logo" className="h-12 w-12 object-cover rounded-lg shadow-sm" />
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 uppercase">
              {cms.companyName}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`${location.pathname === link.path ? 'text-orange-600' : 'text-slate-600'} hover:text-orange-600 transition-colors`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/admin" className="px-4 py-2 bg-slate-100 rounded-full text-slate-700 hover:bg-slate-200 text-sm font-bold">ERP Login</Link>
          </nav>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center relative z-[70] transition-colors"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl text-slate-900`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden fixed inset-0 top-0 left-0 w-full h-screen bg-white transition-transform duration-300 ease-in-out z-[65] ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
        >
          <nav className="flex flex-col items-center justify-center h-full space-y-8 px-6 pt-20">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-black uppercase tracking-tight ${location.pathname === link.path ? 'text-orange-600' : 'text-slate-900'} hover:text-orange-600 transition-colors`}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              to="/admin" 
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl"
            >
              ERP Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={cms.logoUrl} alt="Logo" className="h-10 w-10 object-cover rounded" />
              <span className="font-bold text-xl">{cms.companyName}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Leading scrap trading company in Coimbatore, specialized in MS heavy scrap, factory disposal, and industrial dismantling.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-slate-200">Quick Links</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><Link to="/" className="hover:text-orange-500">Home</Link></li>
              <li><Link to="/products" className="hover:text-orange-500">Products & Services</Link></li>
              <li><Link to="/about" className="hover:text-orange-500">Company Overview</Link></li>
              <li><Link to="/why-choose-us" className="hover:text-orange-500">Why Choose Us</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500">Inquire Now</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-200">Business Hours</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>Mon - Sat: 9:00 AM - 8:00 PM</li>
              <li>Sunday: Holiday</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-200">Contact Details</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex gap-3">
                <i className="fas fa-map-marker-alt text-orange-500 mt-1"></i>
                <span>{cms.address}</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-phone text-orange-500 mt-1"></i>
                <span>{cms.phone}</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-envelope text-orange-500 mt-1"></i>
                <span>{cms.email}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-slate-500 text-xs">
          © {new Date().getFullYear()} Hari Iron Traders. All Rights Reserved.
        </div>
      </footer>

      {/* Sticky Call Buttons (Mobile) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40 md:hidden">
        <a href={`tel:${cms.phone}`} className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
          <i className="fas fa-phone text-xl"></i>
        </a>
        <a href={`https://wa.me/${cms.whatsapp.replace(/\D/g,'')}`} className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl">
          <i className="fab fa-whatsapp text-2xl"></i>
        </a>
      </div>
    </div>
  );
};
