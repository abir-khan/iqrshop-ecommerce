import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  CreditCard, 
  Phone, 
  CheckCircle2, 
  PackageOpen, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { useCms } from '../context/CmsContext';

export type PolicyTab = 'shipping' | 'return' | 'refund' | 'quality';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ 
  isOpen, 
  onClose, 
  initialTab = 'shipping' 
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);
  const { data } = useCms();
  const { siteSettings, policies } = data;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-fadeIn font-sans">
      <div 
        className="relative w-full max-w-3xl bg-[#0d1f17] text-zinc-200 rounded-3xl shadow-2xl border-2 border-[#1f4a35] overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-[#1f4a35] bg-[#091610] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {siteSettings.siteName} পলিসি ও সেবা সহায়িকা
              </h3>
              <p className="text-xs text-zinc-400 font-normal">
                ১০০% স্বচ্ছ ও কাস্টমার ফ্রেন্ডলি নিয়মাবলী
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 pb-2 bg-[#0b1a13] border-b border-[#1f4a35] flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'shipping'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-[#13281e] text-zinc-300 hover:bg-[#183327] border border-[#1f4a35]'
            }`}
          >
            <Truck className="w-4 h-4 text-amber-300" />
            <span>🚚 {policies.shipping.title}</span>
          </button>

          <button
            onClick={() => setActiveTab('return')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'return'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-[#13281e] text-zinc-300 hover:bg-[#183327] border border-[#1f4a35]'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span>🔄 {policies.return.title}</span>
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'refund'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-[#13281e] text-zinc-300 hover:bg-[#183327] border border-[#1f4a35]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-300" />
            <span>💰 {policies.refund.title}</span>
          </button>

          <button
            onClick={() => setActiveTab('quality')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quality'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-[#13281e] text-zinc-300 hover:bg-[#183327] border border-[#1f4a35]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>🛡️ {policies.quality.title}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 text-zinc-200 text-sm leading-relaxed">
          
          {/* TAB 1: SHIPPING */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-[#12281e] border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
                <PackageOpen className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-base">
                    {policies.shipping.subtitle}
                  </h4>
                  <p className="text-xs text-zinc-300 pt-0.5">
                    ডেলিভারি ম্যান পৌঁছালে আপনি পার্সেল খুলে পণ্য দেখে, চেক করে সন্তুষ্ট হয়ে তবেই মূল্য পরিশোধ করবেন।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {policies.shipping.items.map((item, idx) => (
                  <div key={idx} className="bg-[#132a20] p-4 rounded-2xl border border-[#1f4a35] space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-xs text-zinc-200">{item.description}</p>
                    {item.badge && <span className="text-xs text-emerald-300 font-bold">{item.badge}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RETURN */}
          {activeTab === 'return' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-[#12281e] border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-base">
                    {policies.return.subtitle}
                  </h4>
                  <p className="text-xs text-zinc-300 pt-0.5">
                    পণ্য পাওয়ার পর সাইজ না মিললে বা কোনো সমস্যা হলে মাত্র ১টি কলেই আমরা ফ্রি এক্সচেঞ্জ করে দিব।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {policies.return.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-[#132a20] rounded-xl border border-[#1f4a35] space-y-1">
                    <p className="font-bold text-amber-300">{item.title}</p>
                    <p className="text-zinc-300">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 bg-[#132a20] p-3 rounded-xl text-xs text-zinc-300 border border-[#1f4a35]">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>রিটার্ন বা এক্সচেঞ্জের জন্য মূল প্যাকেটটি অক্ষত রাখার অনুরোধ করা হচ্ছে।</span>
              </div>
            </div>
          )}

          {/* TAB 3: REFUND */}
          {activeTab === 'refund' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-[#12281e] border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-base">
                    {policies.refund.subtitle}
                  </h4>
                  <p className="text-xs text-zinc-300 pt-0.5">
                    কোনো কারণে রিফান্ড প্রয়োজন হলে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে বিকাশ/নগদ/ব্যাংকে টাকা ফেরত দেওয়া হয়।
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-zinc-300">
                {policies.refund.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>{item.title}:</b> {item.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUALITY */}
          {activeTab === 'quality' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-[#12281e] border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-base">
                    {policies.quality.subtitle}
                  </h4>
                  <p className="text-xs text-zinc-300 pt-0.5">
                    {siteSettings.siteName}-এর প্রতিটি পণ্য সরাসরি নির্ভরযোগ্য অথেনটিক সোর্স থেকে সংগৃহীত।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {policies.quality.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-[#132a20] rounded-xl border border-[#1f4a35]">
                    <p className="font-bold text-amber-300">✓ {item.title}</p>
                    <p className="text-zinc-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#1f4a35] bg-[#091610] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>হেল্পলাইন: <b>{siteSettings.helplineDisplay}</b> ({siteSettings.workingHours})</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm"
          >
            ঠিক আছে, বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
