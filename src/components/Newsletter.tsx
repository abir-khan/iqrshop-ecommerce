import React, { useState } from 'react';
import { Check, Mail, ArrowRight } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-1 sm:py-2 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xl sm:rounded-3xl overflow-hidden bg-[#13231B] text-white p-2.5 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-2 sm:gap-6 shadow-md border border-[#1d362a]">
          
          {/* Left Text */}
          <div className="space-y-0.5 sm:space-y-1.5 text-center lg:text-left max-w-lg z-10">
            <div className="inline-flex items-center gap-1 text-amber-300 text-[9px] sm:text-xs font-semibold uppercase tracking-wider bg-white/10 px-2 py-0.2 sm:px-3 sm:py-1 rounded-full">
              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>নিউজলেটার ও অফার</span>
            </div>
            <h3 className="text-xs sm:text-2xl font-bold text-white leading-tight pt-0.5">
              বিশেষ ছাড় ও কালেকশন পেতে যুক্ত থাকুন
            </h3>
            <p className="hidden sm:block text-xs sm:text-sm text-zinc-300 font-normal">
              নতুন ইসলামিক কালেকশন ও স্পেশাল ছাড় পেতে ইমেইল দিয়ে যুক্ত থাকুন।
            </p>
          </div>

          {/* Right Form */}
          <form onSubmit={handleSubscribe} className="flex-1 max-w-md w-full z-10">
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 bg-white/10 p-1 sm:p-1.5 rounded-lg sm:rounded-2xl border border-white/15">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ইমেইল অ্যাড্রেস লিখুন..."
                className="flex-1 bg-transparent px-2.5 py-1 sm:px-4 sm:py-2.5 text-[11px] sm:text-sm text-white placeholder:text-zinc-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-[11px] sm:text-sm py-1 sm:py-2.5 px-3 sm:px-5 rounded-md sm:rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shrink-0 shadow-sm active:scale-95"
              >
                {subscribed ? (
                  <span className="flex items-center gap-1 text-emerald-950 font-bold">
                    <Check className="w-4 h-4" /> যুক্ত হয়েছেন!
                  </span>
                ) : (
                  <>
                    <span>সাবস্ক্রাইব</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </section>
  );
};
