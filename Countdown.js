import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, useWindowDimensions } from 'react-native';
import { useApp } from '../store';
import { Text, shadow } from '../ui';

function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  return now;
}

const pad = (n) => String(n).padStart(2, '0');

export default function Countdown({ event }) {
  const { t, theme, state } = useApp();
  const { width } = useWindowDimensions();
  const now = useNow();
  const size = Math.min(width * 0.86, 380);
  const pulse = useRef(new Animated.Value(0)).current;
  const tick = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
  }, []);
  useEffect(() => {
    tick.setValue(1.12);
    Animated.spring(tick, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }).start();
  }, [Math.floor(now / 1000)]);

  const diff = new Date(event.date).getTime() - now;
  const over = diff <= 0;
  const abs = Math.abs(diff);
  const d = Math.floor(abs / 86400000);
  const h = Math.floor((abs % 86400000) / 3600000);
  const m = Math.floor((abs % 3600000) / 60000);
  const s = Math.floor((abs % 60000) / 1000);

  const ring = (scale, op) => ({
    position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: theme.primary,
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [op, 0] }),
    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, scale] }) }],
  });

  const Unit = ({ v, l }) => (
    <View style={{ alignItems: 'center', minWidth: size * 0.19 }}>
      <Text bold size={size * 0.1}>{pad(v)}</Text>
      <Text bold size={size * 0.034} color={theme.muted}>{l}</Text>
    </View>
  );

  const age = parseInt(state.profile.age, 10);
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: size * 1.12, marginVertical: 6 }}>
      <Animated.View style={ring(1.12, 0.22)} />
      <Animated.View style={ring(1.24, 0.12)} />
      <View style={[{
        width: size, height: size, borderRadius: size / 2, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center',
        borderWidth: size * 0.025, borderColor: theme.primary, padding: size * 0.08,
      }, shadow(theme, 8)]}>
        <Text bold size={size * 0.05} color={theme.primaryDark} numberOfLines={2} style={{ textAlign: 'center' }}>
          {over ? event.title : t('toEvent', { title: event.title })}
        </Text>
        {over && d === 0 ? (
          <Text bold size={size * 0.1} style={{ textAlign: 'center', marginTop: 6 }}>{t('itsTime')}</Text>
        ) : (
          <>
            <Animated.View style={{ transform: [{ scale: tick }], alignItems: 'center', marginTop: 4 }}>
              <Text bold size={size * 0.27} color={theme.primary} style={{ lineHeight: size * 0.3 }}>{d}</Text>
            </Animated.View>
            <Text bold size={size * 0.045} color={theme.muted} style={{ marginBottom: 8 }}>{t('days')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Unit v={h} l={t('hours')} />
              <Text bold size={size * 0.08} color={theme.primary}>:</Text>
              <Unit v={m} l={t('minutes')} />
              <Text bold size={size * 0.08} color={theme.primary}>:</Text>
              <Unit v={s} l={t('seconds')} />
            </View>
            {over ? <Text size={13} color={theme.muted} style={{ marginTop: 6 }}>{t('passed', { n: d })}</Text> : null}
          </>
        )}
        {event.type === 'birthday' && !over && age ? (
          <Text size={size * 0.04} color={theme.primaryDark} style={{ marginTop: 6 }}>{t('turns', { age: age + 1 })}</Text>
        ) : null}
      </View>
    </View>
  );
}
