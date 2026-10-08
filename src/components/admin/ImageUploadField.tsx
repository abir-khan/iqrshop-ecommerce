import React, { useRef } from 'react';
import { Upload, Link as LinkIcon, Trash2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  recommendedSize: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  recommendedSize,
  value,
  onChange,
  placeholder = 'https://images.unsplash.com/... অথবা ছবি আপলোড করুন',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-1.5">
      {/* Label and Recommended Size Badge */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
          <span>{label}</span>
        </label>
        <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
          প্রস্তাবিত সাইজ: {recommendedSize}
        </span>
      </div>

      {/* Input row & Upload Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <LinkIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 active:scale-95"
          title="কম্পিউটার থেকে ছবি বাছাই করুন"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ছবি আপলোড</span>
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition cursor-pointer shrink-0"
            title="ছবি মুছে ফেলুন"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Live Preview */}
      {value && (
        <div className="relative mt-2 p-1.5 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-200 shrink-0 border border-zinc-300">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://via.placeholder.com/150?text=Invalid+Image';
              }}
            />
          </div>
          <div className="text-[11px] text-zinc-500 truncate flex-1 pr-2">
            <span className="font-semibold text-emerald-700 block">✓ ছবি প্রিভিউ লোড হয়েছে</span>
            <span className="truncate block text-zinc-400 max-w-[250px]">{value.slice(0, 50)}...</span>
          </div>
        </div>
      )}
    </div>
  );
};
