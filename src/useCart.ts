import { useMemo, useState } from 'react';
import { products } from './products';

const VOUCHER_CODE = 'discount10';
type Quantities = Record<string, number>;
type Voucher = { draft: string; applied: boolean; error: string };

export function useCart() {
  const [quantities, setQuantities] = useState<Quantities>({});
  const [voucher, setVoucher] = useState<Voucher>({
    draft: '',
    applied: false,
    error: '',
  });

  const summary = useMemo(() => {
    const items = products
      .filter((product) => quantities[product.id] > 0)
      .map((product) => ({
        product,
        quantity: quantities[product.id],
        lineTotal: Math.round(product.price * 100) * quantities[product.id],
      }));
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const discount = voucher.applied ? Math.round(subtotal / 10) : 0;

    return { items, count, subtotal, discount, total: subtotal - discount };
  }, [quantities, voucher.applied]);

  function addProduct(id: string) {
    if (!products.some((product) => product.id === id)) return;
    setQuantities((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  }

  function decreaseProduct(id: string) {
    setQuantities((current) => {
      const next = { ...current };
      if ((next[id] ?? 0) <= 1) delete next[id];
      else next[id] -= 1;
      return next;
    });
  }

  function removeProduct(id: string) {
    setQuantities((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function setVoucherDraft(draft: string) {
    setVoucher((current) => ({ ...current, draft, error: '' }));
  }

  function applyVoucher() {
    const valid = voucher.draft.trim().toLowerCase() === VOUCHER_CODE;
    setVoucher((current) => {
      const error = current.draft.trim()
        ? 'Code not recognized.'
        : 'Enter a voucher code.';
      const consequence = current.applied
        ? ' Previous discount removed.'
        : current.draft.trim()
          ? ' No discount applied.'
          : '';

      return {
        draft: valid ? VOUCHER_CODE : current.draft,
        applied: valid,
        error: valid ? '' : error + consequence,
      };
    });
    return valid;
  }

  let voucherMessage = 'Have a code? Enter it above, then tap Apply.';
  if (voucher.error) voucherMessage = voucher.error;
  else if (voucher.applied) {
    voucherMessage = voucher.draft.trim().toLowerCase() === VOUCHER_CODE
      ? 'discount10 applied — 10% off.'
      : 'discount10 stays applied until you press Apply.';
  }

  return {
    ...summary,
    quantities,
    voucher,
    voucherMessage,
    addProduct,
    decreaseProduct,
    removeProduct,
    setVoucherDraft,
    applyVoucher,
  };
}

export type Cart = ReturnType<typeof useCart>;
