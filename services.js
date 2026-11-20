import { Platform, Linking } from 'react-native';
import { createAudioPlayer, setAudioModeAsync, AudioModule } from 'expo-audio';
import * as Notifications from 'expo-notifications';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { File, Directory, Paths } from 'expo-file-system';
import { translate } from './i18n';

/* ---------------- Ses effektleri ---------------- */
const SOUND_FILES = {
  tap: require('../assets/sounds/tap.wav'),
  pop: require('../assets/sounds/pop.wav'),
  success: require('../assets/sounds/success.wav'),
  delete: require('../assets/sounds/delete.wav'),
  whoosh: require('../assets/sounds/whoosh.wav'),
  chime: require('../assets/sounds/chime.wav'),
  record: require('../assets/sounds/record.wav'),
};
let soundOn = true;
const players = {};
export const setSoundEnabled = (v) => { soundOn = v; };
export function playSound(name) {
  if (!soundOn) return;
  try {
    if (!players[name]) {
      players[name] = createAudioPlayer(SOUND_FILES[name]);
      players[name].volume = 0.6;
    }
    const p = players[name];
    p.seekTo(0);
    p.play();
  } catch (e) {}
}

/* ---------------- Faýl saklamak (hil üýtgemeýär) ---------------- */
export function persistFile(uri, fallbackExt = 'jpg') {
  try {
    const dir = new Directory(Paths.document, 'media');
    if (!dir.exists) dir.create();
    const m = /\.([a-zA-Z0-9]{2,5})(?:\?|$)/.exec(uri);
    const ext = m ? m[1] : fallbackExt;
    const dest = new File(dir, `${Date.now()}_${Math.floor(Math.random() * 1e6)}.${ext}`);
    new File(uri).copy(dest);
    return dest.uri;
  } catch (e) {
    return uri;
  }
}

/* ---------------- Surat / wideo saýlamak ---------------- */
export async function pickImagesFromGallery(multiple = true) {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted && perm.accessPrivileges !== 'limited') return null;
  const r = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'], allowsMultipleSelection: multiple, quality: 1, exif: false,
    preferredAssetRepresentationMode: 'current',
  });
  if (r.canceled) return [];
  return r.assets.map((a) => ({ uri: persistFile(a.uri), w: a.width, h: a.height }));
}

export async function pickImagesFromFiles() {
  const r = await DocumentPicker.getDocumentAsync({ type: 'image/*', multiple: true, copyToCacheDirectory: true });
  if (r.canceled) return [];
  return r.assets.map((a) => ({ uri: persistFile(a.uri), w: 0, h: 0 }));
}

export async function takePhoto() {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) return null;
  const r = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
  if (r.canceled) return [];
  return r.assets.map((a) => ({ uri: persistFile(a.uri), w: a.width, h: a.height }));
}

export async function pickVideo(fromCamera = false) {
  let r;
  if (fromCamera) {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return null;
    r = await ImagePicker.launchCameraAsync({ mediaTypes: ['videos'], quality: 1 });
  } else {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted && perm.accessPrivileges !== 'limited') return null;
    r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'], quality: 1, preferredAssetRepresentationMode: 'current' });
  }
  if (r.canceled) return [];
  const out = [];
  for (const a of r.assets) {
    const uri = persistFile(a.uri, 'mp4');
    let thumb = null;
    try {
      const th = await VideoThumbnails.getThumbnailAsync(uri, { time: 500, quality: 1 });
      thumb = persistFile(th.uri, 'jpg');
    } catch (e) {}
    out.push({ uri, thumb, w: a.width, h: a.height });
  }
  return out;
}

/* ---------------- Ses ýazgysy ---------------- */
export async function ensureMicPermission() {
  try {
    const p = await AudioModule.requestRecordingPermissionsAsync();
    return !!p.granted;
  } catch (e) { return false; }
}
export async function setRecordingMode(on) {
  try { await setAudioModeAsync({ allowsRecording: on, playsInSilentMode: true }); } catch (e) {}
}

/* ---------------- Kontaktlar ---------------- */
export async function loadContacts() {
  const p = await Contacts.requestPermissionsAsync();
  if (!p.granted) return null;
  const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name] });
  const list = [];
  for (const c of data || []) {
    const num = c.phoneNumbers && c.phoneNumbers[0] && c.phoneNumbers[0].number;
    if (!num) continue;
    list.push({ id: c.id || c.name + num, name: c.name || num, phone: num });
  }
  list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

/* ---------------- Salgy / karta / jaň / SMS ---------------- */
export async function currentAddress() {
  const p = await Location.requestForegroundPermissionsAsync();
  if (!p.granted) return { error: 'denied' };
  try {
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const { latitude, longitude } = pos.coords;
    let text = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    try {
      const r = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (r && r[0]) {
        const a = r[0];
        const parts = [a.street && (a.streetNumber ? `${a.street} ${a.streetNumber}` : a.street), a.district || a.subregion, a.city, a.region, a.country].filter(Boolean);
        if (parts.length) text = [...new Set(parts)].join(', ');
      }
    } catch (e) {}
    return { text, latitude, longitude };
  } catch (e) {
    return { error: 'fail' };
  }
}
export function openMap(address, lat, lng) {
  const q = lat && lng ? `${lat},${lng}` : encodeURIComponent(address || '');
  const url = Platform.select({
    ios: `http://maps.apple.com/?q=${q}`,
    default: lat && lng ? `geo:${lat},${lng}?q=${lat},${lng}` : `geo:0,0?q=${q}`,
  });
  Linking.openURL(url).catch(() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`).catch(() => {}));
}
const cleanPhone = (p) => String(p || '').replace(/[^\d+]/g, '');
export const callNumber = (p) => Linking.openURL(`tel:${cleanPhone(p)}`).catch(() => {});
export const smsNumber = (p, body) =>
  Linking.openURL(`sms:${cleanPhone(p)}${body ? (Platform.OS === 'ios' ? '&' : '?') + 'body=' + encodeURIComponent(body) : ''}`).catch(() => {});

/* ---------------- Ähli rugsatlary soramak ---------------- */
export async function requestAllPermissions() {
  const run = async (fn) => { try { await fn(); } catch (e) {} };
  await run(() => Notifications.requestPermissionsAsync());
  await run(() => Contacts.requestPermissionsAsync());
  await run(() => ImagePicker.requestMediaLibraryPermissionsAsync());
  await run(() => ImagePicker.requestCameraPermissionsAsync());
  await run(() => AudioModule.requestRecordingPermissionsAsync());
  await run(() => Location.requestForegroundPermissionsAsync());
}

/* ---------------- Bildirişler ---------------- */
export function setupNotifications() {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
    });
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Ýatlatmalar', importance: Notifications.AndroidImportance.HIGH, lightColor: '#E8A317',
      });
    }
  } catch (e) {}
}

const atHour = (d, h) => { const x = new Date(d); x.setHours(h, 0, 0, 0); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

export async function rescheduleAll(state) {
  try {
    const perm = await Notifications.getPermissionsAsync();
    if (!perm.granted) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    const lang = state.settings.lang;
    const t = (k, v) => translate(lang, k, v);
    const now = new Date();
    const items = [];
    const push = (date, body) => { if (date > now) items.push({ date, body }); };
    for (const e of state.events) {
      const d = new Date(e.date);
      push(atHour(addDays(d, -7), 10), t('nEvent7', { title: e.title }));
      push(atHour(addDays(d, -1), 10), t('nEvent1', { title: e.title }));
      push(d, t('nEventDay', { title: e.title }));
    }
    for (const k of state.tasks) {
      if (k.done || !k.due) continue;
      const d = new Date(k.due);
      push(atHour(addDays(d, -1), 9), t('nTaskTomorrow', { title: k.title }));
      push(atHour(d, 9), t('nTaskToday', { title: k.title }));
    }
    items.sort((a, b) => a.date - b.date);
    for (const it of items.slice(0, 56)) {
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Garaşylýan Gün', body: it.body, sound: true },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: it.date, channelId: 'default' },
      });
    }
    const pending = state.tasks.filter((k) => !k.done).length;
    if (state.settings.daily && pending > 0) {
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Garaşylýan Gün', body: t('nDaily', { n: pending }), sound: true },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: state.settings.dailyHour || 9, minute: 0, channelId: 'default' },
      });
    }
  } catch (e) {}
}
