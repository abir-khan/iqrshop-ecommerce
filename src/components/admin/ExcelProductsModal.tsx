import React, { useState, useRef } from 'react';
import {
  X,
  FileSpreadsheet,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  FileText,
  Layers,
  Info,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Eye,
} from 'lucide-react';
import type { Product, Category } from '../../types';
import {
  parseProductsFromExcel,
  exportProductsToExcel,
  downloadSampleExcelTemplate,
} from '../../lib/excelProductService';
import type { ParseExcelResult } from '../../lib/excelProductService';

interface ExcelProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onImportSuccess: (
    newProducts: Product[],
    mode: 'merge' | 'replace'
  ) => { added: number; updated: number; total: number };
}

export const ExcelProductsModal: React.FC<ExcelProductsModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  onImportSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'guide'>('import');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseExcelResult | null>(null);
  const [parseError, setParseError] = useState<string>('');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importStats, setImportStats] = useState<{
    added: number;
    updated: number;
    total: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    setParseError('');
    setImportStats(null);
    setParseResult(null);

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setParseError('অনুগ্রহ করে একটি বৈধ এক্সেল (.xlsx, .xls) অথবা .csv ফাইল আপলোড করুন।');
      return;
    }

    setSelectedFile(file);
    setIsParsing(true);

    try {
      const result = await parseProductsFromExcel(file, categories);
      setParseResult(result);
    } catch (err: any) {
      setParseError(err.message || 'ফাইল প্রসেসিং করতে সমস্যা হয়েছে। ফাইলের ফরম্যাট ঠিক আছে কিনা যাচাই করুন।');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (!parseResult || parseResult.products.length === 0) return;

    if (
      importMode === 'replace' &&
      !window.confirm(
        'সতর্কতা: "Replace All" মোডে বর্তমান সকল প্রোডাক্ট মুছে গিয়ে শুধুমাত্র এই এক্সেলের প্রোডাক্টগুলো থাকবে। আপনি কি নিশ্চিত?'
      )
    ) {
      return;
    }

    try {
      const stats = onImportSuccess(parseResult.products, importMode);
      setImportStats(stats);
    } catch (err: any) {
      setParseError('ইমপোর্ট সংরক্ষণে সমস্যা হয়েছে: ' + (err.message || ''));
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParseResult(null);
    setParseError('');
    setImportStats(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-300 border border-white/15">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
                এক্সেল প্রোডাক্ট ম্যানেজার
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-emerald-200">
                  Import & Export
                </span>
              </h3>
              <p className="text-xs text-emerald-100/80">
                এক্সেলে সহজে সকল প্রোডাক্টের তথ্য, ছবি, ক্যাটাগরি, সাইজ ও মূল্য আপলোড ও ডাউনলোড করুন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'import'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>এক্সেল ফাইল আপলোড (Import)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>প্রোডাক্ট ডাউনলোড (Export)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>কলাম গাইড ও নির্দেশিকা</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ========================================================= */}
          {/* TAB 1: IMPORT EXCEL */}
          {/* ========================================================= */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              {/* Quick Template Download Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      আপনার কি এক্সেল ফরম্যাটের নমুনা ফাইল প্রয়োজন?
                    </h4>
                    <p className="text-xs text-emerald-800">
                      নমুনা ফাইলে ছবি, ক্যাটাগরি, সাইজ, বিবরণসহ সকল কলামের উদাহরণ দেওয়া আছে।
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={downloadSampleExcelTemplate}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer shrink-0 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>নমুনা টেমপ্লেট ডাউনলোড (.xlsx)</span>
                </button>
              </div>

              {/* Import Success State */}
              {importStats && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-base font-bold">অভিনন্দন! সফলভাবে ইমপোর্ট সম্পন্ন হয়েছে</h4>
                      <p className="text-xs text-emerald-700">
                        মোট {importStats.total}টি প্রোডাক্ট সফলভাবে প্রক্রিয়াকরণ করা হয়েছে ({importStats.added}টি নতুন যোগ, {importStats.updated}টি আপডেট)।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      ড্যাশবোর্ডে ফিরুন
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      আরেকটি ফাইল আপলোড করুন
                    </button>
                  </div>
                </div>
              )}

              {/* Dropzone Area (Shown if no file selected yet) */}
              {!parseResult && !importStats && (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative p-8 sm:p-10 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-emerald-600 bg-emerald-50/50 scale-[1.01]'
                      : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-inner">
                    {isParsing ? (
                      <RefreshCw className="w-8 h-8 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8" />
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-800 mb-1">
                    {isParsing
                      ? 'এক্সেল ফাইল প্রসেসিং হচ্ছে...'
                      : 'আপনার এক্সেল ফাইলটি ড্র্যাগ করে এখানে ছাড়ুন অথবা ক্লিক করুন'}
                  </h4>

                  <p className="text-xs text-slate-500 max-w-md">
                    সমর্থিত ফরম্যাট: <span className="font-semibold text-slate-700">.xlsx, .xls, .csv</span>।
                    সকল প্রোডাক্ট, ছবি, ক্যাটাগরি, সাইজ, বিবরণ ও দাম স্বয়ংক্রিয়ভাবে ইনসার্ট বা আপডেট হবে।
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs hover:border-emerald-400">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>কম্পিউটার থেকে ফাইল সিলেক্ট করুন</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {parseError && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">ত্রুটি ঘটেছে:</p>
                    <p>{parseError}</p>
                  </div>
                </div>
              )}

              {/* Parsed Preview Section */}
              {parseResult && !importStats && (
                <div className="space-y-5">
                  {/* File Info Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span>{selectedFile?.name}</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            ({((selectedFile?.size || 0) / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 mt-0.5">
                          <span className="text-emerald-700 font-bold">
                            ✓ {parseResult.products.length}টি বৈধ প্রোডাক্ট পাওয়া গেছে
                          </span>
                          {parseResult.newCategories.length > 0 && (
                            <span className="text-indigo-700 font-medium">
                              • {parseResult.newCategories.length}টি নতুন ক্যাটাগরি তৈরি হবে
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold rounded-xl transition cursor-pointer self-start sm:self-auto"
                    >
                      অন্য ফাইল দিন
                    </button>
                  </div>

                  {/* Warnings if any */}
                  {parseResult.warnings.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-amber-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span>সতর্কবার্তা ({parseResult.warnings.length}টি):</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-700 max-h-24 overflow-y-auto pl-1">
                        {parseResult.warnings.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Import Mode Selector */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-700" />
                      <span>ইমপোর্ট মোড নির্বাচন করুন:</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Merge Mode */}
                      <label
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition ${
                          importMode === 'merge'
                            ? 'border-emerald-600 bg-emerald-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'merge'}
                          onChange={() => setImportMode('merge')}
                          className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="text-xs space-y-0.5">
                          <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                            <span>🔄 সংযোজন ও আপডেট (Merge & Update)</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md font-bold">
                              প্রস্তাবিত
                            </span>
                          </span>
                          <p className="text-slate-500 text-[11px]">
                            আইডি বা নাম মিলে গেলে আগের পণ্যটি আপডেট হবে, আর নতুন পণ্যগুলো বিদ্যমান তালিকায় যোগ হবে।
                          </p>
                        </div>
                      </label>

                      {/* Replace Mode */}
                      <label
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition ${
                          importMode === 'replace'
                            ? 'border-rose-600 bg-rose-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="mt-0.5 text-rose-600 focus:ring-rose-500"
                        />
                        <div className="text-xs space-y-0.5">
                          <span className="font-bold text-rose-900 block">
                            ⚠️ সব মুছে নতুন বসানো (Replace All)
                          </span>
                          <p className="text-slate-500 text-[11px]">
                            বিদ্যমান সমস্ত পণ্য ডিলিট হয়ে শুধুমাত্র এই এক্সেল ফাইলের পণ্যগুলোই সেভ হবে।
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Preview Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>প্রোডাক্ট প্রিভিউ (প্রথম {Math.min(parseResult.products.length, 25)}টি পণ্য):</span>
                      </span>
                      <span className="text-slate-400 font-normal">
                        মোট: {parseResult.products.length}টি
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-64 overflow-y-auto bg-white shadow-2xs">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0 border-b border-slate-200 text-[11px]">
                          <tr>
                            <th className="p-2.5">ছবি</th>
                            <th className="p-2.5">আইডি</th>
                            <th className="p-2.5">পণ্যের নাম</th>
                            <th className="p-2.5">ক্যাটাগরি</th>
                            <th className="p-2.5">মূল্য</th>
                            <th className="p-2.5">স্টক</th>
                            <th className="p-2.5">সাইজ/ভ্যারিয়েন্ট</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {parseResult.products.slice(0, 25).map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition">
                              <td className="p-2">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-9 h-9 rounded-lg object-cover bg-slate-100 border border-slate-200"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=80';
                                  }}
                                />
                              </td>
                              <td className="p-2 font-mono text-[11px] text-slate-500">{p.id}</td>
                              <td className="p-2 font-bold text-slate-900 max-w-[200px] truncate">
                                {p.name}
                              </td>
                              <td className="p-2">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold">
                                  {p.category}
                                </span>
                              </td>
                              <td className="p-2 font-bold text-emerald-700">
                                ৳{p.price}
                                {p.originalPrice && (
                                  <span className="text-[10px] text-slate-400 line-through ml-1">
                                    ৳{p.originalPrice}
                                  </span>
                                )}
                              </td>
                              <td className="p-2">
                                {p.inStock ? (
                                  <span className="text-emerald-700 bg-emerald-50 text-[10px] px-1.5 py-0.5 rounded-sm font-semibold">
                                    স্টকে আছে
                                  </span>
                                ) : (
                                  <span className="text-rose-700 bg-rose-50 text-[10px] px-1.5 py-0.5 rounded-sm font-semibold">
                                    স্টক নেই
                                  </span>
                                )}
                              </td>
                              <td className="p-2 text-[11px] text-slate-500">
                                {p.sizes && p.sizes.length > 0 ? p.sizes.join(', ') : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Confirm & Save Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmImport}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{parseResult.products.length}টি প্রোডাক্ট ইমপোর্ট কনফার্ম করুন</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: EXPORT / DOWNLOAD CURRENT PRODUCTS */}
          {/* ========================================================= */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                  <Download className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900">
                    বর্তমান প্রোডাক্ট ক্যাটালগ এক্সেল ডাউনলোড করুন
                  </h4>
                  <p className="text-xs text-slate-500 max-w-lg mx-auto">
                    আপনার স্টোরের সকল প্রোডাক্টের ছবি, মূল্য, বিবরণ, সাইজ ও স্টক স্ট্যাটাস সম্বলিত
                    পূর্ণাঙ্গ <span className="font-semibold text-slate-700">.xlsx</span> ফাইল ডাউনলোড
                    করুন। এটি এডিট করে পরবর্তীতে পুনরায় আপলোড করতে পারবেন।
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto py-2">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block">মোট প্রোডাক্ট</span>
                    <span className="text-lg font-extrabold text-slate-800">{products.length}টি</span>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block">ক্যাটাগরি</span>
                    <span className="text-lg font-extrabold text-slate-800">{categories.length}টি</span>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-400 block">ফরম্যাট</span>
                    <span className="text-lg font-extrabold text-emerald-700">Excel (.xlsx)</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      exportProductsToExcel(
                        products,
                        `iqrshop_products_${new Date().toISOString().slice(0, 10)}.xlsx`
                      )
                    }
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>সব প্রোডাক্ট এক্সেল ডাউনলোড করুন (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadSampleExcelTemplate}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>নমুনা টেমপ্লেট দেখুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: COLUMN GUIDE & INSTRUCTIONS */}
          {/* ========================================================= */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">এক্সেল কলাম নিয়মাবলি</h4>
                  <p className="text-emerald-800 text-[11px]">
                    এক্সেল ফাইলে নিচের কলামগুলোর নাম বাংলায় বা ইংরেজিতে ব্যবহার করতে পারেন।
                    সিস্টেম স্বয়ংক্রিয়ভাবে কলামগুলো চিনে নেবে।
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="p-3">কলামের নাম</th>
                      <th className="p-3">বাংলা বা বিকল্প নাম</th>
                      <th className="p-3">বাধ্যতামূলক?</th>
                      <th className="p-3">উদাহরন ও বিবরণ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-[11.5px]">
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-800">Name</td>
                      <td className="p-3 font-medium">নাম, Product Name, পণ্য</td>
                      <td className="p-3 font-bold text-rose-600">হ্যাঁ (আবশ্যক)</td>
                      <td className="p-3 text-slate-600">রয়েল আম্বার উদ আতর ১২ মি.লি.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-800">Category</td>
                      <td className="p-3 font-medium">ক্যাটাগরি, বিভাগ</td>
                      <td className="p-3 font-bold text-rose-600">হ্যাঁ (আবশ্যক)</td>
                      <td className="p-3 text-slate-600">attar, panjabi, janamaz, tasbih (নতুন দিলে তৈরি হবে)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-800">Price</td>
                      <td className="p-3 font-medium">মূল্য, দাম, বিক্রয় মূল্য</td>
                      <td className="p-3 font-bold text-rose-600">হ্যাঁ (আবশ্যক)</td>
                      <td className="p-3 text-slate-600">1250 (শুধু সংখ্যা)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-800">Original Price</td>
                      <td className="p-3 font-medium">আগের দাম, পূর্ব মূল্য</td>
                      <td className="p-3 text-slate-400">ঐচ্ছিক</td>
                      <td className="p-3 text-slate-600">1600 (কাটা দাগ দেখানো হবে)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-800">Main Image URL</td>
                      <td className="p-3 font-medium">Image, ছবি, প্রধান ছবি</td>
                      <td className="p-3 text-emerald-700 font-semibold">প্রস্তাবিত</td>
                      <td className="p-3 text-slate-600">https://images.unsplash.com/... (ছবির ওয়েব লিংক)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-800">Gallery Images</td>
                      <td className="p-3 font-medium">Images, গ্যালারি ছবি</td>
                      <td className="p-3 text-slate-400">ঐচ্ছিক</td>
                      <td className="p-3 text-slate-600">একাধিক ছবির লিংক কমা (,) দিয়ে দিন</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-800">Sizes</td>
                      <td className="p-3 font-medium">সাইজ, Variants, মাপ</td>
                      <td className="p-3 text-slate-400">ঐচ্ছিক</td>
                      <td className="p-3 text-slate-600">38, 40, 42, 44 অথবা 6ml, 12ml (কমা দিয়ে)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-800">Features</td>
                      <td className="p-3 font-medium">বৈশিষ্ট্য, পয়েন্ট</td>
                      <td className="p-3 text-slate-400">ঐচ্ছিক</td>
                      <td className="p-3 text-slate-600">১০০% পিওর সুতি | আরামদায়ক (পাইপ | বা কমা দিয়ে)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-800">In Stock</td>
                      <td className="p-3 font-medium">স্টক, স্টকে আছে</td>
                      <td className="p-3 text-slate-400">ঐচ্ছিক</td>
                      <td className="p-3 text-slate-600">YES, NO, TRUE, FALSE বা 1, 0 (ডিফল্ট: YES)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-800">Badge</td>
                      <td className="p-3 font-medium">ব্যাজ, ট্যাগ</td>
                      <td className="p-3 text-slate-400">ঐচ্ছিক</td>
                      <td className="p-3 text-slate-600">বেস্ট সেলার, নতুন, অফার, ২০% ছাড় ইত্যাদি</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-800">Description</td>
                      <td className="p-3 font-medium">বিবরণ, বর্ণনা</td>
                      <td className="p-3 text-slate-400">ঐচ্ছিক</td>
                      <td className="p-3 text-slate-600">পণ্যের বিস্তারিত বর্ণনা ও বিবরণ</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={downloadSampleExcelTemplate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>নমুনা ফাইলটি সরাসরি ডাউনলোড করে দেখুন</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
