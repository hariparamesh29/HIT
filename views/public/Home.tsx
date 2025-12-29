
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../AppContext';
import { Phone, ArrowRight, Factory, Truck, Weight, ClipboardCheck, BadgeCheck, Zap, CheckCircle2, Navigation, Activity } from 'lucide-react';

// Helper to bust browser cache
const getBustedUrl = (url: string, version?: number) => {
  if (!url || !version || url.startsWith('data:')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}v=${version}`;
};

export const Home: React.FC = () => {
  const { cms } = useApp();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={getBustedUrl(cms.heroImageUrl, cms.updatedAt)} className="w-full h-full object-cover" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl space-y-8 animate-in slide-in-from-bottom duration-700">
            <div className="inline-block px-4 py-1 bg-orange-600 text-white text-xs font-bold uppercase tracking-widest rounded">
              Est. Since 1999
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Reliable <span className="text-orange-500">Iron & Steel</span> Scrap Trading in Coimbatore
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              We provide the most competitive rates and professional factory disposal services. Trusted by 500+ industrial partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`tel:${cms.phone}`} className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-xl shadow-orange-900/40">
                <Phone size={20} />
                CALL NOW
              </a>
              <a href={`https://wa.me/${cms.whatsapp.replace(/\D/g,'')}`} className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-xl shadow-green-900/40">
                <i className="fab fa-whatsapp text-xl"></i>
                WHATSAPP US
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white">
        {/* 1) PRODUCTS SECTION */}
        <section className="py-24 bg-[#F7F8FA] border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <p className="text-orange-600 font-black tracking-widest text-[10px] mb-4 uppercase">OUR CORE SERVICES</p>
                <h2 className="text-4xl font-black text-[#1F2937] mb-6">Iron & Steel Scraps We Trade</h2>
                <p className="text-lg text-[#4B5563] leading-relaxed max-w-xl">
                  We specialize in sourcing, processing, and trading industrial scrap
                  from factories, demolition sites, and fabrication units with strict
                  quality grading and transparent pricing.
                </p>
              </div>
              <Link to="/products" className="flex items-center gap-2 text-slate-400 hover:text-orange-600 font-bold transition-colors shrink-0 mb-2 group">
                VIEW ALL PRODUCTS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {cms.products.slice(0, 3).map((product) => (
                <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:border-orange-200 transition-all duration-500 border border-slate-100 hover:-translate-y-2">
                  <div className="h-72 overflow-hidden relative">
                    <img src={getBustedUrl(product.imageUrl, cms.updatedAt)} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                      <Link to="/contact" className="w-full bg-white text-slate-900 py-3 rounded-xl font-black uppercase text-xs tracking-widest text-center hover:bg-orange-600 hover:text-white transition-colors">Inquire Now</Link>
                    </div>
                  </div>
                  <div className="p-8 bg-white">
                    <h4 className="text-2xl font-black text-[#1F2937] mb-4">{product.name}</h4>
                    <p className="text-[#4B5563] text-sm leading-relaxed line-clamp-2">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2) TRUST BLOCK */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-[#F4F6F8] border border-[#E1E5EA] rounded-[2.5rem] p-12 md:p-16 shadow-[0_6px_18px_rgba(0,0,0,0.04)] text-center">
              <h3 className="text-4xl font-black text-[#1F2937] tracking-tight mb-8">Trusted Scrap Trading Partner in Coimbatore</h3>
              <p className="text-xl text-[#4B5563] leading-relaxed max-w-3xl mx-auto mb-12">
                With decades of experience, Hari Iron Traders is trusted by
                manufacturers, builders, and recyclers for reliable scrap solutions
                backed by professional logistics and responsible recycling practices.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { label: "Licensed Scrap Dealer", icon: BadgeCheck },
                  { label: "Transparent Pricing", icon: Zap },
                  { label: "Own Fleet & Godown", icon: Factory }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-100 rounded-full font-bold text-[#1F2937] shadow-sm">
                    <item.icon className="text-orange-600" size={20} />
                    <span className="text-sm whitespace-nowrap">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3) HOW WE WORK */}
        <section className="py-24 bg-gradient-to-b from-white to-[#F6F7F9]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-20">
              <p className="text-slate-400 font-black tracking-widest text-[10px] mb-4 uppercase">OPERATIONAL EXCELLENCE</p>
              <h3 className="text-4xl font-black text-[#1F2937]">How We Work</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
              {[
                { 
                  title: "Scrap Evaluation", 
                  desc: "Material assessment based on grade and industrial type.", 
                  icon: ClipboardCheck 
                },
                { 
                  title: "Price Confirmation", 
                  desc: "Transparent quotes aligned with real-time market rates.", 
                  icon: Weight 
                },
                { 
                  title: "Scheduled Pickup", 
                  desc: "Hassle-free removal using our dedicated transport fleet.", 
                  icon: Truck 
                },
                { 
                  title: "Digital Weighment", 
                  desc: "Accurate and reliable weight measurement on-site.", 
                  icon: Factory 
                },
                { 
                  title: "Prompt Settlement", 
                  desc: "Immediate payment processing for cleared material.", 
                  icon: CheckCircle2 
                }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-start space-y-6 group p-6 rounded-3xl border border-transparent bg-white/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-t-4 hover:border-t-orange-500 hover:bg-white shadow-sm">
                  <div className="w-14 h-14 text-slate-400 flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all duration-300">
                    <step.icon size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-[#1F2937] mb-3 text-lg">{i + 1}. {step.title}</h4>
                    <p className="text-sm text-[#4B5563] leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4) OPERATIONAL COVERAGE DASHBOARD */}
        {cms.showCoverageSection && (
          <section className="py-24 bg-[#F7F8FA] border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Side: Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-orange-600 font-black tracking-widest text-[10px] uppercase">{cms.coverageLabel}</p>
                  <h2 className="text-4xl font-black text-[#1F2937] leading-tight">{cms.coverageHeading}</h2>
                  <p className="text-lg text-[#4B5563] leading-relaxed">
                    {cms.coverageDescription}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {cms.coverageAreas.map((area, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                      <span className="font-bold text-sm tracking-tight">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Dashboard Card */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm hover:shadow-lg transition-all duration-500 group">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
                    </div>
                    <span className="text-xs font-black uppercase text-slate-900 tracking-widest">Live Tracking</span>
                  </div>
                  <Activity size={24} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                </div>

                <div className="space-y-10">
                  {/* Metric 1 */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-sm font-bold text-slate-500">Active Vehicles</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">{cms.activeVehicles} Active</p>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${(cms.activeVehicles / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-sm font-bold text-slate-500">Operational Efficiency</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">{cms.operationalEfficiency}%</p>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${cms.operationalEfficiency}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center gap-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <Truck size={16} /> Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5) TEXT RHYTHM & EMPHASIS */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-3xl font-medium text-slate-500 leading-relaxed max-w-4xl mx-auto italic">
              "Serving industries across Coimbatore with consistency, integrity, and operational efficiency."
            </p>
          </div>
        </section>

        {/* 6) CTA SECTION */}
        <section className="max-w-5xl mx-auto px-4 pb-24">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[3rem] p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-orange-900/30">
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h3 className="text-4xl font-black mb-6 leading-tight">Ready to clear your factory scrap?</h3>
              <p className="text-orange-100 text-xl font-medium">
                Get competitive pricing, reliable pickup, and professional service.
              </p>
            </div>
            <div className="relative z-10 flex flex-shrink-0">
              <Link to="/contact" className="bg-white text-orange-600 px-12 py-6 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl hover:bg-slate-50 hover:scale-105 hover:shadow-orange-400/50 transition-all duration-300 group">
                <span className="group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.4)] transition-all">INQUIRE NOW</span>
              </Link>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-900/10 rounded-full translate-y-1/2 -translate-x-1/3"></div>
          </div>
        </section>
      </div>
    </div>
  );
};
