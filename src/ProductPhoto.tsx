import { Image, View } from 'react-native';
import type { Product } from './products';

export function ProductPhoto({ product, size }: { product: Product; size: number }) {
  const imageHeight = product.topCropAspectRatio
    ? Math.max(size, size / product.topCropAspectRatio)
    : size;

  return (
    <View
      className="overflow-hidden rounded bg-subtle"
      style={{ width: size, height: size }}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Image
        source={product.image}
        resizeMode="cover"
        style={{ width: size, height: imageHeight }}
        accessible={false}
      />
    </View>
  );
}
