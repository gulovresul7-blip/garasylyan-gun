import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { useApp } from '../store';
import { Text, Tap, Card, Entrance, RoundBtn, Chip, shadow } from '../ui';
import Countdown from './Countdown';
import { EventEditor, TaskEditor } from './Editors';
import { fmtDay, } from '../i18n';
import { callNumber, smsNumber, openMap, playSound } from '../services';

export default function Home() {
  const { t, theme, state, update } = useApp();
  const [evEdit, setEvEdit] = useState({ open: false, ev: null });
  const [taskEdit, setTaskEdit] = useState({ open: false, task: null });
  const event = state.events.find((e) => e.id === state.activeEventId) || state.events[0];
  const tasks = state.tasks.filter((k) => event && k.eventId === event.id)
    .sort((a, b) => (a.done - b.done) || ((a.due ? new Date(a.due) : 9e15) - (b.due ? new Date(b.due) : 9e15)));
  const doneN = tasks.filter((k) => k.done).length;
  const { name, place, age } = state.profile;

  const toggle = (id) => {
    const k = state.tasks.find((x) => x.id === id);
    playSound(k && !k.done ? 'success' : 'pop');
    update((s) => ({ ...s, tasks: s.tasks.map((x) => (x.id === id ? { ...x, done: !x.done } : x)) }));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <Entrance>
        <Text bold size={26}>{t('hello', { name })}</Text>
        <Text size={14} color={theme.muted}>{t('helloPlace', { place, age })}</Text>
      </Entrance>

      <Entrance delay={80}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }}>
          {state.events.map((e) => (
            <Chip key={e.id} label={e.title} active={event && e.id === event.id} onPress={() => update((s) => ({ ...s, activeEventId: e.id }))} />
          ))}
          <Chip icon="＋" label={t('newEvent')} onPress={() => setEvEdit({ open: true, ev: null })} />
        </ScrollView>
      </Entrance>

      {event ? (
        <>
          <Entrance delay={140}>
            <Tap onPress={() => setEvEdit({ open: true, ev: event })} sound="pop" style={{}}>
              <Countdown event={event} />
            </Tap>
          </Entrance>

          <Entrance delay={220}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 6 }}>
              <View>
                <Text bold size={22}>{t('plans')}</Text>
                {tasks.length ? <Text size={13} color={theme.muted}>{t('progress', { done: doneN, total: tasks.length })}</Text> : null}
              </View>
              <RoundBtn icon="＋" onPress={() => setTaskEdit({ open: true, task: null })} />
            </View>
            {tasks.length ? (
              <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.border, marginBottom: 12, overflow: 'hidden' }}>
                <View style={{ width: `${(doneN / tasks.length) * 100}%`, height: 8, backgroundColor: theme.ok, borderRadius: 4 }} />
              </View>
            ) : null}
          </Entrance>

          {tasks.length === 0 ? (
            <Card><Text color={theme.muted} style={{ textAlign: 'center' }}>{t('noPlans')}</Text></Card>
          ) : null}
          {tasks.map((k, i) => {
            const late = k.due && !k.done && new Date(k.due) < new Date();
            return (
              <Entrance key={k.id} delay={260 + i * 40} from={14}>
                <Card style={{ marginBottom: 10, padding: 0, opacity: k.done ? 0.65 : 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
                    <Tap onPress={() => toggle(k.id)} sound={null} hitSlop={10}
                      style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2.5, borderColor: theme.primary, marginRight: 12,
                        backgroundColor: k.done ? theme.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                      {k.done ? <Text bold size={15} color={theme.onPrimary}>✓</Text> : null}
                    </Tap>
                    <Tap onPress={() => setTaskEdit({ open: true, task: k })} style={{ flex: 1 }}>
                      <Text bold size={16} style={{ textDecorationLine: k.done ? 'line-through' : 'none' }}>{k.title}</Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 3, gap: 8 }}>
                        {k.due ? <Text size={12} color={late ? theme.danger : theme.muted}>📅 {fmtDay(state.settings.lang, k.due)}{late ? ' • ' + t('overdue') : ''}</Text> : null}
                        {k.address ? <Text size={12} color={theme.muted} numberOfLines={1}>📍 {k.address}</Text> : null}
                        {k.phone ? <Text size={12} color={theme.muted}>📞 {k.phone}</Text> : null}
                      </View>
                    </Tap>
                  </View>
                  {(k.photos && k.photos.length) || k.phone || k.address ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 12, gap: 8 }}>
                      {(k.photos || []).slice(0, 3).map((u, j) => <Image key={j} source={{ uri: u }} style={{ width: 44, height: 44, borderRadius: 10 }} />)}
                      <View style={{ flex: 1 }} />
                      {k.address ? <Tap onPress={() => openMap(k.address, k.lat, k.lng)} style={{ padding: 8 }}><Text size={20}>🗺️</Text></Tap> : null}
                      {k.phone ? <Tap onPress={() => smsNumber(k.phone)} style={{ padding: 8 }}><Text size={20}>💬</Text></Tap> : null}
                      {k.phone ? <Tap onPress={() => callNumber(k.phone)} style={{ padding: 8 }}><Text size={20}>📞</Text></Tap> : null}
                    </View>
                  ) : null}
                </Card>
              </Entrance>
            );
          })}
        </>
      ) : null}

      <EventEditor visible={evEdit.open} event={evEdit.ev} onClose={() => setEvEdit((x) => ({ ...x, open: false }))} />
      <TaskEditor visible={taskEdit.open} task={taskEdit.task} eventId={event && event.id} onClose={() => setTaskEdit((x) => ({ ...x, open: false }))} />
    </ScrollView>
  );
}
