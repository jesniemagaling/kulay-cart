import './global.css';

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { CartScreen } from './src/CartScreen';
import { MenuScreen } from './src/MenuScreen';
import { useCart } from './src/useCart';

function CartApp() {
  const [screen, setScreen] = useState<'menu' | 'cart'>('menu');
  const cart = useCart();

  useEffect(() => {
    if (Platform.OS !== 'android' || screen !== 'cart') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      Keyboard.dismiss();
      setScreen('menu');
      return true;
    });

    return () => subscription.remove();
  }, [screen]);

  function browseMenu() {
    Keyboard.dismiss();
    setScreen('menu');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {screen === 'menu' ? (
          <MenuScreen cart={cart} onOpenCart={() => setScreen('cart')} />
        ) : (
          <CartScreen cart={cart} onBrowseMenu={browseMenu} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <CartApp />
    </SafeAreaProvider>
  );
}
