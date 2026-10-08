import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquareHeart,
  Sparkles
} from 'lucide-react';
import { ReviewsModal } from './ReviewsModal';
import { useCms } from '../context/CmsContext';

export const CustomerReviews: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialShowForm, setModalInitialShowForm] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  const { data } = useCms();
  const { testimonials } = data;

  const toggleExpandReview = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openReviewsList = () => {
    setModalInitialShowForm(false);
    setIsModalOpen(true);
  };

  const openWriteReview = () => {
    setModalInitialShowForm(true);
    setIsModalOpen(true);
  };

  const topThreeReviews = testimonials.slice(0, 3);

  return (
    <section className="py-0 sm:py-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1 sm:space-y-8 font-sans">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 pb-2 sm:pb-4 border-b border-zinc-200">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
            <span>ভেরিফাইড কাস্টমার রিভিউ ও রেটিং</span>
          </div>
          
          <h2 className="text-base sm:text-2xl font-bold text-zinc-900 tracking-tight">
            সম্মানিত গ্রাহকদের অভিজ্ঞতা
          </h2>
          <p className="hidden sm:block text-xs sm:text-sm text-zinc-500 font-normal">
            সারাদেশে ২৫,০০০+ সন্তুষ্ট পরিবারের আসল রিভিউ ও রেটিং (৪.৯ / ৫.০)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openWriteReview}
            className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-[10.5px] sm:text-sm font-bold transition cursor-pointer shadow-xs active:scale-95"
            title="পণ্য ব্যবহারের অভিজ্ঞতা ও রেটিং দিন"
          >
            <MessageSquareHeart className="w-3.5 h-3.5 text-amber-300" />
            <span>রিভিউ দিন</span>
          </button>

          <button
            onClick={openReviewsList}
            className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-[10.5px] sm:text-sm font-bold transition cursor-pointer shadow-xs active:scale-95"
          >
            <span>সব রিভিউ ({testimonials.length})</span>
          </button>
        </div>
      </div>

      {/* MOBILE 1-CARD WITH BULLET DOTS */}
      <div className="sm:hidden space-y-1">
        {topThreeReviews.length > 0 && (
          <div 
            onClick={openReviewsList}
            className="bg-[#F8F9F8] p-2.5 rounded-xl border border-zinc-200 shadow-xs cursor-pointer active:scale-98 transition-all"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={topThreeReviews[activeMobileIndex]?.avatar}
                  alt={topThreeReviews[activeMobileIndex]?.name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-300 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="text-xs font-bold text-zinc-900 truncate">
                      {topThreeReviews[activeMobileIndex]?.name}
                    </h3>
                    <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate">
                    {topThreeReviews[activeMobileIndex]?.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-bold text-amber-900">
                  {topThreeReviews[activeMobileIndex]?.rating}.0
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-700 leading-snug line-clamp-2">
              "{topThreeReviews[activeMobileIndex]?.comment}"
            </p>

            <div className="mt-1.5 pt-1.5 border-t border-zinc-200/70 flex items-center justify-between text-[10px]">
              <span className="text-emerald-800 font-semibold truncate max-w-[65%]">
                পণ্য: {topThreeReviews[activeMobileIndex]?.product}
              </span>
              <span className="text-zinc-500 font-bold flex items-center gap-0.5">
                <ThumbsUp className="w-2.5 h-2.5 text-zinc-400" /> ভেরিফাইড ক্রেতা
              </span>
            </div>
          </div>
        )}

        {/* Bullet Dots Slider */}
        <div className="flex justify-center items-center gap-1.5 pt-0.5">
          {topThreeReviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveMobileIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeMobileIndex === idx ? 'w-4 bg-emerald-800' : 'w-1.5 bg-zinc-300'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP 3-CARD GRID */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-5">
        {topThreeReviews.map((review) => {
          const isExpanded = expandedReviews[review.id];

          return (
            <div
              key={review.id}
              onClick={openReviewsList}
              className="bg-[#FAFAF9] p-5 rounded-3xl border border-zinc-200 hover:border-emerald-700/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h3 className="text-sm font-bold text-zinc-900 truncate">
                          {review.name}
                        </h3>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      </div>
                      <p className="text-xs text-zinc-500 truncate">
                        {review.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/80 shrink-0">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-black text-amber-950">
                      {review.rating}.0
                    </span>
                  </div>
                </div>

                <div>
                  <p className={`text-xs sm:text-[13px] text-zinc-700 leading-relaxed font-normal ${!isExpanded ? 'line-clamp-3' : ''}`}>
                    "{review.comment}"
                  </p>
                  {review.comment.length > 85 && (
                    <button
                      type="button"
                      onClick={(e) => toggleExpandReview(review.id, e)}
                      className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 mt-1 cursor-pointer underline"
                    >
                      {isExpanded ? 'সংক্ষিপ্ত করুন' : 'সম্পূর্ণ পড়ুন...'}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200/70 flex items-center justify-between text-xs">
                <span className="text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-[60%]">
                  {review.product}
                </span>
                <span className="text-zinc-500 font-medium flex items-center gap-1 text-[11px]">
                  <ThumbsUp className="w-3 h-3 text-zinc-400" /> ভেরিফাইড ক্রেতা
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <ReviewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialShowForm={modalInitialShowForm}
      />
    </section>
  );
};
