import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  ThumbsUp, 
  Search, 
  Image as ImageIcon,
  Check,
  ShoppingBag,
  MessageSquarePlus
} from 'lucide-react';
import type { Testimonial } from '../types';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialShowForm?: boolean;
}

interface ExtendedReview extends Testimonial {
  date: string;
  category?: string;
  likes: number;
  hasLiked?: boolean;
  reviewImage?: string;
}

// Initial detailed reviews dataset
const INITIAL_DETAILED_REVIEWS: ExtendedReview[] = [
  {
    id: '1',
    name: 'মুফতি তানভীর মাহমুদ',
    location: 'উত্তরা, ঢাকা',
    comment: 'রয়েল এরাবিয়ান ওউদ আতরটি হাতে পেয়ে ব্যবহার করলাম। সুবাস সত্যিই রাজকীয় এবং দীর্ঘস্থায়ী। জুমার নামাজে মেখে গিয়েছিলাম, সবাই প্রশংসা করেছে। ক্যাশ অন ডেলিভারিতে দ্রুত পেয়েছি।',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    product: 'রয়েল এরাবিয়ান ওউদ আতর (১২ মিলি)',
    category: 'attar',
    date: '১ দিন আগে',
    likes: 42,
    reviewImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'ইঞ্জিনিয়ার মাহমুদুল হাসান',
    location: 'জিইসি মোড়, চট্টগ্রাম',
    comment: 'আমার আম্মার জন্য তুর্কি অর্থোপেডিক মেমোরি ফোম জায়নামাজটা নিয়েছিলাম। আম্মার হাঁটুর ব্যথার সমস্যা ছিল, এখন নামাজ পড়ে খুবই আরাম পাচ্ছেন। চমৎকার কোয়ালিটি ও ফিনিশিং!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    product: 'তুর্কি অর্থোপেডিক মেমোরি ফোম জায়নামাজ',
    category: 'janamaz',
    date: '২ দিন আগে',
    likes: 38,
    reviewImage: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'আব্দুর রহিম',
    location: 'আম্বরখানা, সিলেট',
    comment: 'মদিনার ভিআইপি আজওয়া খেজুর এবং সুন্দরবনের মধু দুটোই একদম খাঁটি ও ফ্রেশ। প্যাকেজিং অত্যন্ত নিরাপদ ও দৃষ্টিনন্দন ছিল। জাজাকাল্লাহু খাইরান!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    product: 'মদিনার ভিআইপি আজওয়া খেজুর ও মধু',
    category: 'organic',
    date: '৩ দিন আগে',
    likes: 29,
  },
  {
    id: '4',
    name: 'মো: হাসিবুল ইসলাম',
    location: 'মিরপুর-১০, ঢাকা',
    comment: 'প্রিমিয়াম সুতি সেমি-লং পাঞ্জাবি সাইজ ৪২ অর্ডার করেছিলাম। সাইজ একদম পারফেক্ট এবং সুতি কাপড়ের ফিনিশিং দারুণ আরামদায়ক। রঙ ১০০% ছবির মতোই এসেছে।',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    product: 'প্রিমিয়াম সুতি সেমি-লং পাঞ্জাবি (ব্ল্যাক)',
    category: 'panjabi',
    date: '৪ দিন আগে',
    likes: 19,
    reviewImage: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '5',
    name: 'ডা: নাজমুল হুদা',
    location: 'কাজীহাটা, রাজশাহী',
    comment: 'ডিজিটাল স্মার্ট এলইডি তসবিহ রিং জিকিরের জন্য দারুণ এক সৃষ্টি। বিশেষ করে সাইলেন্ট ভাইব্রেশন অ্যালার্ট খুব কাজে দেয়। হাইলি রেকমেন্ডেড!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    product: 'ডিজিটাল স্মার্ট এলইডি কাউন্টার তসবিহ',
    category: 'tasbih',
    date: '৫ দিন আগে',
    likes: 24,
  },
  {
    id: '6',
    name: 'মাওলানা কামরুল হাসান',
    location: 'সোনাডাঙ্গা, খুলনা',
    comment: 'সুলতান ওউদ কাঠের গিফট বক্সটি বড় ভাইয়ের জন্মদিনে উপহার দিয়েছিলাম। উনি অসম্ভব খুশি হয়েছেন। কাঠ ও বোতলের প্রিমিয়াম লুক যেকোনো মানুষকে মুগ্ধ করবে।',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    product: 'সুলতান ওউদ লাক্সারি গিফট বক্স',
    category: 'attar',
    date: '১ সপ্তাহ আগে',
    likes: 31,
  },
  {
    id: '7',
    name: 'তৌহিদুল আলম চৌধুরী',
    location: 'ধানমন্ডি, ঢাকা',
    comment: 'রয়েল কাশ্মীরি সুতোয় কাজ করা পাঞ্জাবিটি প্রিমিয়াম লুক দিয়েছে। কলি ও বোতামের নিখুঁত কাজ সত্যিই প্রশংসার দাবিদার।',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&auto=format&fit=crop&q=80',
    product: 'রয়েল কাশ্মীরি এমব্রয়ডারি পাঞ্জাবি',
    category: 'panjabi',
    date: '১ সপ্তাহ আগে',
    likes: 15,
  },
  {
    id: '8',
    name: 'জাহিদুল ইসলাম শামীম',
    location: 'মাইজদী, নোয়াখালী',
    comment: 'প্রাকৃতিক চন্দন কাঠের ১০০ দানার তসবিহ। কাঠের প্রাকৃতিক ঘ্রাণ এখনো পাচ্ছি। তসবিহ পড়তে গিয়ে মনে এক অদ্ভুত প্রশান্তি আসে।',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    product: 'প্রাকৃতিক চন্দন কাঠের তসবিহ',
    category: 'tasbih',
    date: '২ সপ্তাহ আগে',
    likes: 22,
  },
];

export const ReviewsModal: React.FC<ReviewsModalProps> = ({ isOpen, onClose, initialShowForm = false }) => {
  const [reviewsList, setReviewsList] = useState<ExtendedReview[]>(INITIAL_DETAILED_REVIEWS);
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5star' | 'photos' | 'panjabi' | 'attar' | 'janamaz' | 'tasbih' | 'organic'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWriteForm, setShowWriteForm] = useState(initialShowForm);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Sync initialShowForm when modal is opened
  useEffect(() => {
    if (isOpen) {
      setShowWriteForm(initialShowForm);
    }
  }, [isOpen, initialShowForm]);

  // New review form fields
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formProduct, setFormProduct] = useState('রয়েল এরাবিয়ান ওউদ আতর');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');

  if (!isOpen) return null;

  // Handle like toggle
  const handleToggleLike = (id: string) => {
    setReviewsList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const hasLiked = item.hasLiked;
          return {
            ...item,
            hasLiked: !hasLiked,
            likes: hasLiked ? item.likes - 1 : item.likes + 1,
          };
        }
        return item;
      })
    );
  };

  // Submit new review handler
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    const newReview: ExtendedReview = {
      id: Date.now().toString(),
      name: formName.trim(),
      location: formLocation.trim() || 'বাংলাদেশ',
      comment: formComment.trim(),
      rating: formRating,
      avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(formName)}`,
      product: formProduct,
      category: 'attar',
      date: 'এইমাত্র',
      likes: 1,
      hasLiked: true,
    };

    setReviewsList([newReview, ...reviewsList]);
    setSubmittedSuccess(true);
    setFormName('');
    setFormLocation('');
    setFormComment('');
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowWriteForm(false);
    }, 2500);
  };

  // Filtered reviews
  const filteredReviews = reviewsList.filter((r) => {
    // Category or rating filter
    if (selectedFilter === '5star' && r.rating !== 5) return false;
    if (selectedFilter === 'photos' && !r.reviewImage) return false;
    if (selectedFilter === 'panjabi' && r.category !== 'panjabi') return false;
    if (selectedFilter === 'attar' && r.category !== 'attar') return false;
    if (selectedFilter === 'janamaz' && r.category !== 'janamaz') return false;
    if (selectedFilter === 'tasbih' && r.category !== 'tasbih') return false;
    if (selectedFilter === 'organic' && r.category !== 'organic') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        (r.product && r.product.toLowerCase().includes(q)) ||
        r.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 5: return '🤩 ৫/৫ (অসাধারণ / দারুণ!)';
      case 4: return '😊 ৪/৫ (খুব ভালো লেগেছে)';
      case 3: return '🙂 ৩/৫ (মোটামুটি ভালো)';
      case 2: return '😐 ২/৫ (সন্তোষজনক নয়)';
      case 1: return '😞 ১/৫ (পছন্দ হয়নি)';
      default: return '৫/৫';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 sm:px-8 py-4.5 border-b border-zinc-100 bg-[#FAFAF9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
                  ভেরিফাইড কাস্টমার রিভিউ ও রেটিং
                </h3>
                <span className="hidden sm:inline-block text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  ১০০% আসল ক্রেতা
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-normal">
                সারাদেশের সম্মানিত গ্রাহকদের প্রত্যক্ষ অভিজ্ঞতা ও রিভিউ
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-800 rounded-full hover:bg-zinc-200/60 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {/* Overall Rating & Breakdown Card */}
          <div className="bg-gradient-to-br from-[#FAFAF9] to-[#F5F5F4] p-5 sm:p-6 rounded-3xl border border-zinc-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Big Score Box */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start shrink-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight">৪.৯</span>
                <span className="text-sm sm:text-base font-semibold text-zinc-400">/ ৫.০</span>
              </div>
              <div className="flex items-center gap-1 my-2 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                ৯৯% পজিটিভ কাস্টমার সন্তুষ্টি
              </span>
            </div>

            {/* Rating Bars */}
            <div className="flex-1 w-full max-w-sm space-y-1.5 text-xs font-medium text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="w-12 text-zinc-500 font-normal">৫ স্টার</span>
                <div className="flex-1 bg-zinc-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="w-8 text-right font-bold text-zinc-800">৯২%</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-12 text-zinc-500 font-normal">৪ স্টার</span>
                <div className="flex-1 bg-zinc-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '6%' }}></div>
                </div>
                <span className="w-8 text-right font-bold text-zinc-800">৬%</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-12 text-zinc-500 font-normal">৩ স্টার</span>
                <div className="flex-1 bg-zinc-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '2%' }}></div>
                </div>
                <span className="w-8 text-right font-bold text-zinc-800">২%</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-12 text-zinc-500 font-normal">২ স্টার</span>
                <div className="flex-1 bg-zinc-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '0%' }}></div>
                </div>
                <span className="w-8 text-right font-bold text-zinc-800">০%</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-12 text-zinc-500 font-normal">১ স্টার</span>
                <div className="flex-1 bg-zinc-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '0%' }}></div>
                </div>
                <span className="w-8 text-right font-bold text-zinc-800">০%</span>
              </div>
            </div>

            {/* Write Review CTA Button */}
            <div className="shrink-0 flex flex-col items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowWriteForm(!showWriteForm)}
                className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer ${
                  showWriteForm
                    ? 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20 shadow-md'
                }`}
              >
                {showWriteForm ? (
                  <>
                    <X className="w-4 h-4 text-zinc-600" />
                    <span>ফর্ম বন্ধ করুন</span>
                  </>
                ) : (
                  <>
                    <span className="text-amber-300 text-sm sm:text-base">✍️</span>
                    <span>রেটিং দিন ও রিভিউ লিখুন</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-zinc-500 font-medium text-center">
                {showWriteForm ? '✍️ নিচে ফর্মটি পূরণ করুন' : '⭐ আপনার অভিজ্ঞতা শেয়ার করুন'}
              </span>
            </div>
          </div>

          {/* Write Review Form Accordion */}
          {showWriteForm && (
            <div className="bg-gradient-to-b from-amber-50/70 to-emerald-50/40 border border-emerald-200/90 rounded-3xl p-5 sm:p-6 animate-fadeIn shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                    ✍️
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm sm:text-base">
                      আপনার পণ্য ব্যবহারের অভিজ্ঞতা ও রেটিং দিন
                    </h4>
                    <p className="text-[11px] text-zinc-500 font-normal">
                      আপনার মূল্যবান মতামত অন্যদের সঠিক পণ্য নির্বাচনে সাহায্য করবে
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWriteForm(false)}
                  className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-200/50 transition cursor-pointer"
                  title="ফর্ম বন্ধ করুন"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-5 rounded-2xl text-center flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-base text-emerald-950">আলহামদুলিল্লাহ! আপনার রিভিউ সফলভাবে যুক্ত হয়েছে।</p>
                  <p className="text-xs text-emerald-800">আমাদের সাথে থাকার জন্য আপনাকে আন্তরিক ধন্যবাদ।</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80">
                    <label className="block text-xs font-bold text-zinc-800 mb-2">
                      ১. পণ্যটি আপনার কেমন লেগেছে? (স্টার রেটিং দিন):
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200/70">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormRating(star)}
                            className="p-1 text-zinc-300 hover:text-amber-400 hover:scale-110 transition cursor-pointer"
                            title={`${star} স্টার`}
                          >
                            <Star
                              className={`w-6 h-6 sm:w-7 sm:h-7 ${
                                star <= formRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-zinc-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                        {getRatingLabel(formRating)}
                      </span>
                    </div>
                  </div>

                  {/* Input Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        ২. আপনার পুরো নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="যেমন: তানভীর মাহমুদ"
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        ৩. আপনার এলাকা বা জেলা *
                      </label>
                      <input
                        type="text"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="যেমন: মিরপুর, ঢাকা"
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Product Choice */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      ৪. কোন পণ্যটির রিভিউ দিচ্ছেন?
                    </label>
                    <select
                      value={formProduct}
                      onChange={(e) => setFormProduct(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      <option value="রয়েল এরাবিয়ান ওউদ আতর">রয়েল এরাবিয়ান ওউদ আতর</option>
                      <option value="তুর্কি অর্থোপেডিক মেমোরি ফোম জায়নামাজ">তুর্কি অর্থোপেডিক মেমোরি ফোম জায়নামাজ</option>
                      <option value="প্রিমিয়াম সুতি সেমি-লং পাঞ্জাবি">প্রিমিয়াম সুতি সেমি-লং পাঞ্জাবি</option>
                      <option value="ডিজিটাল স্মার্ট এলইডি কাউন্টার তসবিহ">ডিজিটাল স্মার্ট এলইডি কাউন্টার তসবিহ</option>
                      <option value="মদিনার ভিআইপি আজওয়া খেজুর">মদিনার ভিআইপি আজওয়া খেজুর</option>
                      <option value="খাঁটি সুন্দরবনের প্রাকৃতিক চাকের মধু">খাঁটি সুন্দরবনের প্রাকৃতিক চাকের মধু</option>
                    </select>
                  </div>

                  {/* Comment Area */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      ৫. পণ্যটি কেমন লেগেছে বিস্তারিত লিখুন *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      placeholder="পণ্যটির মান, সুবাস, কাপড়ের ফিনিশিং বা ডেলিভারি অভিজ্ঞতা কেমন লেগেছে লিখুন..."
                      className="w-full bg-white border border-zinc-300 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                    />
                  </div>

                  {/* Submit button */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-200/50">
                    <span className="text-[11px] text-zinc-500 font-normal">
                      🔒 আপনার রিভিউ সঙ্গে সঙ্গে নিচে প্রদর্শিত হবে
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowWriteForm(false)}
                        className="px-4 py-2.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 rounded-xl hover:bg-zinc-200/60 transition cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>রিভিউ জমা দিন</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Filters & Search Row */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                    selectedFilter === 'all'
                      ? 'bg-[#13231B] text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  সবগুলো ({reviewsList.length})
                </button>

                <button
                  onClick={() => setSelectedFilter('5star')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1 ${
                    selectedFilter === '5star'
                      ? 'bg-[#13231B] text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>৫★ রেটিং</span>
                </button>

                <button
                  onClick={() => setSelectedFilter('photos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1 ${
                    selectedFilter === 'photos'
                      ? 'bg-[#13231B] text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  <ImageIcon className="w-3 h-3 text-emerald-600" />
                  <span>ছবি সহ রিভিউ</span>
                </button>

                <button
                  onClick={() => setSelectedFilter('attar')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                    selectedFilter === 'attar'
                      ? 'bg-[#13231B] text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  আতর
                </button>

                <button
                  onClick={() => setSelectedFilter('panjabi')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                    selectedFilter === 'panjabi'
                      ? 'bg-[#13231B] text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  পাঞ্জাবি
                </button>

                <button
                  onClick={() => setSelectedFilter('janamaz')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                    selectedFilter === 'janamaz'
                      ? 'bg-[#13231B] text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  জায়নামাজ
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-56 shrink-0">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="রিভিউতে খুঁজুন..."
                  className="w-full pl-8.5 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-[#13231B] focus:bg-white"
                />
              </div>

            </div>
          </div>

          {/* Review List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.length === 0 ? (
              <div className="col-span-full py-12 text-center text-zinc-400 space-y-2">
                <MessageSquarePlus className="w-8 h-8 mx-auto text-zinc-300" />
                <p className="text-sm font-semibold">কোনো রিভিউ পাওয়া যায়নি</p>
                <p className="text-xs">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
              </div>
            ) : (
              filteredReviews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-xs hover:border-zinc-300 hover:shadow-sm transition flex flex-col justify-between space-y-3.5"
                >
                  <div className="space-y-2.5">
                    {/* Header: Stars & Date & Verified Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-normal">{item.date}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>ভেরিফাইড ক্রেতা</span>
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-xs sm:text-[13px] text-zinc-700 leading-relaxed font-normal">
                      "{item.comment}"
                    </p>

                    {/* Image Attachment (if any) */}
                    {item.reviewImage && (
                      <div className="pt-1">
                        <img
                          src={item.reviewImage}
                          alt="Customer product photo"
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-zinc-200 hover:scale-105 transition cursor-pointer"
                          onClick={() => window.open(item.reviewImage, '_blank')}
                        />
                      </div>
                    )}

                    {/* Purchased Product Tag */}
                    {item.product && (
                      <div className="inline-flex items-center gap-1.5 bg-zinc-50 text-zinc-600 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-zinc-200/80">
                        <ShoppingBag className="w-3 h-3 text-zinc-400" />
                        <span>পণ্য: {item.product}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Profile & Helpful Count */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-zinc-900 leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-zinc-400 font-normal">{item.location}</span>
                      </div>
                    </div>

                    {/* Thumbs up Like Button */}
                    <button
                      onClick={() => handleToggleLike(item.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition cursor-pointer border ${
                        item.hasLiked
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-800'
                      }`}
                      title="উপকারী মনে হয়েছে"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${item.hasLiked ? 'text-emerald-600 fill-emerald-600' : ''}`} />
                      <span className="text-[11px]">{item.likes}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Trust Banner inside Modal */}
          <div className="bg-[#13231B] text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-300 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  ইকর শপের প্রতিটি রিভিউ ১০০% ভেরিফাইড পার্সেল গ্রাহকদের
                </p>
                <p className="text-[11px] text-zinc-300 font-normal">
                  ক্যাশ অন ডেলিভারিতে পার্সেল দেখে নেওয়ার নিশ্চয়তা সহ।
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-400/30 shrink-0">
              🛡️ ১০০% আসল অভিজ্ঞতা
            </span>
          </div>

        </div>

        {/* Modal Footer Bar */}
        <div className="px-5 sm:px-8 py-3.5 border-t border-zinc-100 bg-[#FAFAF9] flex items-center justify-between shrink-0">
          <span className="text-xs text-zinc-500 font-normal">
            মোট <b>{reviewsList.length}</b> টি ভেরিফাইড রিভিউ প্রদর্শিত হচ্ছে
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#13231B] hover:bg-[#1f372a] text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
