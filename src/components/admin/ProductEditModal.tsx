import React, { useState } from 'react';
import { X, Save, Trash2, Package, Tag, DollarSign } from 'lucide-react';
import type { Product, Category } from '../../types';
import { ImageUploadField } from './ImageUploadField';

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  categories: Category[];
  onSave: (product: Product) => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  product,
  categories,
  onSave,
}) => {
  const isEditing = !!product;

  const [formData, setFormData] = useState<Product>(() => {
    if (product) return { ...product };
    return {
      id: `p-${Date.now()}`,
      name: '',
      category: categories[1]?.id || 'panjabi',
      price: 0,
      originalPrice: 0,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewsCount: 1,
      badge: 'নতুন',
      isPopular: false,
      inStock: true,
      description: '',
      features: ['১০০% অরিজিনাল ও হালাল', 'সরাসরি সংগ্রহকৃত', '৭ দিনের রিটার্ন সুবিধা'],
      sizes: [],
    };
  });

  const [newFeature, setNewFeature] = useState('');
  const [newSize, setNewSize] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  const addSize = () => {
    if (newSize.trim()) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...(prev.sizes || []), newSize.trim()],
      }));
      setNewSize('');
    }
  };

  const removeSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: (prev.sizes || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {isEditing ? 'প্রোডাক্ট এডিট করুন' : 'নতুন প্রোডাক্ট যুক্ত করুন'}
              </h3>
              <p className="text-xs text-slate-500">প্রোডাক্টের সমস্ত তথ্য ও ছবি পরিবর্তন করুন</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          {/* Product Name */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-700">প্রোডাক্টের নাম *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="যেমন: রয়েল এরাবিয়ান ওউদ আতর"
              className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Category & Badge Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-zinc-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-700" />
                <span>ক্যাটাগরি</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium text-xs sm:text-sm"
              >
                {categories
                  .filter((c) => c.id !== 'all')
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700">ব্যাজ / ট্যাগ (ঐচ্ছিক)</label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="যেমন: বেস্ট সেলার, নতুন, অফার"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-zinc-700 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                <span>বিক্রয় মূল্য (টাকা) *</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-bold text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700 flex items-center gap-1">
                <span>আগের মূল্য / রেগুলার প্রাইজ (টাকা)</span>
              </label>
              <input
                type="number"
                min={0}
                value={formData.originalPrice || 0}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-bold text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Main Primary Image */}
          <ImageUploadField
            label="প্রোডাক্টের প্রধান ছবি (Primary Image)"
            recommendedSize="৮০০ × ৮০০ পিক্সেল (১:১ স্কয়ার)"
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />

          {/* Multiple Additional Gallery Images */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-900 text-xs sm:text-sm block">
                  অতিরিক্ত গ্যালারি ছবিসমূহ (একের অধিক ছবি)
                </label>
                <p className="text-[11px] text-slate-500">
                  গ্রাহক প্রোডাক্টের উপর ক্লিক করলে সবগুলো ছবি বড় করে ও গ্যালারিতে দেখতে পাবে
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), ''],
                  }));
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                + আরও ছবি যোগ করুন
              </button>
            </div>

            {/* List of Additional Images */}
            {formData.images && formData.images.length > 0 ? (
              <div className="space-y-3 pt-1">
                {formData.images.map((imgUrl, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        ছবি #{imgIdx + 2}
                      </span>

                      <div className="flex items-center gap-2">
                        {imgUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              // Swap this image with primary image
                              const oldPrimary = formData.image;
                              const updatedImages = [...(formData.images || [])];
                              updatedImages[imgIdx] = oldPrimary;
                              setFormData({
                                ...formData,
                                image: imgUrl,
                                images: updatedImages,
                              });
                            }}
                            className="text-[10.5px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 cursor-pointer"
                          >
                            মূল ছবি বানান
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              images: (prev.images || []).filter((_, i) => i !== imgIdx),
                            }));
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="এই ছবি মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <ImageUploadField
                      label=""
                      recommendedSize="৮০০ × ৮০০ পিক্সেল"
                      value={imgUrl}
                      onChange={(url) => {
                        const copy = [...(formData.images || [])];
                        copy[imgIdx] = url;
                        setFormData({ ...formData, images: copy });
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                বর্তমানে কোনো অতিরিক্ত ছবি নেই। প্রয়োজনে "+ আরও ছবি যোগ করুন" বাটনে চাপুন।
              </div>
            )}
          </div>

          {/* In Stock & Popular Switches */}
          <div className="flex items-center gap-6 p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800 text-xs">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>স্টকে আছে (In Stock)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800 text-xs">
              <input
                type="checkbox"
                checked={formData.isPopular || false}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>পপুলার / হোমপেজ হাইলাইট</span>
            </label>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-700">বিস্তারিত বিবরণ (Description)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="পণ্যটির গুণাগুণ, ব্যবহার ও বৈশিষ্ট্য লিখুন..."
              className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Sizes / Variations */}
          <div className="space-y-2">
            <label className="font-bold text-zinc-700">সাইজ / ভ্যারিয়েন্ট (পাঞ্জাবি, টুপি ইত্যাদি পণ্যের জন্য)</label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {(formData.sizes || []).map((sz, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-300 text-emerald-900 px-2.5 py-0.5 rounded-lg text-xs font-bold"
                >
                  <span>{sz}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(idx)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="যেমন: 38, 40, 42, 12ml"
                className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={addSize}
                className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              >
                + সাইজ যোগ করুন
              </button>
            </div>
          </div>

          {/* Features Bullets */}
          <div className="space-y-2">
            <label className="font-bold text-zinc-700">মূল বৈশিষ্ট্যসমূহ (Bullet Points)</label>
            <div className="space-y-1 mb-2">
              {(formData.features || []).map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-1.5 px-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs"
                >
                  <span>• {feat}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="নতুন বৈশিষ্ট্য লিখুন..."
                className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              >
                + পয়েন্ট যোগ করুন
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'পরিবর্তন সংরক্ষণ করুন' : 'প্রোডাক্ট সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
