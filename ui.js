import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Easing, Pressable, Text as RNText, TextInput, View, Modal, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, useWindowDimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from './store';
import { playSound, } from './services';
import { fmtDate, fmtDay } from './i18n';

/* Ýazgy: saýlanan fonty awtomatik ulanýar */
export function Text({ bold, size = 16, color, style, children, family, ...rest }) {
  const { theme, font } = useApp();
  const flat = StyleSheet.flatten(style) || {};
  const isBold = bold || flat.fontWeight === '700' || flat.fontWeight === 'bold';
  const fs = (flat.fontSize || size) * font.scale;
  return (
    <RNText
      {...rest}
      style={[{ color: color || theme.text }, style, { fontFamily: family || (isBold ? font.b : font.r), fontSize: fs, fontWeight: 'normal',
        lineHeight: flat.lineHeight ? flat.lineHeight * font.scale : undefined }]}
    >
      {children}
    </RNText>
  );
}

/* Basylanda ses + ýumşak kiçelme animasiýasy */
export function Tap({ onPress, onLongPress, sound = 'tap', style, children, disabled, hitSlop }) {
  const s = useRef(new Animated.Value(1)).current;
  const to = (v) => Animated.spring(s, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  return (
    <Pressable
      disabled={disabled}
      hitSlop={hitSlop}
      onPressIn={() => to(0.95)}
      onPressOut={() => to(1)}
      onPress={() => { if (sound) playSound(sound); onPress && onPress(); }}
      onLongPress={onLongPress}
    >
      <Animated.View style={[{ transform: [{ scale: s }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}

export function Button({ label, onPress, kind = 'primary', icon, style, disabled, sound }) {
  const { theme } = useApp();
  const bg = kind === 'primary' ? theme.primary : kind === 'danger' ? theme.danger : theme.card;
  const fg = kind === 'primary' ? theme.onPrimary : kind === 'danger' ? '#fff' : theme.primaryDark;
  return (
    <Tap onPress={onPress} disabled={disabled} sound={sound}
      style={[{ backgroundColor: bg, paddingVertical: 13, paddingHorizontal: 20, borderRadius: 16, alignItems: 'center',
        flexDirection: 'row', justifyContent: 'center', gap: 8, opacity: disabled ? 0.5 : 1,
        borderWidth: kind === 'ghost' ? 1.5 : 0, borderColor: theme.border }, shadow(theme, 3), style]}>
      {icon ? <Text size={18} color={fg}>{icon}</Text> : null}
      <Text bold size={16} color={fg}>{label}</Text>
    </Tap>
  );
}

export const shadow = (theme, e = 4) => ({
  shadowColor: theme.shadow, shadowOpacity: theme.mode === 'dark' ? 0.4 : 0.22, shadowRadius: e * 2,
  shadowOffset: { width: 0, height: e }, elevation: e,
});

export function Card({ children, style }) {
  const { theme } = useApp();
  return (
    <View style={[{ backgroundColor: theme.card, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: theme.border }, shadow(theme, 3), style]}>
      {children}
    </View>
  );
}

export function Field({ label, style, multiline, ...props }) {
  const { theme, font } = useApp();
  return (
    <View style={[{ marginBottom: 12 }, style]}>
      {label ? <Text bold size={13} color={theme.muted} style={{ marginBottom: 6, marginLeft: 4 }}>{label}</Text> : null}
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={theme.muted + '99'}
        style={{
          backgroundColor: theme.bg, borderColor: theme.border, borderWidth: 1.5, borderRadius: 14,
          paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 * font.scale, color: theme.text, fontFamily: font.r,
          minHeight: multiline ? 80 : undefined, textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  );
}

export function Chip({ label, active, onPress, icon }) {
  const { theme } = useApp();
  return (
    <Tap onPress={onPress} sound="pop"
      style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, marginRight: 8, marginBottom: 8,
        backgroundColor: active ? theme.primary : theme.card, borderWidth: 1.5, borderColor: active ? theme.primary : theme.border }}>
      <Text bold size={14} color={active ? theme.onPrimary : theme.text}>{icon ? icon + ' ' : ''}{label}</Text>
    </Tap>
  );
}

/* Ekran geçişi: ýuwaşja ýüze çykýar we aşakdan galýar */
export function Entrance({ children, delay = 0, style, from = 24 }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: 420, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={[{ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [from, 0] }) }] }, style]}>
      {children}
    </Animated.View>
  );
}

/* Aşakdan çykýan sahypa (modal) */
export function Sheet({ visible, onClose, title, children, full }) {
  const { theme } = useApp();
  const { height } = useWindowDimensions();
  const a = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState(visible);
  useEffect(() => {
    if (visible) {
      setShown(true);
      playSound('whoosh');
      Animated.timing(a, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    } else if (shown) {
      Animated.timing(a, { toValue: 0, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => setShown(false));
    }
  }, [visible]);
  if (!shown) return null;
  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme.overlay, opacity: a }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
        <Animated.View
          style={{
            backgroundColor: theme.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: height * 0.92,
            height: full ? height * 0.92 : undefined, paddingTop: 10,
            transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [height, 0] }) }],
          }}
        >
          <View style={{ alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: theme.border, marginBottom: 8 }} />
          {title ? <Text bold size={20} style={{ textAlign: 'center', marginBottom: 6 }}>{title}</Text> : null}
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>{children}</ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* Sene / wagt saýlamak */
export function DateField({ label, value, onChange, withTime = true, clearable, placeholder }) {
  const { theme, t, lang } = useApp();
  const [step, setStep] = useState(null); // 'date' | 'time' | 'ios'
  const [temp, setTemp] = useState(null);
  const cur = value ? new Date(value) : new Date();

  const open = () => (Platform.OS === 'ios' ? (setTemp(cur), setStep('ios')) : setStep('date'));
  const onAndroid = (ev, d) => {
    if (ev.type === 'dismissed' || !d) { setStep(null); return; }
    if (step === 'date') {
      if (withTime) { setTemp(d); setStep('time'); }
      else { setStep(null); onChange(d.toISOString()); }
    } else {
      const base = temp || cur;
      const r = new Date(base);
      r.setHours(d.getHours(), d.getMinutes(), 0, 0);
      setStep(null);
      onChange(r.toISOString());
    }
  };
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text bold size={13} color={theme.muted} style={{ marginBottom: 6, marginLeft: 4 }}>{label}</Text> : null}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Tap onPress={open} style={{ flex: 1, backgroundColor: theme.bg, borderColor: theme.border, borderWidth: 1.5, borderRadius: 14, padding: 14 }}>
          <Text size={16} color={value ? theme.text : theme.muted}>
            📅  {value ? (withTime ? fmtDate(lang, value) : fmtDay(lang, value)) : (placeholder || t('noDate'))}
          </Text>
        </Tap>
        {clearable && value ? (
          <Tap onPress={() => onChange(null)} style={{ borderRadius: 14, paddingHorizontal: 14, justifyContent: 'center', backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border }}>
            <Text size={16}>✕</Text>
          </Tap>
        ) : null}
      </View>
      {Platform.OS === 'android' && (step === 'date' || step === 'time') ? (
        <DateTimePicker value={step === 'time' ? (temp || cur) : cur} mode={step} is24Hour onChange={onAndroid} />
      ) : null}
      {Platform.OS === 'ios' && step === 'ios' ? (
        <Modal transparent animationType="fade" onRequestClose={() => setStep(null)}>
          <View style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: 'center', padding: 20 }}>
            <View style={{ backgroundColor: theme.card, borderRadius: 24, padding: 16 }}>
              <DateTimePicker value={temp || cur} mode={withTime ? 'datetime' : 'date'} display="spinner" themeVariant={theme.mode}
                onChange={(e, d) => d && setTemp(d)} />
              <Button label={t('done')} onPress={() => { onChange((temp || cur).toISOString()); setStep(null); }} />
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

export function Header({ title, right }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <Text bold size={26}>{title}</Text>
      {right}
    </View>
  );
}

export const RoundBtn = ({ icon, onPress, size = 46 }) => {
  const { theme } = useApp();
  return (
    <Tap onPress={onPress} sound="pop"
      style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' }, shadow(theme, 4)]}>
      <Text bold size={size * 0.5} color={theme.onPrimary}>{icon}</Text>
    </Tap>
  );
};
