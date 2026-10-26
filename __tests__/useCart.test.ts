import { act, renderHook } from '@testing-library/react-native';
import { formatMoney } from '../src/money';
import { products } from '../src/products';
import { useCart } from '../src/useCart';

describe('cart', () => {
  it('starts empty with four complete static products', () => {
    expect(products).toHaveLength(4);
    products.forEach((product) => {
      expect(typeof product.productName).toBe('string');
      expect(typeof product.description).toBe('string');
      expect(typeof product.price).toBe('number');
      expect(product.price).toBeGreaterThan(0);
    });
    const { result } = renderHook(useCart);
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('adds all different products and calculates their prices', () => {
    const { result } = renderHook(useCart);
    act(() => products.forEach((product) => result.current.addProduct(product.id)));
    expect(result.current.items).toHaveLength(4);
    expect(result.current.count).toBe(4);
    expect(result.current.subtotal).toBe(36250);
    expect(result.current.total).toBe(36250);
    expect(formatMoney(result.current.total)).toBe('₱362.50');
  });

  it('groups repeated additions without losing updates in the same event', () => {
    const { result } = renderHook(useCart);
    act(() => {
      result.current.addProduct('chicken');
      result.current.addProduct('chicken');
      result.current.addProduct('tea');
    });
    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.items[0].lineTotal).toBe(29900);
    expect(result.current.count).toBe(3);
    expect(result.current.subtotal).toBe(35800);
  });

  it('decreases one unit and removes the last unit without negative counts', () => {
    const { result } = renderHook(useCart);
    act(() => {
      result.current.addProduct('chicken');
      result.current.addProduct('chicken');
    });
    act(() => result.current.decreaseProduct('chicken'));
    expect(result.current.count).toBe(1);
    expect(result.current.total).toBe(14950);
    act(() => result.current.decreaseProduct('chicken'));
    act(() => result.current.decreaseProduct('chicken'));
    expect(result.current.items).toEqual([]);
    expect(result.current.quantities).toEqual({});
    expect(result.current.count).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('removes a complete product line while preserving other products', () => {
    const { result } = renderHook(useCart);
    act(() => {
      result.current.addProduct('chicken');
      result.current.addProduct('chicken');
      result.current.addProduct('tea');
    });
    act(() => result.current.removeProduct('chicken'));
    expect(result.current.items.map((item) => item.product.id)).toEqual(['tea']);
    expect(result.current.count).toBe(1);
    expect(result.current.total).toBe(5900);
    act(() => result.current.removeProduct('tea'));
    expect(result.current.total).toBe(0);
  });

  it('ignores unknown products', () => {
    const { result } = renderHook(useCart);
    act(() => result.current.addProduct('unknown'));
    expect(result.current.count).toBe(0);
    expect(result.current.total).toBe(0);
  });
});

describe('voucher', () => {
  it('normalizes discount10 and applies ten percent once', () => {
    const { result } = renderHook(useCart);
    act(() => {
      result.current.addProduct('chicken');
      result.current.addProduct('chicken');
      result.current.addProduct('tea');
      result.current.setVoucherDraft('  DISCOUNT10  ');
    });
    act(() => { expect(result.current.applyVoucher()).toBe(true); });
    expect(result.current.voucher.draft).toBe('discount10');
    expect(result.current.discount).toBe(3580);
    expect(result.current.total).toBe(32220);
    act(() => result.current.applyVoucher());
    expect(result.current.discount).toBe(3580);
    expect(result.current.total).toBe(32220);
  });

  it('recalculates after additions, decrements, and removal', () => {
    const { result } = renderHook(useCart);
    act(() => {
      result.current.addProduct('chicken');
      result.current.setVoucherDraft('discount10');
    });
    act(() => result.current.applyVoucher());
    expect(result.current.total).toBe(13455);
    act(() => result.current.addProduct('tea'));
    expect(result.current.total).toBe(18765);
    act(() => result.current.addProduct('chicken'));
    expect(result.current.total).toBe(32220);
    act(() => result.current.decreaseProduct('chicken'));
    expect(result.current.total).toBe(18765);
    act(() => result.current.removeProduct('tea'));
    expect(result.current.total).toBe(13455);
  });

  it('keeps the applied voucher when its draft is edited until Apply is pressed', () => {
    const { result } = renderHook(useCart);
    act(() => {
      result.current.addProduct('tea');
      result.current.setVoucherDraft('discount10');
    });
    act(() => result.current.applyVoucher());
    act(() => result.current.setVoucherDraft('wrong'));
    expect(result.current.total).toBe(5310);
    expect(result.current.voucherMessage).toContain('stays applied');
    act(() => { expect(result.current.applyVoucher()).toBe(false); });
    expect(result.current.discount).toBe(0);
    expect(result.current.total).toBe(5900);
    expect(result.current.voucher.error).toContain('Previous discount removed');
  });

  it.each(['', ' ', 'invalid'])('rejects code %p with explanatory feedback', (code) => {
    const { result } = renderHook(useCart);
    act(() => {
      result.current.addProduct('tea');
      result.current.setVoucherDraft(code);
    });
    act(() => { expect(result.current.applyVoucher()).toBe(false); });
    expect(result.current.voucher.error).not.toBe('');
    expect(result.current.total).toBe(5900);
    expect(result.current.discount).toBe(0);
  });

  it('keeps the voucher for the session when the cart becomes empty', () => {
    const { result } = renderHook(useCart);
    act(() => {
      result.current.addProduct('tea');
      result.current.setVoucherDraft('discount10');
    });
    act(() => result.current.applyVoucher());
    act(() => result.current.removeProduct('tea'));
    expect(result.current.voucher.applied).toBe(true);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.discount).toBe(0);
    expect(result.current.total).toBe(0);
    act(() => result.current.addProduct('water'));
    expect(result.current.total).toBe(2250);
  });
});
