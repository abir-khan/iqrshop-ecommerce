import React from 'react';
import { ShoppingBag, Search, Heart, Phone, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCms } from '../context/CmsContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenWishlist: () => void;
  wishlistCount: number;
  onSelectCategory: (category: string) => void;
  onOpenAdmin: () => void;
  activeCategory?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenWishlist,
  wishlistCount,
  onSelectCategory,
  onOpenAdmin,
  activeCategory,
}) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { data, isAdminLoggedIn } = useCms();
  const { siteSettings, headerNavLinks } = data;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/90 shadow-xs font-sans">
      
      {/* 1. Minimal Top Banner */}
      {siteSettings.showAnnouncement && (
        <div className="bg-[#13231B] text-zinc-300 text-[11px] sm:text-[12px] py-1.5 sm:py-2 px-3 sm:px-4 font-medium tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              {siteSettings.announcementArabic && (
                <span className="text-amber-300 font-semibold">{siteSettings.announcementArabic}</span>
              )}
              <span className="hidden sm:inline text-zinc-600">|</span>
              <span className="hidden sm:inline text-zinc-200">{siteSettings.announcementText}</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={`tel:${siteSettings.helplinePhone}`}
                className="hidden md:flex items-center gap-1.5 text-zinc-200 hover:text-white transition font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>হেল্পলাইন: {siteSettings.helplineDisplay}</span>
              </a>

              {/* Admin Portal Entry Button */}
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 text-[10.5px] font-bold border border-emerald-600/50 transition cursor-pointer"
                title="অ্যাডমিন প্যানেলে যান"
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>{isAdminLoggedIn ? 'অ্যাডমিন প্যানেল' : 'অ্যাডমিন'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3.5">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Logo / Brand Name */}
          <button
            type="button"
            onClick={() => onSelectCategory('home')}
            className="flex items-center gap-2 shrink-0 group cursor-pointer text-left focus:outline-none"
          >
            {siteSettings.logoImageUrl ? (
              <img
                src={siteSettings.logoImageUrl}
                alt={siteSettings.siteName}
                className="h-8 sm:h-10 object-contain"
              />
            ) : (
              <>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#13231B] text-amber-300 flex items-center justify-center font-bold text-sm sm:text-base shadow-xs group-hover:bg-[#1a2f24] transition">
                  {siteSettings.logoIcon || '☪'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 leading-none">
                    {siteSettings.siteName.slice(0, 3)}
                    <span className="text-[#13231B] font-extrabold">{siteSettings.siteName.slice(3)}</span>
                  </span>
                  <span className="text-[10px] text-zinc-500 font-semibold tracking-wider mt-0.5">
                    {siteSettings.tagline}
                  </span>
                </div>
              </>
            )}
          </button>

          {/* Minimal Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="আতর, জায়নামাজ, পাঞ্জাবি, তসবিহ খুঁজুন..."
                className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-full py-2.5 pl-4 pr-10 text-[13px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#13231B] focus:bg-white transition"
              />
              <Search className="absolute right-3.5 top-3 w-4 h-4 text-zinc-400" />
            </div>
          </div>

          {/* Actions: Wishlist & Cart */}
          <div className="flex items-center gap-3.5 text-zinc-700 text-xs font-semibold">
            
            <button
              onClick={onOpenWishlist}
              className="p-2 rounded-full hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 transition cursor-pointer relative"
              title="পছন্দের তালিকা"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 bg-[#13231B] hover:bg-[#1c3227] text-white px-4 py-2 rounded-full transition cursor-pointer active:scale-95 shadow-sm text-xs sm:text-[13px] font-semibold"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>কার্ট</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-zinc-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden mt-2.5">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="আতর, জায়নামাজ, পাঞ্জাবি খুঁজুন..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-2.5 pl-4 pr-9 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-800 focus:bg-white transition"
            />
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-zinc-400" />
          </div>
        </div>

      </div>

      {/* 3. Sub-Nav Row */}
      <div className="border-t border-zinc-100 bg-zinc-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4 text-[13px] sm:text-[13.5px] font-semibold text-zinc-700 py-2 overflow-x-auto no-scrollbar">
            {headerNavLinks.map((link) => {
              const targetCategory = link.categoryId || link.id;
              const isActive = activeCategory === targetCategory;

              return (
                <button
                  key={link.id}
                  onClick={() => onSelectCategory(targetCategory)}
                  className={`whitespace-nowrap px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 text-xs sm:text-[13px] font-bold ${
                    isActive
                      ? 'bg-[#13231B] text-amber-300 shadow-xs'
                      : 'hover:bg-zinc-200/70 text-zinc-700 hover:text-zinc-950'
                  }`}
                >
                  {link.showSparkle && <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-amber-600'}`} />}
                  <span>{link.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

    </header>
  );
};
