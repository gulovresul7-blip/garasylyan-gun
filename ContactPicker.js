import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useApp } from '../store';
import { Sheet, Text, Tap, Button, Field } from '../ui';
import { loadContacts } from '../services';

// Kontaktlary awtomatik görkezýär; multi=true bolsa, gerekmezlerini aýryp bolýar.
export default function ContactPicker({ visible, onClose, multi, onPick }) {
  const { t, theme } = useApp();
  const [list, setList] = useState([]);
  const [sel, setSel] = useState({});
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setSel({}); setQ(''); setLoading(true);
    loadContacts().then((r) => {
      setLoading(false);
      if (r === null) { Alert.alert(t('denied')); onClose(); return; }
      setList(r);
      if (multi) setSel(Object.fromEntries(r.map((c) => [c.id, true]))); // başda hemmesi saýlanan
    });
  }, [visible]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? list.filter((c) => c.name.toLowerCase().includes(s) || c.phone.includes(s)) : list;
  }, [list, q]);
  const n = Object.values(sel).filter(Boolean).length;

  return (
    <Sheet visible={visible} onClose={onClose} title={t('pickContact')} full>
      <Field placeholder={t('search')} value={q} onChangeText={setQ} />
      {multi ? (
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
          <Button kind="ghost" label={t('selectAll')} style={{ flex: 1 }} onPress={() => setSel(Object.fromEntries(list.map((c) => [c.id, true])))} />
          <Button kind="ghost" label={t('selectNone')} style={{ flex: 1 }} onPress={() => setSel({})} />
        </View>
      ) : null}
      {loading ? <ActivityIndicator color={theme.primary} style={{ margin: 30 }} /> : null}
      {shown.map((c) => (
        <Tap key={c.id} sound="pop"
          onPress={() => { if (multi) setSel((s) => ({ ...s, [c.id]: !s[c.id] })); else { onPick([c]); onClose(); } }}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
          {multi ? (
            <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: theme.primary, marginRight: 12,
              backgroundColor: sel[c.id] ? theme.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              {sel[c.id] ? <Text bold size={14} color={theme.onPrimary}>✓</Text> : null}
            </View>
          ) : null}
          <View style={{ flex: 1 }}>
            <Text bold size={16}>{c.name}</Text>
            <Text size={13} color={theme.muted}>{c.phone}</Text>
          </View>
        </Tap>
      ))}
      {multi ? (
        <Button style={{ marginTop: 16 }} label={`${t('addSelected')} (${n})`} disabled={!n} sound="success"
          onPress={() => { onPick(list.filter((c) => sel[c.id])); onClose(); }} />
      ) : null}
    </Sheet>
  );
}
