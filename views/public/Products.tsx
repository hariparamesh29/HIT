
import React from 'react';
import { useApp } from '../../AppContext';
import { ShoppingCart } from 'lucide-react';

// Helper to bust browser cache
const getBustedUrl = (url: string, version?: number) => {
  if (!url || !version || url.startsWith('data:')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}v=${version}`;
};

export const Products: React.FC = () => {
  const { cms } = useApp();

  const handleInquiry = (productName: string) => {
    const msg = encodeURIComponent(`Hi Hari Iron Traders, I am interested in inquiring about ${productName}. Please share the current rates.`);
    window.open(`https://wa.me/${cms.whatsapp.replace(/\D/g,'')}?text=${msg}`, '_blank');
  };

  return (
    <div className="pb-24">
      <div className="bg-slate-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-6">Industrial Catalog</h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">We provide comprehensive metal recycling solutions and professional factory disposal services across Tamil Nadu.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cms.products.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-slate-100">
              <div className="h-72 overflow-hidden relative">
                <img src={getBustedUrl(product.imageUrl, cms.updatedAt)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                <div className="absolute top-4 right-4 bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">Available</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black text-slate-900 mb-4">{product.name}</h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-sm line-clamp-3">{product.description}</p>
                <button 
                  onClick={() => handleInquiry(product.name)}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors shadow-lg"
                >
                  <ShoppingCart size={18} />
                  INQUIRE VIA WHATSAPP
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
