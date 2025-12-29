
import React from 'react';
import { useApp } from '../../AppContext';

// Helper to bust browser cache
const getBustedUrl = (url: string, version?: number) => {
  if (!url || !version || url.startsWith('data:')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}v=${version}`;
};

export const About: React.FC = () => {
  const { cms } = useApp();

  return (
    <div className="pb-24">
      {/* About Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <img src={getBustedUrl(cms.aboutHeroImageUrl, cms.updatedAt)} className="absolute inset-0 w-full h-full object-cover" alt="About" />
        <div className="absolute inset-0 bg-slate-900/70"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-white">
          <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter animate-in slide-in-from-left duration-700">About Our Legacy</h1>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
            From a small yard in Pollachi to a leading trading house in Coimbatore, we have defined excellence in scrap management for over two decades.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {cms.aboutStats.filter(s => s.enabled).map((stat) => (
            <div key={stat.id} className="bg-slate-50 p-10 rounded-3xl text-center border shadow-sm hover:-translate-y-2 hover:shadow-xl hover:bg-white transition-all duration-300">
              <div className="text-5xl font-black text-slate-900 mb-2">{stat.val}</div>
              <div className="text-orange-600 font-bold tracking-widest uppercase text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="max-w-7xl mx-auto px-4 py-24 space-y-32">
        {/* Founder 1 */}
        {cms.showFounder && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-orange-600 font-black text-sm tracking-[0.3em] uppercase">MEET OUR FOUNDER</h2>
              <h3 className="text-4xl font-extrabold text-slate-900">{cms.founderName}</h3>
              <p className="text-slate-600 text-lg leading-relaxed italic">
                "We don't just trade scrap; we provide circular economy solutions for the heavy industrial sector of Coimbatore. Our reputation is built on the scale and the handshake."
              </p>
              {cms.showFounderDesc && (
                <p className="text-slate-600 leading-relaxed">
                  {cms.founderDescription}
                </p>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-orange-600 rounded-3xl translate-x-4 translate-y-4 -z-10 opacity-20"></div>
              <img src={getBustedUrl(cms.founderPhotoUrl, cms.updatedAt)} className="w-full aspect-[4/5] object-cover rounded-3xl shadow-2xl" alt="Founder" />
            </div>
          </div>
        )}

        {/* Co-Founder */}
        {cms.showCoFounder && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-slate-900 rounded-3xl translate-x-4 translate-y-4 -z-10 opacity-10"></div>
              <img src={getBustedUrl(cms.coFounderPhotoUrl, cms.updatedAt)} className="w-full aspect-[4/5] object-cover rounded-3xl shadow-2xl" alt="Co-Founder" />
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-slate-500 font-black text-sm tracking-[0.3em] uppercase">THE FUTURE VISION</h2>
              <h3 className="text-4xl font-extrabold text-slate-900">{cms.coFounderName}</h3>
              {cms.showCoFounderDesc && (
                <p className="text-slate-600 text-lg leading-relaxed">
                  {cms.coFounderDescription}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Founder 2 (Optional) */}
        {cms.showFounder2 && cms.founder2Name && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-orange-600 rounded-3xl -translate-x-4 translate-y-4 -z-10 opacity-20"></div>
              <img src={getBustedUrl(cms.founder2PhotoUrl, cms.updatedAt)} className="w-full aspect-[4/5] object-cover rounded-3xl shadow-2xl" alt="Joint Founder" />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-orange-600 font-black text-sm tracking-[0.3em] uppercase">OUR JOINT FOUNDER</h2>
              <h3 className="text-4xl font-extrabold text-slate-900">{cms.founder2Name}</h3>
              {cms.showFounder2Desc && (
                <p className="text-slate-600 text-lg leading-relaxed">
                  {cms.founder2Description}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Team Section */}
      {cms.team && cms.team.filter(m => m.enabled).length > 0 && (
        <section className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-orange-600 font-black text-sm tracking-[0.3em] uppercase mb-4">OUR POWERFUL TEAM</h2>
              <h3 className="text-4xl font-extrabold text-slate-900">The Faces Behind Efficiency</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {cms.team.filter(m => m.enabled).sort((a, b) => a.order - b.order).map((member) => (
                <div key={member.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                    <img src={getBustedUrl(member.photoUrl, cms.updatedAt)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={member.name} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">{member.name}</h4>
                  <p className="text-orange-600 font-black text-[10px] uppercase tracking-widest mb-4">{member.role}</p>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
