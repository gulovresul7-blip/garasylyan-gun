import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Modal, Alert, useWindowDimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer, useAudioPlayerStatus, useAudioRecorder, RecordingPresets } from 'expo-audio';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useApp, uid } from '../store';
import { Text, Tap, Entrance, Header, RoundBtn, Sheet, Button, Field, shadow } from '../ui';
import {
  pickImagesFromGallery, takePhoto, pickVideo, persistFile, ensureMicPermission, setRecordingMode, playSound,
} from '../services';
import { fmtDay } from '../i18n';

const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };

function AudioBox({ uri, big }) {
  const { theme } = useApp();
  const player = useAudioPlayer(uri);
  const st = useAudioPlayerStatus(player);
  const toggle = () => {
    if (st.playing) player.pause();
    else { if (st.didJustFinish || (st.duration && st.currentTime >= st.duration - 0.1)) player.seekTo(0); player.play(); }
  };
  return (
    <Tap onPress={toggle} sound="pop" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ width: big ? 56 : 40, height: big ? 56 : 40, borderRadius: 30, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' }}>
        <Text bold size={big ? 24 : 16} color={theme.onPrimary}>{st.playing ? '❚❚' : '▶'}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1 }}>
        {Array.from({ length: big ? 28 : 12 }).map((_, i) => (
          <View key={i} style={{ width: 3, height: 8 + ((i * 7 + 3) % 5) * 5, borderRadius: 2, backgroundColor: st.playing ? theme.primary : theme.border }} />
        ))}
      </View>
    </Tap>
  );
}

function VideoBox({ uri }) {
  const { width, height } = useWindowDimensions();
  const player = useVideoPlayer(uri, (p) => { p.loop = false; p.play(); });
  return <VideoView player={player} nativeControls contentFit="contain" style={{ width, height: height * 0.7 }} allowsFullscreen />;
}

function Recorder({ visible, onClose, onSaved }) {
  const { t, theme } = useApp();
  const rec = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [on, setOn] = useState(false);
  const [sec, setSec] = useState(0);
  useEffect(() => {
    if (!on) return;
    const i = setInterval(() => setSec((x) => x + 1), 1000);
    return () => clearInterval(i);
  }, [on]);
  const start = async () => {
    if (!(await ensureMicPermission())) return Alert.alert(t('denied'));
    await setRecordingMode(true);
    await rec.prepareToRecordAsync();
    rec.record(); playSound('record'); setSec(0); setOn(true);
  };
  const stop = async () => {
    setOn(false);
    try {
      await rec.stop();
      await setRecordingMode(false);
      if (rec.uri) onSaved(persistFile(rec.uri, 'm4a'));
    } catch (e) {}
    onClose();
  };
  return (
    <Sheet visible={visible} onClose={() => { if (!on) onClose(); }} title={t('addVoice')}>
      <View style={{ alignItems: 'center', paddingVertical: 10 }}>
        <Text bold size={44} color={on ? theme.danger : theme.primary}>{String(Math.floor(sec / 60)).padStart(2, '0')}:{String(sec % 60).padStart(2, '0')}</Text>
        <Text color={theme.muted} style={{ marginBottom: 16 }}>{on ? t('recording') : ''}</Text>
        {on ? <Button kind="danger" icon="■" label={t('stop')} onPress={stop} sound="success" style={{ alignSelf: 'stretch' }} />
          : <Button icon="🎙️" label={t('record')} onPress={start} sound={null} style={{ alignSelf: 'stretch' }} />}
      </View>
    </Sheet>
  );
}

export default function Moments() {
  const { t, theme, state, update, lang } = useApp();
  const { width } = useWindowDimensions();
  const [menu, setMenu] = useState(false);
  const [rec, setRec] = useState(false);
  const [note, setNote] = useState(false);
  const [text, setText] = useState('');
  const [view, setView] = useState(null);
  const event = state.events.find((e) => e.id === state.activeEventId) || state.events[0];
  if (!event) return null;

  const list = state.moments.filter((m) => m.eventId === event.id).sort((a, b) => b.created - a.created);
  const add = (items) => update((s) => ({ ...s, moments: [...s.moments, ...items.map((i) => ({ id: uid(), eventId: event.id, created: Date.now(), ...i }))] }));
  const guard = async (fn, map) => {
    setMenu(false);
    const r = await fn();
    if (r === null) return Alert.alert(t('denied'));
    if (r.length) { playSound('success'); add(r.map(map)); }
  };
  const del = (m) => Alert.alert(t('confirmDelete'), '', [{ text: t('no') }, { text: t('yes'), style: 'destructive', onPress: () => { playSound('delete'); update((s) => ({ ...s, moments: s.moments.filter((x) => x.id !== m.id) })); setView(null); } }]);

  const colW = (width - 18 * 2 - 14) / 2;
  const cols = [[], []]; const hs = [0, 0];
  list.forEach((m) => {
    let h;
    if (m.type === 'photo' || m.type === 'video') h = colW * (m.w && m.h ? Math.min(1.7, Math.max(0.7, m.h / m.w)) : 1.2) + 22;
    else h = m.type === 'audio' ? 90 : 110;
    const c = hs[0] <= hs[1] ? 0 : 1;
    cols[c].push({ m, h }); hs[c] += h + 20;
  });

  const renderCard = (m, h, i) => {
    const rot = ((hash(m.id) % 50) - 25) / 10; // -2.5° ... +2.5°
    const base = { backgroundColor: theme.mode === 'dark' ? '#F3E9D0' : '#FFFFFF', padding: 8, borderRadius: 6, marginBottom: 20, transform: [{ rotate: `${rot}deg` }] };
    return (
      <Entrance key={m.id} delay={Math.min(i, 10) * 50} from={30}>
        <Pressable onPress={() => { playSound('pop'); setView(m); }} onLongPress={() => del(m)}>
          <View style={[base, shadow({ ...theme, shadow: '#000' }, 5)]}>
            {m.type === 'photo' || m.type === 'video' ? (
              <View>
                <Image source={{ uri: m.type === 'photo' ? m.uri : m.thumb }} resizeMode="cover" style={{ width: '100%', height: h - 22, borderRadius: 3, backgroundColor: '#ddd' }} />
                {m.type === 'video' ? (
                  <View style={{ position: 'absolute', alignSelf: 'center', top: (h - 22) / 2 - 24, width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
                    <Text bold size={20} color="#fff">▶</Text>
                  </View>
                ) : null}
                <Text size={11} color="#8C7A5B" style={{ marginTop: 5, textAlign: 'center' }}>{fmtDay(lang, m.created)}</Text>
              </View>
            ) : m.type === 'audio' ? (
              <View style={{ padding: 6 }}><AudioBox uri={m.uri} /><Text size={11} color="#8C7A5B" style={{ marginTop: 6 }}>🎙️ {fmtDay(lang, m.created)}</Text></View>
            ) : (
              <View style={{ padding: 8, backgroundColor: '#FFF1B8' }}>
                <Text color="#4A3B22" size={14} numberOfLines={5}>{m.text}</Text>
                <Text size={11} color="#8C7A5B" style={{ marginTop: 6 }}>{fmtDay(lang, m.created)}</Text>
              </View>
            )}
          </View>
          {/* lenta */}
          <View style={{ position: 'absolute', top: -8, alignSelf: 'center', width: 56, height: 16, backgroundColor: 'rgba(232,163,23,0.45)', transform: [{ rotate: `${-rot * 2}deg` }] }} />
        </Pressable>
      </Entrance>
    );
  };

  const opts = [
    ['🖼️', t('addPhoto'), () => guard(() => pickImagesFromGallery(true), (x) => ({ type: 'photo', uri: x.uri, w: x.w, h: x.h }))],
    ['📷', t('camera'), () => guard(takePhoto, (x) => ({ type: 'photo', uri: x.uri, w: x.w, h: x.h }))],
    ['🎬', t('addVideo'), () => guard(() => pickVideo(false), (x) => ({ type: 'video', ...x }))],
    ['🎥', t('camera') + ' 🎬', () => guard(() => pickVideo(true), (x) => ({ type: 'video', ...x }))],
    ['🎙️', t('addVoice'), () => { setMenu(false); setTimeout(() => setRec(true), 350); }],
    ['📝', t('addText'), () => { setMenu(false); setTimeout(() => setNote(true), 350); }],
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <Header title={t('moments')} right={<RoundBtn icon="＋" onPress={() => setMenu(true)} />} />
      {list.length === 0 ? <Text color={theme.muted} style={{ textAlign: 'center', marginTop: 40 }}>{t('noMoments')}</Text> : null}
      <View style={{ flexDirection: 'row', gap: 14, paddingTop: 10 }}>
        {cols.map((c, ci) => (
          <View key={ci} style={{ flex: 1, paddingTop: ci === 1 ? 24 : 0 }}>
            {c.map(({ m, h }, i) => renderCard(m, h, i + ci))}
          </View>
        ))}
      </View>

      <Sheet visible={menu} onClose={() => setMenu(false)} title={t('moments')}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {opts.map(([ic, lb, fn]) => (
            <Tap key={lb} onPress={fn} sound="pop" style={{ width: 100, paddingVertical: 16, borderRadius: 18, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, alignItems: 'center' }}>
              <Text size={30}>{ic}</Text><Text bold size={13} style={{ marginTop: 4, textAlign: 'center' }}>{lb}</Text>
            </Tap>
          ))}
        </View>
      </Sheet>
      <Recorder visible={rec} onClose={() => setRec(false)} onSaved={(uri) => { playSound('success'); add([{ type: 'audio', uri }]); }} />
      <Sheet visible={note} onClose={() => setNote(false)} title={t('addText')}>
        <Field value={text} onChangeText={setText} placeholder={t('textPh')} multiline />
        <Button label={t('save')} sound="success" onPress={() => { if (text.trim()) add([{ type: 'text', text: text.trim() }]); setText(''); setNote(false); }} />
      </Sheet>

      <Modal visible={!!view} transparent animationType="fade" onRequestClose={() => setView(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(15,10,0,0.94)' }}>
          <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            {view && view.type === 'photo' ? <Image source={{ uri: view.uri }} resizeMode="contain" style={{ width: '100%', height: '80%' }} /> : null}
            {view && view.type === 'video' ? <VideoBox uri={view.uri} /> : null}
            {view && view.type === 'audio' ? <View style={{ padding: 30 }}><AudioBox uri={view.uri} big /></View> : null}
            {view && view.type === 'text' ? <View style={{ margin: 24, padding: 24, backgroundColor: '#FFF1B8', borderRadius: 8 }}><Text color="#4A3B22" size={20}>{view.text}</Text></View> : null}
            <View style={{ position: 'absolute', top: 40, right: 20, flexDirection: 'row', gap: 10 }}>
              <Tap onPress={() => del(view)} sound={null} style={{ padding: 12 }}><Text size={22}>🗑️</Text></Tap>
              <Tap onPress={() => setView(null)} style={{ padding: 12 }}><Text bold size={24} color="#fff">✕</Text></Tap>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </ScrollView>
  );
}
