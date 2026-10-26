import Feather from '@expo/vector-icons/Feather';
import { useRef } from 'react';
import { Keyboard, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { formatMoney } from './money';
import { ProductPhoto } from './ProductPhoto';
import type { Cart } from './useCart';

type Props = { cart: Cart; onBrowseMenu: () => void };

export function CartScreen({ cart, onBrowseMenu }: Props) {
  const voucherInput = useRef<TextInput>(null);

  function applyVoucher() {
    if (cart.applyVoucher()) Keyboard.dismiss();
    else voucherInput.current?.focus();
  }

  return (
    <View className="flex-1 bg-white">
      <View className="min-h-16 flex-row items-center gap-2 border-b border-divider px-4 py-2">
        <Pressable
          onPress={onBrowseMenu}
          accessibilityRole="button"
          accessibilityLabel="Back to menu"
          className="-ml-2 min-h-12 min-w-12 items-center justify-center rounded active:bg-subtle"
        >
          <Feather name="arrow-left" size={24} color="#1D2420" accessible={false} />
        </Pressable>
        <Text accessibilityRole="header" className="min-w-0 flex-1 text-[22px] font-medium leading-[28px] text-ink">
          Your Cart
        </Text>
        <Text className="text-[14px] leading-5 text-muted">
          {cart.count} {cart.count === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {cart.count === 0 ? (
        <ScrollView className="flex-1" contentContainerClassName="items-center px-6 pb-8 pt-28">
          <Text className="mb-2 text-center text-[20px] font-medium leading-7 text-ink">
            Your cart is empty
          </Text>
          <Text className="mb-6 max-w-[264px] text-center text-[14px] leading-[22px] text-muted">
            Add something from the menu to get started.
          </Text>
          <Pressable
            onPress={onBrowseMenu}
            accessibilityRole="button"
            className="min-h-12 min-w-44 items-center justify-center rounded-md bg-primary px-4 py-2.5 active:bg-primary-pressed"
          >
            <Text className="text-[15px] font-medium leading-[22px] text-white">Browse menu</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-6"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {cart.items.map(({ product, quantity, lineTotal }) => (
            <View key={product.id} className="border-b border-divider py-4">
              <View className="flex-row items-start gap-3">
                <ProductPhoto product={product} size={56} />
                <View className="min-w-0 flex-1">
                  <Text className="text-[16px] font-medium leading-[22px] text-ink">
                    {product.productName}
                  </Text>
                  <Text className="mt-1 text-[14px] leading-5 text-muted tabular-nums">
                    {formatMoney(Math.round(product.price * 100))} each
                  </Text>
                </View>
                <Text
                  accessibilityLabel={`${product.productName} line total ${formatMoney(lineTotal)}`}
                  className="text-[16px] font-semibold leading-[22px] text-ink tabular-nums"
                >
                  {formatMoney(lineTotal)}
                </Text>
              </View>
              <View className="ml-[68px] mt-2 flex-row flex-wrap items-center justify-between gap-x-3">
                <View className="flex-row items-center gap-0.5">
                  <Pressable
                    onPress={() => cart.decreaseProduct(product.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Decrease ${product.productName} quantity`}
                    accessibilityHint={quantity === 1 ? 'Removes the last item from your cart' : undefined}
                    className="min-h-12 min-w-12 items-center justify-center rounded"
                  >
                    <View className="h-8 w-8 items-center justify-center rounded bg-subtle">
                      <Feather name="minus" size={20} color="#1D2420" accessible={false} />
                    </View>
                  </Pressable>
                  <Text
                    accessibilityLabel={`${product.productName} quantity ${quantity}`}
                    className="min-w-6 text-center text-[16px] leading-[22px] text-ink tabular-nums"
                  >
                    {quantity}
                  </Text>
                  <Pressable
                    onPress={() => cart.addProduct(product.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Increase ${product.productName} quantity`}
                    className="min-h-12 min-w-12 items-center justify-center rounded"
                  >
                    <View className="h-8 w-8 items-center justify-center rounded bg-subtle">
                      <Feather name="plus" size={20} color="#1D2420" accessible={false} />
                    </View>
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => cart.removeProduct(product.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove all ${product.productName} from cart`}
                  className="-mr-2 min-h-12 min-w-12 items-center justify-center px-2"
                >
                  <Text className="text-[14px] leading-5 text-muted underline">Remove</Text>
                </Pressable>
              </View>
            </View>
          ))}

          <View className="border-b border-divider py-6">
            <Text className="mb-2 text-[14px] font-medium leading-5 text-ink">Voucher code</Text>
            <View className="flex-row items-start gap-2">
              <TextInput
                ref={voucherInput}
                value={cart.voucher.draft}
                onChangeText={cart.setVoucherDraft}
                onSubmitEditing={applyVoucher}
                accessibilityLabel="Voucher code"
                accessibilityHint={cart.voucherMessage}
                placeholder="Enter code"
                placeholderTextColor="#66716B"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                autoComplete="off"
                returnKeyType="done"
                submitBehavior="submit"
                className={`min-h-12 min-w-0 flex-1 rounded-md border bg-white px-3 py-2 text-[16px] leading-6 text-ink ${cart.voucher.error ? 'border-error' : 'border-input'}`}
              />
              <Pressable
                onPress={applyVoucher}
                accessibilityRole="button"
                accessibilityLabel="Apply voucher"
                className="min-h-12 min-w-[72px] items-center justify-center rounded-md border border-primary bg-white px-3 py-2 active:bg-subtle"
              >
                <Text className="text-[14px] font-medium leading-5 text-primary">Apply</Text>
              </Pressable>
            </View>
            <Text
              accessibilityLiveRegion="polite"
              className={`mt-2.5 min-h-5 text-[14px] leading-5 ${cart.voucher.error ? 'text-error' : cart.voucher.applied ? 'text-primary' : 'text-muted'}`}
            >
              {cart.voucherMessage}
            </Text>
          </View>

          <View className="pt-6">
            <View className="mb-3 flex-row items-baseline justify-between gap-4">
              <Text className="text-[14px] leading-5 text-ink">Subtotal</Text>
              <Text className="text-[14px] font-medium leading-5 text-ink tabular-nums">
                {formatMoney(cart.subtotal)}
              </Text>
            </View>
            {cart.voucher.applied && (
              <View className="mb-3 flex-row items-baseline justify-between gap-4">
                <Text className="text-[14px] leading-5 text-primary">Discount · 10%</Text>
                <Text className="text-[14px] font-medium leading-5 text-primary tabular-nums">
                  −{formatMoney(cart.discount)}
                </Text>
              </View>
            )}
            <View className="mt-1 flex-row items-baseline justify-between gap-4 border-t border-divider pt-4">
              <Text className="text-[20px] font-semibold leading-7 text-ink">Total</Text>
              <Text accessibilityLiveRegion="polite" className="text-[20px] font-semibold leading-7 text-ink tabular-nums">
                {formatMoney(cart.total)}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
