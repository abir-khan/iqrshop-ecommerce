import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export const FloatingWhatsApp: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const { data } = useCms();
  const { siteSettings } = data;

  const cleanWaNumber = (siteSettings.whatsappNumber || '8801700000000').replace(/[^0-9]/g, '');

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 font-sans">
      {expanded && (
        <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 p-4 max-w-xs w-72 mb-2 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-zinc-900 text-xs">{siteSettings.siteName} সহায়তা</h4>
                <span className="text-[10px] text-emerald-600 font-bold">অনলাইনে আছেন</span>
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-600 my-3 leading-relaxed">
            আসসালামু আলাইকুম! কোনো পণ্য বা অর্ডারে সাহায্য প্রয়োজন হলে সরাসরি যোগাযোগ করুন।
          </p>

          <div className="space-y-2">
            <a
              href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি পণ্য সম্পর্কে জানতে চাই।')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে মেসেজ দিন</span>
            </a>

            <a
              href={`tel:${siteSettings.helplinePhone}`}
              className="w-full flex items-center justify-center gap-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-bold py-2 px-3 rounded-xl text-xs border border-zinc-200 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-800" />
              <span>সরাসরি কল: {siteSettings.helplineDisplay}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="relative flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 sm:py-3 sm:px-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white"
        aria-label="Contact on WhatsApp"
      >
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold hidden sm:inline">সহায়তা</span>
      </button>
    </div>
  );
};
