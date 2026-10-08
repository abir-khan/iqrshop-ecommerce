import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCms } from '../context/CmsContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const { createOrder, data: cmsData } = useCms();
  const { siteSettings } = cmsData;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryArea: 'inside_dhaka',
    notes: '',
  });

  const [couponInput, setCouponInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  // Delivery Charge: 70 BDT inside Dhaka, 120 BDT outside Dhaka
  const deliveryCharge = formData.deliveryArea === 'inside_dhaka' ? 70 : 120;

  // Discount calculation
  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const grandTotal = Math.max(0, cartTotal - discountAmount + deliveryCharge);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponInput.trim().toUpperCase();
    if (code === 'IQR10') {
      setDiscountPercent(10);
      setCouponSuccess('১০% কুপন ডিসকাউন্ট সফলভাবে প্রয়োগ হয়েছে!');
    } else {
      setCouponError('কুপন কোডটি সঠিক নয়। দয়া করে IQR10 লিখুন।');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('দয়া করে নাম, মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা পূরণ করুন।');
      return;
    }

    if (formData.phone.length < 11) {
      alert('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)');
      return;
    }

    const generatedId = `IQR-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    // Save order into CMS store
    const orderedItems = cart.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      image: item.product.image,
    }));

    createOrder({
      id: generatedId,
      customerName: formData.name.trim(),
      customerPhone: formData.phone.trim(),
      customerAddress: formData.address.trim(),
      deliveryArea: formData.deliveryArea as 'inside_dhaka' | 'outside_dhaka',
      notes: formData.notes.trim() || undefined,
      items: orderedItems,
      subtotal: cartTotal,
      deliveryCharge,
      discount: discountAmount,
      totalAmount: grandTotal,
      status: 'pending',
      paymentMethod: 'ক্যাশ অন ডেলিভারি (COD)',
      createdAt: new Date().toISOString(),
    });

    setIsSuccess(true);
    clearCart();
  };

  const waNumber = siteSettings?.whatsappNumber?.replace(/[^0-9]/g, '') || '8801700000000';
  const cleanWaNumber = waNumber.startsWith('88') ? waNumber : `88${waNumber}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E8DFD1] relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#EFE8DC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0D382D] text-amber-300 flex items-center justify-center font-bold">
              📦
            </div>
            <div>
              <h3 className="font-black text-stone-900 text-base sm:text-lg">
                ক্যাশ অন ডেলিভারি দ্রুত অর্ডার
              </h3>
              <span className="text-[11px] text-emerald-800 font-semibold">
                পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করুন
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <span className="inline-block bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full">
              অর্ডার নম্বর: {orderId}
            </span>

            <h4 className="text-2xl font-black text-stone-900">
              আলহামদুলিল্লাহ! আপনার অর্ডার সফল হয়েছে
            </h4>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
              ধন্যবাদ <strong>{formData.name}</strong>। আপনার অর্ডারটি কনফার্ম করার জন্য আমাদের কাস্টমার প্রতিনিধি শীঘ্রই <strong>{formData.phone}</strong> নম্বরে কল করবেন।
            </p>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EFE8DC] text-xs text-stone-600 text-left space-y-1">
              <div className="flex justify-between">
                <span>ডেলিভারি ঠিকানা:</span>
                <span className="font-bold text-stone-800 text-right max-w-[200px] truncate">{formData.address}</span>
              </div>
              <div className="flex justify-between">
                <span>মোট পরিশোধযোগ্য মূল্য:</span>
                <span className="font-black text-[#0D382D] text-sm">৳{grandTotal}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমার অর্ডার নম্বর ${orderId} কনফার্ম করতে চাই।`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition shadow cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপে আপডেট পান</span>
              </a>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs py-3 px-6 rounded-xl transition cursor-pointer"
              >
                আরও শピング করুন
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                আপনার নাম *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="যেমন: মোঃ আব্দুল্লাহ"
                className="w-full bg-[#FAF8F5] border border-[#E8DFD1] rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-stone-800 focus:ring-2 focus:ring-[#0D382D] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                মোবাইল নম্বর (১১ ডিজিট) *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="যেমন: 01712345678"
                className="w-full bg-[#FAF8F5] border border-[#E8DFD1] rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-stone-800 focus:ring-2 focus:ring-[#0D382D] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/থানা/জেলা) *
              </label>
              <textarea
                required
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="যেমন: বাড়ি # ১২, রোড # ৪, সেক্টর # ৭, উত্তরা, ঢাকা"
                className="w-full bg-[#FAF8F5] border border-[#E8DFD1] rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-stone-800 focus:ring-2 focus:ring-[#0D382D] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Delivery Area Options */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                ডেলিভারি এলাকা নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryArea: 'inside_dhaka' })}
                  className={`min-h-[48px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-0.5 ${
                    formData.deliveryArea === 'inside_dhaka'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-800/30'
                      : 'bg-[#FAF8F5] border-[#E8DFD1] text-stone-700 hover:bg-[#F3EDE2]'
                  }`}
                >
                  <span>ঢাকার ভেতরে</span>
                  <span className={`text-[11px] font-bold ${formData.deliveryArea === 'inside_dhaka' ? 'text-amber-300' : 'text-emerald-800'}`}>
                    ৳৭০
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryArea: 'outside_dhaka' })}
                  className={`min-h-[48px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-0.5 ${
                    formData.deliveryArea === 'outside_dhaka'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-800/30'
                      : 'bg-[#FAF8F5] border-[#E8DFD1] text-stone-700 hover:bg-[#F3EDE2]'
                  }`}
                >
                  <span>ঢাকার বাইরে</span>
                  <span className={`text-[11px] font-bold ${formData.deliveryArea === 'outside_dhaka' ? 'text-amber-300' : 'text-emerald-800'}`}>
                    ৳১২০
                  </span>
                </button>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ডিসকাউন্ট কুপন (যদি থাকে):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="যেমন: IQR10"
                  className="flex-1 bg-[#FAF8F5] border border-[#E8DFD1] rounded-xl py-2 px-3 text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#0D382D]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-[#0D382D] text-white text-xs font-bold px-4 rounded-xl hover:bg-[#124B3D] transition cursor-pointer"
                >
                  প্রয়োগ
                </button>
              </div>
              {couponSuccess && (
                <p className="text-[11px] text-emerald-700 font-bold mt-1">✓ {couponSuccess}</p>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 font-bold mt-1">✕ {couponError}</p>
              )}
            </div>

            {/* Order Summary Box */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8DFD1] space-y-2 text-xs text-stone-700">
              <div className="flex justify-between">
                <span>পণ্যের মোট মূল্য:</span>
                <span className="font-bold text-stone-900">৳{cartTotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>কুপন ছাড় (১০%):</span>
                  <span>-৳{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>ডেলিভারি চার্জ ({formData.deliveryArea === 'inside_dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}):</span>
                <span className="font-black text-emerald-800">
                  +৳{deliveryCharge}
                </span>
              </div>

              <div className="flex justify-between items-center font-black text-sm sm:text-base text-[#0D382D] pt-2 border-t border-[#E8DFD1]">
                <span>সর্বমোট পরিশোধযোগ্য:</span>
                <span className="text-base sm:text-lg">৳{grandTotal}</span>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-600 bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>কোনো অগ্রিম পেমেন্ট নেই • পণ্য দেখে চেক করে টাকা দিন</span>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white font-black py-3.5 rounded-xl shadow-lg transition-all text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-amber-300" />
              <span>অর্ডার নিশ্চিত করুন (৳{grandTotal})</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
