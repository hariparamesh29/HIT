
import React from 'react';
import { useApp } from '../../AppContext';
import { Factory, Weight, Truck, CheckCircle2 } from 'lucide-react';

// Helper to bust browser cache
const getBustedUrl = (url: string, version?: number) => {
  if (!url || !version || url.startsWith('data:')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}v=${version}`;
};

export const WhyChooseUs: React.FC = () => {
  const { cms } = useApp();

  const IconMap: Record<string, any> = {
    Factory: Factory,
    Weight: Weight,
    Truck: Truck,
    CheckCircle2: CheckCircle2
  };

  return (
    <div className="pb-24">
      {/* Page Header */}
      <div className="bg-slate-900 py-24 text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter">{cms.whyPageTitle}</h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">{cms.whyPageDescription}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {cms.benefits.filter(b => b.enabled).map((benefit) => {
            const Icon = IconMap[benefit.icon] || CheckCircle2;
            return (
              <div key={benefit.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
                <div className="h-64 overflow-hidden relative">
                  <img src={getBustedUrl(benefit.imageUrl, cms.updatedAt)} alt={benefit.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 right-6 p-4 bg-orange-600 text-white rounded-2xl shadow-xl">
                    <Icon size={32} />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-4">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Quote */}
      <div className="max-w-4xl mx-auto px-4 text-center mt-12">
        <div className="p-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
           <p className="text-2xl font-bold text-slate-800 italic">"Trust is the hardest metal to forge, but once formed, it never rusts."</p>
           <p className="mt-4 text-orange-600 font-black uppercase tracking-widest text-sm">- Hari Iron Traders philosophy</p>
        </div>
      </div>
    </div>
  );
};
