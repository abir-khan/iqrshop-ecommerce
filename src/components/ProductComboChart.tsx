import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Layers, Tag, Maximize2, Shapes, Sparkles, ArrowRight, Flame, Clock } from 'lucide-react';
import type { ComboChart, ComboChartShape, Product } from '../types';
import { fetchActiveComboCharts, resolveComboProducts } from '../lib/comboChartService';
import { useCms } from '../context/CmsContext';
import { PRODUCTS } from '../data/products';

export type ComboChartSize = 'sm' | 'md' | 'lg' | 'xl' | number;

export const COMBO_CHART_SHAPES: { id: ComboChartShape; name: string; icon: string; desc: string }[] = [
  { id: 'circle', name: 'রাউন্ড', icon: '⭕', desc: 'বৃত্তাকার ক্লাসিক' },
  { id: 'hexagon', name: 'হেক্সাগন', icon: '⬡', desc: 'ষড়ভুজ জ্যামিতিক' },
  { id: 'flower', name: 'ফ্লাওয়ার', icon: '🪷', desc: 'পাপড়ি অর্গানিক' },
  { id: 'octagon', name: 'অক্টাগন', icon: '🛑', desc: 'অষ্টভুজ রয়্যাল' },
  { id: 'squircle', name: 'স্কোয়ার্কল', icon: '▢', desc: 'সফট স্কয়ার' },
  { id: 'diamond', name: 'ডায়মন্ড', icon: '💎', desc: 'হীরক আকৃতি' },
];

export interface ProductComboChartProps {
  /** Optional custom combo charts list. If not provided, active combo charts are fetched automatically. */
  comboCharts?: ComboChart[];
  /** Optional active combo ID to highlight / select */
  activeComboId?: string;
  /** Whether to hide tabs for other combo packages (ideal for dedicated single landing views) */
  hideOtherTabs?: boolean;
  /** Optional category ID filter. If provided, only shows combo charts for this category. */
  categoryId?: string;
  /** Size of the combo chart: 'sm' (480px) | 'md' (580px) | 'lg' (680px) | 'xl' (780px) or custom pixel number */
  size?: ComboChartSize;
  /** Whether to show interactive size switcher buttons (default: true) */
  showSizeControls?: boolean;
  /** Shape of the chart: 'circle' | 'hexagon' | 'flower' | 'octagon' | 'squircle' | 'diamond' */
  shape?: ComboChartShape;
  /** Whether to show interactive shape switcher buttons (default: true) */
  showShapeControls?: boolean;
  /** Optional catalog of products to resolve product IDs from. Defaults to CMS products / static fallback. */
  catalog?: Product[];
  /** Callback when user clicks on a product from the pie-chart */
  onSelectProduct?: (product: Product) => void;
  /** Callback when user buys the combo */
  onBuyCombo?: (chart: ComboChart, products: Product[]) => void;
  /** Custom wrapper CSS class */
  className?: string;
}

/** Helper to extract or detect product gram / weight / size */
function getProductSizeOrWeight(product: Product): string | null {
  if (product.sizes && product.sizes.length > 0) {
    return product.sizes.join(', ');
  }
  const text = `${product.name} ${product.description || ''} ${product.badge || ''}`;
  const match = text.match(/(\d+\s*(?:কেজি|গ্রাম|মি\.?লি|ml|kg|gm|পিস|দানা))/i);
  if (match) return match[1];

  if (product.badge && !['নতুন', 'হট ডিল', 'বেস্ট সেলার', 'প্রিমিয়াম'].includes(product.badge)) {
    return product.badge;
  }
  if (product.category === 'organic') return '১ কেজি প্যাক';
  if (product.category === 'attar') return '১২ মি.লি.';
  return null;
}

/** Mathematical geometry helper for dynamic shapes */
function getOuterPoint(
  deg: number,
  shape: ComboChartShape,
  _numSlices: number,
  sliceIndex: number,
  sliceAngle: number,
  center: number,
  baseRadius: number
): { x: number; y: number; r: number } {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const rad = toRad(deg);
  let r = baseRadius;

  if (shape === 'flower') {
    // Elegant blooming petal cresting at center of each slice
    const midAngle = sliceIndex * sliceAngle - 90 + sliceAngle / 2;
    let diff = deg - midAngle;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    const halfAngle = sliceAngle / 2;
    const norm = Math.min(1, Math.max(-1, diff / (halfAngle || 1)));
    const bulge = Math.cos((norm * Math.PI) / 2); // 1 at center, 0 at edges
    r = baseRadius - 16 + bulge * 34;
  } else if (shape === 'hexagon') {
    // 6-sided regular polygon, top vertex at 12 o'clock (-90 deg)
    const N = 6;
    const sideAngle = (2 * Math.PI) / N; // 60 deg
    const theta = rad + Math.PI / 2;
    const mod = ((theta % sideAngle) + sideAngle) % sideAngle;
    const thetaRel = mod - sideAngle / 2;
    const rIn = (baseRadius - 14) * Math.cos(sideAngle / 2);
    r = rIn / Math.cos(thetaRel);
    r = Math.min(r, baseRadius + 16);
  } else if (shape === 'octagon') {
    // 8-sided regular polygon (Islamic architectural motif)
    const N = 8;
    const sideAngle = (2 * Math.PI) / N; // 45 deg
    const theta = rad + Math.PI / 2;
    const mod = ((theta % sideAngle) + sideAngle) % sideAngle;
    const thetaRel = mod - sideAngle / 2;
    const rIn = (baseRadius - 10) * Math.cos(sideAngle / 2);
    r = rIn / Math.cos(thetaRel);
    r = Math.min(r, baseRadius + 14);
  } else if (shape === 'squircle') {
    // Apple-style superellipse (p = 4)
    const p = 4;
    const cosP = Math.pow(Math.abs(Math.cos(rad)), p);
    const sinP = Math.pow(Math.abs(Math.sin(rad)), p);
    r = (baseRadius - 12) / Math.pow(cosP + sinP, 1 / p);
    r = Math.min(r, baseRadius + 18);
  } else if (shape === 'diamond') {
    // 4-sided diamond with points at cardinal directions
    const N = 4;
    const sideAngle = (2 * Math.PI) / N; // 90 deg
    const theta = rad + Math.PI / 2;
    const mod = ((theta % sideAngle) + sideAngle) % sideAngle;
    const thetaRel = mod - sideAngle / 2;
    const rIn = (baseRadius - 32) * Math.cos(sideAngle / 2);
    r = rIn / Math.cos(thetaRel);
    r = Math.min(r, baseRadius + 24);
  } else {
    // 'circle' default
    r = baseRadius;
  }

  return {
    x: center + r * Math.cos(rad),
    y: center + r * Math.sin(rad),
    r,
  };
}

export const ProductComboChart: React.FC<ProductComboChartProps> = ({
  comboCharts: propComboCharts,
  activeComboId,
  hideOtherTabs = false,
  categoryId,
  size: propSize = 'lg',
  showSizeControls = true,
  shape: propShape,
  showShapeControls = false, // Admin decides shape; hidden from customer storefront
  catalog: propCatalog,
  onSelectProduct,
  onBuyCombo,
  className = '',
}) => {
  const { data: cmsData } = useCms();

  // Selected chart size state
  const [currentSize, setCurrentSize] = useState<ComboChartSize>(propSize);
  // Optional manual override (only active if showShapeControls is enabled)
  const [manualShape, setManualShape] = useState<ComboChartShape | null>(null);

  // 1. Data resolution
  const allProducts = useMemo(() => {
    if (propCatalog && propCatalog.length > 0) return propCatalog;
    if (cmsData?.products && cmsData.products.length > 0) return cmsData.products;
    return PRODUCTS;
  }, [propCatalog, cmsData]);

  const [charts, setCharts] = useState<ComboChart[]>(propComboCharts || []);
  const [selectedChartIndex, setSelectedChartIndex] = useState(0);
  const [hoveredSliceIndex, setHoveredSliceIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(!propComboCharts);

  // Filter charts according to categoryId if provided
  const effectiveCharts = useMemo(() => {
    if (!categoryId || categoryId === 'all') return charts;
    return charts.filter((c) => c.categoryId === categoryId);
  }, [charts, categoryId]);

  // 2. Fetch active combo charts if not provided via props
  useEffect(() => {
    if (propComboCharts) return;

    let isMounted = true;
    fetchActiveComboCharts()
      .then((activeCharts) => {
        if (isMounted) {
          setCharts(activeCharts);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load active combo charts:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [propComboCharts]);

  // Synchronize selected chart index when activeComboId is specified
  useEffect(() => {
    if (activeComboId && effectiveCharts.length > 0) {
      const idx = effectiveCharts.findIndex((c) => c.id === activeComboId);
      if (idx !== -1) {
        setSelectedChartIndex(idx);
      }
    }
  }, [activeComboId, effectiveCharts]);

  const activeChart: ComboChart | undefined = effectiveCharts[selectedChartIndex] || effectiveCharts[0];

  // Scarcity state: live daily countdown to midnight & realistic remaining promo stock
  const [countdownStr, setCountdownStr] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = Math.max(0, endOfDay.getTime() - now.getTime());

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const toBn = (n: number) => n.toString().padStart(2, '0').replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

      setCountdownStr(`${toBn(h)}:${toBn(m)}:${toBn(s)}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Believable promo stock count for current combo (between 7 and 12 packs)
  const stockCountBn = useMemo(() => {
    if (!activeChart) return '৯';
    const daySeed = new Date().getDate();
    const charCodeSum = (activeChart.id || activeChart.title).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const count = 7 + ((charCodeSum + daySeed) % 6); // 7 to 12
    return count.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);
  }, [activeChart]);

  // The shape is strictly decided by Admin in activeChart.shape (or propShape)
  const currentShape: ComboChartShape = manualShape || propShape || activeChart?.shape || 'circle';

  // Reset manual override whenever active chart switches
  useEffect(() => {
    setManualShape(null);
  }, [activeChart?.id]);

  // Resolve products for current active chart
  const resolvedProducts = useMemo(() => {
    if (!activeChart) return [];
    return resolveComboProducts(activeChart.productIds, allProducts);
  }, [activeChart, allProducts]);

  // Calculate sum of individual products and discount
  const originalTotal = useMemo(() => {
    return resolvedProducts.reduce((sum, p) => sum + (p.originalPrice || p.price), 0);
  }, [resolvedProducts]);

  const savingsAmount = activeChart && originalTotal > activeChart.price
    ? originalTotal - activeChart.price
    : 0;

  // Handle direct Order of the complete Combo package (Direct to Checkout)
  const handleOrderCombo = () => {
    if (!activeChart || resolvedProducts.length === 0) return;

    if (onBuyCombo) {
      onBuyCombo(activeChart, resolvedProducts);
    }
  };

  // 3. Mathematical Geometry for Dynamic Shape Pie/Polygon Chart
  const VIEWBOX_SIZE = 700;
  const CENTER = VIEWBOX_SIZE / 2; // 350
  const OUTER_RADIUS = 315; // Full coverage
  const INNER_RADIUS = 95;  // Compact center circle focusing strictly on price

  const numSlices = Math.max(resolvedProducts.length, 1);
  const sliceAngle = 360 / numSlices;
  const GAP_DEGREES = numSlices > 1 ? 2.2 : 0;

  // Pre-calculate SVG paths and positioning for each slice
  const sliceData = useMemo(() => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    return resolvedProducts.map((product, idx) => {
      const startAngle = idx * sliceAngle - 90 + GAP_DEGREES / 2;
      const endAngle = (idx + 1) * sliceAngle - 90 - GAP_DEGREES / 2;
      const midAngle = (startAngle + endAngle) / 2;

      const radStart = toRad(startAngle);
      const radEnd = toRad(endAngle);
      const radMid = toRad(midAngle);

      // Inner Arc points
      const xInnerEnd = CENTER + INNER_RADIUS * Math.cos(radEnd);
      const yInnerEnd = CENTER + INNER_RADIUS * Math.sin(radEnd);
      const xInnerStart = CENTER + INNER_RADIUS * Math.cos(radStart);
      const yInnerStart = CENTER + INNER_RADIUS * Math.sin(radStart);

      const largeArc = endAngle - startAngle > 180 ? 1 : 0;

      // Slice sector path based on chosen shape
      let path = '';
      if (currentShape === 'circle') {
        const xOuterStart = CENTER + OUTER_RADIUS * Math.cos(radStart);
        const yOuterStart = CENTER + OUTER_RADIUS * Math.sin(radStart);
        const xOuterEnd = CENTER + OUTER_RADIUS * Math.cos(radEnd);
        const yOuterEnd = CENTER + OUTER_RADIUS * Math.sin(radEnd);

        path = [
          `M ${xOuterStart.toFixed(2)} ${yOuterStart.toFixed(2)}`,
          `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${xOuterEnd.toFixed(2)} ${yOuterEnd.toFixed(2)}`,
          `L ${xInnerEnd.toFixed(2)} ${yInnerEnd.toFixed(2)}`,
          `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${xInnerStart.toFixed(2)} ${yInnerStart.toFixed(2)}`,
          'Z',
        ].join(' ');
      } else {
        // Multi-point sampling along outer boundary for clean polygons / petals
        const STEPS = 16;
        const outerPoints: { x: number; y: number }[] = [];
        for (let s = 0; s <= STEPS; s++) {
          const deg = startAngle + (s / STEPS) * (endAngle - startAngle);
          outerPoints.push(getOuterPoint(deg, currentShape, numSlices, idx, sliceAngle, CENTER, OUTER_RADIUS));
        }

        const outerCommands = outerPoints
          .map((p, pIdx) => (pIdx === 0 ? `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}` : `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`))
          .join(' ');

        path = [
          outerCommands,
          `L ${xInnerEnd.toFixed(2)} ${yInnerEnd.toFixed(2)}`,
          `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${xInnerStart.toFixed(2)} ${yInnerStart.toFixed(2)}`,
          'Z',
        ].join(' ');
      }

      // Mid-radius outer point for proper image center placement
      const midOuter = getOuterPoint(midAngle, currentShape, numSlices, idx, sliceAngle, CENTER, OUTER_RADIUS);
      const effectiveMidRadius = (midOuter.r + INNER_RADIUS) / 2;
      const xMid = CENTER + effectiveMidRadius * Math.cos(radMid);
      const yMid = CENTER + effectiveMidRadius * Math.sin(radMid);

      // Shift vector for hover expansion (8px outward along slice angle)
      const shiftX = Math.cos(radMid) * 8;
      const shiftY = Math.sin(radMid) * 8;

      // Image size & position inside wedge (generous for full coverage)
      const imgSize = 390;
      const imgX = xMid - imgSize / 2;
      const imgY = yMid - imgSize / 2;

      // Plus (+) connector along the boundary angle
      const boundaryAngle = (idx + 1) * sliceAngle - 90;
      const plusPt = getOuterPoint(boundaryAngle, currentShape, numSlices, idx, sliceAngle, CENTER, OUTER_RADIUS);
      const radBoundary = toRad(boundaryAngle);
      const xPlus = CENTER + (plusPt.r - 12) * Math.cos(radBoundary);
      const yPlus = CENTER + (plusPt.r - 12) * Math.sin(radBoundary);

      const sizeOrGram = getProductSizeOrWeight(product);

      return {
        product,
        index: idx,
        path,
        xMid,
        yMid,
        imgX,
        imgY,
        imgSize,
        shiftX,
        shiftY,
        midAngle,
        xPlus,
        yPlus,
        sizeOrGram,
      };
    });
  }, [resolvedProducts, sliceAngle, GAP_DEGREES, CENTER, OUTER_RADIUS, INNER_RADIUS, currentShape, numSlices]);

  // Max width CSS resolver based on current size (Default: lg -> 670px)
  const maxContainerWidth = useMemo(() => {
    if (typeof currentSize === 'number') {
      return `${currentSize}px`;
    }
    switch (currentSize) {
      case 'sm':
        return '460px';
      case 'md':
        return '560px';
      case 'xl':
        return '790px';
      case 'lg':
      default:
        return '670px';
    }
  }, [currentSize]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`w-full max-w-4xl mx-auto p-6 bg-white rounded-3xl border border-stone-200/80 shadow-sm animate-pulse flex flex-col items-center justify-center min-h-[460px] ${className}`}>
        <div className="w-72 h-72 rounded-full border-8 border-stone-100 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-stone-100" />
        </div>
        <div className="h-4 w-40 bg-stone-200 rounded mt-6" />
      </div>
    );
  }

  // If a category was specified and has no combo charts, don't show empty block
  if (categoryId && categoryId !== 'all' && (!activeChart || resolvedProducts.length === 0)) {
    return null;
  }

  // Empty state
  if (!activeChart || resolvedProducts.length === 0) {
    return (
      <div className={`w-full max-w-xl mx-auto p-8 text-center bg-stone-50 rounded-3xl border border-stone-200 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-2xl font-bold">
          🥧
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-1">কোনো সক্রিয় কম্বো চার্ট নেই</h3>
        <p className="text-xs text-stone-500">বর্তমানে কোনো অ্যাক্টিভ কম্বো অফার পাওয়া যায়নি।</p>
      </div>
    );
  }

  const hoveredProduct = hoveredSliceIndex !== null ? resolvedProducts[hoveredSliceIndex] : null;

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      
      {/* 4. Top Controls: Combo Switcher, Shape Controller & Size Adjuster */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 sm:mb-8">
        
        {/* Multi Combo Charts Tabs */}
        {effectiveCharts.length > 1 && !hideOtherTabs ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0">
            {effectiveCharts.map((chart, i) => (
              <button
                key={chart.id}
                onClick={() => {
                  setSelectedChartIndex(i);
                  setHoveredSliceIndex(null);
                }}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xs shrink-0 ${
                  selectedChartIndex === i
                    ? 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-emerald-900/20 shadow-md scale-102'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 opacity-80" />
                <span>{chart.title}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                  selectedChartIndex === i ? 'bg-amber-400 text-stone-900' : 'bg-stone-200 text-stone-600'
                }`}>
                  ৳{chart.price}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div />
        )}

        {/* Right Controls: Shape Switcher & Size Adjuster */}
        <div className="flex flex-wrap items-center gap-2 md:ml-auto">
          {/* Interactive Shape Controller */}
          {showShapeControls && (
            <div className="flex items-center gap-1 bg-stone-100/95 backdrop-blur-xs p-1 rounded-2xl border border-stone-200/80 shadow-2xs text-xs font-semibold text-stone-700 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold text-stone-500 px-1.5 sm:px-2 flex items-center gap-1 shrink-0">
                <Shapes className="w-3 h-3 text-emerald-700" />
                <span className="hidden sm:inline">শেপ:</span>
              </span>
              {COMBO_CHART_SHAPES.map((shp) => (
                <button
                  key={shp.id}
                  type="button"
                  onClick={() => setManualShape(shp.id)}
                  className={`px-2 py-1 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-1 text-[11px] shrink-0 ${
                    currentShape === shp.id
                      ? 'bg-white text-emerald-900 shadow-xs border border-emerald-600/30 scale-102'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                  title={`${shp.name} (${shp.desc})`}
                >
                  <span className="text-xs">{shp.icon}</span>
                  <span className="hidden lg:inline">{shp.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Interactive Size Controller (Desktop only) */}
          {showSizeControls && (
            <div className="hidden sm:flex items-center gap-1.5 bg-stone-100/90 backdrop-blur-xs p-1 rounded-2xl border border-stone-200/80 shadow-2xs text-xs font-semibold text-stone-700">
              <span className="text-[11px] font-bold text-stone-500 px-2 flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-emerald-700" />
                সাইজ:
              </span>
              {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setCurrentSize(s)}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer font-bold ${
                    currentSize === s
                      ? 'bg-white text-emerald-900 shadow-xs border border-emerald-600/30'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  {s === 'sm' ? 'S' : s === 'md' ? 'M' : s === 'lg' ? 'L' : 'XL'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Main Chart Container */}
      <div className="relative bg-gradient-to-b from-stone-50/95 via-white to-emerald-50/30 rounded-3xl sm:rounded-[3rem] p-2.5 sm:p-7 lg:p-10 border border-stone-200 shadow-xl overflow-hidden">
        
        {/* Subtle decorative background shapes based on currentShape */}
        {currentShape === 'circle' && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full border border-emerald-900/5 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] aspect-square rounded-full border border-dashed border-stone-200/50 pointer-events-none" />
          </>
        )}
        {currentShape === 'flower' && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full border-2 border-dashed border-amber-500/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] aspect-square rounded-full border border-emerald-700/5 pointer-events-none" />
          </>
        )}
        {(currentShape === 'hexagon' || currentShape === 'octagon') && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[118%] aspect-square rounded-[3.5rem] border border-emerald-900/5 pointer-events-none rotate-12" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[132%] aspect-square rounded-[4rem] border border-dashed border-stone-200/50 pointer-events-none" />
          </>
        )}
        {currentShape === 'squircle' && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[116%] aspect-square rounded-[3rem] border border-emerald-900/5 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] aspect-square rounded-[3.5rem] border border-dashed border-stone-200/50 pointer-events-none" />
          </>
        )}
        {currentShape === 'diamond' && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] aspect-square rounded-3xl border border-emerald-900/5 pointer-events-none rotate-45" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[125%] aspect-square rounded-full border border-dashed border-stone-200/50 pointer-events-none" />
          </>
        )}

        <div className="flex flex-col items-center">
          
          {/* Circular Chart Wrapper with Dynamic Size Control */}
          <div className="w-full max-w-[320px] sm:max-w-none flex items-center justify-center">
            <div 
              style={{ maxWidth: maxContainerWidth }}
              className="relative w-full aspect-square flex items-center justify-center select-none transition-all duration-500"
            >
            
            {/* SVG Pie Chart Canvas (Clips full product images into sectors + draws leader lines) */}
            <svg
              viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
              className="w-full h-full filter drop-shadow-md transition-transform duration-300 overflow-visible"
            >
              <defs>
                {/* 1. ClipPaths: Each slice gets its exact curved wedge clipPath */}
                {sliceData.map((slice) => (
                  <clipPath key={`clip-${slice.product.id}`} id={`clip-slice-${slice.product.id}`}>
                    <path d={slice.path} />
                  </clipPath>
                ))}

                {/* 2. Soft Dark Vignette Gradient Overlay so images look high-contrast & deep */}
                <radialGradient id="slice-vignette" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#000000" stopOpacity="0.0" />
                  <stop offset="70%" stopColor="#000000" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
                </radialGradient>

                {/* 3. Hover Glow Filter */}
                <filter id="hover-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#059669" floodOpacity="0.45" />
                </filter>
              </defs>

              {/* Slices Group: Pure Full-Bleed Product Image Wedges */}
              <g>
                {sliceData.map((slice) => {
                  const isHovered = hoveredSliceIndex === slice.index;
                  const transform = isHovered
                    ? `translate(${slice.shiftX}, ${slice.shiftY}) scale(1.025)`
                    : 'translate(0, 0) scale(1)';

                  return (
                    <g
                      key={`slice-${slice.product.id}`}
                      style={{
                        transform,
                        transformOrigin: `${CENTER}px ${CENTER}px`,
                        transition: 'transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredSliceIndex(slice.index)}
                      onMouseLeave={() => setHoveredSliceIndex(null)}
                      onClick={() => {
                        setHoveredSliceIndex(hoveredSliceIndex === slice.index ? null : slice.index);
                        if (onSelectProduct) onSelectProduct(slice.product);
                      }}
                    >
                      {/* Sub-Group Clipped strictly to this Sector Path */}
                      <g clipPath={`url(#clip-slice-${slice.product.id})`}>
                        {/* Fallback solid background */}
                        <path d={slice.path} fill="#f1f5f9" />

                        {/* FULL PURE PRODUCT IMAGE FILLING THE SECTOR (UNOBSTRUCTED) */}
                        <image
                          href={slice.product.image}
                          x={slice.imgX}
                          y={slice.imgY}
                          width={slice.imgSize}
                          height={slice.imgSize}
                          preserveAspectRatio="xMidYMid slice"
                          style={{
                            transformOrigin: `${slice.xMid}px ${slice.yMid}px`,
                            transition: 'transform 0.5s ease-out',
                            transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                          }}
                        />

                        {/* Rich gradient overlay inside the wedge for contrast & depth */}
                        <path
                          d={slice.path}
                          fill="url(#slice-vignette)"
                          className="transition-opacity duration-300"
                          style={{ opacity: isHovered ? 0.3 : 0.55 }}
                        />
                      </g>

                      {/* Precise Crisp Border around the Slice */}
                      <path
                        d={slice.path}
                        fill="none"
                        stroke={isHovered ? '#10b981' : '#ffffff'}
                        strokeWidth={isHovered ? 4 : 2.5}
                        filter={isHovered ? 'url(#hover-glow)' : undefined}
                        className="transition-all duration-300"
                      />
                    </g>
                  );
                })}
              </g>

              {/* Plus (+) Connectors between Consecutive Slices */}
              {sliceData.length > 1 && sliceData.map((slice) => (
                <g key={`plus-svg-${slice.index}`} className="pointer-events-none">
                  <circle
                    cx={slice.xPlus}
                    cy={slice.yPlus}
                    r={11}
                    fill="#065f46"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                  <line
                    x1={slice.xPlus - 5}
                    y1={slice.yPlus}
                    x2={slice.xPlus + 5}
                    y2={slice.yPlus}
                    stroke="#ffffff"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                  <line
                    x1={slice.xPlus}
                    y1={slice.yPlus - 5}
                    x2={slice.xPlus}
                    y2={slice.yPlus + 5}
                    stroke="#ffffff"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                </g>
              ))}
            </svg>

            {/* 6. Center Circle (The Donut Hole): Pure Price Hero Focus (Shape-adaptive) */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28%] h-[28%] min-w-[90px] min-h-[90px] sm:min-w-[140px] sm:min-h-[140px] ${
                currentShape === 'squircle'
                  ? 'rounded-2xl sm:rounded-3xl'
                  : currentShape === 'diamond'
                  ? 'rounded-xl sm:rounded-2xl'
                  : currentShape === 'hexagon'
                  ? 'rounded-2xl sm:rounded-[1.75rem]'
                  : currentShape === 'octagon'
                  ? 'rounded-xl sm:rounded-2xl'
                  : 'rounded-full'
              } bg-white/98 backdrop-blur-md border sm:border-3 ${
                currentShape === 'flower' ? 'border-amber-600/70' : 'border-emerald-700/60'
              } shadow-lg sm:shadow-2xl flex flex-col items-center justify-center text-center p-1 sm:p-2.5 z-20 transition-all duration-300 ring-2 sm:ring-6 ${
                currentShape === 'flower' ? 'ring-amber-500/20' : 'ring-emerald-500/15'
              } ${
                hoveredSliceIndex !== null
                  ? 'ring-4 sm:ring-8 ring-emerald-500/35 scale-105 border-emerald-600 shadow-emerald-950/20'
                  : ''
              }`}
            >
              {hoveredProduct ? (
                /* Dynamic Hover State: Shows item index, clear price, and weight */
                <div className="flex flex-col items-center justify-center animate-fadeIn w-full px-1">
                  <span className="text-[9px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 sm:px-2 py-0.2 rounded-full mb-0.5">
                    আইটেম #{hoveredSliceIndex! + 1}
                  </span>

                  <p className="text-base sm:text-3xl font-black text-rose-600 my-0.5 leading-none tracking-tight">
                    ৳{hoveredProduct.price.toLocaleString('bn-BD')}
                  </p>

                  {hoveredSliceIndex !== null && sliceData[hoveredSliceIndex]?.sizeOrGram && (
                    <span className="text-[8.5px] sm:text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-1 sm:px-1.5 py-0.2 rounded mt-0.5">
                      {sliceData[hoveredSliceIndex].sizeOrGram}
                    </span>
                  )}
                </div>
              ) : (
                /* Default Center State: Dedicated Exclusively to Clear, Bold Price & Savings */
                <div className="flex flex-col items-center justify-center w-full px-0.5 sm:px-1">
                  {/* Highlighted "অফার মূল্য" Badge */}
                  <span className="text-[8.5px] sm:text-[11.5px] font-black text-rose-700 bg-rose-50 border border-rose-300/90 px-1.5 sm:px-2.5 py-0.2 sm:py-0.5 rounded-full shadow-2xs tracking-wide uppercase leading-none flex items-center gap-0.5 sm:gap-1 mb-0.5">
                    <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-500 shrink-0" />
                    অফার মূল্য
                  </span>

                  {/* Main Focus: Hero Large Bold Red Price */}
                  <div className="my-0.5 leading-none">
                    <span className="text-lg sm:text-3xl lg:text-4xl font-black text-rose-600 tracking-tight leading-none drop-shadow-2xs">
                      ৳{activeChart.price.toLocaleString('bn-BD')}
                    </span>
                  </div>

                  {/* Savings / Original Price Badge */}
                  {originalTotal > activeChart.price && (
                    <div className="flex items-center justify-center gap-1 leading-none mt-0.5">
                      <span className="text-[8.5px] sm:text-[11px] font-semibold text-stone-400 line-through">
                        ৳{originalTotal.toLocaleString('bn-BD')}
                      </span>
                      {savingsAmount > 0 && (
                        <span className="text-[8px] sm:text-[10.5px] font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-1.5 py-0.2 rounded-full shadow-2xs">
                          সাশ্রয় ৳{savingsAmount.toLocaleString('bn-BD')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            </div>
          </div>

          {/* 7. Action Button Below the Chart: Direct 1-Click Order */}
          <div className="mt-5 sm:mt-8 flex flex-col items-center justify-center w-full max-w-lg mx-auto px-2 sm:px-4">
            
            {/* Ultra-Refined Luxury Scarcity & Countdown Pill */}
            <div className="w-full mb-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 shadow-sm flex items-center justify-between gap-2 transition-all">
              {/* Left: Stock Scarcity Tag */}
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/90 text-[10.5px] sm:text-xs font-black shrink-0 shadow-2xs">
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600 fill-rose-500 animate-pulse" />
                  <span>মাত্র {stockCountBn}টি বাকি</span>
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-stone-600 truncate hidden xs:inline sm:inline">
                  আজকের ডিসকাউন্ট স্টক
                </span>
              </div>

              {/* Right: Digital Timer Badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 hidden sm:inline">
                  অফার শেষ হতে:
                </span>
                <div className="inline-flex items-center gap-1 bg-stone-900 text-amber-300 px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-xs font-mono font-black tracking-wider shadow-2xs border border-stone-800">
                  <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="tabular-nums">{countdownStr}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleOrderCombo}
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#063828] via-[#094d38] to-[#04281d] text-white py-2 px-3 sm:py-3.5 sm:px-5 shadow-[0_10px_25px_-5px_rgba(6,56,40,0.5)] hover:shadow-[0_16px_35px_-4px_rgba(6,56,40,0.65)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 cursor-pointer border border-emerald-500/40 ring-1 sm:ring-2 ring-emerald-400/25"
            >
              {/* Animated Light Sweep Shimmer Effect on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />

              <div className="relative flex items-center justify-between gap-2 sm:gap-3.5 w-full">
                {/* Left: Round Gold Icon + Action Text */}
                <div className="flex items-center gap-2 sm:gap-3 text-left min-w-0">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-sm ring-1 sm:ring-2 ring-amber-200/50 group-hover:scale-105 transition-transform duration-300">
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 fill-stone-950/20 text-stone-950" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1 leading-tight">
                      <span className="text-[13px] sm:text-base font-black text-white tracking-tight truncate group-hover:text-amber-200 transition-colors">
                        সম্পূর্ণ কম্বো অর্ডার
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0 hidden sm:inline" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-emerald-200/80 font-medium leading-none mt-0.5 truncate">
                      ক্যাশ অন ডেলিভারি
                    </span>
                  </div>
                </div>

                {/* Right: Compact Offer Price Pill + Arrow */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 bg-black/35 backdrop-blur-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-amber-400/35 shrink-0">
                  <div className="flex flex-col items-end leading-none">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-amber-200/90 hidden xs:inline sm:inline">অফার</span>
                      <span className="text-sm sm:text-lg font-black text-amber-300 tracking-tight">
                        ৳{activeChart.price.toLocaleString('bn-BD')}
                      </span>
                    </div>
                    {savingsAmount > 0 && (
                      <span className="text-[8.5px] sm:text-[10px] font-black text-amber-950 bg-gradient-to-r from-amber-300 to-amber-400 px-1.5 py-0.2 rounded-full mt-0.5 leading-tight">
                        সাশ্রয় ৳{savingsAmount.toLocaleString('bn-BD')}
                      </span>
                    )}
                  </div>

                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 group-hover:bg-amber-400 group-hover:text-stone-950 text-white flex items-center justify-center transition-all duration-300 shrink-0">
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </button>

            {/* Micro Trust Strip below button */}
            <div className="flex items-center justify-center gap-x-3 gap-y-1 mt-2 text-[10.5px] sm:text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ক্যাশ অন ডেলিভারি
              </span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                পণ্য দেখে মূল্য পরিশোধ
              </span>
            </div>
          </div>

          {/* Quick Item List Footer - Crystal Clear for Mobile & Desktop */}
          <div className="mt-6 pt-5 border-t border-stone-200/90 w-full max-w-3xl space-y-2.5">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-extrabold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px] sm:text-xs">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                কম্বোর পণ্যসমূহ:
              </span>
              <span className="hidden sm:inline text-[11px] text-stone-500 font-medium">
                ক্লিক করে চার্টে ফোকাস করুন
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {resolvedProducts.map((p, idx) => {
                const itemSize = sliceData[idx]?.sizeOrGram;
                const isSelected = hoveredSliceIndex === idx;
                return (
                  <div
                    key={p.id}
                    onMouseEnter={() => setHoveredSliceIndex(idx)}
                    onMouseLeave={() => setHoveredSliceIndex(null)}
                    onClick={() => {
                      setHoveredSliceIndex(hoveredSliceIndex === idx ? null : idx);
                      if (onSelectProduct) onSelectProduct(p);
                    }}
                    className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-stone-200/80 hover:border-emerald-300 hover:bg-stone-50/60 shadow-2xs'
                    }`}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-100"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                          #{idx + 1}
                        </span>
                        {itemSize && (
                          <span className="text-[9px] font-bold text-amber-900 bg-amber-100/80 border border-amber-200 px-1 py-0.2 rounded truncate">
                            {itemSize}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-stone-900 truncate mt-0.5" title={p.name}>
                        {p.name}
                      </p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs font-black text-rose-600">
                          ৳{p.price.toLocaleString('bn-BD')}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-stone-400 line-through">
                            ৳{p.originalPrice.toLocaleString('bn-BD')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
