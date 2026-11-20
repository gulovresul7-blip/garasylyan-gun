import React, { useState } from 'react';
import { View, ScrollView, Alert, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, uid } from '../store';
import { Text, Button, Field, Chip, Entrance, DateField, Card } from '../ui';
import { LANGS } from '../i18n';
import { requestAllPermissions, playSound } from '../services';

export default function Onboarding() {
  const { t, theme, state, setSettings, setProfile, update } = useApp();
  const { height } = useWindowDimensions();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [place, setPlace] = useState('');
  const [type, setType] = useState('wedding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(null);

  const go = (n) => { playSound('whoosh'); setStep(n); };
  const typeLabel = { wedding: t('wedding'), birthday: t('birthday'), anniversary: t('anniversary'), custom: t('custom') };

  const finish = async (ask) => {
    if (ask) await requestAllPermissions();
    const ev = { id: uid(), type, title: title.trim() || typeLabel[type], date };
    playSound('success');
    update((s) => ({
      ...s,
      profile: { name: name.trim(), age: age.trim(), place: place.trim(), onboarded: true },
      events: [ev], activeEventId: ev.id,
    }));
  };

  const next1 = () => {
    if (!name.trim() || !age.trim() || !place.trim()) return Alert.alert(t('fillAll'));
    go(2);
  };
  const next2 = () => {
    if (!date) return Alert.alert(t('fillAll'));
    go(3);
  };

  const perms = [['🔔', t('permNotif')], ['👥', t('permContacts')], ['🖼️', t('permPhotos')], ['📷', t('permCamera')], ['🎙️', t('permMic')], ['📍', t('permLoc')]];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: 22, minHeight: height * 0.9, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
        <Entrance key={step}>
          {step === 0 && (
            <View style={{ alignItems: 'center' }}>
              <Text size={72}>💛</Text>
              <Text bold size={32} style={{ textAlign: 'center', marginTop: 10 }}>{t('welcome')}</Text>
              <Text size={16} color={theme.muted} style={{ textAlign: 'center', marginVertical: 14 }}>{t('welcomeSub')}</Text>
              <Text bold size={14} color={theme.muted} style={{ marginBottom: 10 }}>{t('chooseLang')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {LANGS.map((l) => <Chip key={l.code} label={l.name} active={state.settings.lang === l.code} onPress={() => setSettings({ lang: l.code })} />)}
              </View>
              <Button style={{ marginTop: 20, alignSelf: 'stretch' }} label={t('next')} onPress={() => go(1)} />
            </View>
          )}
          {step === 1 && (
            <View>
              <Text bold size={26} style={{ marginBottom: 14 }}>{t('aboutYou')}</Text>
              <Field label={t('yourName')} value={name} onChangeText={setName} placeholder={t('namePh')} />
              <Field label={t('yourAge')} value={age} onChangeText={(v) => setAge(v.replace(/[^\d]/g, '').slice(0, 3))} placeholder={t('agePh')} keyboardType="number-pad" />
              <Field label={t('yourPlace')} value={place} onChangeText={setPlace} placeholder={t('placePh')} />
              <Card style={{ marginVertical: 8, flexDirection: 'row', gap: 10 }}>
                <Text size={20}>🔒</Text>
                <Text size={13} color={theme.muted} style={{ flex: 1 }}>{t('privacy')}</Text>
              </Card>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <Button kind="ghost" label={t('back')} onPress={() => go(0)} style={{ flex: 1 }} />
                <Button label={t('next')} onPress={next1} style={{ flex: 2 }} />
              </View>
            </View>
          )}
          {step === 2 && (
            <View>
              <Text bold size={26} style={{ marginBottom: 14 }}>{t('firstEvent')}</Text>
              <Text bold size={13} color={theme.muted} style={{ marginBottom: 8, marginLeft: 4 }}>{t('eventType')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {Object.keys(typeLabel).map((k) => <Chip key={k} label={typeLabel[k]} active={type === k} onPress={() => setType(k)} />)}
              </View>
              <Field label={t('eventTitle')} value={title} onChangeText={setTitle} placeholder={t('eventTitlePh')} />
              <DateField label={t('eventDate')} value={date} onChange={setDate} />
              <Card style={{ marginVertical: 8, flexDirection: 'row', gap: 10 }}>
                <Text size={20}>🔒</Text>
                <Text size={13} color={theme.muted} style={{ flex: 1 }}>{t('privacy')}</Text>
              </Card>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <Button kind="ghost" label={t('back')} onPress={() => go(1)} style={{ flex: 1 }} />
                <Button label={t('next')} onPress={next2} style={{ flex: 2 }} />
              </View>
            </View>
          )}
          {step === 3 && (
            <View>
              <Text bold size={26} style={{ marginBottom: 6 }}>{t('permTitle')}</Text>
              <Text size={14} color={theme.muted} style={{ marginBottom: 14 }}>{t('permSub')}</Text>
              {perms.map(([i, l]) => (
                <Card key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8, paddingVertical: 12 }}>
                  <Text size={22}>{i}</Text><Text bold size={15}>{l}</Text>
                </Card>
              ))}
              <Text size={13} color={theme.muted} style={{ marginVertical: 8 }}>🔒 {t('privacy')}</Text>
              <Button label={t('allowAll')} onPress={() => finish(true)} style={{ marginTop: 6 }} />
              <Button kind="ghost" label={t('skip')} onPress={() => finish(false)} style={{ marginTop: 10 }} />
            </View>
          )}
        </Entrance>
      </ScrollView>
    </SafeAreaView>
  );
}
