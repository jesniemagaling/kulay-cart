import type { ImageSourcePropType } from 'react-native';

export type Product = {
  id: string;
  productName: string;
  description: string;
  price: number;
  image: ImageSourcePropType;
  topCropAspectRatio?: number;
};

export const products: readonly Product[] = [
  {
    id: 'chicken',
    productName: 'Chicken rice',
    description: 'Seasoned chicken over rice, with fresh herbs.',
    price: 149.5,
    image: require('../assets/products/chicken-rice.jpg'),
  },
  {
    id: 'vegetables',
    productName: 'Vegetable rice bowl',
    description: 'Vegetable fried rice with carrots and greens.',
    price: 129,
    image: require('../assets/products/vegetable-rice.jpg'),
  },
  {
    id: 'tea',
    productName: 'Iced tea',
    description: 'Chilled black tea with a slice of lemon.',
    price: 59,
    image: require('../assets/products/iced-tea.jpg'),
  },
  {
    id: 'water',
    productName: 'Bottled water',
    description: 'Still water, 500 ml.',
    price: 25,
    image: require('../assets/products/bottled-water.jpg'),
    topCropAspectRatio: 400 / 600,
  },
];
