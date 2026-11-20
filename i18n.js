export const LANGS = [
  { code: 'tk', name: 'Türkmençe' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
];

const tk = {
  welcome: 'Hoş geldiň!', welcomeSub: 'Toýuňa, doglan gütňe we ähli ajaýyp günlere galan wagty bile sanalyň.',
  chooseLang: 'Dil saýla', next: 'Indiki', back: 'Yza', start: 'Başla', save: 'Ýatda sakla', cancel: 'Ýatyr',
  delete: 'Poz', edit: 'Üýtget', add: 'Goş', done: 'Taýýar', close: 'Ýap',
  aboutYou: 'Özüň barada', yourName: 'Adyň', yourAge: 'Ýaşyň', yourPlace: 'Ýaşaýan ýeriň',
  namePh: 'Meselem: Aýna', agePh: 'Meselem: 25', placePh: 'Şäher / etrap',
  privacy: 'Girizen maglumatlaryňyz diňe şu telefonyňyzda saklanýar. Ony diňe özüň görüp bilýärsiň, hiç kime iberilmeýär.',
  fillAll: 'Hemme meýdany dolduryň.',
  eventType: 'Nähili gün?', wedding: 'Toý', birthday: 'Doglan gün', anniversary: 'Ýubileý', custom: 'Başga',
  eventTitle: 'Senäniň ady', eventTitlePh: 'Meselem: Aýnanyň toýy', eventDate: 'Sene we wagt',
  firstEvent: 'Ilkinji senäňi belle', newEvent: 'Täze sene', editEvent: 'Seneni üýtget',
  permTitle: 'Rugsatlar', permSub: 'Programmanyň doly işlemegi üçin birnäçe rugsat gerek. Hemmesi diňe sen isleseň ulanylýar.',
  permNotif: 'Ýatlatmalar (bildiriş)', permContacts: 'Kontaktlar (çakylyk sanawy)', permPhotos: 'Galereýa we faýllar',
  permCamera: 'Kamera', permMic: 'Mikrofon (ses ýazgysy)', permLoc: 'Ýerleşiş (awtomatik salgy)',
  allowAll: 'Rugsat ber', skip: 'Soňra',
  hello: 'Salam, {name}!', helloPlace: '{place} • {age} ýaş', toEvent: '{title} çenli galan wagt',
  days: 'GÜN', hours: 'SAGAT', minutes: 'MINUT', seconds: 'SEKUNT',
  itsTime: 'Gün geldi! 🎉', passed: '{n} gün öň geçdi', turns: '{age} ýaşa ýetýärsiň 🎂',
  tabHome: 'Esasy', tabGuests: 'Çakylyk', tabMoments: 'Pursatlar', tabSettings: 'Sazlama',
  plans: 'Meýilnama', addPlan: 'Täze iş', editPlan: 'Işi üýtget', noPlans: 'Entek iş ýok. «+» düwmesine bas!',
  planTitle: 'Işiň ady', planTitlePh: 'Näme etmeli?', planDue: 'Ýerine ýetirmeli senesi', noDate: 'Sene bellenmedi', setDate: 'Sene belle', clearDate: 'Senäni aýyr',
  address: 'Salgy', addressPh: 'Salgy ýaz ýa-da awtomatik saýla', useMyLocation: 'Meniň ýerim', openMap: 'Kartada aç', searchMap: 'Kartada gözle',
  phone: 'Telefon belgi', phonePh: '+993 ...', call: 'Jaň et', sms: 'SMS', pickContact: 'Kontaktdan saýla',
  photos: 'Suratlar', fromGallery: 'Galereýa', fromFiles: 'Faýllar', camera: 'Kamera', note: 'Bellik', notePh: 'Goşmaça bellik...',
  progress: '{done}/{total} ýerine ýetirildi', overdue: 'Möhleti geçdi',
  guests: 'Çakylyk sanawy', addGuest: 'Adam goş', importContacts: 'Kontaktdan al', noGuests: 'Entek hiç kim ýok.',
  guestName: 'Ady', invited: 'Çagyryldy', sendInvite: 'Çakylyk iber',
  inviteText: 'Salam {name}! Seni {title} çagyrýaryn. Wagty: {date}.',
  selectAll: 'Hemmesini saýla', selectNone: 'Hiçini', selectedN: '{n} saýlandy', search: 'Gözle', addSelected: 'Saýlananlary goş',
  moments: 'Pursatlar', addPhoto: 'Surat', addVideo: 'Wideo', addVoice: 'Ses', addText: 'Ýazgy', noMoments: 'Ilkinji pursadyňy goş ✨',
  recording: 'Ýazylýar...', stop: 'Duruz', record: 'Ýazga başla', textPh: 'Pursat barada ýaz...',
  confirmDelete: 'Pozmaga ynamlymy?', yes: 'Hawa', no: 'Ýok',
  settings: 'Sazlamalar', language: 'Dil', theme: 'Tema', light: 'Gündiz', dark: 'Gije', system: 'Awtomatik',
  font: 'Ýazgy görnüşi', fontSample: 'Ajaýyp gün gelýär', sound: 'Ses effektleri', dailyReminder: 'Her gün ýatlatma', yourData: 'Meniň maglumatlarym', events: 'Seneler',
  about: 'Programma barada', creator: 'Döredijisi', contact: 'Habarlaşmak üçin',
  denied: 'Rugsat berilmedi. Telefonyň sazlamalaryndan rugsat beriň.', locError: 'Ýer anyklanmady.',
  nEvent7: '{title} üçin 7 gün galdy!', nEvent1: '{title} ertir! 🎉', nEventDay: 'Şu gün {title}! Gutly bolsun! 🎉',
  nTaskTomorrow: 'Ertir ýerine ýetirmeli iş: {title}', nTaskToday: 'Şu gün ýerine ýetirmeli iş: {title}',
  nDaily: 'Ýerine ýetirilmedik {n} iş bar.',
};

const en = {
  welcome: 'Welcome!', welcomeSub: "Let's count down together to your wedding, birthday and every special day.",
  chooseLang: 'Choose language', next: 'Next', back: 'Back', start: 'Start', save: 'Save', cancel: 'Cancel',
  delete: 'Delete', edit: 'Edit', add: 'Add', done: 'Done', close: 'Close',
  aboutYou: 'About you', yourName: 'Your name', yourAge: 'Your age', yourPlace: 'Where you live',
  namePh: 'e.g. Aina', agePh: 'e.g. 25', placePh: 'City / district',
  privacy: 'Everything you enter is stored only on this phone. Only you can see it and it is never sent to anyone.',
  fillAll: 'Please fill in every field.',
  eventType: 'What kind of day?', wedding: 'Wedding', birthday: 'Birthday', anniversary: 'Anniversary', custom: 'Other',
  eventTitle: 'Name of the date', eventTitlePh: "e.g. Aina's wedding", eventDate: 'Date and time',
  firstEvent: 'Set your first date', newEvent: 'New date', editEvent: 'Edit date',
  permTitle: 'Permissions', permSub: 'A few permissions are needed for the app to work fully. They are only used when you want.',
  permNotif: 'Reminders (notifications)', permContacts: 'Contacts (guest list)', permPhotos: 'Gallery and files',
  permCamera: 'Camera', permMic: 'Microphone (voice notes)', permLoc: 'Location (auto address)',
  allowAll: 'Allow', skip: 'Later',
  hello: 'Hello, {name}!', helloPlace: '{place} • {age} y/o', toEvent: 'Time left until {title}',
  days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS',
  itsTime: "It's time! 🎉", passed: 'passed {n} days ago', turns: 'You turn {age} 🎂',
  tabHome: 'Home', tabGuests: 'Guests', tabMoments: 'Moments', tabSettings: 'Settings',
  plans: 'Plans', addPlan: 'New task', editPlan: 'Edit task', noPlans: 'No tasks yet. Tap “+”!',
  planTitle: 'Task', planTitlePh: 'What to do?', planDue: 'Due date', noDate: 'No date', setDate: 'Set date', clearDate: 'Clear date',
  address: 'Address', addressPh: 'Type or pick automatically', useMyLocation: 'My location', openMap: 'Open in maps', searchMap: 'Search in maps',
  phone: 'Phone number', phonePh: '+993 ...', call: 'Call', sms: 'SMS', pickContact: 'Pick from contacts',
  photos: 'Photos', fromGallery: 'Gallery', fromFiles: 'Files', camera: 'Camera', note: 'Note', notePh: 'Extra notes...',
  progress: '{done}/{total} completed', overdue: 'Overdue',
  guests: 'Guest list', addGuest: 'Add person', importContacts: 'Import contacts', noGuests: 'Nobody here yet.',
  guestName: 'Name', invited: 'Invited', sendInvite: 'Send invite',
  inviteText: 'Hi {name}! You are invited to {title}. When: {date}.',
  selectAll: 'Select all', selectNone: 'None', selectedN: '{n} selected', search: 'Search', addSelected: 'Add selected',
  moments: 'Moments', addPhoto: 'Photo', addVideo: 'Video', addVoice: 'Voice', addText: 'Note', noMoments: 'Add your first moment ✨',
  recording: 'Recording...', stop: 'Stop', record: 'Start recording', textPh: 'Write about this moment...',
  confirmDelete: 'Delete this?', yes: 'Yes', no: 'No',
  settings: 'Settings', language: 'Language', theme: 'Theme', light: 'Day', dark: 'Night', system: 'Auto',
  font: 'Font', fontSample: 'A wonderful day is coming', sound: 'Sound effects', dailyReminder: 'Daily reminder', yourData: 'My data', events: 'Dates',
  about: 'About', creator: 'Created by', contact: 'Contact',
  denied: 'Permission denied. Please allow it in phone settings.', locError: 'Could not get location.',
  nEvent7: '7 days left until {title}!', nEvent1: '{title} is tomorrow! 🎉', nEventDay: 'Today is {title}! 🎉',
  nTaskTomorrow: 'Task due tomorrow: {title}', nTaskToday: 'Task due today: {title}',
  nDaily: 'You have {n} unfinished tasks.',
};

const ru = {
  welcome: 'Добро пожаловать!', welcomeSub: 'Давайте вместе отсчитывать время до свадьбы, дня рождения и других важных дней.',
  chooseLang: 'Выберите язык', next: 'Далее', back: 'Назад', start: 'Начать', save: 'Сохранить', cancel: 'Отмена',
  delete: 'Удалить', edit: 'Изменить', add: 'Добавить', done: 'Готово', close: 'Закрыть',
  aboutYou: 'О вас', yourName: 'Ваше имя', yourAge: 'Возраст', yourPlace: 'Где вы живёте',
  namePh: 'Например: Айна', agePh: 'Например: 25', placePh: 'Город / район',
  privacy: 'Все введённые данные хранятся только на этом телефоне. Их видите только вы, они никому не отправляются.',
  fillAll: 'Заполните все поля.',
  eventType: 'Какой это день?', wedding: 'Свадьба', birthday: 'День рождения', anniversary: 'Юбилей', custom: 'Другое',
  eventTitle: 'Название даты', eventTitlePh: 'Например: Свадьба Айны', eventDate: 'Дата и время',
  firstEvent: 'Укажите первую дату', newEvent: 'Новая дата', editEvent: 'Изменить дату',
  permTitle: 'Разрешения', permSub: 'Для полной работы приложению нужны разрешения. Они используются только по вашему желанию.',
  permNotif: 'Напоминания (уведомления)', permContacts: 'Контакты (список гостей)', permPhotos: 'Галерея и файлы',
  permCamera: 'Камера', permMic: 'Микрофон (голосовые записи)', permLoc: 'Геолокация (авто-адрес)',
  allowAll: 'Разрешить', skip: 'Позже',
  hello: 'Привет, {name}!', helloPlace: '{place} • {age} лет', toEvent: 'Осталось до: {title}',
  days: 'ДНЕЙ', hours: 'ЧАСОВ', minutes: 'МИНУТ', seconds: 'СЕКУНД',
  itsTime: 'Время пришло! 🎉', passed: 'прошло {n} дн. назад', turns: 'Вам исполнится {age} 🎂',
  tabHome: 'Главная', tabGuests: 'Гости', tabMoments: 'Моменты', tabSettings: 'Настройки',
  plans: 'Планы', addPlan: 'Новое дело', editPlan: 'Изменить дело', noPlans: 'Дел пока нет. Нажмите «+»!',
  planTitle: 'Дело', planTitlePh: 'Что сделать?', planDue: 'Срок выполнения', noDate: 'Без даты', setDate: 'Выбрать дату', clearDate: 'Убрать дату',
  address: 'Адрес', addressPh: 'Введите или выберите автоматически', useMyLocation: 'Моё место', openMap: 'Открыть на карте', searchMap: 'Искать на карте',
  phone: 'Номер телефона', phonePh: '+993 ...', call: 'Позвонить', sms: 'SMS', pickContact: 'Из контактов',
  photos: 'Фото', fromGallery: 'Галерея', fromFiles: 'Файлы', camera: 'Камера', note: 'Заметка', notePh: 'Дополнительно...',
  progress: 'Выполнено {done}/{total}', overdue: 'Просрочено',
  guests: 'Список гостей', addGuest: 'Добавить', importContacts: 'Из контактов', noGuests: 'Пока никого нет.',
  guestName: 'Имя', invited: 'Приглашён', sendInvite: 'Отправить приглашение',
  inviteText: 'Привет, {name}! Приглашаю тебя на: {title}. Когда: {date}.',
  selectAll: 'Выбрать все', selectNone: 'Снять', selectedN: 'Выбрано: {n}', search: 'Поиск', addSelected: 'Добавить выбранных',
  moments: 'Моменты', addPhoto: 'Фото', addVideo: 'Видео', addVoice: 'Голос', addText: 'Запись', noMoments: 'Добавьте первый момент ✨',
  recording: 'Идёт запись...', stop: 'Стоп', record: 'Начать запись', textPh: 'Напишите об этом моменте...',
  confirmDelete: 'Удалить?', yes: 'Да', no: 'Нет',
  settings: 'Настройки', language: 'Язык', theme: 'Тема', light: 'День', dark: 'Ночь', system: 'Авто',
  font: 'Шрифт', fontSample: 'Скоро чудесный день', sound: 'Звуковые эффекты', dailyReminder: 'Ежедневное напоминание', yourData: 'Мои данные', events: 'Даты',
  about: 'О приложении', creator: 'Автор', contact: 'Связь',
  denied: 'Нет разрешения. Разрешите в настройках телефона.', locError: 'Не удалось определить место.',
  nEvent7: 'До «{title}» осталось 7 дней!', nEvent1: '«{title}» уже завтра! 🎉', nEventDay: 'Сегодня «{title}»! 🎉',
  nTaskTomorrow: 'Дело на завтра: {title}', nTaskToday: 'Дело на сегодня: {title}',
  nDaily: 'Невыполненных дел: {n}.',
};

const tr = {
  welcome: 'Hoş geldin!', welcomeSub: 'Düğününe, doğum gününe ve tüm özel günlerine kalan zamanı birlikte sayalım.',
  chooseLang: 'Dil seç', next: 'İleri', back: 'Geri', start: 'Başla', save: 'Kaydet', cancel: 'İptal',
  delete: 'Sil', edit: 'Düzenle', add: 'Ekle', done: 'Tamam', close: 'Kapat',
  aboutYou: 'Senin hakkında', yourName: 'Adın', yourAge: 'Yaşın', yourPlace: 'Yaşadığın yer',
  namePh: 'Örn: Ayna', agePh: 'Örn: 25', placePh: 'Şehir / ilçe',
  privacy: 'Girdiğin bilgiler yalnızca bu telefonda saklanır. Sadece sen görebilirsin, kimseye gönderilmez.',
  fillAll: 'Tüm alanları doldur.',
  eventType: 'Nasıl bir gün?', wedding: 'Düğün', birthday: 'Doğum günü', anniversary: 'Yıldönümü', custom: 'Diğer',
  eventTitle: 'Tarihin adı', eventTitlePh: 'Örn: Ayna’nın düğünü', eventDate: 'Tarih ve saat',
  firstEvent: 'İlk tarihini belirle', newEvent: 'Yeni tarih', editEvent: 'Tarihi düzenle',
  permTitle: 'İzinler', permSub: 'Uygulamanın tam çalışması için bazı izinler gerekir. Yalnızca sen istediğinde kullanılır.',
  permNotif: 'Hatırlatmalar (bildirim)', permContacts: 'Kişiler (davetli listesi)', permPhotos: 'Galeri ve dosyalar',
  permCamera: 'Kamera', permMic: 'Mikrofon (ses kaydı)', permLoc: 'Konum (otomatik adres)',
  allowAll: 'İzin ver', skip: 'Sonra',
  hello: 'Merhaba, {name}!', helloPlace: '{place} • {age} yaş', toEvent: '{title} için kalan süre',
  days: 'GÜN', hours: 'SAAT', minutes: 'DAKİKA', seconds: 'SANİYE',
  itsTime: 'Gün geldi! 🎉', passed: '{n} gün önce geçti', turns: '{age} yaşına giriyorsun 🎂',
  tabHome: 'Ana', tabGuests: 'Davet', tabMoments: 'Anılar', tabSettings: 'Ayarlar',
  plans: 'Planlar', addPlan: 'Yeni iş', editPlan: 'İşi düzenle', noPlans: 'Henüz iş yok. “+” düğmesine bas!',
  planTitle: 'İş', planTitlePh: 'Ne yapılacak?', planDue: 'Yapılacağı tarih', noDate: 'Tarih yok', setDate: 'Tarih seç', clearDate: 'Tarihi kaldır',
  address: 'Adres', addressPh: 'Yaz veya otomatik seç', useMyLocation: 'Konumum', openMap: 'Haritada aç', searchMap: 'Haritada ara',
  phone: 'Telefon numarası', phonePh: '+993 ...', call: 'Ara', sms: 'SMS', pickContact: 'Kişilerden seç',
  photos: 'Fotoğraflar', fromGallery: 'Galeri', fromFiles: 'Dosyalar', camera: 'Kamera', note: 'Not', notePh: 'Ek not...',
  progress: '{done}/{total} tamamlandı', overdue: 'Süresi geçti',
  guests: 'Davetli listesi', addGuest: 'Kişi ekle', importContacts: 'Kişilerden al', noGuests: 'Henüz kimse yok.',
  guestName: 'Ad', invited: 'Davet edildi', sendInvite: 'Davet gönder',
  inviteText: 'Merhaba {name}! Seni {title} etkinliğine davet ediyorum. Zaman: {date}.',
  selectAll: 'Tümünü seç', selectNone: 'Hiçbiri', selectedN: '{n} seçildi', search: 'Ara', addSelected: 'Seçilenleri ekle',
  moments: 'Anılar', addPhoto: 'Fotoğraf', addVideo: 'Video', addVoice: 'Ses', addText: 'Not', noMoments: 'İlk anını ekle ✨',
  recording: 'Kaydediliyor...', stop: 'Durdur', record: 'Kaydı başlat', textPh: 'Bu an hakkında yaz...',
  confirmDelete: 'Silinsin mi?', yes: 'Evet', no: 'Hayır',
  settings: 'Ayarlar', language: 'Dil', theme: 'Tema', light: 'Gündüz', dark: 'Gece', system: 'Otomatik',
  font: 'Yazı tipi', fontSample: 'Güzel bir gün geliyor', sound: 'Ses efektleri', dailyReminder: 'Günlük hatırlatma', yourData: 'Bilgilerim', events: 'Tarihler',
  about: 'Hakkında', creator: 'Geliştirici', contact: 'İletişim',
  denied: 'İzin verilmedi. Telefon ayarlarından izin ver.', locError: 'Konum alınamadı.',
  nEvent7: '{title} için 7 gün kaldı!', nEvent1: '{title} yarın! 🎉', nEventDay: 'Bugün {title}! 🎉',
  nTaskTomorrow: 'Yarın yapılacak iş: {title}', nTaskToday: 'Bugün yapılacak iş: {title}',
  nDaily: '{n} tamamlanmamış işin var.',
};

const DICT = { tk, en, ru, tr };

export function translate(lang, key, vars) {
  let s = (DICT[lang] && DICT[lang][key]) || tk[key] || key;
  if (vars) for (const k of Object.keys(vars)) s = s.split('{' + k + '}').join(String(vars[k]));
  return s;
}

export function fmtDate(lang, d) {
  const loc = { tk: 'tr-TR', tr: 'tr-TR', ru: 'ru-RU', en: 'en-GB' }[lang] || 'en-GB';
  try {
    return new Date(d).toLocaleString(loc, { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return new Date(d).toISOString();
  }
}

export function fmtDay(lang, d) {
  const loc = { tk: 'tr-TR', tr: 'tr-TR', ru: 'ru-RU', en: 'en-GB' }[lang] || 'en-GB';
  try {
    return new Date(d).toLocaleDateString(loc, { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return String(d).slice(0, 10);
  }
}
