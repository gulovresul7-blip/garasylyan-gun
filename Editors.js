import React, { useEffect, useState } from 'react';
import { View, Image, Alert, ScrollView } from 'react-native';
import { useApp, uid } from '../store';
import { Sheet, Text, Tap, Button, Field, Chip, DateField, Card } from '../ui';
import ContactPicker from './ContactPicker';
import {
  pickImagesFromGallery, pickImagesFromFiles, takePhoto, currentAddress, openMap, callNumber, smsNumber, playSound,
} from '../services';

export function EventEditor({ visible, event, onClose }) {
  const { t, update } = useApp();
  const [type, setType] = useState('wedding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(null);
  const labels = { wedding: t('wedding'), birthday: t('birthday'), anniversary: t('anniversary'), custom: t('custom') };

  useEffect(() => {
    if (!visible) return;
    setType(event ? event.type : 'wedding'); setTitle(event ? event.title : ''); setDate(event ? event.date : null);
  }, [visible]);

  const save = () => {
    if (!date) return Alert.alert(t('fillAll'));
    const ev = { id: event ? event.id : uid(), type, title: title.trim() || labels[type], date };
    playSound('success');
    update((s) => ({
      ...s,
      events: event ? s.events.map((e) => (e.id === ev.id ? ev : e)) : [...s.events, ev],
      activeEventId: ev.id,
    }));
    onClose();
  };
  const remove = () =>
    Alert.alert(t('confirmDelete'), '', [
      { text: t('no') },
      { text: t('yes'), style: 'destructive', onPress: () => {
        playSound('delete');
        update((s) => {
          const events = s.events.filter((e) => e.id !== event.id);
          return { ...s, events, activeEventId: events[0] ? events[0].id : null,
            tasks: s.tasks.filter((k) => k.eventId !== event.id), guests: s.guests.filter((g) => g.eventId !== event.id),
            moments: s.moments.filter((m) => m.eventId !== event.id) };
        });
        onClose();
      } },
    ]);

  return (
    <Sheet visible={visible} onClose={onClose} title={event ? t('editEvent') : t('newEvent')}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 }}>
        {Object.keys(labels).map((k) => <Chip key={k} label={labels[k]} active={type === k} onPress={() => setType(k)} />)}
      </View>
      <Field label={t('eventTitle')} value={title} onChangeText={setTitle} placeholder={t('eventTitlePh')} />
      <DateField label={t('eventDate')} value={date} onChange={setDate} />
      <Button label={t('save')} onPress={save} sound={null} />
      {event ? <Button kind="danger" label={t('delete')} onPress={remove} style={{ marginTop: 10 }} sound={null} /> : null}
    </Sheet>
  );
}

export function TaskEditor({ visible, task, eventId, onClose }) {
  const { t, theme, update } = useApp();
  const [f, setF] = useState({});
  const [picker, setPicker] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setF(task ? { ...task } : { title: '', due: null, address: '', lat: null, lng: null, phone: '', note: '', photos: [], done: false });
  }, [visible]);
  const set = (p) => setF((x) => ({ ...x, ...p }));

  const save = () => {
    if (!(f.title || '').trim()) return Alert.alert(t('fillAll'));
    const item = { ...f, title: f.title.trim(), id: task ? task.id : uid(), eventId: task ? task.eventId : eventId };
    playSound('success');
    update((s) => ({ ...s, tasks: task ? s.tasks.map((k) => (k.id === item.id ? item : k)) : [...s.tasks, item] }));
    onClose();
  };
  const remove = () =>
    Alert.alert(t('confirmDelete'), '', [
      { text: t('no') },
      { text: t('yes'), style: 'destructive', onPress: () => { playSound('delete'); update((s) => ({ ...s, tasks: s.tasks.filter((k) => k.id !== task.id) })); onClose(); } },
    ]);

  const autoAddress = async () => {
    setBusy(true);
    const r = await currentAddress();
    setBusy(false);
    if (r.error === 'denied') return Alert.alert(t('denied'));
    if (r.error) return Alert.alert(t('locError'));
    set({ address: r.text, lat: r.latitude, lng: r.longitude });
    playSound('pop');
  };
  const addPhotos = async (fn) => {
    const r = await fn();
    if (r === null) return Alert.alert(t('denied'));
    if (r.length) set({ photos: [...(f.photos || []), ...r.map((x) => x.uri)] });
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={task ? t('editPlan') : t('addPlan')} full>
      <Field label={t('planTitle')} value={f.title} onChangeText={(v) => set({ title: v })} placeholder={t('planTitlePh')} />
      <DateField label={t('planDue')} value={f.due} onChange={(v) => set({ due: v })} clearable placeholder={t('setDate')} />

      <Field label={t('address')} value={f.address} onChangeText={(v) => set({ address: v, lat: null, lng: null })} placeholder={t('addressPh')} multiline />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: -4, marginBottom: 12 }}>
        <Chip icon="📍" label={busy ? '...' : t('useMyLocation')} onPress={autoAddress} />
        <Chip icon="🗺️" label={f.lat ? t('openMap') : t('searchMap')} onPress={() => (f.address || f.lat) ? openMap(f.address, f.lat, f.lng) : null} />
      </View>

      <Field label={t('phone')} value={f.phone} onChangeText={(v) => set({ phone: v })} placeholder={t('phonePh')} keyboardType="phone-pad" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: -4, marginBottom: 12 }}>
        <Chip icon="👥" label={t('pickContact')} onPress={() => setPicker(true)} />
        {f.phone ? <Chip icon="📞" label={t('call')} onPress={() => callNumber(f.phone)} /> : null}
        {f.phone ? <Chip icon="💬" label={t('sms')} onPress={() => smsNumber(f.phone)} /> : null}
      </View>

      <Text bold size={13} color={theme.muted} style={{ marginBottom: 6, marginLeft: 4 }}>{t('photos')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Chip icon="🖼️" label={t('fromGallery')} onPress={() => addPhotos(() => pickImagesFromGallery(true))} />
        <Chip icon="📁" label={t('fromFiles')} onPress={() => addPhotos(pickImagesFromFiles)} />
        <Chip icon="📷" label={t('camera')} onPress={() => addPhotos(takePhoto)} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {(f.photos || []).map((u, i) => (
          <View key={u + i} style={{ marginRight: 10 }}>
            <Image source={{ uri: u }} style={{ width: 96, height: 96, borderRadius: 14 }} />
            <Tap onPress={() => set({ photos: f.photos.filter((_, j) => j !== i) })} sound="delete"
              style={{ position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: 12, backgroundColor: theme.danger, alignItems: 'center', justifyContent: 'center' }}>
              <Text bold size={12} color="#fff">✕</Text>
            </Tap>
          </View>
        ))}
      </ScrollView>

      <Field label={t('note')} value={f.note} onChangeText={(v) => set({ note: v })} placeholder={t('notePh')} multiline />
      <Button label={t('save')} onPress={save} sound={null} />
      {task ? <Button kind="danger" label={t('delete')} onPress={remove} style={{ marginTop: 10 }} sound={null} /> : null}
      <ContactPicker visible={picker} onClose={() => setPicker(false)} onPick={(l) => l[0] && set({ phone: l[0].phone })} />
    </Sheet>
  );
}
