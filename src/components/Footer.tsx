import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  ShieldCheck, 
  Heart,
  Truck, 
  RotateCcw, 
  Clock,
  ArrowRight, 
  Sparkles,
  MapPin,
  Banknote
} from 'lucide-react';
import { PolicyModal, type PolicyTab } from './PolicyModal';
import { useCms } from '../context/CmsContext';

export const Footer: React.FC = () => {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [selectedPolicyTab, setSelectedPolicyTab] = useState<PolicyTab>('shipping');
  const { data } = useCms();
  const { siteSettings, categories } = data;

  const openPolicy = (tab: PolicyTab = 'shipping') => {
    setSelectedPolicyTab(tab);
    setIsPolicyModalOpen(true);
  };

  return (
    <footer className="bg-[#060e09] text-zinc-200 pt-5 sm:pt-10 pb-6 sm:pb-8 border-t-2 border-[#193828] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-10">
        
        {/* PROMINENT GUARANTEE & POLICY SUMMARY STRIP */}
        <div className="bg-[#0f241a] border-2 border-[#1f4a35] rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-md">
          {/* Top Bar with Title & CTA */}
          <div className="flex flex-row items-center justify-between gap-2 pb-2.5 sm:pb-4 mb-2.5 sm:mb-4 border-b border-[#1f4a35]">
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              <h3 className="text-xs sm:text-lg font-black text-white">
                {siteSettings.siteName} পলিসি ও গ্যারান্টি
              </h3>
            </div>
            
            {/* View Details Button */}
            <button
              onClick={() => openPolicy('shipping')}
              className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-[10px] sm:text-sm font-black transition-all cursor-pointer shadow-sm active:scale-95 group"
            >
              <span>বিস্তারিত পলিসি</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 4 Prominent Guarantee Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3.5">
            
            {/* 1. ক্যাশ অন ডেলিভারি */}
            <div 
              onClick={() => openPolicy('shipping')}
              className="p-2 sm:p-3.5 rounded-lg sm:rounded-2xl bg-[#132a20] hover:bg-[#183528] border border-[#1f4a35] transition-all cursor-pointer flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 group"
            >
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-500 group-hover:text-stone-950 transition-all duration-300">
                <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 w-full">
                <h4 className="text-[11px] sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  ক্যাশ অন ডেলিভারি
                </h4>
                <p className="text-[9.5px] sm:text-xs text-zinc-300/80 truncate pt-0.5">
                  পণ্য দেখে মূল্য পরিশোধ
                </p>
              </div>
            </div>

            {/* 2. ৭ দিনের রিটার্ন */}
            <div 
              onClick={() => openPolicy('return')}
              className="p-2 sm:p-3.5 rounded-lg sm:rounded-2xl bg-[#132a20] hover:bg-[#183528] border border-[#1f4a35] transition-all cursor-pointer flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 group"
            >
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all duration-300">
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 w-full">
                <h4 className="text-[11px] sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  ৭ দিনের রিটার্ন
                </h4>
                <p className="text-[9.5px] sm:text-xs text-zinc-300/80 truncate pt-0.5">
                  সহজ এক্সচেঞ্জ পলিসি
                </p>
              </div>
            </div>

            {/* 3. অরিজিনাল প্রোডাক্ট গ্যারান্টি */}
            <div 
              onClick={() => openPolicy('quality')}
              className="p-2 sm:p-3.5 rounded-lg sm:rounded-2xl bg-[#132a20] hover:bg-[#183528] border border-[#1f4a35] transition-all cursor-pointer flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 group"
            >
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 w-full">
                <h4 className="text-[11px] sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  অরিজিনাল প্রোডাক্ট গ্যারান্টি
                </h4>
                <p className="text-[9.5px] sm:text-xs text-zinc-300/80 truncate pt-0.5">
                  ১০০% খাঁটি পণ্যের নিশ্চয়তা
                </p>
              </div>
            </div>

            {/* 4. ডেলিভারি ২-৫ দিন */}
            <div 
              onClick={() => openPolicy('shipping')}
              className="p-2 sm:p-3.5 rounded-lg sm:rounded-2xl bg-[#132a20] hover:bg-[#183528] border border-[#1f4a35] transition-all cursor-pointer flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 group"
            >
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 w-full">
                <h4 className="text-[11px] sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  ডেলিভারি ২-৫ দিন
                </h4>
                <p className="text-[9.5px] sm:text-xs text-zinc-300/80 truncate pt-0.5">
                  সারাদেশে নিরাপদ শিপিং
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* MOBILE COMPACT FOOTER (< md:) */}
        <div 
          className="md:hidden space-y-3 pt-2.5 pb-4 border-b border-[#193828] text-zinc-300"
          style={{ fontSize: '12.5px', lineHeight: 1.5 }}
        >
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-black text-sm border border-amber-400/40">
                {siteSettings.logoIcon || '☪'}
              </div>
              <span className="text-base font-black text-white">
                {siteSettings.siteName}
              </span>
            </div>

            <a 
              href={`tel:${siteSettings.helplinePhone}`} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>{siteSettings.helplineDisplay}</span>
            </a>
          </div>

          <p 
            className="text-zinc-300"
            style={{ fontSize: '12.5px', lineHeight: 1.5 }}
          >
            {siteSettings.tagline}। {siteSettings.announcementText}
          </p>

          <div className="flex flex-wrap items-center gap-2 font-semibold pt-0.5">
            <a href="#featured" className="bg-[#132a20] text-zinc-200 hover:text-white px-3 py-1 rounded-lg border border-[#1f4a35] transition-colors">
              প্রিমিয়াম কালেকশন
            </a>
            <button 
              onClick={() => openPolicy('shipping')} 
              className="bg-[#132a20] text-amber-300 hover:text-white px-3 py-1 rounded-lg border border-[#1f4a35] cursor-pointer transition-colors"
            >
              পলিসি ও সাপোর্ট
            </button>
            <a href="#reviews" className="bg-[#132a20] text-zinc-200 hover:text-white px-3 py-1 rounded-lg border border-[#1f4a35] transition-colors">
              রিভিউ
            </a>
          </div>

          {/* Payment Badges with generous spacing & clean typography */}
          <div className="space-y-2 pt-1.5">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
              <span className="bg-[#183a29] text-emerald-200 border border-emerald-500/30 px-3 py-1.5 rounded-lg shadow-2xs">
                ক্যাশ অন ডেলিভারি
              </span>
              <span className="bg-[#183a29] text-rose-200 border border-rose-500/30 px-3 py-1.5 rounded-lg shadow-2xs">
                বিকাশ
              </span>
              <span className="bg-[#183a29] text-amber-200 border border-amber-500/30 px-3 py-1.5 rounded-lg shadow-2xs">
                নগদ
              </span>
            </div>
            
            <p 
              className="text-zinc-400 pt-1"
              style={{ fontSize: '12.5px', lineHeight: 1.5 }}
            >
              {siteSettings.copyrightText}
            </p>
          </div>

        </div>

        {/* DESKTOP FULL 4 FOOTER COLUMNS */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-12 gap-7 pt-2 pb-6 border-b border-[#193828] text-sm">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-black text-base border border-amber-400/40">
                {siteSettings.logoIcon || '☪'}
              </div>
              <span className="text-xl font-black text-white">
                {siteSettings.siteName}
              </span>
            </div>
            
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              {siteSettings.tagline}। {siteSettings.announcementText}
            </p>
            
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>১০০% অরিজিনাল ও হালাল কোয়ালিটি</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
              ক্যাটাগরি
            </h4>
            <ul className="space-y-1.5 text-zinc-300 text-xs sm:text-sm font-medium">
              {categories
                .filter((c) => c.id !== 'all')
                .slice(0, 5)
                .map((cat) => (
                  <li key={cat.id}>
                    <a href="#featured" className="hover:text-amber-300 transition">
                      {cat.icon} {cat.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
              গ্রাহক সেবা
            </h4>
            <ul className="space-y-1.5 text-zinc-300 text-xs sm:text-sm font-medium">
              <li>
                <button 
                  onClick={() => openPolicy('shipping')} 
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  শিপিং ও রিটার্ন
                </button>
              </li>
              <li><a href="#faq" className="hover:text-amber-300 transition">প্রশ্নোত্তর (FAQ)</a></li>
              <li><a href="#reviews" className="hover:text-amber-300 transition">গ্রাহকদের রিভিউ</a></li>
              <li>
                <button 
                  onClick={() => openPolicy('refund')} 
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  রিফান্ড পলিসি
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Payments */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
              যোগাযোগ
            </h4>
            <div className="space-y-1.5 text-zinc-300 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteSettings.helplineDisplay}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{siteSettings.workingHours}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{siteSettings.supportEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{siteSettings.address}</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex flex-wrap gap-2.5 sm:gap-3 text-xs font-bold">
                <span className="bg-[#183a29] text-emerald-200 border border-emerald-500/30 px-3 py-1.5 rounded-lg shadow-2xs">
                  ক্যাশ অন ডেলিভারি
                </span>
                <span className="bg-[#183a29] text-rose-200 border border-rose-500/30 px-3 py-1.5 rounded-lg shadow-2xs">
                  বিকাশ
                </span>
                <span className="bg-[#183a29] text-amber-200 border border-amber-500/30 px-3 py-1.5 rounded-lg shadow-2xs">
                  নগদ
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4 text-zinc-400 pt-4 pb-2"
          style={{ fontSize: '12.5px', lineHeight: 1.5 }}
        >
          <p className="text-zinc-400">{siteSettings.copyrightText}</p>
          <div className="flex items-center gap-3.5 text-zinc-300 font-medium">
            <button 
              onClick={() => openPolicy('shipping')} 
              className="hover:text-amber-300 transition cursor-pointer"
            >
              ডেলিভারি পলিসি
            </button>
            <span className="text-zinc-600">•</span>
            <button 
              onClick={() => openPolicy('return')} 
              className="hover:text-amber-300 transition cursor-pointer"
            >
              রিটার্ন পলিসি
            </button>
            <span className="text-zinc-600">•</span>
            <button 
              onClick={() => {
                window.location.hash = '#admin';
              }} 
              className="hover:text-amber-300 transition cursor-pointer text-zinc-500 hover:text-zinc-300"
              title="অ্যাডমিন প্যানেল"
            >
              অ্যাডমিন
            </button>
          </div>
          <p className="flex items-center gap-1.5 text-zinc-400">
            <span>ভালোবাসা ও বিশ্বস্ততায় তৈরি</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>

      </div>

      {/* POLICY DETAILS MODAL */}
      <PolicyModal
        isOpen={isPolicyModalOpen}
        initialTab={selectedPolicyTab}
        onClose={() => setIsPolicyModalOpen(false)}
      />
    </footer>
  );
};
