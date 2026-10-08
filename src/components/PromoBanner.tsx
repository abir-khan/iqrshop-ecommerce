import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const couponCode = 'IQR10';

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#f4efe6] rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-stone-200">
        
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            স্পেশাল অফার
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
            প্রথম অর্ডারে জিতে নিন ১০% ছাড়!
          </h3>
          <p className="text-xs sm:text-sm text-stone-600">
            চেকআউটে কুপন কোড ব্যবহার করে উপভোগ করুন বিশেষ ডিসকাউন্ট।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-stone-300 font-mono text-sm font-bold text-[#0f382c] tracking-wider">
            {couponCode}
          </div>
          <button
            onClick={handleCopy}
            className="bg-[#0f382c] hover:bg-[#164e3e] text-white font-bold text-xs py-3 px-5 rounded-2xl transition cursor-pointer active:scale-95"
          >
            {copied ? (
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> কপি হয়েছে</span>
            ) : (
              <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> কোড কপি করুন</span>
            )}
          </button>
        </div>

      </div>
    </section>
  );
};
