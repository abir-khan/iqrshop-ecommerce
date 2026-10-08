import React, { useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';

const HERO_SLIDES = [
  {
    tag: 'নতুন সিজন কালেকশন',
    title: 'অভিজাত রুচি ও সুন্নাহর মেলবন্ধন',
    description: '১০০% খাঁটি এরাবিয়ান ওউদ আতর, অর্থোপেডিক জায়নামাজ ও প্রিমিয়াম লাইফস্টাইল পণ্য।',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&auto=format&fit=crop&q=80',
    category: 'attar',
    badge: 'প্রিমিয়াম আতর',
  },
  {
    tag: 'আরামদায়ক কালেকশন',
    title: 'তুর্কি অর্থোপেডিক মেমোরি জায়নামাজ',
    description: 'হাঁটু ও জয়েন্টের ব্যথাহীন প্রশান্তিময় নামাজের জন্য প্রিমিয়াম সিল্কি কুশনিং।',
    image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=900&auto=format&fit=crop&q=80',
    category: 'janamaz',
    badge: 'অর্থোপেডিক ফোম',
  },
  {
    tag: 'সুন্নাহ ডায়েট',
    title: 'মদিনার ভিআইপি আজওয়া ও মধু',
    description: 'মদিনা মুনাওয়ারা থেকে সরাসরি সংগৃহীত শতভাগ খাঁটি ও পুষ্টিকর সুপারফুড।',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&auto=format&fit=crop&q=80',
    category: 'organic',
    badge: '১০০% নির্ভেজাল',
  },
];

export const Banner: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = HERO_SLIDES[activeSlide];

  return (
    <section className="bg-[#FAF8F5] py-8 sm:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Content (Clean Luxora Style) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <span className="inline-block text-xs font-bold text-amber-800 tracking-widest uppercase bg-amber-100/70 px-3 py-1 rounded-full">
              {slide.tag}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 leading-[1.15] tracking-tight">
              {slide.title}
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
              {slide.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#products-section"
                className="inline-flex items-center justify-center gap-2 bg-[#0f382c] hover:bg-[#164e3e] text-white font-bold text-sm py-3.5 px-8 rounded-full shadow-sm hover:shadow-md transition active:scale-95"
              >
                <span>কালেকশন দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Clean Social Proof (Luxora style) */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
              <div className="flex -space-x-2">
                <img
                  className="h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Reviewer"
                />
                <img
                  className="h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="Reviewer"
                />
                <img
                  className="h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                  alt="Reviewer"
                />
              </div>

              <div className="text-left text-xs">
                <div className="flex items-center gap-1 font-bold text-stone-800">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>৪.৮ রেটিং</span>
                </div>
                <span className="text-[11px] text-stone-500">২০,০০০+ সন্তুষ্ট গ্রাহক</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Showcase (Circular backdrop + Slide numbers like Luxora) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Aesthetic Circular Backdrop */}
            <div className="relative w-72 sm:w-96 aspect-square rounded-full bg-[#EFE9DF] flex items-center justify-center p-4">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover rounded-full shadow-xl transition-all duration-700"
              />

              {/* Floating Clean Tag */}
              <span className="absolute bottom-4 bg-white/95 backdrop-blur-xs text-[#0f382c] font-black text-xs px-4 py-1.5 rounded-full shadow-md border border-stone-200">
                {slide.badge}
              </span>
            </div>

            {/* Slide Index Buttons (01, 02, 03 - like Luxora) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`text-[11px] font-bold py-1 px-2 rounded-md transition cursor-pointer ${
                    activeSlide === idx
                      ? 'text-[#0f382c] border-b-2 border-[#0f382c]'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
