import { createContext } from 'react';
import type { CartLine } from './schemas';

export interface CartContextValue {
  lines: CartLine[];
  count: number;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: number) => Promise<void>;
  setQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | null>(null);
