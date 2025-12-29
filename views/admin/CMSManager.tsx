
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { ScrapRate, WhyItem, StatItem, CMSConfig, Product, TeamMember, AdminUser } from '../../types';
import { 
  Plus, Trash2, MoveUp, MoveDown, Globe, Image as ImageIcon, 
  CheckCircle2, ShoppingBag, Upload, UserPlus, AlertCircle, 
  ShieldCheck, UserCheck, X, Navigation, Map, List, Layout, Users, TrendingUp 
} from 'lucide-react';

// Helper to bust browser cache for images that are URLs
const getBustedUrl = (url: string, version?: number) => {
  if (!url || !version || url.startsWith('data:')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}v=${version}`;
};

export const CMSManager: React.FC = () => {
  const { draftCms, setDraftCms, publishCms, changePassword, admins, addAdmin, updateAdminStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'General' | 'Images' | 'Why Us' | 'About Stats' | 'Team' | 'Rates' | 'Products' | 'Coverage' | 'Security'>('General');

  // Multi-Admin Form
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', username: '', password: '', confirm: '' });

  // Password Change Form
  const activeUser = localStorage.getItem('hari_active_user') || 'admin';
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [pwdStatus, setPwdStatus] = useState({ type: '', message: '' });

  const handleCmsChange = (key: keyof CMSConfig, value: any) => {
    setDraftCms({ ...draftCms, [key]: value, updatedAt: Date.now() });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, key: keyof CMSConfig) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleCmsChange(key, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleListItemImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: keyof CMSConfig, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const list = draftCms[key] as any[];
        // Determine which field name to use based on the item type
        const fieldName = (key === 'products' || key === 'benefits') ? 'imageUrl' : 'photoUrl';
        const newList = list.map((item: any) => item.id === id ? { ...item, [fieldName]: reader.result as string } : item);
        handleCmsChange(key, newList);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateListItem = <K extends keyof CMSConfig>(
    key: K,
    id: string,
    updates: CMSConfig[K] extends (infer U)[] ? Partial<U> : any
  ) => {
    const list = draftCms[key] as any[];
    const newList = list.map((item: any) => item.id === id ? { ...item, ...updates } : item);
    handleCmsChange(key, newList);
  };

  const deleteListItem = (key: keyof CMSConfig, id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const list = draftCms[key] as any[];
      handleCmsChange(key, list.filter(item => item.id !== id));
    }
  };

  const moveListItem = (key: keyof CMSConfig, index: number, direction: 'up' | 'down') => {
    const list = [...(draftCms[key] as any[])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < list.length) {
      [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
      handleCmsChange(key, list);
    }
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Product',
      description: '',
      imageUrl: 'https://via.placeholder.com/600x400'
    };
    handleCmsChange('products', [...draftCms.products, newProduct]);
  };

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Member',
      role: 'Staff',
      description: '',
      photoUrl: 'https://ui-avatars.com/api/?name=Team+Member',
      enabled: true,
      order: draftCms.team.length + 1
    };
    handleCmsChange('team', [...draftCms.team, newMember]);
  };

  const addRate = () => {
    const newRate: ScrapRate = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Scrap Item',
      rate: 0,
      unit: 'kg',
      enabled: true,
      order: draftCms.rates.length + 1
    };
    handleCmsChange('rates', [...draftCms.rates, newRate]);
  };

  const toggleAllRates = (enabled: boolean) => {
    const newList = draftCms.rates.map(r => ({ ...r, enabled }));
    handleCmsChange('rates', newList);
  };

  const addCoverageArea = () => {
    const area = prompt('Enter new coverage area name:');
    if (area && area.trim()) {
      handleCmsChange('coverageAreas', [...draftCms.coverageAreas, area.trim()]);
    }
  };

  const removeCoverageArea = (idx: number) => {
    handleCmsChange('coverageAreas', draftCms.coverageAreas.filter((_, i) => i !== idx));
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminForm.password !== adminForm.confirm) {
      alert('Passwords do not match');
      return;
    }
    addAdmin({
      name: adminForm.name,
      username: adminForm.username,
      passwordHash: adminForm.password,
      active: true
    });
    setIsAdminModalOpen(false);
    setAdminForm({ name: '', username: '', password: '', confirm: '' });
  };

  const handlePwdChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdStatus({ type: 'error', message: 'Confirm password does not match.' });
      return;
    }
    const res = changePassword(activeUser, pwdForm.current, pwdForm.next);
    if (res.success) {
      setPwdStatus({ type: 'success', message: res.message });
      setPwdForm({ current: '', next: '', confirm: '' });
    } else {
      setPwdStatus({ type: 'error', message: res.message });
    }
  };

  const isPublishDisabled = 
    !draftCms.founderName?.trim() || 
    !draftCms.coFounderName?.trim();

  const ImageUploader = ({ label, current, onUpload, id }: { label: string, current: string, onUpload: (e: any) => void, id: string }) => (
    <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border">
      <label className="text-xs font-black uppercase text-slate-400 block">{label}</label>
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border shadow-sm shrink-0">
          <img src={getBustedUrl(current, draftCms.updatedAt)} alt={label} className="w-full h-full object-cover" />
        </div>
        <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-4 cursor-pointer hover:border-orange-500 transition-colors bg-white">
          <Upload size={20} className="text-slate-400 mb-2" />
          <span className="text-[10px] font-bold text-slate-500">Click to Upload</span>
          <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      {/* Header / Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-3xl border shadow-sm sticky top-0 z-50">
        <div className="flex gap-1 p-1 bg-slate-200 rounded-2xl w-full lg:w-fit flex-wrap overflow-hidden">
          {['General', 'Images', 'Why Us', 'About Stats', 'Team', 'Rates', 'Products', 'Coverage', 'Security'].map((tab: any) => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab); setPwdStatus({ type: '', message: '' }); }}
              className={`flex-grow md:flex-none px-4 py-3 md:py-2 rounded-xl font-bold text-xs transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {isPublishDisabled && (
             <span className="w-full sm:w-auto text-[10px] font-bold text-rose-500 bg-rose-50 px-3 py-2 rounded-full border border-rose-100 flex items-center justify-center gap-1">
               <AlertCircle size={12} /> MANDATORY CONTENT MISSING
             </span>
          )}
          <button 
            onClick={publishCms}
            disabled={isPublishDisabled}
            className={`w-full sm:w-auto bg-orange-600 text-white px-8 py-3 rounded-xl font-black shadow-lg transition-all flex items-center justify-center gap-2 ${isPublishDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700'}`}
          >
            <Globe size={18} /> PUBLISH CHANGES
          </button>
        </div>
      </div>

      {/* General Section */}
      {activeTab === 'General' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border max-w-4xl space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 text-orange-600 mb-6">
            <Globe size={24} />
            <h3 className="text-xl font-bold">General Business Info</h3>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Company Name</label>
                <input value={draftCms.companyName} onChange={e => handleCmsChange('companyName', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Official Phone</label>
                <input value={draftCms.phone} onChange={e => handleCmsChange('phone', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Official Email</label>
                <input value={draftCms.email} onChange={e => handleCmsChange('email', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">WhatsApp Contact</label>
                <input value={draftCms.whatsapp} onChange={e => handleCmsChange('whatsapp', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Business Address</label>
                <textarea rows={3} value={draftCms.address} onChange={e => handleCmsChange('address', e.target.value)} className="w-full px-4 py-3 border rounded-xl font-bold bg-white outline-none focus:ring-2 focus:ring-orange-500"></textarea>
              </div>
            </div>

            <div className="pt-8 border-t space-y-12">
              <h3 className="text-lg font-bold text-slate-800">Leadership Details</h3>
              
              <div className="space-y-6 p-6 bg-slate-50 rounded-2xl border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h4 className="font-bold text-orange-600 text-sm uppercase">Founder</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[10px] font-black uppercase text-slate-400">Show Section</span>
                    <input type="checkbox" checked={draftCms.showFounder} onChange={e => handleCmsChange('showFounder', e.target.checked)} className="w-5 h-5 accent-orange-600" />
                  </label>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
                    <input value={draftCms.founderName} onChange={e => handleCmsChange('founderName', e.target.value)} className="w-full px-4 py-3 bg-white border rounded-xl font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Background Description</label>
                    <textarea rows={3} value={draftCms.founderDescription} onChange={e => handleCmsChange('founderDescription', e.target.value)} className="w-full px-4 py-3 border rounded-xl text-sm leading-relaxed bg-white outline-none"></textarea>
                  </div>
                </div>
              </div>

              {/* Founder 2 Section (Additional Founder) */}
              <div className="space-y-6 p-6 bg-slate-50 rounded-2xl border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h4 className="font-bold text-orange-600 text-sm uppercase">Additional Founder</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[10px] font-black uppercase text-slate-400">Show Section</span>
                    <input type="checkbox" checked={draftCms.showFounder2} onChange={e => handleCmsChange('showFounder2', e.target.checked)} className="w-5 h-5 accent-orange-600" />
                  </label>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
                    <input value={draftCms.founder2Name} onChange={e => handleCmsChange('founder2Name', e.target.value)} className="w-full px-4 py-3 bg-white border rounded-xl font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Founder Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border shrink-0">
                        <img src={getBustedUrl(draftCms.founder2PhotoUrl, draftCms.updatedAt)} className="w-full h-full object-cover" />
                      </div>
                      <label className="flex-grow flex items-center justify-center p-3 border-2 border-dashed rounded-xl bg-white cursor-pointer hover:border-orange-500">
                        <Upload size={16} className="text-slate-400 mr-2" />
                        <span className="text-[10px] font-bold">Change Photo</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'founder2PhotoUrl')} />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Description</label>
                    <textarea rows={3} value={draftCms.founder2Description} onChange={e => handleCmsChange('founder2Description', e.target.value)} className="w-full px-4 py-3 border rounded-xl text-sm leading-relaxed bg-white outline-none"></textarea>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 bg-slate-50 rounded-2xl border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h4 className="font-bold text-orange-600 text-sm uppercase">Co-Founder</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[10px] font-black uppercase text-slate-400">Show Section</span>
                    <input type="checkbox" checked={draftCms.showCoFounder} onChange={e => handleCmsChange('showCoFounder', e.target.checked)} className="w-5 h-5 accent-orange-600" />
                  </label>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
                    <input value={draftCms.coFounderName} onChange={e => handleCmsChange('coFounderName', e.target.value)} className="w-full px-4 py-3 bg-white border rounded-xl font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Visionary Bio</label>
                    <textarea rows={3} value={draftCms.coFounderDescription} onChange={e => handleCmsChange('coFounderDescription', e.target.value)} className="w-full px-4 py-3 border rounded-xl text-sm leading-relaxed bg-white outline-none"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Images Section */}
      {activeTab === 'Images' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border max-w-4xl space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 text-orange-600 mb-6">
            <ImageIcon size={24} />
            <h3 className="text-xl font-bold">Branding & Hero Images</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader label="Company Logo" current={draftCms.logoUrl} onUpload={(e) => handleFileUpload(e, 'logoUrl')} id="logo" />
            <ImageUploader label="Home Hero Image" current={draftCms.heroImageUrl} onUpload={(e) => handleFileUpload(e, 'heroImageUrl')} id="hero" />
            <ImageUploader label="About Page Hero" current={draftCms.aboutHeroImageUrl} onUpload={(e) => handleFileUpload(e, 'aboutHeroImageUrl')} id="about-hero" />
            <ImageUploader label="Founder Photo" current={draftCms.founderPhotoUrl} onUpload={(e) => handleFileUpload(e, 'founderPhotoUrl')} id="founder" />
            <ImageUploader label="Co-Founder Photo" current={draftCms.coFounderPhotoUrl} onUpload={(e) => handleFileUpload(e, 'coFounderPhotoUrl')} id="cofounder" />
          </div>
        </div>
      )}

      {/* Why Us Section */}
      {activeTab === 'Why Us' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border max-w-4xl space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 text-orange-600 mb-6">
            <CheckCircle2 size={24} />
            <h3 className="text-xl font-bold">Why Choose Us Benefits</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b pb-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400">Page Title</label>
              <input value={draftCms.whyPageTitle} onChange={e => handleCmsChange('whyPageTitle', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400">Section Heading</label>
              <input value={draftCms.whyHeading} onChange={e => handleCmsChange('whyHeading', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
            </div>
          </div>
          <div className="space-y-4">
            {draftCms.benefits.map((benefit, idx) => (
              <div key={benefit.id} className="p-6 bg-slate-50 rounded-2xl border flex flex-col sm:flex-row gap-6">
                <div className="w-20 h-20 bg-white rounded-xl border flex items-center justify-center shrink-0 relative group/img overflow-hidden">
                  <img src={getBustedUrl(benefit.imageUrl, draftCms.updatedAt)} className="w-full h-full object-cover rounded-xl" />
                  <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Upload size={16} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleListItemImageUpload(e, 'benefits', benefit.id)} />
                  </label>
                </div>
                <div className="flex-grow space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input placeholder="Benefit Title" value={benefit.title} onChange={e => updateListItem('benefits', benefit.id, { title: e.target.value })} className="px-4 py-2 border rounded-xl font-bold text-sm" />
                    <input placeholder="Icon (Lucide Name)" value={benefit.icon} onChange={e => updateListItem('benefits', benefit.id, { icon: e.target.value })} className="px-4 py-2 border rounded-xl text-sm" />
                  </div>
                  <textarea placeholder="Description" value={benefit.desc} onChange={e => updateListItem('benefits', benefit.id, { desc: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-sm bg-white"></textarea>
                </div>
                <div className="flex flex-row sm:flex-col gap-2">
                  <button onClick={() => moveListItem('benefits', idx, 'up')} className="p-2 bg-white border rounded-lg hover:text-orange-600"><MoveUp size={16} /></button>
                  <button onClick={() => moveListItem('benefits', idx, 'down')} className="p-2 bg-white border rounded-lg hover:text-orange-600"><MoveDown size={16} /></button>
                  <button onClick={() => deleteListItem('benefits', benefit.id)} className="p-2 bg-white border rounded-lg text-rose-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Stats Section */}
      {activeTab === 'About Stats' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border max-w-4xl space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 text-orange-600 mb-6">
            <List size={24} />
            <h3 className="text-xl font-bold">About Page Statistics</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {draftCms.aboutStats.map((stat) => (
              <div key={stat.id} className="p-4 bg-slate-50 rounded-2xl border flex gap-4 items-end">
                <div className="flex-grow space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Stat Label</label>
                  <input value={stat.label} onChange={e => updateListItem('aboutStats', stat.id, { label: e.target.value })} className="w-full px-4 py-2 bg-white border rounded-xl font-bold text-sm" />
                </div>
                <div className="w-24 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Value</label>
                  <input value={stat.val} onChange={e => updateListItem('aboutStats', stat.id, { val: e.target.value })} className="w-full px-4 py-2 bg-white border rounded-xl font-black text-sm text-center" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Section */}
      {activeTab === 'Team' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border max-w-4xl space-y-8 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3 text-orange-600">
              <Users size={24} />
              <h3 className="text-xl font-bold">Team Members</h3>
            </div>
            <button onClick={addTeamMember} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"><Plus size={16} /> ADD MEMBER</button>
          </div>
          <div className="space-y-4">
            {draftCms.team.map((member, idx) => (
              <div key={member.id} className="p-6 bg-slate-50 rounded-2xl border flex flex-col sm:flex-row gap-6">
                <div className="w-20 h-20 bg-white rounded-xl border flex items-center justify-center shrink-0 relative group/img overflow-hidden">
                  <img src={getBustedUrl(member.photoUrl, draftCms.updatedAt)} className="w-full h-full object-cover rounded-xl" />
                  <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Upload size={16} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleListItemImageUpload(e, 'team', member.id)} />
                  </label>
                </div>
                <div className="flex-grow space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input placeholder="Member Name" value={member.name} onChange={e => updateListItem('team', member.id, { name: e.target.value })} className="px-4 py-2 border rounded-xl font-bold text-sm" />
                    <input placeholder="Role" value={member.role} onChange={e => updateListItem('team', member.id, { role: e.target.value })} className="px-4 py-2 border rounded-xl text-sm" />
                  </div>
                  <textarea placeholder="Bio" value={member.description} onChange={e => updateListItem('team', member.id, { description: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-sm bg-white"></textarea>
                </div>
                <div className="flex flex-row sm:flex-col gap-2">
                  <button onClick={() => moveListItem('team', idx, 'up')} className="p-2 bg-white border rounded-lg hover:text-orange-600"><MoveUp size={16} /></button>
                  <button onClick={() => deleteListItem('team', member.id)} className="p-2 bg-white border rounded-lg text-rose-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scrap Rates Section */}
      {activeTab === 'Rates' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border max-w-4xl space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3 text-orange-600">
              <TrendingUp size={24} />
              <h3 className="text-xl font-bold">Real-time Scrap Rates</h3>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={() => toggleAllRates(true)} className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[10px] font-black rounded-xl">SELECT ALL</button>
              <button onClick={() => toggleAllRates(false)} className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[10px] font-black rounded-xl">DESELECT ALL</button>
              <button onClick={addRate} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"><Plus size={16} /> ADD RATE</button>
            </div>
          </div>
          <div className="space-y-3">
            {draftCms.rates.map((rate, idx) => (
              <div key={rate.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border">
                <div className="w-full sm:w-auto flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={rate.enabled} 
                    onChange={e => updateListItem('rates', rate.id, { enabled: e.target.checked })} 
                    className="w-5 h-5 accent-orange-600 shrink-0"
                  />
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-xs text-slate-400 shrink-0">{idx + 1}</div>
                  <input value={rate.name} onChange={e => updateListItem('rates', rate.id, { name: e.target.value })} className="flex-grow px-4 py-2 border rounded-xl font-bold text-sm" />
                </div>
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400">₹</span>
                    <input type="number" step="0.01" value={rate.rate} onChange={e => updateListItem('rates', rate.id, { rate: parseFloat(e.target.value) })} className="w-24 px-4 py-2 border rounded-xl font-black text-sm text-center" />
                    <span className="text-xs font-black text-slate-400 whitespace-nowrap">/ {rate.unit}</span>
                  </div>
                  <button onClick={() => deleteListItem('rates', rate.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Section */}
      {activeTab === 'Products' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border max-w-4xl space-y-8 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3 text-orange-600">
              <ShoppingBag size={24} />
              <h3 className="text-xl font-bold">Products & Services</h3>
            </div>
            <button onClick={addProduct} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"><Plus size={16} /> ADD PRODUCT</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {draftCms.products.map((product) => (
              <div key={product.id} className="p-6 bg-slate-50 rounded-2xl border space-y-4">
                <div className="h-40 bg-white rounded-xl border overflow-hidden relative group/prod-img">
                  <img src={getBustedUrl(product.imageUrl, draftCms.updatedAt)} className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/prod-img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Upload size={20} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleListItemImageUpload(e, 'products', product.id)} />
                  </label>
                </div>
                <input placeholder="Product Name" value={product.name} onChange={e => updateListItem('products', product.id, { name: e.target.value })} className="w-full px-4 py-2 border rounded-xl font-bold text-sm" />
                <textarea placeholder="Description" rows={3} value={product.description} onChange={e => updateListItem('products', product.id, { description: e.target.value })} className="w-full px-4 py-2 border rounded-xl text-sm bg-white"></textarea>
                <div className="flex justify-between items-center">
                   <button onClick={() => deleteListItem('products', product.id)} className="text-xs font-bold text-rose-500 hover:underline">Remove Product</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coverage Section */}
      {activeTab === 'Coverage' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border max-w-4xl space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 text-orange-600 mb-6">
            <Map size={24} />
            <h3 className="text-xl font-bold">Operational Coverage Settings</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border">
              <label className="text-sm font-bold text-slate-700 flex-grow">Display Coverage Section on Website</label>
              <input type="checkbox" checked={draftCms.showCoverageSection} onChange={e => handleCmsChange('showCoverageSection', e.target.checked)} className="w-6 h-6 accent-orange-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Section Label</label>
                <input value={draftCms.coverageLabel} onChange={e => handleCmsChange('coverageLabel', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Section Heading</label>
                <input value={draftCms.coverageHeading} onChange={e => handleCmsChange('coverageHeading', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Section Description</label>
                <textarea rows={3} value={draftCms.coverageDescription} onChange={e => handleCmsChange('coverageDescription', e.target.value)} className="w-full px-4 py-3 border rounded-xl font-bold bg-white outline-none"></textarea>
              </div>
            </div>

            <div className="pt-6 border-t space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-800">Coverage Areas</h4>
                <button onClick={addCoverageArea} className="text-orange-600 text-xs font-black uppercase hover:underline flex items-center gap-1"><Plus size={14} /> Add Area</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {draftCms.coverageAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                    <span className="text-sm font-bold text-slate-700">{area}</span>
                    <button onClick={() => removeCoverageArea(idx)} className="text-slate-400 hover:text-rose-500"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Dashboard: Active Vehicles</label>
                  <input type="number" value={draftCms.activeVehicles} onChange={e => handleCmsChange('activeVehicles', parseInt(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Dashboard: Efficiency (%)</label>
                  <input type="number" value={draftCms.operationalEfficiency} onChange={e => handleCmsChange('operationalEfficiency', parseInt(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Section */}
      {activeTab === 'Security' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* User Management */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border flex-grow space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 text-slate-800">
                  <UserCheck size={24} className="text-orange-600" />
                  <h3 className="text-xl font-bold">Admin Management</h3>
                </div>
                <button onClick={() => setIsAdminModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">
                  <Plus size={16} /> CREATE ADMIN
                </button>
              </div>

              <div className="space-y-3">
                {admins.map(admin => (
                  <div key={admin.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-2xl border gap-4">
                    <div className="text-center sm:text-left">
                      <p className="font-bold text-slate-800">{admin.name}</p>
                      <p className="text-xs text-slate-400">@{admin.username}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border">
                        <span className={`text-[10px] font-black uppercase ${admin.active ? 'text-green-600' : 'text-slate-400'}`}>{admin.active ? 'Active' : 'Inactive'}</span>
                        <input 
                          type="checkbox" 
                          checked={admin.active} 
                          onChange={e => updateAdminStatus(admin.id, e.target.checked)}
                          className="w-5 h-5 accent-orange-600" 
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border max-w-full lg:max-w-md w-full space-y-6">
              <div className="flex items-center gap-3 text-orange-600">
                <ShieldCheck size={24} />
                <h3 className="text-xl font-bold">Security Update</h3>
              </div>
              
              <form onSubmit={handlePwdChangeSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Current Password</label>
                  <input required type="password" value={pwdForm.current} onChange={e => setPwdForm({...pwdForm, current: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">New Password</label>
                  <input required type="password" value={pwdForm.next} onChange={e => setPwdForm({...pwdForm, next: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Confirm New Password</label>
                  <input required type="password" value={pwdForm.confirm} onChange={e => setPwdForm({...pwdForm, confirm: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                {pwdStatus.message && (
                  <div className={`p-3 rounded-lg text-xs font-bold ${pwdStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'}`}>
                    {pwdStatus.message}
                  </div>
                )}
                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all uppercase tracking-widest text-xs">
                  Update Security Access
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
               <h3 className="font-bold uppercase tracking-tight">Create ERP User</h3>
               <button onClick={() => setIsAdminModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddAdmin} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
                <input required value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Username</label>
                <input required value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Password</label>
                <input required type="password" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Confirm Password</label>
                <input required type="password" value={adminForm.confirm} onChange={e => setAdminForm({...adminForm, confirm: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
              </div>
              <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-900/20">CREATE ACCOUNT</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
