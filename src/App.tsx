import { useState, useMemo, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { CmsProvider, useCms } from './context/CmsContext';
import { Header } from './components/Header';
import { BelieverShowcaseHome } from './components/BelieverShowcaseHome';
import { ProductSection } from './components/ProductSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { QuickViewModal } from './components/QuickViewModal';
import { WishlistModal } from './components/WishlistModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CategoryView } from './components/CategoryView';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import type { Product } from './types';

function ShopContent() {
  const { data, isAdminLoggedIn } = useCms();
  const [activeCategoryView, setActiveCategoryView] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Admin Modal States
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Detect #admin or /admin in URL
  useEffect(() => {
    const handleHashOrUrl = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || hash === '#/admin' || path.includes('/admin')) {
        if (isAdminLoggedIn) {
          setIsAdminDashboardOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    handleHashOrUrl();
    window.addEventListener('hashchange', handleHashOrUrl);
    return () => window.removeEventListener('hashchange', handleHashOrUrl);
  }, [isAdminLoggedIn]);

  // Keyboard shortcut: Ctrl+Shift+A or Alt+A to open Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setIsAdminDashboardOpen((prev) => !prev);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn]);

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const { addToCart, setIsCartOpen } = useCart();

  // Dynamic products list from CMS context
  const productsList = data.products;

  // Filtered list when search query is active
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return productsList.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, productsList]);

  // Wishlist products
  const wishlistProducts = useMemo(() => {
    return productsList.filter((p) => wishlistIds.includes(p.id));
  }, [wishlistIds, productsList]);

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleBuyNow = (product: Product, size?: string) => {
    addToCart(product, size);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleSelectCategory = (categoryId: string) => {
    if (categoryId === 'home') {
      setActiveCategoryView(null);
    } else {
      setActiveCategoryView(categoryId);
    }
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-amber-200 selection:text-stone-900 font-sans">
      
      {/* 1. Header (Top Bar + Main Nav + Sub-Nav Row + Admin launcher) */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSelectCategory={handleSelectCategory}
        onOpenAdmin={handleOpenAdmin}
        activeCategory={activeCategoryView}
      />

      {/* When user searches, display search results grid */}
      {searchResults ? (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-black text-stone-900">
              সার্চ ফলাফল: "{searchQuery}" ({searchResults.length} টি পণ্য পাওয়া গেছে)
            </h2>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-[#1b382b] underline cursor-pointer"
            >
              সার্চ রিসেট করুন
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-2">
              <span className="text-3xl">🔍</span>
              <h3 className="font-bold text-stone-800 text-base">কোনো পণ্য পাওয়া যায়নি!</h3>
              <p className="text-xs text-stone-500">অন্য নাম লিখে চেষ্টা করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {searchResults.map((p) => (
                <div key={p.id}>
                  <ProductSection
                    title=""
                    products={[p]}
                    onBuyNow={handleBuyNow}
                    onQuickView={setQuickViewProduct}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      ) : activeCategoryView ? (
        /* Full Category & Size-Selector Filter View */
        <CategoryView
          key={activeCategoryView}
          initialCategory={activeCategoryView}
          onBackToHome={() => setActiveCategoryView(null)}
          onBuyNow={handleBuyNow}
          onQuickView={setQuickViewProduct}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      ) : (
        /* Believer Style Showcase Layout (Showroom Design) */
        <BelieverShowcaseHome
          onSelectCategory={handleSelectCategory}
          onBuyNow={handleBuyNow}
          onQuickView={setQuickViewProduct}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* 10. Slide-out Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      {/* 11. 1-Click Fast Cash on Delivery Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* 12. Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onBuyNow={handleBuyNow}
      />

      {/* 13. Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onBuyNow={handleBuyNow}
      />

      {/* 14. Floating WhatsApp Help Button */}
      <FloatingWhatsApp />

      {/* 15. Dark Forest Luxury Footer */}
      <Footer />

      {/* 16. Admin Login Modal */}
      {isAdminLoginOpen && (
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onSuccess={() => {
            setIsAdminDashboardOpen(true);
          }}
        />
      )}

      {/* 17. Full Admin CMS Studio Dashboard */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          onClose={() => {
            setIsAdminDashboardOpen(false);
            if (window.location.hash.includes('admin')) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <CartProvider>
        <ShopContent />
      </CartProvider>
    </CmsProvider>
  );
}
