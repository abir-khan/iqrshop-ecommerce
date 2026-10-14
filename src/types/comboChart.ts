import type { Product } from './index';

export type ComboChartShape = 'circle' | 'hexagon' | 'octagon' | 'flower' | 'squircle' | 'diamond';

export interface ComboChart {
  id: string;
  title: string;
  price: number;
  packageSize: number | string;
  isActive: boolean;
  shape?: ComboChartShape;
  categoryId?: string;
  productIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ComboChartWithProducts extends ComboChart {
  products: Product[];
}

export type CreateComboChartInput = Omit<ComboChart, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateComboChartInput = Partial<CreateComboChartInput>;
