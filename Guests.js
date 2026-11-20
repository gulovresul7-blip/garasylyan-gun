import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useApp, uid } from '../store';
import { Text, Tap, Card, Entrance, Header, Button, Field, Sheet } from '../ui';
import ContactPicker from './ContactPicker';
import { callNumber, smsNumber, playSound } from '../services';
import { fmtDate } from '../i18n';

export default function Guests() {
  const { t, theme, state, update, lang } = useApp();
  const event = state.events.find((e) => e.id === state.activeEventId) || state.events[0];
  const [picker, setPicker] = useState(false);
  const [manual, setManual] = useState(false);
  const [n, setN] = useState('');
  const [p, setP] = useState('');
  if (!event) return null;
  const list = state.guests.filter((g) => g.eventId === event.id);
  const invitedN = list.filter((g) => g.invited).length;

  const addMany = (items) => {
    const have = new Set(list.map((g) => g.phone));
    const add = items.filter((c) => !c.phone || !have.has(c.phone)).map((c) => ({ id: uid(), eventId: event.id, name: c.name, phone: c.phone, invited: false }));
    update((s) => ({ ...s, guests: [...s.guests, ...add] }));
  };
  const addManual = () => {
    if (!n.trim()) return Alert.alert(t('fillAll'));
    addMany([{ name: n.trim(), phone: p.trim() }]);
    setN(''); setP(''); setManual(false); playSound('success');
  };
  const remove = (id) => { playSound('delete'); update((s) => ({ ...s, guests: s.guests.filter((g) => g.id !== id) })); };
  const toggle = (id) => { playSound('pop'); update((s) => ({ ...s, guests: s.guests.map((g) => (g.id === id ? { ...g, invited: !g.invited } : g)) })); };
  const invite = (g) => smsNumber(g.phone, t('inviteText', { name: g.name, title: event.title, date: fmtDate(lang, event.date) }));

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <Entrance>
        <Header title={t('guests')} />
        <Text size={13} color={theme.muted} style={{ marginBottom: 12 }}>{event.title} • {invitedN}/{list.length} {t('invited')}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          <Button icon="👥" label={t('importContacts')} onPress={() => setPicker(true)} style={{ flex: 1 }} />
          <Button kind="ghost" icon="＋" label={t('addGuest')} onPress={() => setManual(true)} style={{ flex: 1 }} />
        </View>
      </Entrance>
      {list.length === 0 ? <Card><Text color={theme.muted} style={{ textAlign: 'center' }}>{t('noGuests')}</Text></Card> : null}
      {list.map((g, i) => (
        <Entrance key={g.id} delay={Math.min(i, 8) * 30} from={12}>
          <Card style={{ marginBottom: 8, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
            <Tap onPress={() => toggle(g.id)} sound={null} style={{ width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: theme.primary, marginRight: 12,
              backgroundColor: g.invited ? theme.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              {g.invited ? <Text bold size={14} color={theme.onPrimary}>✓</Text> : null}
            </Tap>
            <View style={{ flex: 1 }}>
              <Text bold size={16}>{g.name}</Text>
              {g.phone ? <Text size={13} color={theme.muted}>{g.phone}</Text> : null}
            </View>
            {g.phone ? <Tap onPress={() => invite(g)} style={{ padding: 8 }}><Text size={20}>💌</Text></Tap> : null}
            {g.phone ? <Tap onPress={() => callNumber(g.phone)} style={{ padding: 8 }}><Text size={20}>📞</Text></Tap> : null}
            <Tap onPress={() => remove(g.id)} sound={null} style={{ padding: 8 }}><Text size={18} color={theme.danger}>✕</Text></Tap>
          </Card>
        </Entrance>
      ))}
      <ContactPicker visible={picker} multi onClose={() => setPicker(false)} onPick={addMany} />
      <Sheet visible={manual} onClose={() => setManual(false)} title={t('addGuest')}>
        <Field label={t('guestName')} value={n} onChangeText={setN} />
        <Field label={t('phone')} value={p} onChangeText={setP} keyboardType="phone-pad" placeholder={t('phonePh')} />
        <Button label={t('save')} onPress={addManual} sound={null} />
      </Sheet>
    </ScrollView>
  );
}
