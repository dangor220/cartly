import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import {
  addToServerCart,
  getServerCart,
  mergeIntoServerCart,
  removeFromServerCart,
  setServerQuantity,
} from './api';
import { CartContext } from './CartContext';
import { clearGuestCart, loadGuestCart, saveGuestCart } from './guestStorage';
import type { CartLine } from './schemas';

type ServerCart = { owner: string; lines: CartLine[] };

function withOneMore(lines: CartLine[], productId: number): CartLine[] {
  const exists = lines.some((l) => l.productId === productId);
  return exists
    ? lines.map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + 1 } : l))
    : [...lines, { productId, quantity: 1 }];
}

function withQuantity(lines: CartLine[], productId: number, quantity: number): CartLine[] {
  if (quantity <= 0) return lines.filter((l) => l.productId !== productId);
  return lines.map((l) => (l.productId === productId ? { ...l, quantity } : l));
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const email = user?.email;

  const [guestLines, setGuestLines] = useState<CartLine[]>(loadGuestCart);
  const [serverCart, setServerCart] = useState<ServerCart | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    let ignore = false;

    async function sync(owner: string) {
      try {
        const guest = loadGuestCart();
        if (guest.length > 0) {
          await mergeIntoServerCart(guest);
          clearGuestCart();
          setGuestLines([]);
        }
        const lines = await getServerCart();
        if (!ignore) setServerCart({ owner, lines });
      } catch (e) {
        console.error(e);
        if (!ignore) {
          setServerCart({ owner, lines: [] });
          setError('The cart could not be loaded.');
        }
      }
    }

    void sync(email);

    return () => {
      ignore = true;
    };
  }, [email]);

  const lines =
    email === undefined ? guestLines : serverCart?.owner === email ? serverCart.lines : [];
  const isLoading = isAuthLoading || (email !== undefined && serverCart?.owner !== email);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);

  const addItem = async (productId: number) => {
    if (!email) {
      const next = withOneMore(guestLines, productId);
      setGuestLines(next);
      saveGuestCart(next);
      return;
    }
    await addToServerCart(productId);
    setServerCart({ owner: email, lines: await getServerCart() });
  };
  const refresh = async () => {
    if (!email) return;
    setServerCart({ owner: email, lines: await getServerCart() });
  };

  const setQuantity = async (productId: number, quantity: number) => {
    if (!email) {
      const next = withQuantity(guestLines, productId, quantity);
      setGuestLines(next);
      saveGuestCart(next);
      return;
    }
    if (quantity <= 0) await removeFromServerCart(productId);
    else await setServerQuantity(productId, quantity);

    setServerCart({ owner: email, lines: await getServerCart() });
  };
  const removeItem = (productId: number) => setQuantity(productId, 0);

  return (
    <CartContext
      value={{ lines, count, isLoading, error, addItem, refresh, setQuantity, removeItem }}>
      {children}
    </CartContext>
  );
}
