import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { BackHandler, Platform } from 'react-native';
import App from '../App';

jest.mock('../global.css', () => ({}));
jest.mock('@expo/vector-icons/Feather', () => 'Feather');
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

afterEach(() => jest.restoreAllMocks());

it('supports catalog, cart quantities, valid voucher, and discounted catalog total', () => {
  render(<App />);
  expect(screen.getByText('Menu')).toBeVisible();
  expect(screen.getAllByRole('button', { name: /Add .+ to cart/ })).toHaveLength(4);
  fireEvent.press(screen.getByRole('button', { name: 'Add Chicken rice to cart' }));
  fireEvent.press(screen.getByRole('button', { name: 'Add Chicken rice to cart' }));
  fireEvent.press(screen.getByRole('button', { name: 'Add Iced tea to cart' }));
  fireEvent.press(screen.getByRole('button', { name: 'Open cart, 3 items' }));
  expect(screen.getByText('Your Cart')).toBeVisible();
  expect(screen.getByLabelText('Chicken rice line total ₱299.00')).toBeVisible();
  expect(screen.getAllByText('₱358.00')).toHaveLength(2);
  fireEvent.changeText(screen.getByLabelText('Voucher code'), 'discount10');
  fireEvent.press(screen.getByRole('button', { name: 'Apply voucher' }));
  expect(screen.getByText('−₱35.80')).toBeVisible();
  expect(screen.getByText('₱322.20')).toBeVisible();
  fireEvent.press(screen.getByRole('button', { name: 'Back to menu' }));
  expect(screen.getByText('Discounted total')).toBeVisible();
  expect(screen.getByRole('button', { name: 'View cart, 3 items, discounted total ₱322.20' })).toBeVisible();
});

it('decreases the final item to the empty state and returns to browsing', () => {
  render(<App />);
  fireEvent.press(screen.getByRole('button', { name: 'Add Bottled water to cart' }));
  fireEvent.press(screen.getByRole('button', { name: 'Open cart, 1 item' }));
  fireEvent.press(screen.getByRole('button', { name: 'Increase Bottled water quantity' }));
  expect(screen.getAllByText('₱50.00')).toHaveLength(3);
  fireEvent.press(screen.getByRole('button', { name: 'Decrease Bottled water quantity' }));
  fireEvent.press(screen.getByRole('button', { name: 'Decrease Bottled water quantity' }));
  expect(screen.getByText('Your cart is empty')).toBeVisible();
  expect(screen.queryByLabelText('Voucher code')).toBeNull();
  fireEvent.press(screen.getByRole('button', { name: 'Browse menu' }));
  expect(screen.getByRole('button', { name: 'Open cart, 0 items' })).toBeVisible();
});

it('shows invalid voucher feedback, clears a previous discount, and removes items', () => {
  render(<App />);
  fireEvent.press(screen.getByRole('button', { name: 'Add Iced tea to cart' }));
  fireEvent.press(screen.getByRole('button', { name: 'Open cart, 1 item' }));
  const input = screen.getByLabelText('Voucher code');
  fireEvent.changeText(input, 'discount10');
  fireEvent(input, 'submitEditing');
  fireEvent.changeText(input, 'wrong');
  fireEvent.press(screen.getByRole('button', { name: 'Apply voucher' }));
  expect(screen.getByText('Code not recognized. Previous discount removed.')).toBeVisible();
  expect(screen.queryByText('Discount · 10%')).toBeNull();
  fireEvent.press(screen.getByRole('button', { name: 'Remove all Iced tea from cart' }));
  expect(screen.getByText('Your cart is empty')).toBeVisible();
});

it('handles Android Back from the cart and removes the listener on return', () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  const remove = jest.fn();
  const subscribe = jest.spyOn(BackHandler, 'addEventListener').mockReturnValue({ remove });
  render(<App />);
  fireEvent.press(screen.getByRole('button', { name: 'Open cart, 0 items' }));
  const handler = subscribe.mock.calls[0][1];
  act(() => { expect(handler({ type: 'hardwareBackPress', timeStamp: 0 })).toBe(true); });
  expect(screen.getByText('Menu')).toBeVisible();
  expect(remove).toHaveBeenCalledTimes(1);
});
