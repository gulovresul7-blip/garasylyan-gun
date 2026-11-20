import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';
import { Comfortaa_400Regular, Comfortaa_700Bold } from '@expo-google-fonts/comfortaa';
import { Caveat_400Regular, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';

import { AppProvider, useApp } from './src/store';
import { Text, Tap, shadow } from './src/ui';
import { playSound, setupNotifications, rescheduleAll } from './src/services';
import Onboarding from './src/screens/Onboarding';
import Home from './src/screens/Home';
import Guests from './src/screens/Guests';
import Moments from './src/screens/Moments';
import Settings from './src/screens/Settings';

SplashScreen.preventAutoHideAsync().catch(() => {});
setupNotifications();

const TABS = [
  ['home', '🏠', 'tabHome', Home],
  ['guests', '💌', 'tabGuests', Guests],
  ['moments', '📸', 'tabMoments', Moments],
  ['settings', '⚙️', 'tabSettings', Settings],
];

function Screen({ children, id }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    a.setValue(0);
    Animated.timing(a, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [id]);
  return (
    <Animated.View style={{ flex: 1, opacity: a, transform: [{ translateX: a.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }, { scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }) }] }}>
      {children}
    </Animated.View>
  );
}

function Main() {
  const { theme, t, state } = useApp();
  const [tab, setTab] = useState('home');
  const insets = useSafeAreaInsets();
  const Cur = TABS.find((x) => x[0] === tab)[3];

  // Seneler / işler / dil üýtgände bildirişleri täzeden meýilleşdirýär
  useEffect(() => { rescheduleAll(state); }, [state.events, state.tasks, state.settings.lang, state.settings.daily]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <Screen id={tab}><Cur /></Screen>
      </SafeAreaView>
      <View style={[{ position: 'absolute', left: 14, right: 14, bottom: Math.max(insets.bottom, 10), flexDirection: 'row', backgroundColor: theme.card,
        borderRadius: 26, padding: 6, borderWidth: 1, borderColor: theme.border }, shadow(theme, 8)]}>
        {TABS.map(([id, icon, label]) => {
          const on = tab === id;
          return (
            <Tap key={id} onPress={() => setTab(id)} sound="tap"
              style={{ flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 20, backgroundColor: on ? theme.primary : 'transparent' }}>
              <Text size={20}>{icon}</Text>
              <Text bold size={11} color={on ? theme.onPrimary : theme.muted} numberOfLines={1}>{t(label)}</Text>
            </Tap>
          );
        })}
      </View>
    </View>
  );
}

function Root() {
  const { ready, state, theme } = useApp();
  const [loaded] = useFonts({
    Nunito_400Regular, Nunito_700Bold, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold, Lora_400Regular, Lora_700Bold,
    Comfortaa_400Regular, Comfortaa_700Bold, Caveat_400Regular, Caveat_700Bold, Pacifico_400Regular,
  });
  useEffect(() => { if (ready && loaded) SplashScreen.hideAsync().catch(() => {}); }, [ready, loaded]);
  if (!ready || !loaded) return null;
  return (
    <>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      {state.profile.onboarded && state.events.length ? <Main /> : <Onboarding />}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}
