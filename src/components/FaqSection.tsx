import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'আমি কি ডেলিভারি ম্যানের সামনে পার্সেল খুলে চেক করতে পারব?',
    a: 'জ্বী, অবশ্যই! ডেলিভারি ম্যান পৌঁছালে আপনি পার্সেল খুলে পণ্য দেখে ও নিশ্চিত হয়ে মূল্য পরিশোধ করতে পারবেন।',
  },
  {
    q: 'অর্ডার কনফার্ম করতে কি কোনো অগ্রিম টাকা দিতে হবে?',
    a: 'না, কোনো প্রকার অগ্রিম টাকা দিতে হবে না। আপনি ১০০% ক্যাশ অন ডেলিভারিতে নিশ্চিন্তে ঘরে বসে অর্ডার করতে পারেন।',
  },
  {
    q: 'ডেলিভারি হতে কত দিন সময় লাগবে?',
    a: 'ঢাকা সিটির ভেতরে সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে সারা বাংলাদেশে ২ থেকে ৩ কর্মদিবসের মধ্যে হোম ডেলিভারি পৌঁছে যায়।',
  },
  {
    q: 'পণ্য পছন্দ না হলে অথবা ত্রুটি থাকলে রিটার্ন বা পরিবর্তনের নিয়ম কী?',
    a: 'পণ্য পাওয়ার ৭ দিনের মধ্যে আমাদের হেল্পলাইন বা হোয়াটসঅ্যাপে জানালে আমরা অতি দ্রুত কোনো ঝামেলা ছাড়াই পণ্য এক্সচেঞ্জ বা সমাধান করে দিব।',
  },
  {
    q: 'আতরগুলো কি অ্যালকোহলমুক্ত ও নামাজে ব্যবহারের জন্য সম্পূর্ণ নিরাপদ?',
    a: 'জ্বী, আমাদের প্রতিটি আতর শতভাগ অ্যালকোহলমুক্ত এবং সরাসরি দুবাই ও সৌদি আরবের নির্ভরযোগ্য সোর্স থেকে সংগৃহীত। এগুলো নামাজ ও ইবাদতে ব্যবহারের জন্য ১০০% হালাল ও নিরাপদ।',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D382D]/10 text-[#0D382D] text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>সচরাচর জিজ্ঞাসিত প্রশ্নাবলী</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            কাস্টমারদের সাধারণ প্রশ্নের উত্তর
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            কেনাকাটা করার আগে আপনার মনের যেকোনো দ্বিধা দূর করতে জেনে নিন
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8DFD1] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-stone-900 hover:text-[#0D382D] transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#0D382D]/10 text-[#0D382D] text-xs flex items-center justify-center shrink-0 font-black">
                      ?
                    </span>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#0D382D]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FDFBF7]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
