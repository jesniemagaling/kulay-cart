import Feather from '@expo/vector-icons/Feather';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { formatMoney } from './money';
import { ProductPhoto } from './ProductPhoto';
import { products } from './products';
import type { Cart } from './useCart';

type Props = { cart: Cart; onOpenCart: () => void };

export function MenuScreen({ cart, onOpenCart }: Props) {
  const { width } = useWindowDimensions();
  const itemLabel = `${cart.count} ${cart.count === 1 ? 'item' : 'items'}`;

  return (
    <View className="flex-1 bg-white">
      <View className="min-h-16 flex-row items-center gap-2 border-b border-divider px-4 py-2">
        <View className="min-w-0 flex-1">
          <Text accessibilityRole="header" className="text-[22px] font-medium leading-[28px] text-ink">
            Menu
          </Text>
          <Text className="text-[12px] leading-4 text-muted">Meals & refreshments</Text>
        </View>
        <Pressable
          onPress={onOpenCart}
          accessibilityRole="button"
          accessibilityLabel={`Open cart, ${itemLabel}`}
          className="-mr-2 min-h-12 min-w-16 flex-row items-center justify-center gap-2 rounded px-2 active:bg-subtle"
        >
          <Feather name="shopping-cart" size={24} color="#1D2420" accessible={false} />
          <Text className="text-[14px] text-ink">{cart.count}</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-4">
        {products.map((product, index) => {
          const quantity = cart.quantities[product.id] ?? 0;
          return (
            <View
              key={product.id}
              className={`flex-row items-start gap-3 py-3 ${index < products.length - 1 ? 'border-b border-divider' : ''}`}
            >
              <ProductPhoto product={product} size={width < 380 ? 64 : 72} />
              <View className="min-w-0 flex-1">
                <Text className="text-[16px] font-medium leading-[22px] text-ink">
                  {product.productName}
                </Text>
                <Text className="mb-2 mt-1 text-[14px] leading-5 text-muted">
                  {product.description}
                </Text>
                <View className="flex-row items-center justify-between gap-3">
                  <View className="min-h-[42px] min-w-0 flex-shrink gap-0.5">
                    <Text className="text-[16px] font-semibold leading-[22px] text-ink tabular-nums">
                      {formatMoney(Math.round(product.price * 100))}
                    </Text>
                    {quantity > 0 && (
                      <Text accessibilityLiveRegion="polite" className="text-[12px] leading-[18px] text-muted">
                        In cart: {quantity}
                      </Text>
                    )}
                  </View>
                  <Pressable
                    onPress={() => cart.addProduct(product.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${product.productName} to cart`}
                    className="min-h-12 min-w-16 justify-center py-2"
                  >
                    <View className="min-h-8 items-center justify-center rounded bg-primary px-3 py-1">
                      <Text className="text-[14px] font-medium leading-5 text-white">Add</Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {cart.count > 0 && (
        <View className="border-t border-divider px-4 pb-2 pt-3">
          <Pressable
            onPress={onOpenCart}
            accessibilityRole="button"
            accessibilityLabel={`View cart, ${itemLabel}, ${cart.voucher.applied ? 'discounted total' : 'total'} ${formatMoney(cart.total)}`}
            className="min-h-12 flex-row items-center justify-between gap-3 rounded-md bg-primary px-4 py-1.5 active:bg-primary-pressed"
          >
            <View className="min-w-0 flex-1 flex-row flex-wrap items-center gap-x-2">
              <Text className="text-[15px] font-medium leading-[22px] text-white">View cart</Text>
              <Text className="text-[13px] leading-[18px] text-white">{itemLabel}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[12px] leading-4 text-white">
                {cart.voucher.applied ? 'Discounted total' : 'Total'}
              </Text>
              <Text className="text-[16px] font-semibold leading-[22px] text-white tabular-nums">
                {formatMoney(cart.total)}
              </Text>
            </View>
          </Pressable>
          {cart.voucher.applied && (
            <Text className="mt-1.5 text-center text-[12px] leading-4 text-muted">
              Includes 10% voucher discount
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
