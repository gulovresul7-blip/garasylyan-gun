import React, { useState } from 'react';
import { View, ScrollView, Switch, Alert } from 'react-native';
import { useApp } from '../store';
import { Text, Card, Chip, Field, Entrance, Header, Button, Tap } from '../ui';
import { LANGS } from '../i18n';
import { FONTS } from '../theme';
import { callNumber, smsNumber } from '../services';

export default function Settings() {
  const { t, theme, state, setSettings, setProfile, update } = useApp();
  const s = state.settings;
  const Row = ({ children }) => <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{children}</View>;
  const Title = ({ children }) => <Text bold size={14} color={theme.muted} style={{ marginBottom: 8 }}>{children}</Text>;

  const resetAll = () =>
    Alert.alert(t('confirmDelete'), '', [{ text: t('no') }, { text: t('yes'), style: 'destructive', onPress: () =>
      update((x) => ({ ...x, profile: { name: '', age: '', place: '', onboarded: false }, events: [], tasks: [], guests: [], moments: [], activeEventId: null })) }]);

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <Entrance>
        <Header title={t('settings')} />

        <Card style={{ marginBottom: 14 }}>
          <Title>🔒 {t('yourData')}</Title>
          <Field label={t('yourName')} value={state.profile.name} onChangeText={(v) => setProfile({ name: v })} />
          <Field label={t('yourAge')} value={state.profile.age} keyboardType="number-pad" onChangeText={(v) => setProfile({ age: v.replace(/[^\d]/g, '').slice(0, 3) })} />
          <Field label={t('yourPlace')} value={state.profile.place} onChangeText={(v) => setProfile({ place: v })} />
          <Text size={12} color={theme.muted}>{t('privacy')}</Text>
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <Title>🌐 {t('language')}</Title>
          <Row>{LANGS.map((l) => <Chip key={l.code} label={l.name} active={s.lang === l.code} onPress={() => setSettings({ lang: l.code })} />)}</Row>
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <Title>🌗 {t('theme')}</Title>
          <Row>
            <Chip icon="☀️" label={t('light')} active={s.theme === 'light'} onPress={() => setSettings({ theme: 'light' })} />
            <Chip icon="🌙" label={t('dark')} active={s.theme === 'dark'} onPress={() => setSettings({ theme: 'dark' })} />
            <Chip icon="📱" label={t('system')} active={s.theme === 'system'} onPress={() => setSettings({ theme: 'system' })} />
          </Row>
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <Title>🔤 {t('font')}</Title>
          {Object.keys(FONTS).map((k) => (
            <Tap key={k} onPress={() => setSettings({ font: k })} sound="pop"
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.border }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: theme.primary, marginRight: 12, alignItems: 'center', justifyContent: 'center' }}>
                {s.font === k ? <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: theme.primary }} /> : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text size={12} color={theme.muted}>{FONTS[k].label}</Text>
                <Text size={20} family={FONTS[k].r}>{t('fontSample')}</Text>
              </View>
            </Tap>
          ))}
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text bold size={16}>🔊 {t('sound')}</Text>
            <Switch value={s.sound} onValueChange={(v) => setSettings({ sound: v })} trackColor={{ true: theme.primary, false: theme.border }} thumbColor="#fff" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text bold size={16}>🔔 {t('dailyReminder')}</Text>
            <Switch value={s.daily} onValueChange={(v) => setSettings({ daily: v })} trackColor={{ true: theme.primary, false: theme.border }} thumbColor="#fff" />
          </View>
        </Card>

        <Card style={{ marginBottom: 14, alignItems: 'center' }}>
          <Title>💛 {t('about')}</Title>
          <Text size={13} color={theme.muted}>{t('creator')}</Text>
          <Text bold size={22}>Gulow Resul</Text>
          <Text size={13} color={theme.muted} style={{ marginTop: 8 }}>{t('contact')}</Text>
          <Text bold size={18} color={theme.primaryDark}>+99362056128</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12, alignSelf: 'stretch' }}>
            <Button icon="📞" label={t('call')} style={{ flex: 1 }} onPress={() => callNumber('+99362056128')} />
            <Button kind="ghost" icon="💬" label={t('sms')} style={{ flex: 1 }} onPress={() => smsNumber('+99362056128')} />
          </View>
        </Card>
        <Button kind="danger" label={t('delete') + ' — ' + t('yourData')} onPress={resetAll} sound={null} />
      </Entrance>
    </ScrollView>
  );
}
