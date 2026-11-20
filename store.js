import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translate } from './i18n';
import { LIGHT, DARK, FONTS } from './theme';
import { setSoundEnabled } from './services';

const KEY = 'garasylyan-gun-v1';

export const INITIAL = {
  profile: { name: '', age: '', place: '', onboarded: false },
  settings: { lang: 'tk', theme: 'system', font: 'nunito', sound: true, daily: true, dailyHour: 9 },
  events: [],
  activeEventId: null,
  tasks: [],
  guests: [],
  moments: [],
};

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function AppProvider({ children }) {
  const [state, setState] = useState(INITIAL);
  const [ready, setReady] = useState(false);
  const [sys, setSys] = useState(Appearance.getColorScheme() || 'light');
  const timer = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          setState({
            ...INITIAL, ...saved,
            profile: { ...INITIAL.profile, ...(saved.profile || {}) },
            settings: { ...INITIAL.settings, ...(saved.settings || {}) },
          });
        }
      } catch (e) {}
      setReady(true);
    })();
    const sub = Appearance.addChangeListener(({ colorScheme }) => setSys(colorScheme || 'light'));
    return () => sub && sub.remove && sub.remove();
  }, []);

  useEffect(() => {
    if (!ready) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
    }, 300);
  }, [state, ready]);

  useEffect(() => { setSoundEnabled(state.settings.sound); }, [state.settings.sound]);

  const update = useCallback((fn) => setState((s) => fn(s)), []);
  const setSettings = useCallback((patch) => setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })), []);
  const setProfile = useCallback((patch) => setState((s) => ({ ...s, profile: { ...s.profile, ...patch } })), []);

  const lang = state.settings.lang;
  const t = useCallback((k, v) => translate(lang, k, v), [lang]);
  const dark = state.settings.theme === 'dark' || (state.settings.theme === 'system' && sys === 'dark');
  const theme = dark ? DARK : LIGHT;
  const font = FONTS[state.settings.font] || FONTS.nunito;

  const value = useMemo(
    () => ({ state, ready, update, setSettings, setProfile, t, lang, theme, font }),
    [state, ready, update, setSettings, setProfile, t, lang, theme, font]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
