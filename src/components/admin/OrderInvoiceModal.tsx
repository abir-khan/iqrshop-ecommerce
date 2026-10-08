import React from 'react';
import { X, Printer, Phone, MessageCircle, MapPin, Calendar } from 'lucide-react';
import type { CustomerOrder, OrderStatus, SiteSettings } from '../../types/cms';

interface OrderInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CustomerOrder | null;
  siteSettings: SiteSettings;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
  siteSettings,
  onStatusChange,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold">⏳ অপেক্ষমাণ (Pending)</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-1 rounded-full text-xs font-bold">✓ নিশ্চিত (Confirmed)</span>;
      case 'shipped':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-1 rounded-full text-xs font-bold">🚚 শিপমেন্টে (Shipped)</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold">🎉 ডেলিভার্ড (Delivered)</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-900 border border-rose-300 px-2.5 py-1 rounded-full text-xs font-bold">✕ বাতিল (Cancelled)</span>;
      default:
        return null;
    }
  };

  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/88${cleanPhone.startsWith('88') ? cleanPhone.slice(2) : cleanPhone}?text=${encodeURIComponent(
    `আসসালামু আলাইকুম ${order.customerName} সাহেব, আপনার ${order.id} অর্ডারের বিষয়ে ${siteSettings.siteName} থেকে যোগাযোগ করা হচ্ছে।`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto font-sans">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions (Not in Print) */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              অর্ডার ডিটেইলস ও ইনভয়েস চালনা
            </h3>
            {getStatusBadge(order.status)}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-700" />
              <span>প্রিন্ট চালান</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{siteSettings.siteName}</h2>
              <p className="text-xs text-slate-500">{siteSettings.tagline}</p>
              <p className="text-xs text-slate-500">{siteSettings.address}</p>
              <p className="text-xs text-slate-500 font-mono">হেল্পলাইন: {siteSettings.helplineDisplay}</p>
            </div>

            <div className="text-right space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">ইনভয়েস নম্বর</span>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-800">{order.id}</div>
              <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(order.createdAt).toLocaleDateString('bn-BD')}</span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                গ্রাহকের তথ্য (Customer Details)
              </span>
              <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
              <div className="text-xs text-slate-600 font-mono flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="pt-2 flex items-center gap-2 print:hidden">
                <a
                  href={`tel:${order.customerPhone}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition shadow-2xs"
                >
                  <Phone className="w-3 h-3 text-emerald-700" />
                  <span>কল দিন</span>
                </a>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-2xs"
                >
                  <MessageCircle className="w-3 h-3 text-amber-300" />
                  <span>WhatsApp চ্যাট</span>
                </a>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                ডেলিভারি ঠিকানা ও এলাকা
              </span>
              <div className="text-xs text-slate-800 font-medium flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>{order.customerAddress}</span>
              </div>
              <div className="text-xs text-slate-600">
                এলাকা: <b className="text-slate-800">{order.deliveryArea === 'inside_dhaka' ? 'ঢাকা সিটির ভেতরে (৬০/৭০ ৳)' : 'ঢাকার বাইরে সমগ্র বাংলাদেশ (১২০ ৳)'}</b>
              </div>
              {order.notes && (
                <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">
                  <b>গ্রাহকের নোট:</b> {order.notes}
                </div>
              )}
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              অর্ডারের পণ্যসমূহ ({order.items.length} টি আইটেম)
            </span>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-3">পণ্য</th>
                    <th className="p-3 text-center">সাইজ/ভ্যারিয়েন্ট</th>
                    <th className="p-3 text-center">পরিমাণ</th>
                    <th className="p-3 text-right">মূল্য</th>
                    <th className="p-3 text-right">মোট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                          <span className="font-bold text-slate-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center text-slate-600 font-medium">
                        {item.selectedSize ? <span className="bg-slate-100 px-2 py-0.5 rounded-md">{item.selectedSize}</span> : '—'}
                      </td>
                      <td className="p-3 text-center font-bold text-slate-900">{item.quantity}</td>
                      <td className="p-3 text-right font-mono">৳{item.price}</td>
                      <td className="p-3 text-right font-bold font-mono text-slate-900">৳{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>সাব-টোটাল:</span>
                <span className="font-mono">৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-mono">+ ৳{order.deliveryCharge}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>কুপন ডিসকাউন্ট:</span>
                  <span className="font-mono">- ৳{order.discount}</span>
                </div>
              )}
              <div className="border-t border-slate-300 pt-2 flex justify-between font-black text-sm text-slate-900">
                <span>সর্বমোট প্রদেয়:</span>
                <span className="text-emerald-800 font-mono text-base">৳{order.totalAmount}</span>
              </div>
              <div className="text-[10.5px] text-slate-500 pt-1 text-right">
                পেমেন্ট মেথড: <b>{order.paymentMethod}</b>
              </div>
            </div>
          </div>

          {/* Quick Status Updater (Not in print) */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <div className="text-xs text-emerald-950 font-bold">
              অর্ডারের বর্তমান অবস্থা পরিবর্তন করুন:
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusChange(order.id, st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    order.status === st
                      ? 'bg-emerald-800 text-white shadow-xs scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {st === 'pending' && 'অপেক্ষমাণ'}
                  {st === 'confirmed' && 'নিশ্চিত'}
                  {st === 'shipped' && 'শিপমেন্টে'}
                  {st === 'delivered' && 'ডেলিভার্ড'}
                  {st === 'cancelled' && 'বাতিল'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
