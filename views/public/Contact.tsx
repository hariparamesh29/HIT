
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const { cms, addInquiry } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    product: 'MS Heavy Scrap',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      clientName: formData.name,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      product: formData.product,
      message: formData.message,
      source: 'Website Contact Form'
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', phone: '', whatsapp: '', product: 'MS Heavy Scrap', message: '' });
  };

  return (
    <div className="pb-24">
      <div className="bg-slate-900 py-24 text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-black mb-6">Contact Us</h1>
          <p className="text-slate-400 text-xl">We respond to all inquiries within 2 business hours.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="bg-white p-10 rounded-3xl shadow-xl space-y-12">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Phone className="text-orange-600" /> Phone & Support
            </h3>
            <p className="text-slate-600 font-medium mb-1">Direct Call:</p>
            <p className="text-2xl font-bold text-slate-900">{cms.phone}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Mail className="text-orange-600" /> Email Inquiry
            </h3>
            <p className="text-slate-600 font-medium mb-1">Send your details to:</p>
            <p className="text-xl font-bold text-slate-900 break-all">{cms.email}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="text-orange-600" /> Head Office
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {cms.address}
            </p>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-xl">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Send size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Thank you!</h3>
              <p className="text-slate-500">Your inquiry has been stored in our system. Our executive will call you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number</label>
                  <input type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Product Interested</label>
                  <select value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
                    <option>MS Heavy Scrap</option>
                    <option>MS Light Scrap</option>
                    <option>Structural Scrap</option>
                    <option>Iron Scrap</option>
                    <option>Factory Disposal</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Message</label>
                <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Details about quantity, location etc."></textarea>
              </div>
              <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/20">
                SEND INQUIRY NOW
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125322.4417311314!2d76.88483256562499!3d11.012111100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2d6051f15ed948ad!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1714000000000!5m2!1sen!2sin" 
            width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </section>
    </div>
  );
};
