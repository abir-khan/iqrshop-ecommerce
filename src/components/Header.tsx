import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, Phone, Sparkles, ShieldCheck, X } from 'lucide-react';
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/90 shadow-xs font-sans">
      
      {/* 1. Minimal Top Banner - Hidden on mobile to keep screen airy & clutter-free */}
      {siteSettings.showAnnouncement && (
        <div className="hidden sm:block bg-[#13231B] text-zinc-300 text-[11px] sm:text-[12px] py-1.5 sm:py-2 px-3 sm:px-4 font-medium tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              {siteSettings.announcementArabic && (
                <span className="text-amber-300 font-semibold">{siteSettings.announcementArabic}</span>
              )}
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-200">{siteSettings.announcementText}</span>
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

      {/* 2. Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
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
                className="h-7.5 sm:h-10 object-contain"
              />
            ) : (
              <>
                <div className="w-7.5 h-7.5 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#13231B] text-amber-300 flex items-center justify-center font-bold text-xs sm:text-base shadow-xs group-hover:bg-[#1a2f24] transition">
                  {siteSettings.logoIcon || '☪'}
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-2xl font-bold tracking-tight text-zinc-900 leading-none">
                    {siteSettings.siteName.slice(0, 3)}
                    <span className="text-[#13231B] font-extrabold">{siteSettings.siteName.slice(3)}</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 font-semibold tracking-wider mt-0.5">
                    {siteSettings.tagline}
                  </span>
                </div>
              </>
            )}
          </button>

          {/* Desktop Search Bar */}
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

          {/* Actions: Mobile Search Toggle, Wishlist & Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-zinc-700 text-xs font-semibold">
            
            {/* Mobile Search Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              className={`md:hidden p-2 rounded-full transition cursor-pointer ${
                isMobileSearchOpen || searchQuery
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'hover:bg-zinc-100 text-zinc-700'
              }`}
              title="সার্চ করুন"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="p-2 rounded-full hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 transition cursor-pointer relative"
              title="পছন্দের তালিকা"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[8.5px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 bg-[#13231B] hover:bg-[#1c3227] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition cursor-pointer active:scale-95 shadow-xs text-xs sm:text-[13px] font-semibold"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              <span className="hidden xs:inline">কার্ট</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-zinc-950 text-[9.5px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Expandable Mobile Search Bar */}
        {(isMobileSearchOpen || searchQuery) && (
          <div className="md:hidden mt-2 pt-1 animate-fadeIn">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                autoFocus={isMobileSearchOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="আতর, জায়নামাজ, পাঞ্জাবি খুঁজুন..."
                className="w-full bg-zinc-50 border border-emerald-700/50 rounded-full py-2 pl-4 pr-16 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-800 focus:bg-white shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-8 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="absolute right-2.5 text-zinc-500 hover:text-zinc-800 p-1 cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 3. Sub-Nav Category Row */}
      <div className="border-t border-zinc-100/90 bg-zinc-50/70">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2.5 text-xs sm:text-[13px] font-semibold text-zinc-700 py-1.5 sm:py-2 overflow-x-auto no-scrollbar scroll-smooth">
            {headerNavLinks
              .filter((link) => link.enabled !== false)
              .map((link) => {
              const targetCategory = link.categoryId || link.id;
              const isActive = activeCategory === targetCategory;

              return (
                <button
                  key={link.id}
                  onClick={() => onSelectCategory(targetCategory)}
                  className={`whitespace-nowrap px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1 text-[11px] sm:text-xs font-bold shrink-0 ${
                    isActive
                      ? 'bg-[#13231B] text-amber-300 shadow-xs ring-1 ring-emerald-800/40'
                      : 'hover:bg-zinc-200/70 text-zinc-700 hover:text-zinc-950 bg-white/80 border border-zinc-200/70'
                  }`}
                >
                  {link.showSparkle && <Sparkles className={`w-3 h-3 ${isActive ? 'text-amber-300' : 'text-amber-600'}`} />}
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
