import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Howl, Howler } from 'howler';
import './index.css';
const translations = {
  ru: {
    home: 'Главная',
    discover: 'Обзор',
    library: 'Медиатека',
    playlists: 'Плейлисты',
    settings: 'Настройки',
    search: 'Поиск',
    all: 'Всё',
    tracks: 'Треки',
    artists: 'Артисты',
    audioQuality: 'Качество звука',
    audioQualityDesc: 'Выберите предпочтительный битрейт',
    theme: 'Тема оформления',
    themeDesc: 'Настройте внешний вид интерфейса',
    importTitle: 'Импорт из SoundCloud',
    importDesc: 'Вставьте ссылку на профиль для импорта лайков',
    eq: 'Эквалайзер',
    eqDesc: ' ',
    dangerZone: 'Опасная зона',
    clearLikes: 'Очистить все лайки',
    language: 'Язык',
    languageDesc: 'Выберите язык интерфейса',
    crossfade: 'Кроссфейд',
    crossfadeDesc: 'Плавный переход между треками',
    crossfadeDuration: 'Длительность перехода',
    cfSeconds: 'сек',
    sidebarMode: 'Боковая панель',
    sidebarModeDesc: 'Вид навигационной панели',
    visualizer: 'Визуализатор',
    visualizerDesc: 'Стиль анимации музыки',
    visBars: 'Классические столбики',
    visWave: 'Волна (Осциллограф)',
    visMirrored: 'Зеркальные столбики',
    visCircles: 'Пульсирующие круги',
    visPos: 'Позиция визуализатора',
    visPosCenter: 'По центру',
    visPosLeft: 'Слева',
    visPosRight: 'Справа',
    visPosCustom: 'Своя позиция',
    visPosX: 'Смещение X (%)',
    visPosY: 'Смещение Y (%)',
    visWidth: 'Ширина (px)',
    visHeight: 'Высота (px)',
    sidebarStandard: 'Стандартная',
    sidebarCompact: 'Горизонтальная (сверху)',
    sidebarSlim: 'Узкая (слева)',
    close: 'Закрыть',
    save: 'Применить',
    searchPlaceholder: 'Поиск треков...',
    customFont: 'Свой шрифт',
    customFontDesc: 'Загрузите файл шрифта (.ttf, .otf), чтобы изменить стиль текста в приложении',
    uploadFont: 'Загрузить шрифт',
    resetFont: 'Сбросить',
    scConnect: 'Подключить SoundCloud',
    likedTracks: 'Любимые треки',
    likedPlaylists: 'Любимые плейлисты',
    recent: 'Недавние',
    charts: 'Чарты',
    recommended: 'Рекомендации',
    unknownArtist: 'Неизвестный исполнитель',
    standard: 'Стандарт (128kbps)',
    high: 'Высокое (256kbps)',
    extreme: 'Максимум (Lossless)',
    themeDeepSpace: 'Глубокий космос',
    themeSunset: 'Закат',
    themeEmerald: 'Изумруд',
    themePinkNoir: 'Розовый Нуар',
    themePinkNoir: 'Розовый Нуар',
    themeSoftPink: 'Нежно-розовый',
    themeSoftPink: 'Нежно-розовый',
    themeOldSchool: 'Windows 95',
    themeWindows7: 'Windows 7 Aero',
    themeWindowsXP: 'Windows XP Luna',
    themeIPod: 'iPod Classic',
    themeEclipse: 'Eclipse Classic',
    themeCustom: 'Своя тема',
    uploadBackground: 'Загрузить фон',
    backgroundFit: 'Размер фона',
    bgCover: 'Заполнение (Cover)',
    bgContain: 'Вместить (Contain)',
    bgFill: 'Растянуть (Fill)',
    placeholderUrl: 'URL заглушки (изображения)',
    upload: 'Загрузить',
    artistProfile: 'Профиль артиста',
    followers: 'подписчиков',
    likedTracksHeader: 'Понравившиеся треки',
    likedPlaylistsHeader: 'Понравившиеся плейлисты',
    noPlaylists: 'Плейлисты не найдены',
    noLikes: 'Лайки не найдены',
    import: 'Импорт',
    continueGuest: 'Продолжить без регистрации',
    done: 'Готово',
    clearLikesDesc: 'Удалить все понравившиеся треки из локального хранилища',
    startListening: 'Начни слушать',
    startListeningDesc: 'Ищи любимые треки или плейлисты выше',
    loadingMore: 'Загрузка...',
    forYou: 'Для тебя',
    basedOnTaste: 'На основе ваших вкусов',
    globalTop50: 'Глобальный Топ 50',
    trendingNow: 'В тренде сейчас',
    recentlyPlayed: 'Недавно прослушано',
    recentPlaylists: 'Недавние плейлисты',
    noRecommendations: 'Рекомендаций пока нет',
    playMusicToTaste: 'Слушайте больше музыки, чтобы мы поняли ваш вкус!',
    likedTracksTitle: 'Ваши любимые треки',
    noLikedTracks: 'Вы еще не лайкнули ни одного трека.',
    historyTitle: 'История прослушиваний',
    noHistory: 'Здесь пока пусто.',
    likedPlaylistsTitle: 'Ваши любимые плейлисты',
    noLikedPlaylists: 'Вы еще не лайкнули ни одного плейлиста.',
    scConnectDesc: 'Войдите в аккаунт, чтобы лайки в приложении добавлялись на сайт',
    scConnectedAs: 'Подключено как',
    scDisconnect: 'Выйти',
    scLogin: 'Войти',
    loginWelcome: 'Добро пожаловать',
    loginSubtitle: 'Войдите в свой аккаунт SoundCloud',
    loginButton: 'Войти через SoundCloud',
    loginLoading: 'Подключение...',
    viewAll: 'Показать все',
    shuffle: 'Перемешать',
    loop: 'Повтор',
    eqFlat: 'Сброс',
    eqRock: 'Рок',
    eqPop: 'Поп',
    eqBass: 'Бас',
    eqVocal: 'Вокал',
    eqElectronic: 'Электроника',
    eqJazz: 'Джаз',
    eqClassical: 'Классика',
    discordRpc: 'Discord статус (RPC)',
    discordRpcDesc: 'Показывать музыку в статусе Discord',
    discordClientId: 'Client ID приложения',
    discordClientIdDesc: 'Ваш ID приложения из Discord Developer Portal',
    dynamicBg: 'Живой фон (Vibe)',
    dynamicBgDesc: 'Автоматическая генерация градиента под цвета обложки',
    updateAvailable: 'Доступна новая версия',
    updateDownloading: 'Загрузка обновления...',
    updateDownloaded: 'Обновление готово к установке',
    updateInstall: 'Установить и перезапустить',
    analytics: 'Статистика',
    statsTitle: 'Аналитика прослушиваний',
    topTracks: 'Топ треков',
    topArtists: 'Топ артистов',
    totalTime: 'Всего прослушано',
    tracksPlayed: 'Треков прослушано',
    last7Days: 'За последние 7 дней',
    minutes: 'мин',
    hours: 'ч',
    clearHistory: 'Очистить историю',
    clearHistoryDesc: 'Удалить список недавно прослушанных треков',
    clearStats: 'Очистить аналитику',
    clearStatsDesc: 'Сбросить вашу личную статистику прослушиваний',
    flowMode: 'Flow Mode (Бесконечное Радио)',
    flowModeDesc: 'Автоматически включать похожие треки, когда очередь заканчивается',
    startStation: 'Запустить станцию',
    shareCard: 'Поделиться карточкой',
    nothingPlaying: 'Ничего не воспроизводится',
    playbackSpeed: 'Скорость воспроизведения',
  },
  en: {
    home: 'Home',
    discover: 'Discover',
    library: 'Library',
    playlists: 'Playlists',
    settings: 'Settings',
    search: 'Search',
    all: 'All',
    tracks: 'Tracks',
    artists: 'Artists',
    audioQuality: 'Audio Quality',
    audioQualityDesc: 'Choose your preferred streaming bitrate',
    theme: 'Visual Theme',
    themeDesc: 'Customize the look of your interface',
    importTitle: 'Import from SoundCloud',
    importDesc: 'Paste profile URL to import your favorites',
    eq: 'Equalizer',
    eqDesc: ' ',
    dangerZone: 'Danger Zone',
    clearLikes: 'Clear All Likes',
    language: 'Language',
    languageDesc: 'Select interface language',
    crossfade: 'Crossfade',
    crossfadeDesc: 'Smooth transitions between tracks',
    crossfadeDuration: 'Transition Duration',
    cfSeconds: 's',
    sidebarMode: 'Sidebar Layout',
    sidebarModeDesc: 'Navigation bar appearance',
    visualizer: 'Visualizer Style',
    visualizerDesc: 'Choose how your music looks',
    visBars: 'Classic Bars',
    visWave: 'Sine Wave',
    visMirrored: 'Mirrored Bars',
    visCircles: 'Pulsing Circles',
    visPos: 'Visualizer Position',
    visPosCenter: 'Center',
    visPosLeft: 'Left',
    visPosRight: 'Right',
    visPosCustom: 'Custom Position',
    visPosX: 'X Offset (%)',
    visPosY: 'Y Offset (%)',
    visWidth: 'Width (px)',
    visHeight: 'Height (px)',
    sidebarStandard: 'Standard',
    sidebarCompact: 'Horizontal (Top)',
    sidebarSlim: 'Slim (Left)',
    close: 'Close',
    save: 'Save',
    searchPlaceholder: 'Search tracks...',
    customFont: 'Custom Font',
    customFontDesc: 'Upload a font file (.ttf, .otf) to change the app typography',
    uploadFont: 'Upload Font',
    resetFont: 'Reset',
    scConnect: 'Connect SoundCloud',
    likedTracks: 'Liked Tracks',
    likedPlaylists: 'Liked Playlists',
    recent: 'Recent',
    charts: 'Charts',
    recommended: 'Recommended',
    unknownArtist: 'Unknown Artist',
    standard: 'Standard (128kbps)',
    high: 'High (256kbps)',
    extreme: 'Extreme (Lossless)',
    themeDeepSpace: 'Deep Space',
    themeSunset: 'Sunset Glow',
    themeEmerald: 'Emerald Night',
    themePinkNoir: 'Pink Noir',
    themePinkNoir: 'Pink Noir',
    themeSoftPink: 'Soft Pink',
    themeSoftPink: 'Soft Pink',
    themeOldSchool: 'Windows 95',
    themeWindows7: 'Windows 7 Aero',
    themeWindowsXP: 'Windows XP Luna',
    themeIPod: 'iPod Classic',
    themeEclipse: 'Eclipse Classic',
    themeCustom: 'Custom Theme',
    uploadBackground: 'Upload Background',
    backgroundFit: 'Background Fit',
    bgCover: 'Cover',
    bgContain: 'Contain',
    bgFill: 'Fill',
    placeholderUrl: 'Placeholder Image URL',
    upload: 'Upload',
    artistProfile: 'Artist Profile',
    followers: 'followers',
    likedTracksHeader: 'Liked Tracks',
    likedPlaylistsHeader: 'Liked Playlists',
    noPlaylists: 'No playlists found',
    noLikes: 'No likes found',
    import: 'Import',
    done: 'Done',
    clearLikesDesc: 'Remove all your liked tracks from local storage',
    startListening: 'Start Listening',
    startListeningDesc: 'Search for your favorite tracks or playlists above',
    loadingMore: 'Loading more gems...',
    forYou: 'For You',
    basedOnTaste: 'Based on your taste',
    globalTop50: 'Global Top 50',
    trendingNow: 'Trending now on SoundCloud',
    recentlyPlayed: 'Recently Played',
    recentPlaylists: 'Recent Playlists',
    noRecommendations: 'No recommendations yet',
    playMusicToTaste: 'Play some music to help us understand your taste!',
    likedTracksTitle: 'Your Liked Tracks',
    noLikedTracks: "You haven't liked any tracks yet.",
    historyTitle: 'Listening History',
    noHistory: "It's empty here for now.",
    likedPlaylistsTitle: 'Your Liked Playlists',
    noLikedPlaylists: "You haven't liked any playlists yet.",
    scConnect: 'SoundCloud Sync',
    scConnectDesc: 'Log in to sync your likes with the SoundCloud website',
    scConnectedAs: 'Connected as',
    scDisconnect: 'Logout',
    scLogin: 'Login',
    loginWelcome: 'Welcome',
    loginSubtitle: 'Sign in to your SoundCloud account',
    loginButton: 'Login with SoundCloud',
    loginLoading: 'Connecting...',
    continueGuest: 'Continue without registration',
    viewAll: 'View All',
    shuffle: 'Shuffle',
    loop: 'Loop',
    eqFlat: 'Flat',
    eqRock: 'Rock',
    eqPop: 'Pop',
    eqBass: 'Bass',
    eqVocal: 'Vocal',
    eqElectronic: 'Electronic',
    eqJazz: 'Jazz',
    eqClassical: 'Classical',
    discordRpc: 'Discord Rich Presence',
    discordRpcDesc: 'Show what you are listening to on Discord',
    discordClientId: 'Application Client ID',
    discordClientIdDesc: 'Your Application ID from Discord Developer Portal',
    dynamicBg: 'Dynamic Vibe',
    dynamicBgDesc: 'Background adapts to the current track artwork',
    updateAvailable: 'New version available',
    updateDownloading: 'Downloading update...',
    updateDownloaded: 'Update ready to install',
    updateInstall: 'Install and Restart',
    analytics: 'Analytics',
    statsTitle: 'Listening Analytics',
    topTracks: 'Top Tracks',
    topArtists: 'Top Artists',
    totalTime: 'Total Time',
    tracksPlayed: 'Tracks Played',
    last7Days: 'Last 7 Days',
    minutes: 'min',
    hours: 'h',
    clearHistory: 'Clear History',
    clearHistoryDesc: 'Remove the list of recently played tracks',
    clearStats: 'Clear Analytics',
    clearStatsDesc: 'Reset your personal listening statistics',
    flowMode: 'Flow Mode',
    flowModeDesc: 'Automatically play similar tracks when the queue ends',
    startStation: 'Start Station',
    shareCard: 'Share Card',
    playbackSpeed: 'Playback Speed',
    nothingPlaying: 'Nothing playing',
  }
};
function App() {
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [nextHref, setNextHref] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [rateMenuOpen, setRateMenuOpen] = useState(false);
  const [trackMenuOpen, setTrackMenuOpen] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [activeTab, setActiveTab] = useState('Discover');
  const [likedTracks, setLikedTracks] = useState([]);
  const [likedPlaylists, setLikedPlaylists] = useState([]);
  const [likedTracksQuery, setLikedTracksQuery] = useState('');
  const [libraryDisplayLimit, setLibraryDisplayLimit] = useState(50);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateVersion, setUpdateVersion] = useState('');
  const [trackStats, setTrackStats] = useState([]);
  const hasRecordedPlayRef = useRef(false);
  const playStartTimeRef = useRef(0);
  const filteredLikedTracks = useMemo(() => {
    if (!Array.isArray(likedTracks)) return [];
    if (!likedTracksQuery) return likedTracks;
    const lowerQuery = likedTracksQuery.toLowerCase();
    return likedTracks.filter(track =>
      track && track.title && track.title.toLowerCase().includes(lowerQuery) ||
      (track && track.user && track.user.username && track.user.username.toLowerCase().includes(lowerQuery))
    );
  }, [likedTracks, likedTracksQuery]);
  useEffect(() => {
    setLibraryDisplayLimit(50);
  }, [activeTab, likedTracksQuery]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistTab, setArtistTab] = useState('tracks');
  const [recommendations, setRecommendations] = useState([]);
  const [charts, setCharts] = useState([]);
  const [currentQueue, setCurrentQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scProfileUrl, setScProfileUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [scUser, setScUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isMini, setIsMini] = useState(false);
  const [settings, setSettings] = useState({
    audioQuality: 'High',
    theme: 'Deep Space',
    eq: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    language: 'ru',
    crossfade: true,
    crossfadeDuration: 2500,
    visualizerStyle: 'Bars',
    visualizerPosition: 'Center',
    visCustomX: 50,
    visCustomY: 50,
    visCustomWidth: 400,
    visCustomHeight: 80,
    backgroundImage: null,
    backgroundFit: 'cover',
    customThemeColor: '#ff5500',
    discordClientId: '1458763452041662618',
    dynamicBg: true,
    customTheme: {
      primary: '#ff5500',
      bgDark: '#000000',
      bgPanel: '#121214',
      bgElevated: '#1c1c1f',
      bgHover: '#27272a',
      textMain: '#ffffff',
      textSecondary: '#a1a1aa',
      textMuted: '#52525b',
      borderDim: '#27272a',
      glassBg: 'rgba(0, 0, 0, 0.4)',
      glassBorder: 'rgba(255, 255, 255, 0.1)',
      logoColor: '#ff5500',
      visColor: '#ff5500',
      cardSize: 180
    },
    customFont: null,
    flowMode: false
  });
  const t = (key) => {
    const lang = settings.language || 'ru';
    return translations[lang][key] || translations['en'][key] || key;
  };
  const filtersRef = useRef([]);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const backgroundCanvasRef = useRef(null);
  const headerCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const CROSSFADE_DURATION = settings.crossfadeDuration || 2500;
  const isTransitioningRef = useRef(false);
  const currentTrackRef = useRef(null);
  const queueRef = useRef([]);
  const isLoopingRef = useRef(false);
  const isShuffledRef = useRef(false);
  const soundRef = useRef(null);
  const volumeRef = useRef(1);
  const playbackRateRef = useRef(1);
  const settingsRef = useRef(settings);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { playbackRateRef.current = playbackRate; }, [playbackRate]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);
  useEffect(() => { queueRef.current = currentQueue; }, [currentQueue]);
  useEffect(() => { isLoopingRef.current = isLooping; }, [isLooping]);
  useEffect(() => { isShuffledRef.current = isShuffled; }, [isShuffled]);
  useEffect(() => { soundRef.current = sound; }, [sound]);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [viewingTrack, setViewingTrack] = useState(null);
  const [trackComments, setTrackComments] = useState([]);
  const [trackLikers, setTrackLikers] = useState([]);
  const [activeDetailTab, setActiveDetailTab] = useState('info');
  const [lyrics, setLyrics] = useState(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [vibeColors, setVibeColors] = useState(['#1a1a1a', '#000000']);
  const [waveformSamples, setWaveformSamples] = useState([]);
  const generateFakeWaveform = (seed) => {
    const s = parseInt(String(seed).slice(-5)) || 12345;
    const samples = [];
    for (let i = 0; i < 150; i++) {
      const val = 10 + (Math.abs(Math.sin((i + s) * 0.1) * 30) + Math.abs(Math.cos((i + s) * 0.25) * 15));
      samples.push(val);
    }
    return samples;
  };
  useEffect(() => {
    if (window.electronAPI) {
      const cleanAvail = window.electronAPI.onUpdateAvailable((version) => {
        setUpdateVersion(version);
        setUpdateStatus('available');
      });
      const cleanProg = window.electronAPI.onUpdateProgress((progress) => {
        setUpdateStatus('downloading');
        setUpdateProgress(progress);
      });
      const cleanDown = window.electronAPI.onUpdateDownloaded((version) => {
        setUpdateStatus('downloaded');
      });
      return () => {
        cleanAvail();
        cleanProg();
        cleanDown();
      };
    }
  }, []);
  useEffect(() => {
    if (settings.dynamicBg && currentTrack && (currentTrack.artwork_url || currentTrack.user?.avatar_url)) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      const rawUrl = currentTrack.artwork_url || currentTrack.user?.avatar_url || '';
      img.src = rawUrl.replace('-large', '-t300x300').replace('-small', '-t300x300');
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 10;
          canvas.height = 10;
          ctx.drawImage(img, 0, 0, 10, 10);
          const data = ctx.getImageData(0, 0, 10, 10).data;
          const colors = [];
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            if (brightness > 30 && brightness < 200) {
              colors.push(`rgb(${r}, ${g}, ${b})`);
            }
          }
          if (colors.length >= 2) {
            setVibeColors([colors[0], colors[Math.min(colors.length - 1, 15)]]);
          } else if (colors.length === 1) {
            setVibeColors([colors[0], '#000000']);
          }
        } catch (e) {
          console.error('Vibe: Error sampling colors', e);
        }
      };
      img.onerror = () => {
        console.warn('Vibe: Failed to load image for colors');
      };
    }
  }, [currentTrack, settings.dynamicBg]);
  useEffect(() => {
    if (viewingTrack && window.electronAPI) {
      setLyrics(null);
      setActiveDetailTab('info');
      if (window.electronAPI.getComments) window.electronAPI.getComments(viewingTrack.id).then(setTrackComments);
      if (window.electronAPI.getTrackLikers) window.electronAPI.getTrackLikers(viewingTrack.id).then(setTrackLikers);
      if (viewingTrack.waveform_url) {
        const jsonUrl = viewingTrack.waveform_url.replace('.png', '.json');
        fetch(jsonUrl)
          .then(r => r.json())
          .then(data => {
            if (data.samples) setWaveformSamples(data.samples);
            else setWaveformSamples(generateFakeWaveform(viewingTrack.id));
          })
          .catch(() => setWaveformSamples(generateFakeWaveform(viewingTrack.id)));
      } else {
        setWaveformSamples(generateFakeWaveform(viewingTrack.id));
      }
    } else {
      setTrackComments([]);
      setTrackLikers([]);
      setLyrics(null);
      setWaveformSamples([]);
    }
  }, [viewingTrack]);
  useEffect(() => {
    const handleMouseNav = (e) => {
      if (e.button === 3 || e.button === 4) {
        const TABS = ['Home', 'Discover', 'Library', 'Playlists', 'Player', 'Analytics'];
        const currentIndex = TABS.indexOf(activeTab);
        if (currentIndex === -1) return;
        const direction = e.button === 3 ? 1 : -1;
        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = TABS.length - 1;
        if (nextIndex >= TABS.length) nextIndex = 0;
        setActiveTab(TABS[nextIndex]);
        setViewingTrack(null);
        setSelectedArtist(null);
        setSelectedPlaylist(null);
        setSettingsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleMouseNav);
    return () => window.removeEventListener('mousedown', handleMouseNav);
  }, [activeTab]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (trackMenuOpen) {
        const container = document.querySelector('.rate-menu-container');
        if (container && !container.contains(event.target)) {
          setTrackMenuOpen(false);
        }
      }
      if (rateMenuOpen) {
        const container = document.querySelector('.rate-menu-container');
        if (container && !container.contains(event.target)) {
          setRateMenuOpen(false);
        }
      }
    };
    if (trackMenuOpen || rateMenuOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [trackMenuOpen, rateMenuOpen]);
  const fetchLyrics = async (forceTitle = null) => {
    if (!viewingTrack || (lyrics && !forceTitle) || loadingLyrics) return;
    setLoadingLyrics(true);
    setLyrics(null);
    try {
      let cleanTitle = forceTitle || viewingTrack.title
        .replace(/\([^)]*\)/g, '')
        .replace(/\[[^\]]*\]/g, '')
        .trim();
      console.log(`[Lyrics] Attempting: ${viewingTrack.user.username} - ${cleanTitle}`);
      let res = await window.electronAPI.getLyrics({
        artist: viewingTrack.user.username,
        title: cleanTitle
      });
      if (!res) {
        res = await window.electronAPI.getLyrics({
          artist: '',
          title: cleanTitle
        });
      }
      if (!res && !forceTitle) {
        res = await window.electronAPI.getLyrics({
          artist: viewingTrack.user.username,
          title: viewingTrack.title
        });
      }
      setLyrics(res || 'Lyrics not found.');
    } catch (e) {
      console.error(e);
      setLyrics('Failed to load lyrics.');
    } finally {
      setLoadingLyrics(false);
    }
  };
  const handleSelectFont = async () => {
    if (window.electronAPI) {
      const fontPath = await window.electronAPI.selectFont();
      if (fontPath) {
        const formattedPath = fontPath.startsWith('file://') ? fontPath : `file://${fontPath.replace(/\\/g, '/')}`;
        setSettings({ ...settings, customFont: formattedPath });
      }
    }
  };
  const handleResetFont = () => {
    setSettings({ ...settings, customFont: null });
  };
  useEffect(() => {
    if (settings.customFont) {
      const fontName = 'CustomUserFont';
      let styleTag = document.getElementById('custom-font-style');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'custom-font-style';
        document.head.appendChild(styleTag);
      }
      styleTag.innerHTML = `
        @font-face {
          font-family: '${fontName}';
          src: url('${settings.customFont}');
        }
        :root {
          --app-font: '${fontName}', 'Outfit', 'Inter', -apple-system, sans-serif !important;
        }
        body, button, input, select, textarea {
          font-family: var(--app-font) !important;
        }
      `;
    } else {
      const styleTag = document.getElementById('custom-font-style');
      if (styleTag) styleTag.remove();
      document.documentElement.style.removeProperty('--app-font');
    }
  }, [settings.customFont]);
  useEffect(() => {
    if (sound) {
      sound.loop(isLooping);
    }
  }, [isLooping, sound]);
  useEffect(() => {
    let interval;
    const fetchDiscoverData = async () => {
      if (activeTab === 'Discover' && window.electronAPI) {
        try {
          const [recData, chartData] = await Promise.all([
            window.electronAPI.getRecommendations(),
            window.electronAPI.getCharts()
          ]);
          setRecommendations(recData);
          setCharts(chartData);
        } catch (error) {
          console.error('Error fetching discover data:', error);
        }
      }
    };
    if (activeTab === 'Discover') {
      fetchDiscoverData();
      interval = setInterval(fetchDiscoverData, 120000);
    }
    return () => clearInterval(interval);
  }, [activeTab]);
  const searchTracks = async (isLoadMore = false) => {
    if ((!query && !isLoadMore) || !window.electronAPI || (isLoadMore && !nextHref) || loading) return;
    setLoading(true);
    if (!isLoadMore) {
      setActiveTab('Home');
      setSearchType('all');
      setTracks([]);
      setPlaylists([]);
      setArtists([]);
      setSelectedPlaylist(null);
      setSelectedArtist(null);
      setViewingTrack(null);
    }
    try {
      if (searchType === 'all') {
        const [tRes, pRes, aRes] = await Promise.all([
          window.electronAPI.searchTracks(query, null),
          window.electronAPI.searchPlaylists(query, null),
          window.electronAPI.searchUsers(query, null)
        ]);
        setTracks(tRes.collection);
        setPlaylists(pRes.collection);
        setArtists(aRes.collection);
        setNextHref(null);
      } else {
        let response;
        if (searchType === 'tracks') {
          response = await window.electronAPI.searchTracks(query, isLoadMore ? nextHref : null);
          setTracks(prev => isLoadMore ? [...prev, ...response.collection] : response.collection);
        } else if (searchType === 'playlists') {
          response = await window.electronAPI.searchPlaylists(query, isLoadMore ? nextHref : null);
          setPlaylists(prev => isLoadMore ? [...prev, ...response.collection] : response.collection);
        } else if (searchType === 'artists') {
          response = await window.electronAPI.searchUsers(query, isLoadMore ? nextHref : null);
          setArtists(prev => isLoadMore ? [...prev, ...response.collection] : response.collection);
        }
        setNextHref(response.next_href);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleScroll = (e) => {
    const threshold = 200;
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < threshold;
    if (bottom && nextHref && !loading && !selectedPlaylist) {
      searchTracks(true);
    }
  };
  const handleSeek = (e) => {
    const newSeek = Number(e.target.value);
    setSeek(newSeek);
    if (sound) {
      sound.seek(newSeek);
    }
  };
  const handleHeaderSeek = (e) => {
    if (!duration || !sound) return;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * duration;
    sound.seek(seekTime);
    setSeek(seekTime);
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  useEffect(() => {
    let interval;
    if (isPlaying && sound) {
      interval = setInterval(() => {
        const currentSeek = sound.seek();
        if (typeof currentSeek === 'number') {
          setSeek(currentSeek);
          const threshold = Math.min(20, (sound.duration() || 0) * 0.5);
          if (currentSeek >= threshold && !hasRecordedPlayRef.current && currentTrackRef.current) {
            hasRecordedPlayRef.current = true;
            window.electronAPI.recordPlay({
              id: currentTrackRef.current.id,
              title: currentTrackRef.current.title,
              artist: currentTrackRef.current.user?.username || 'Unknown',
              duration: sound.duration()
            }).then(() => {
              window.electronAPI.getStats().then(setTrackStats);
            });
          }
        }
        const soundDuration = sound.duration();
        const useCrossfade = settings.crossfade && !isLoopingRef.current;
        if (useCrossfade && soundDuration > 0 && (soundDuration - currentSeek) <= (CROSSFADE_DURATION / 1000) && !isTransitioningRef.current) {
          sound.off('end');
          playNext();
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sound]);
  const addToHistory = async (item) => {
    if (window.electronAPI) {
      const updated = await window.electronAPI.addToHistory(item);
      setHistory(updated);
    }
  };
  useEffect(() => {
    queueRef.current = currentQueue;
  }, [currentQueue]);
  const togglePlay = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  };
  const playNext = async () => {
    const q = queueRef.current;
    const current = currentTrackRef.current;
    if (!current || !q || q.length === 0) {
      setIsPlaying(false);
      return;
    }
    const currentId = String(current.id);
    const idx = q.findIndex(t => String(t.id) === currentId);
    if (isShuffledRef.current && q.length > 1) {
      let nextIdx = Math.floor(Math.random() * q.length);
      if (idx !== -1 && q.length > 1 && nextIdx === idx) {
        nextIdx = (nextIdx + 1) % q.length;
      }
      playTrackSecure(q[nextIdx]);
      return;
    }
    if (idx !== -1 && idx < q.length - 1) {
      const nextTrack = q[idx + 1];
      playTrackSecure(nextTrack);
    } else if (settingsRef.current.flowMode) {
      console.log('Flow Mode: Queue ended. Fetching station tracks...');
      if (window.electronAPI) {
        try {
          const stationTracks = await window.electronAPI.getStationTracks(current.id);
          if (stationTracks && stationTracks.length > 0) {
            const newQueue = [...q, ...stationTracks];
            playTrackSecure(stationTracks[0], newQueue);
          }
        } catch (e) {
          console.error('Flow Mode Error:', e);
          setIsPlaying(false);
        }
      }
    } else {
      setIsPlaying(false);
    }
  };
  const playPrevious = () => {
    const q = queueRef.current;
    const current = currentTrackRef.current;
    if (!current || !q || q.length === 0) return;
    const idx = q.findIndex(t => String(t.id) === String(current.id));
    if (idx > 0) {
      playTrackSecure(q[idx - 1]);
    }
  };
  const playTrackSecure = async (track, newQueue = null) => {
    if (track.kind === 'playlist') {
      openPlaylist(track);
      addToHistory(track);
      return;
    }
    addToHistory(track);
    if (newQueue) {
      setCurrentQueue(newQueue);
      queueRef.current = newQueue;
    }
    setCurrentTrack(track);
    currentTrackRef.current = track;
    hasRecordedPlayRef.current = false;
    setSeek(0);
    setDuration(0);
    isTransitioningRef.current = true;
    const previousSound = sound;
    const currentVolume = volumeRef.current;
    const currentRate = playbackRateRef.current;
    const currentSettings = settingsRef.current;
    const useCrossfade = currentSettings.crossfade && !isLoopingRef.current;
    if (previousSound) {
      previousSound.off();
    }
    if (previousSound && !useCrossfade) {
      previousSound.stop();
      previousSound.unload();
    }
    try {
      const streamUrl = await window.electronAPI.getTrackStream(track.id);
      const newSound = new Howl({
        src: [streamUrl],
        html5: false,
        format: ['mp3', 'mpeg'],
        volume: useCrossfade ? 0 : 1,
        rate: currentRate,
        loop: isLoopingRef.current,
        onplay: () => {
          setIsPlaying(true);
          setDuration(newSound.duration());
          if (useCrossfade) {
            newSound.fade(0, 1, (currentSettings.crossfadeDuration || 2500));
          }
          if (previousSound && useCrossfade) {
            previousSound.fade(previousSound.volume(), 0, (currentSettings.crossfadeDuration || 2500));
            setTimeout(() => {
              try { previousSound.unload(); } catch (e) { }
            }, (currentSettings.crossfadeDuration || 2500) + 1000);
          }
          isTransitioningRef.current = false;
          if (window.Howler && window.Howler.ctx) {
            if (window.Howler.ctx.state === 'suspended') {
              window.Howler.ctx.resume();
            }
            setTimeout(() => {
              connectEQ();
            }, 100);
          }
          if (window.electronAPI && window.electronAPI.rpcUpdate) {
            let artwork = track.artwork_url;
            if (artwork) artwork = artwork.replace('large', 't500x500');
            window.electronAPI.rpcUpdate({
              title: track.title,
              artist: track.user?.username,
              duration: newSound.duration(),
              seek: newSound.seek(),
              isPlaying: true,
              artworkUrl: artwork
            });
          }
        },
        onload: () => {
          if (window.electronAPI && window.electronAPI.rpcUpdate) {
            let artwork = track.artwork_url;
            if (artwork) artwork = artwork.replace('large', 't500x500');
            window.electronAPI.rpcUpdate({
              title: track.title,
              artist: track.user?.username,
              duration: newSound.duration(),
              seek: newSound.seek(),
              isPlaying: true,
              artworkUrl: artwork
            });
          }
        },
        onpause: () => {
          setIsPlaying(false);
          if (window.electronAPI && window.electronAPI.rpcUpdate) {
            let artwork = track.artwork_url;
            if (artwork) artwork = artwork.replace('large', 't500x500');
            window.electronAPI.rpcUpdate({
              title: track.title,
              artist: track.user?.username,
              duration: newSound.duration() || (track.duration ? track.duration / 1000 : 0),
              seek: newSound.seek(),
              isPlaying: false,
              artworkUrl: artwork
            });
          }
        },
        onstop: () => {
          setIsPlaying(false);
          if (window.electronAPI && window.electronAPI.rpcClear) {
            window.electronAPI.rpcClear();
          }
        },
        onend: () => {
          if (isLoopingRef.current) {
            return;
          }
          playNext();
        },
      });
      setSound(newSound);
      newSound.play();
    } catch (error) {
      isTransitioningRef.current = false;
      console.error('Error playing track:', error);
    }
  };
  const openPlaylist = async (playlist) => {
    setLoading(true);
    try {
      const tracks = await window.electronAPI.getPlaylistDetails(playlist.id);
      setSelectedPlaylist({ ...playlist, tracks });
    } catch (e) {
      console.error("Failed to open playlist", e);
    } finally {
      setLoading(false);
    }
  };
  const handleStartStation = async (e, track) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const targetTrack = track || e;
    if (!targetTrack || (!targetTrack.id && targetTrack.id !== 0)) {
      console.error("Invalid track for station:", targetTrack);
      return;
    }
    setLoading(true);
    try {
      console.log(`[Station] Starting station for track ID: ${targetTrack.id} (${targetTrack.title})`);
      const tracks = await window.electronAPI.getStationTracks(targetTrack.id);
      if (tracks && tracks.length > 0) {
        setCurrentQueue(tracks);
        queueRef.current = tracks;
        playTrackSecure(tracks[0]);
      } else {
        alert("No station tracks found for this track.");
      }
    } catch (e) {
      console.error("Failed to start station", e);
      alert("Could not start station for this track.");
    } finally {
      setLoading(false);
    }
  };
  const handleShare = async (e, track) => {
    if (e) e.stopPropagation();
    if (!track) return;
    if (!window.electronAPI || !window.electronAPI.copyImageToClipboard) {
      alert("Clipboard API not available.");
      return;
    }
    const width = 1200;
    const height = 630;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    let bgGradient = ctx.createLinearGradient(0, 0, width, height);
    if (String(track.id) === String(currentTrack?.id) && settings.dynamicBg && vibeColors && vibeColors.length >= 2) {
      bgGradient.addColorStop(0, vibeColors[0]);
      bgGradient.addColorStop(1, vibeColors[1]);
    } else {
      bgGradient.addColorStop(0, '#111');
      bgGradient.addColorStop(1, '#333');
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, width, height);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    const artworkUrl = (track.artwork_url || track.user?.avatar_url || '').replace('-large', '-t500x500');
    img.onload = async () => {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 20;
      const artSize = 350;
      const artX = 100;
      const artY = (height - artSize) / 2;
      ctx.drawImage(img, artX, artY, artSize, artSize);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 60px Inter, sans-serif';
      ctx.textBaseline = 'top';
      const textX = artX + artSize + 60;
      const textY = artY + 40;
      const maxWidth = width - textX - 80;
      ctx.fillText(track.title, textX, textY, maxWidth);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '500 40px Inter, sans-serif';
      ctx.fillText(track.user?.username || 'Unknown Artist', textX, textY + 80, maxWidth);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '600 24px Inter, sans-serif';
      ctx.fillText('SoundCloud Desktop', textX, height - artY - 40);
      const dataUrl = canvas.toDataURL('image/png');
      const success = await window.electronAPI.copyImageToClipboard(dataUrl);
      if (success) {
        alert('Share Card copied to clipboard!');
      } else {
        alert('Failed to copy to clipboard.');
      }
    };
    img.onerror = () => {
      alert("Failed to load artwork for sharing.");
    };
    img.src = artworkUrl;
  };
  const closePlaylist = () => {
    setSelectedPlaylist(null);
  };
  const toggleLoop = () => {
    const newLoop = !isLooping;
    setIsLooping(newLoop);
    isLoopingRef.current = newLoop;
    if (sound) {
      sound.loop(newLoop);
    }
  };
  const handleRateChange = (newRate) => {
    setPlaybackRate(newRate);
    if (soundRef.current) {
      soundRef.current.rate(newRate);
    }
  };
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.rate(playbackRate);
    }
  }, [playbackRate]);
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };
  useEffect(() => {
    Howler.volume(volume);
  }, [volume]);
  const connectEQ = () => {
    if (typeof window === 'undefined' || !window.Howler || !window.Howler.ctx || window.Howler.ctx.state === 'closed') return;
    const ctx = window.Howler.ctx;
    if (filtersRef.current.length === 0) {
      const freqs = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
      filtersRef.current = freqs.map((freq, i) => {
        const filter = ctx.createBiquadFilter();
        filter.type = i === 0 ? 'lowshelf' : i === 9 ? 'highshelf' : 'peaking';
        filter.frequency.value = freq;
        filter.gain.value = settings.eq[i];
        return filter;
      });
    }
    if (!analyserRef.current) {
      analyserRef.current = ctx.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
    }
    try {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      window.Howler.masterGain.disconnect();
      window.Howler.masterGain.connect(filtersRef.current[0]);
      for (let i = 0; i < filtersRef.current.length - 1; i++) {
        filtersRef.current[i].disconnect();
        filtersRef.current[i].connect(filtersRef.current[i + 1]);
      }
      filtersRef.current[filtersRef.current.length - 1].disconnect();
      filtersRef.current[filtersRef.current.length - 1].connect(analyserRef.current);
      analyserRef.current.disconnect();
      analyserRef.current.connect(ctx.destination);
    } catch (e) {
      console.warn("EQ Connection issue:", e);
    }
  };
  useEffect(() => {
    connectEQ();
  }, [settingsOpen]);
  useEffect(() => {
    if (filtersRef.current.length > 0) {
      filtersRef.current.forEach((filter, i) => {
        filter.gain.setTargetAtTime(settings.eq[i], window.Howler.ctx.currentTime, 0.05);
      });
    }
  }, [settings.eq]);
  useEffect(() => {
    const loadData = async () => {
      if (window.electronAPI) {
        try {
          const savedSettings = await window.electronAPI.getSettings();
          if (savedSettings) {
            if (savedSettings.eq && savedSettings.eq.length !== 10) {
              savedSettings.eq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            }
            setSettings(savedSettings);
            if (savedSettings.volume !== undefined) setVolume(savedSettings.volume);
          }
          const likes = await window.electronAPI.getLikes();
          setLikedTracks(likes);
          const savedPlaylists = await window.electronAPI.getLikedPlaylists();
          setLikedPlaylists(savedPlaylists);
          const hist = await window.electronAPI.getHistory();
          setHistory(hist);
          const stats = await window.electronAPI.getStats();
          setTrackStats(stats);
          const user = await window.electronAPI.getSCUser();
          setScUser(user);
          if (user && user.permalink_url) {
            try {
              const tracks = await window.electronAPI.importSCLikes(user.permalink_url);
              if (Array.isArray(tracks)) setLikedTracks(tracks);
              const playlists = await window.electronAPI.importSCPlaylists(user.permalink_url);
              if (Array.isArray(playlists)) setLikedPlaylists(playlists);
            } catch (err) {
              console.error('Auto-sync failed on startup:', err);
            }
          }
        } catch (e) {
          console.error("Failed to load user data", e);
        }
        setDataLoaded(true);
      }
    };
    loadData();
  }, []);
  const controlsRef = useRef({ togglePlay, playNext, playPrevious });
  useEffect(() => {
    controlsRef.current = { togglePlay, playNext, playPrevious };
  }, [togglePlay, playNext, playPrevious]);
  useEffect(() => {
    if (window.electronAPI && window.electronAPI.onMediaControl) {
      const cleanup = window.electronAPI.onMediaControl((action) => {
        if (action === 'play-pause') controlsRef.current.togglePlay();
        else if (action === 'next') controlsRef.current.playNext();
        else if (action === 'previous') controlsRef.current.playPrevious();
      });
      return () => {
        if (typeof cleanup === 'function') cleanup();
      };
    }
  }, []);
  useEffect(() => {
    if (window.electronAPI && window.electronAPI.onMiniPlayerState) {
      const cleanup = window.electronAPI.onMiniPlayerState((state) => {
        setIsMini(state);
      });
      return () => cleanup();
    }
  }, []);
  useEffect(() => {
    if (dataLoaded && window.electronAPI) {
      const fullSettings = { ...settings, volume };
      window.electronAPI.saveSettings(fullSettings);
    }
  }, [settings, volume, dataLoaded]);
  const handleClearLikes = async () => {
    if (window.confirm("Are you sure you want to clear ALL liked tracks? This cannot be undone.")) {
      if (window.electronAPI) {
        const newLikes = await window.electronAPI.clearLikes();
        setLikedTracks(newLikes);
      }
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (backgroundCanvasRef.current) {
        backgroundCanvasRef.current.width = window.innerWidth;
        backgroundCanvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return () => window.removeEventListener('resize', handleResize);
    }
    let r = 255, g = 85, b = 0;
    let visColor = 'var(--primary)';
    if (settings.dynamicBg && vibeColors && vibeColors[0]) {
      visColor = vibeColors[0];
    } else if (settings.theme === 'Custom' && settings.customTheme?.visColor) {
      visColor = settings.customTheme.visColor;
    }
    if (visColor.startsWith('#')) {
      const hex = visColor.substring(1);
      if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      }
    } else if (visColor.startsWith('rgb')) {
      const match = visColor.match(/\d+/g);
      if (match && match.length >= 3) {
        [r, g, b] = match.map(Number);
      }
    } else {
      const tempEl = document.createElement('div');
      tempEl.style.color = visColor;
      document.body.appendChild(tempEl);
      const computed = getComputedStyle(tempEl).color;
      document.body.removeChild(tempEl);
      const match = computed.match(/\d+/g);
      if (match && match.length >= 3) {
        [r, g, b] = match.map(Number);
      }
    }
    const rgb = `${r}, ${g}, ${b}`;
    const particles = [];
    const maxParticles = 100;
    const draw = () => {
      if (!analyserRef.current) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      const style = settings.visualizerStyle || 'Bars';
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (Math.abs(canvas.width - canvas.clientWidth) > 5) canvas.width = canvas.clientWidth;
        if (Math.abs(canvas.height - canvas.clientHeight) > 5) canvas.height = canvas.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const footerStyle = ['Particles', 'Frequency'].includes(style) ? 'Bars' : style;
        if (footerStyle === 'Bars') {
          const barWidth = (canvas.width / bufferLength) * 2.5;
          let x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            ctx.fillStyle = `rgba(${rgb}, 0.8)`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
          }
        } else if (footerStyle === 'Waveform' || footerStyle === 'Wave') {
          ctx.lineWidth = 2;
          ctx.strokeStyle = `rgb(${rgb})`;
          ctx.beginPath();
          const sliceWidth = canvas.width / bufferLength;
          let x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * canvas.height / 2;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            x += sliceWidth;
          }
          ctx.stroke();
        } else if (footerStyle === 'Mirrored') {
          const barWidth = (canvas.width / bufferLength) * 1.2;
          const centerX = canvas.width / 2;
          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
            ctx.fillStyle = `rgba(${rgb}, 0.6)`;
            ctx.fillRect(centerX + (i * (barWidth + 1)), canvas.height / 2 - barHeight / 2, barWidth, barHeight);
            ctx.fillRect(centerX - (i * (barWidth + 1)), canvas.height / 2 - barHeight / 2, barWidth, barHeight);
          }
        } else if (footerStyle === 'Circles') {
          const radius = (dataArray[10] / 255) * (canvas.height / 2);
          ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(${rgb}, 0.8)`; ctx.stroke();
        }
      }
      if (headerCanvasRef.current && viewingTrack) {
        const canvas = headerCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (Math.abs(canvas.width - canvas.clientWidth) > 5) canvas.width = canvas.clientWidth;
        if (Math.abs(canvas.height - canvas.clientHeight) > 5) canvas.height = canvas.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const currentSamples = waveformSamples && waveformSamples.length > 0
          ? waveformSamples
          : generateFakeWaveform(viewingTrack.id);
        const isPlayingThis = currentTrack && String(currentTrack.id) === String(viewingTrack.id);
        const currentSeek = (isPlayingThis && sound) ? sound.seek() : 0;
        const totalDur = (viewingTrack.duration || viewingTrack.full_duration || 1) / 1000;
        const progressPercent = currentSeek / totalDur;
        const gap = 1;
        const barWidth = 2;
        const totalBarWidth = barWidth + gap;
        const numBars = Math.floor(canvas.width / totalBarWidth);
        const maxVal = Math.max(...currentSamples) || 1;
        for (let i = 0; i < numBars; i++) {
          const sampleIdx = Math.floor((i / numBars) * currentSamples.length);
          const val = currentSamples[sampleIdx];
          const x = i * totalBarWidth;
          const h = (val / maxVal) * canvas.height * 0.8;
          const isPlayed = (i / numBars) < progressPercent;
          const topH = h * 0.7;
          const botH = h * 0.3;
          ctx.fillStyle = isPlayed ? 'var(--primary)' : 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(x, (canvas.height * 0.6) - topH, barWidth, topH);
          ctx.fillStyle = isPlayed ? 'rgba(255, 85, 0, 0.5)' : 'rgba(255, 255, 255, 0.25)';
          ctx.fillRect(x, (canvas.height * 0.6) + 1, barWidth, botH);
        }
        if (trackComments && trackComments.length > 0) {
          trackComments.forEach(comment => {
            const commentPos = (comment.timestamp / (totalDur * 1000)) * canvas.width;
            ctx.beginPath();
            ctx.arc(commentPos, canvas.height - 5, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
          });
        }
      }
      if (backgroundCanvasRef.current) {
        const canvas = backgroundCanvasRef.current;
        const ctx = canvas.getContext('2d');

        if (style === 'Particles') {
          ctx.save();
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
          const average = dataArray.reduce((s, a) => s + a, 0) / bufferLength;
          if (average > 30 && particles.length < maxParticles) {
            particles.push({
              x: Math.random() * canvas.width, y: canvas.height + 10,
              vx: (Math.random() - 0.5) * 4, vy: -(Math.random() * 5 + 2),
              life: 1.0, color: `rgba(${rgb}, ${Math.random()})`
            });
          }
          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i]; p.x += p.vx; p.y += p.vy; p.life -= 0.01;
            p.x += (Math.random() - 0.5) * (average / 50);
            ctx.beginPath(); ctx.arc(p.x, p.y, 3 * (average / 100), 0, Math.PI * 2);
            ctx.fillStyle = p.color; ctx.fill();
            if (p.life <= 0 || p.y < -10) particles.splice(i, 1);
          }
        } else if (style === 'Frequency') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const bw = (canvas.width / bufferLength) * 2.5;
          let x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const bh = (dataArray[i] / 255) * canvas.height * 0.6;
            const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - bh);
            grad.addColorStop(0, `rgba(${rgb}, 0.8)`); grad.addColorStop(1, `rgba(${rgb}, 0.1)`);
            ctx.fillStyle = grad; ctx.fillRect(x, canvas.height - bh, bw, bh);
            x += bw + 4;
          }
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, settings.visualizerStyle, settings.theme, settings.customThemeColor, viewingTrack]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          playPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          playNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(prev => Math.min(prev + 0.05, 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(prev => Math.max(prev - 0.05, 0));
          break;
        case 'KeyM':
          setVolume(prev => (prev === 0 ? 0.5 : 0));
          break;
        case 'KeyL':
          toggleLoop();
          break;
        case 'KeyS':
          toggleShuffle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, playPrevious, playNext, toggleLoop, toggleShuffle]);
  const handleImportLikes = async () => {
    if (!scProfileUrl) return;
    if (!window.electronAPI) {
      alert('Sync API not available. Please restart the desktop app.');
      return;
    }
    setIsImporting(true);
    try {
      const tracks = await window.electronAPI.importSCLikes(scProfileUrl);
      if (Array.isArray(tracks)) setLikedTracks(tracks);
      const playlists = await window.electronAPI.importSCPlaylists(scProfileUrl);
      if (Array.isArray(playlists)) setLikedPlaylists(playlists);
      alert(`Synchronization complete!`);
      setScProfileUrl('');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import. Make sure the profile URL is correct and public.');
    } finally {
      setIsImporting(false);
    }
  };
  const extractAverageColor = (src) => {
    return new Promise((resolve) => {
      const isVideo = src.match(/\.(mp4|webm)$/i);
      if (isVideo) {
        const video = document.createElement('video');
        video.src = src;
        video.crossOrigin = "Anonymous";
        video.muted = true;
        video.currentTime = 1;
        video.onloadeddata = () => {
          setTimeout(() => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = 1;
              canvas.height = 1;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(video, 0, 0, 1, 1);
              const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              if (brightness > 200) {
                resolve('#ff5500');
              } else {
                resolve(`rgb(${r}, ${g}, ${b})`);
              }
            } catch (e) {
              resolve('#ff5500');
            }
          }, 200);
        };
        video.onerror = () => resolve('#ff5500');
        video.load();
      } else {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = src;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (brightness > 200) {
            resolve('#ff5500');
          } else {
            resolve(`rgb(${r}, ${g}, ${b})`);
          }
        };
        img.onerror = () => resolve('#ff5500');
      }
    });
  };
  const handleSelectPlaceholder = async () => {
    if (window.electronAPI && window.electronAPI.selectImage) {
      const filePath = await window.electronAPI.selectImage();
      if (filePath) {
        const url = `file://${filePath}`;
        const newSettings = {
          ...settings,
          customTheme: { ...settings.customTheme, placeholder: url }
        };
        setSettings(newSettings);
        window.electronAPI.saveSettings(newSettings);
      }
    }
  };
  const handleCustomBackground = async () => {
    if (window.electronAPI) {
      const filePath = await window.electronAPI.selectCustomBackground();
      if (filePath) {
        const color = await extractAverageColor(filePath);
        const newSettings = {
          ...settings,
          theme: 'Custom',
          backgroundImage: filePath,
          customThemeColor: color
        };
        setSettings(newSettings);
        window.electronAPI.saveSettings(newSettings);
      }
    }
  };
  const handleSCConnect = async () => {
    if (window.electronAPI) {
      setIsLoggingIn(true);
      try {
        const result = await window.electronAPI.connectSoundCloud();
        if (result.success && result.user) {
          setScUser(result.user);
          if (result.user.permalink_url) {
            try {
              const tracks = await window.electronAPI.importSCLikes(result.user.permalink_url);
              if (Array.isArray(tracks)) setLikedTracks(tracks);
              const playlists = await window.electronAPI.importSCPlaylists(result.user.permalink_url);
              if (Array.isArray(playlists)) setLikedPlaylists(playlists);
            } catch (err) {
              console.error('Auto-sync failed:', err);
            }
          }
        }
      } finally {
        setIsLoggingIn(false);
      }
    }
  };
  const handleSCDisconnect = async () => {
    if (window.electronAPI) {
      await window.electronAPI.disconnectSoundCloud();
      setScUser(null);
    }
  };
  const handleToggleLike = async (e, item) => {
    e.stopPropagation();
    if (window.electronAPI) {
      if (item.kind === 'playlist') {
        const updated = await window.electronAPI.toggleLikePlaylist(item);
        setLikedPlaylists(updated);
      } else {
        const updated = await window.electronAPI.toggleLike(item);
        setLikedTracks(updated);
      }
    }
  };
  useEffect(() => {
    if (settings.theme === 'Custom' && settings.customTheme && settings.customTheme.cardSize) {
      document.documentElement.style.setProperty('--card-size', `${settings.customTheme.cardSize}px`);
    } else {
      document.documentElement.style.removeProperty('--card-size');
    }
  }, [settings.theme, settings.customTheme]);
  const isLiked = (item) => {
    if (!item) return false;
    if (item.kind === 'playlist') {
      return Array.isArray(likedPlaylists) && likedPlaylists.some(p => p.id === item.id);
    }
    return Array.isArray(likedTracks) && likedTracks.some(t => t.id === item.id);
  };
  const defaultPlaceholder = require('./assets/holder.png');
  const placeholderImg = (settings.theme === 'Custom' && settings.customTheme?.placeholder) || defaultPlaceholder;
  const getContextQueue = () => {
    if (selectedPlaylist) return selectedPlaylist.tracks;
    if (selectedArtist) {
      if (artistTab === 'tracks') return selectedArtist.tracks;
      if (artistTab === 'likes') return selectedArtist.likes;
      if (artistTab === 'playlists') return selectedArtist.playlists;
    }
    if (activeTab === 'Library') return likedTracks;
    return tracks;
  };
  const renderTrackCard = (item) => (
    <div key={item.id} className="track-card" onClick={() => playTrackSecure(item, getContextQueue())}>
      <button
        className={`like-btn ${isLiked(item) ? 'liked' : ''}`}
        onClick={(e) => handleToggleLike(e, item)}
        title={isLiked(item) ? "Unlike" : "Like"}
      >
        ♥
      </button>
      <div className="card-image-container">
        <img
          src={item.artwork_url ? item.artwork_url.replace('large', 't500x500') : placeholderImg}
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
          alt={item.title}
        />
        <div className="play-overlay">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </div>
      </div>
      <div className="track-info">
        <h3>{item.title}</h3>
        <p>{item.user ? item.user.username : 'Unknown Artist'} {item.track_count ? `(${item.track_count} tracks)` : ''}</p>
      </div>
    </div>
  );
  const renderHorizontalList = (items, title, subtitle) => {
    if (!items || items.length === 0) return null;
    return (
      <div style={{ marginBottom: '56px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 900, marginBottom: '4px' }}>{title}</h2>
          {subtitle && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>{subtitle}</p>}
        </div>
        <div
          className="track-grid no-scrollbar"
          ref={(el) => {
            if (el) {
              el.onwheel = (e) => {
                if (e.deltaY !== 0) {
                  e.preventDefault();
                  el.scrollLeft += e.deltaY;
                }
              };
            }
          }}
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            paddingBottom: '12px',
            gap: '24px',
            margin: '-10px -10px 0 -10px',
            padding: '10px 10px 12px 10px'
          }}>
          {items.map(item => (
            <div key={`${title}-${item.id}`} className="track-card ripple" style={{ minWidth: '200px', width: '200px' }} onClick={() => playTrackSecure(item, items)}>
              <button
                className={`like-btn ${isLiked(item) ? 'liked' : ''}`}
                onClick={(e) => handleToggleLike(e, item)}
                title={isLiked(item) ? "Unlike" : "Like"}
              >
                ♥
              </button>
              <div className="card-image-container">
                <img
                  src={item.artwork_url ? item.artwork_url.replace('large', 't500x500') : placeholderImg}
                  onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
                  alt={item.title}
                />
                <div className="play-overlay">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="track-info">
                <h3 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h3>
                <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.user ? item.user.username : 'Unknown Artist'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  const renderSkeletonGrid = (count = 10) => (
    <div className="track-grid">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="track-card">
          <div className="card-image-container skeleton" style={{ width: '100%', height: 'auto' }}></div>
          <div className="track-info">
            <div className="skeleton" style={{ width: '80%', height: '16px', marginBottom: '8px' }}></div>
            <div className="skeleton" style={{ width: '60%', height: '12px' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
  const renderPlaylistView = () => {
    if (!selectedPlaylist) return null;
    return (
      <div className="content">
        <button onClick={closePlaylist} style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}><path d="m15 18-6-6 6-6" /></svg> Back to search
        </button>
        <div style={{ display: 'flex', marginBottom: '40px', alignItems: 'flex-end' }}>
          <div className="card-image-container" style={{ width: '240px', height: '240px', marginRight: '32px', marginBottom: 0 }}>
            <img
              src={selectedPlaylist.artwork_url ? selectedPlaylist.artwork_url.replace('large', 't500x500') : placeholderImg}
              onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
              alt={selectedPlaylist.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ paddingBottom: '12px' }}>
            <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', color: 'var(--primary)', marginBottom: '8px', display: 'block' }}>Playlist</span>
            <h2 style={{ color: 'var(--text-main)', margin: '0 0 12px 0', fontSize: '48px', fontWeight: 900, letterSpacing: '-2px' }}>{selectedPlaylist.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ color: 'var(--text-main)', margin: 0, fontWeight: 700, fontSize: '15px' }}>{selectedPlaylist.user?.username}</p>
              <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>•</span>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>{selectedPlaylist.track_count} tracks</p>
            </div>
            <button
              className={`like-btn ${isLiked(selectedPlaylist) ? 'liked' : ''}`}
              onClick={(e) => handleToggleLike(e, selectedPlaylist)}
              style={{ position: 'static', opacity: 1, marginTop: '24px', background: 'var(--bg-elevated)' }}
            >
              ♥
            </button>
          </div>
        </div>
        <div className="track-grid">
          {selectedPlaylist.tracks.map(track => renderTrackCard(track))}
        </div>
      </div>
    );
  };
  const openArtist = async (artist) => {
    setLoading(true);
    try {
      const details = await window.electronAPI.getArtistDetails(artist.id);
      setSelectedArtist(details);
      setSelectedArtist(details);
      setArtistTab('tracks');
      setSelectedPlaylist(null);
      setActiveTab('Home');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const renderArtistCard = (artist) => (
    <div key={artist.id} className="track-card ripple" onClick={() => openArtist(artist)}>
      <div style={{
        width: '100%',
        aspectRatio: '1',
        borderRadius: '50%',
        overflow: 'hidden',
        marginBottom: '16px',
        boxShadow: 'var(--shadow-md)',
        border: '2px solid rgba(255,255,255,0.05)'
      }}>
        <img
          src={artist.avatar_url ? artist.avatar_url.replace('large', 't500x500') : placeholderImg}
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
          alt={artist.username}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="card-info" style={{ textAlign: 'center' }}>
        <h3 className="card-title">{artist.username}</h3>
        <p className="card-artist" style={{ color: 'var(--primary)' }}>Artist • {artist.followers_count?.toLocaleString() || 0} followers</p>
      </div>
    </div>
  );
  const renderArtistView = () => {
    if (!selectedArtist) return null;
    const { profile, tracks: artistTracks, likes: artistLikes, playlists: artistPlaylists } = selectedArtist;
    return (
      <div className="content">
        <button onClick={() => setSelectedArtist(null)} style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}><path d="m15 18-6-6 6-6" /></svg> Back to search
        </button>
        <div style={{ display: 'flex', marginBottom: '40px', alignItems: 'center' }}>
          <div style={{
            width: '180px',
            height: '180px',
            marginRight: '32px',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '4px solid rgba(255,255,255,0.1)',
            flexShrink: 0
          }}>
            <img
              src={profile.avatar_url ? profile.avatar_url.replace('large', 't500x500') : placeholderImg}
              onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
              alt={profile.username}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
          <div>
            <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', color: 'var(--primary)', marginBottom: '8px', display: 'block' }}>{t('artistProfile')}</span>
            <h2 style={{ color: 'var(--text-main)', margin: '0 0 8px 0', fontSize: '48px', fontWeight: 900, letterSpacing: '-2px' }}>{profile.username}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
              {profile.followers_count?.toLocaleString()} {t('followers')} • {profile.track_count} {t('tracks')} • {profile.city || 'Universe'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--border-dim)', marginBottom: '32px' }}>
          <button
            onClick={() => setArtistTab('tracks')}
            style={{
              background: 'none',
              border: 'none',
              color: artistTab === 'tracks' ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '18px',
              fontWeight: 800,
              padding: '12px 0',
              cursor: 'pointer',
              borderBottom: artistTab === 'tracks' ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'var(--transition-fast)'
            }}
          >
            {t('tracks')}
          </button>
          <button
            onClick={() => setArtistTab('playlists')}
            style={{
              background: 'none',
              border: 'none',
              color: artistTab === 'playlists' ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '18px',
              fontWeight: 800,
              padding: '12px 0',
              cursor: 'pointer',
              borderBottom: artistTab === 'playlists' ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'var(--transition-fast)'
            }}
          >
            {t('playlists')} ({artistPlaylists?.length || 0})
          </button>
          <button
            onClick={() => setArtistTab('likes')}
            style={{
              background: 'none',
              border: 'none',
              color: artistTab === 'likes' ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '18px',
              fontWeight: 800,
              padding: '12px 0',
              cursor: 'pointer',
              borderBottom: artistTab === 'likes' ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'var(--transition-fast)'
            }}
          >
            {t('recent')} ({artistLikes?.length || 0})
          </button>
        </div>
        <div className="track-grid">
          {artistTab === 'tracks' ? (
            artistTracks.map(track => renderTrackCard(track, artistTracks))
          ) : artistTab === 'playlists' ? (
            artistPlaylists?.length > 0 ? (
              artistPlaylists.map(playlist => renderTrackCard(playlist))
            ) : (
              <div style={{ color: 'var(--text-secondary)', gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>{t('noPlaylists')}</div>
            )
          ) : (
            artistLikes.length > 0 ? (
              artistLikes.map(track => renderTrackCard(track, artistLikes))
            ) : (
              <div style={{ color: 'var(--text-secondary)', gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>{t('noLikes')}</div>
            )
          )}
        </div>
      </div >
    );
  };
  const renderTrackDetailView = () => {
    if (!viewingTrack) return null;
    const isPlayingThis = currentTrack && String(currentTrack.id) === String(viewingTrack.id);
    return (
      <div className="content" style={{ padding: 0 }}>
        <div style={{
          minHeight: '340px',
          background: `linear-gradient(135deg, ${viewingTrack.user?.avatar_url ? '#1a1a1a' : '#333'}, #000)`,
          padding: '30px',
          position: 'relative',
          display: 'flex',
          gap: '30px',
          color: 'white',
          alignItems: 'flex-start'
        }}>
          { }
          {viewingTrack.artwork_url && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `url(${viewingTrack.artwork_url.replace('large', 't500x500')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(60px) brightness(0.3)',
              zIndex: 0
            }} />
          )}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 1, height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: 'auto' }}>
              <button
                className="play-btn-large"
                onClick={() => isPlayingThis ? togglePlay() : playTrackSecure(viewingTrack)}
                style={{
                  width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                }}
              >
                {isPlayingThis && isPlaying ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <div>
                <h1 style={{ fontSize: '28px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', margin: '0 0 8px 0', fontWeight: 900 }}>{viewingTrack.title}</h1>
                <h2
                  onClick={() => { setViewingTrack(null); openArtist(viewingTrack.user); }}
                  title="View Artist Profile"
                  style={{ fontSize: '18px', color: '#eee', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', margin: 0, width: 'fit-content', cursor: 'pointer' }}
                >
                  {viewingTrack.user?.username}
                </h2>
              </div>
            </div>
            { }
            <div style={{ height: '100px', marginTop: '40px', position: 'relative', overflow: 'hidden' }}>
              <canvas
                ref={headerCanvasRef}
                onClick={handleHeaderSeek}
                style={{ width: '100%', height: '100%', cursor: 'pointer' }}
              />
            </div>
          </div>
          { }
          <div style={{ width: '300px', height: '300px', flexShrink: 0, zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <img
              src={viewingTrack.artwork_url ? viewingTrack.artwork_url.replace('large', 't500x500') : placeholderImg}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt="Artwork"
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', padding: '40px' }}>
          <div>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '30px', borderBottom: '1px solid var(--border-dim)' }}>
              <button
                onClick={() => setActiveDetailTab('info')}
                style={{
                  padding: '0 0 12px 0',
                  background: 'none', border: 'none',
                  borderBottom: activeDetailTab === 'info' ? '2px solid var(--primary)' : '2px solid transparent',
                  color: activeDetailTab === 'info' ? 'var(--text-main)' : 'var(--text-secondary)',
                  fontWeight: 700, cursor: 'pointer', fontSize: '14px'
                }}
              >
                Info & Comments
              </button>
              <button
                onClick={() => { setActiveDetailTab('lyrics'); fetchLyrics(); }}
                style={{
                  padding: '0 0 12px 0',
                  background: 'none', border: 'none',
                  borderBottom: activeDetailTab === 'lyrics' ? '2px solid var(--primary)' : '2px solid transparent',
                  color: activeDetailTab === 'lyrics' ? 'var(--text-main)' : 'var(--text-secondary)',
                  fontWeight: 700, cursor: 'pointer', fontSize: '14px'
                }}
              >
                Lyrics
              </button>
            </div>
            {activeDetailTab === 'info' ? (
              <>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '20px' }}>
                  <button
                    className={`action-btn ${isLiked(viewingTrack) ? 'active' : ''}`}
                    onClick={(e) => handleToggleLike(e, viewingTrack)}
                    style={{
                      background: isLiked(viewingTrack) ? 'var(--primary)' : 'var(--bg-elevated)',
                      color: isLiked(viewingTrack) ? 'white' : 'var(--text-main)',
                      border: '1px solid var(--border-dim)',
                      padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px'
                    }}
                  >
                    {isLiked(viewingTrack) ? '♥ Liked' : '♡ Like'}
                  </button>
                  <button style={{ background: 'var(--bg-elevated)', color: 'var(--text-main)', border: '1px solid var(--border-dim)', padding: '8px 16px', borderRadius: '4px', cursor: 'not-allowed', opacity: 0.7, fontSize: '13px' }}>Repost</button>
                  <button style={{ background: 'var(--bg-elevated)', color: 'var(--text-main)', border: '1px solid var(--border-dim)', padding: '8px 16px', borderRadius: '4px', cursor: 'not-allowed', opacity: 0.7, fontSize: '13px' }}>Share</button>
                </div>
                {viewingTrack.description && (
                  <div style={{ marginBottom: '40px', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                    {viewingTrack.description}
                  </div>
                )}
                <h3 style={{ borderBottom: '1px solid var(--border-dim)', paddingBottom: '10px', marginBottom: '20px' }}>
                  {trackComments.length} comments
                </h3>
                <div className="comments-list">
                  {trackComments.length > 0 ? trackComments.map(c => (
                    <div key={c.id} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                      <img
                        src={c.user?.avatar_url}
                        onClick={() => { setViewingTrack(null); openArtist(c.user); }}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
                        alt="User"
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                          <span
                            onClick={() => { setViewingTrack(null); openArtist(c.user); }}
                            style={{ color: 'var(--text-main)', fontWeight: 700, marginRight: '8px', cursor: 'pointer' }}
                          >
                            {c.user?.username}
                          </span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Just now'} at {formatTime((c.timestamp || 0) / 1000)}</span>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '14px' }}>{c.body}</p>
                      </div>
                    </div>
                  )) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No comments yet.</p>
                  )}
                </div>
              </>
            ) : (
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '16px', color: 'var(--text-main)' }}>
                {loadingLyrics ? (
                  <div style={{ color: 'var(--text-secondary)' }}>Searching Genius...</div>
                ) : (
                  <>
                    {lyrics ? (
                      <>
                        {lyrics}
                        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-dim)', paddingTop: '20px' }}>
                          <button
                            onClick={() => fetchLyrics(viewingTrack.title)}
                            style={{ background: 'none', border: '1px solid var(--border-dim)', color: 'var(--text-secondary)', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', borderRadius: '4px' }}
                          >
                            Not correct? Search with full title
                          </button>
                        </div>
                      </>
                    ) : (
                      <div style={{ color: 'var(--text-secondary)' }}>
                        Lyrics not found.
                        <br />
                        <button
                          onClick={() => fetchLyrics(viewingTrack.title)}
                          style={{ marginTop: '10px', background: 'var(--primary)', border: 'none', color: 'white', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', borderRadius: '4px' }}
                        >
                          Search again with full title
                        </button>
                      </div>
                    )}
                  </>
                )}
                <div style={{ marginTop: '40px', fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.5 }}>
                  Lyrics provided by Genius.com
                </div>
              </div>
            )}
          </div>
          <div>
            <div
              onClick={() => { setViewingTrack(null); openArtist(viewingTrack.user); }}
              style={{ background: 'var(--bg-elevated)', padding: '20px', borderRadius: '8px', marginBottom: '30px', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
            >
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Artist</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={viewingTrack.user?.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Artist" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{viewingTrack.user?.username}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{viewingTrack.user?.followers_count?.toLocaleString()} followers</div>
                </div>
              </div>
            </div>
            {trackLikers.length > 0 && (
              <div style={{ background: 'var(--bg-elevated)', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Fans</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {trackLikers.map(u => (
                    <div
                      key={u.id}
                      title={u.username}
                      onClick={() => { setViewingTrack(null); openArtist(u); }}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--bg-panel)', cursor: 'pointer' }}
                    >
                      <img src={u.avatar_url} style={{ width: '100%', height: '100%' }} alt={u.username} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  const renderAnalytics = () => {
    if (!trackStats || trackStats.length === 0) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '20px' }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <h2>{t('noHistory')}</h2>
          <p>{t('playMusicToTaste')}</p>
        </div>
      );
    }
    const trackCounts = {};
    const artistCounts = {};
    let totalSeconds = 0;
    trackStats.forEach(play => {
      const trackKey = `${play.title} - ${play.artist}`;
      trackCounts[trackKey] = (trackCounts[trackKey] || 0) + 1;
      artistCounts[play.artist] = (artistCounts[play.artist] || 0) + 1;
      totalSeconds += (play.duration || 0);
    });
    const topTracks = Object.entries(trackCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const topArtists = Object.entries(artistCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return (
      <div className="analytics-view" style={{ padding: '0 20px 100px 20px', animation: 'fadeIn 0.5s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>{t('statsTitle')}</h1>
          <button
            onClick={() => {
              if (window.confirm(t('clearStats') + '?')) {
                window.electronAPI.clearStats().then(setTrackStats);
              }
            }}
            className="view-all-btn"
            style={{ padding: '8px 16px', background: 'var(--bg-hover)', border: '1px solid var(--border-dim)' }}
          >
            {t('clearStats')}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          <div style={{ background: 'var(--bg-panel)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-dim)' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('totalTime')}</span>
            <div style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0', color: 'var(--primary)' }}>
              {Math.floor(totalSeconds / 3600)} {t('hours')} {Math.floor((totalSeconds % 3600) / 60)} {t('minutes')}
            </div>
          </div>
          <div style={{ background: 'var(--bg-panel)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-dim)' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('tracksPlayed')}</span>
            <div style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0', color: 'white' }}>
              {trackStats.length}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
          <section>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
              {t('topTracks')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topTracks.map(([key, count], i) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-hover)', padding: '12px 16px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 900, opacity: 0.2, minWidth: '24px' }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{key.split(' - ')[0]}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{key.split(' - ')[1]}</div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', background: 'rgba(255,85,0,0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                    {count} plays
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
              {t('topArtists')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topArtists.map(([name, count], i) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-hover)', padding: '12px 16px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 900, opacity: 0.2, minWidth: '24px' }}>{i + 1}</span>
                  <div style={{ flex: 1, fontWeight: 700, fontSize: '14px' }}>{name}</div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'white', opacity: 0.6 }}>
                    {count} plays
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  };
  const renderContent = () => {
    if (viewingTrack) return renderTrackDetailView();
    if (selectedPlaylist) return renderPlaylistView();
    if (selectedArtist) return renderArtistView();
    switch (activeTab) {
      case 'Home':
        return (
          <section className="content" onScroll={handleScroll}>
            {loading && tracks.length === 0 && playlists.length === 0 && artists.length === 0 ? (
              renderSkeletonGrid()
            ) : (searchType === 'all') ? (
              <div className="search-results-combined">
                {(tracks || []).length > 0 && (
                  <div className="search-section">
                    <h2 style={{ padding: '20px 0 16px 0', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" /></svg>
                      {t('tracks')}
                    </h2>
                    <div className="track-grid">
                      {(tracks || []).slice(0, 10).map(track => renderTrackCard(track))}
                    </div>
                    {tracks.length > 10 && (
                      <button className="view-all-btn" onClick={() => setSearchType('tracks')}>{t('viewAll')} →</button>
                    )}
                  </div>
                )}
                {(playlists || []).length > 0 && (
                  <div className="search-section">
                    <h2 style={{ padding: '20px 0 16px 0', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                      {t('playlists')}
                    </h2>
                    <div className="track-grid">
                      {(playlists || []).slice(0, 5).map(playlist => renderTrackCard(playlist))}
                    </div>
                    {playlists.length > 5 && (
                      <button className="view-all-btn" onClick={() => setSearchType('playlists')}>{t('viewAll')} →</button>
                    )}
                  </div>
                )}
                {(artists || []).length > 0 && (
                  <div className="search-section">
                    <h2 style={{ padding: '20px 0 16px 0', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                      {t('artists')}
                    </h2>
                    <div className="track-grid">
                      {(artists || []).slice(0, 5).map(artist => renderArtistCard(artist))}
                    </div>
                    {artists.length > 5 && (
                      <button className="view-all-btn" onClick={() => setSearchType('artists')}>{t('viewAll')} →</button>
                    )}
                  </div>
                )}
              </div>
            ) : (tracks.length > 0 || playlists.length > 0 || artists.length > 0) ? (
              <div className="track-grid">
                {searchType === 'tracks' && tracks.map(track => renderTrackCard(track))}
                {searchType === 'playlists' && playlists.map(playlist => renderTrackCard(playlist))}
                {searchType === 'artists' && artists.map(artist => renderArtistCard(artist))}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80%',
                color: 'var(--text-main)',
              }}>
                <div style={{ background: 'var(--bg-panel)', padding: '40px', borderRadius: '40px', textAlign: 'center', border: '1px solid var(--border-dim)' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1" style={{ marginBottom: '24px', opacity: 0.5 }}><path d="m2 9 3 3 3-3M9 15h10M19 15l-3-3m3 3-3 3" /></svg>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>{t('startListening')}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>{t('startListeningDesc')}</p>
                </div>
              </div>
            )}
            {loading && tracks.length > 0 && <div style={{ color: 'var(--text-secondary)', padding: '40px', textAlign: 'center', fontWeight: 600 }}>{t('loadingMore')}</div>}
          </section>
        );
      case 'Discover':
        const recentTracks = (history || []).filter(item => item && (item.kind === 'track' || !item.kind)).slice(0, 10);
        const recentPlaylists = (history || []).filter(item => item && item.kind === 'playlist').slice(0, 10);
        return (
          <div className="content" style={{ padding: '40px', color: 'var(--text-main)' }}>
            <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: 900 }}>{t('discover')}</h1>
            {recommendations.length > 0 && renderHorizontalList(recommendations, t('forYou'), t('basedOnTaste'))}
            {(charts || []).length > 0 && renderHorizontalList(charts.slice(0, 20), t('globalTop50'), t('trendingNow'))}
            {recentTracks.length > 0 && renderHorizontalList(recentTracks, t('recentlyPlayed'))}
            {recentPlaylists.length > 0 && renderHorizontalList(recentPlaylists, t('recentPlaylists'))}
            {recommendations.length === 0 && !loading && (
              <div style={{ opacity: 0.5, padding: '40px', textAlign: 'center', background: 'var(--bg-panel)', borderRadius: '20px' }}>
                <h3>{t('noRecommendations')}</h3>
                <p>{t('playMusicToTaste')}</p>
              </div>
            )}
          </div>
        );
      case 'Library':
        const displayTracks = (filteredLikedTracks || []).slice(0, libraryDisplayLimit);
        return (
          <section
            className="content"
            onScroll={(e) => {
              if (e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 400) {
                if (libraryDisplayLimit < filteredLikedTracks.length) {
                  setLibraryDisplayLimit(prev => Math.min(prev + 50, filteredLikedTracks.length));
                }
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0 16px 0' }}>
              <h2 style={{ margin: 0 }}>{t('likedTracksTitle')} <span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>({likedTracks.length})</span></h2>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={likedTracksQuery}
                onChange={(e) => setLikedTracksQuery(e.target.value)}
                className="search-input-minimal"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  color: 'var(--text-main)',
                  width: '240px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
            {displayTracks.length > 0 ? (
              <div className="track-grid">
                {displayTracks.map(track => renderTrackCard(track))}
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                <p>{likedTracks.length > 0 ? 'No matches found' : t('noLikedTracks')}</p>
              </div>
            )}
            {libraryDisplayLimit < filteredLikedTracks.length && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
                Loading more...
              </div>
            )}
          </section>
        );

      case 'Player':
        if (!currentTrack) {
          return (
            <div className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: 'var(--text-secondary)' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.5, marginBottom: '20px' }}><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
              <h2>{t('nothingPlaying')}</h2>
              <p>{t('startListeningDesc')}</p>
            </div>
          );
        }

        const queue = currentQueue;
        let nextTracks = [];
        if (queue && queue.length > 0) {
          const currentIndex = queue.findIndex(t => String(t.id) === String(currentTrack.id));
          if (currentIndex !== -1) {
            nextTracks = queue.slice(currentIndex + 1);
          }
        }

        return (
          <div className="content" style={{ padding: 0, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
            {/* Player Section - Takes up more vertical space (~2/3) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              position: 'relative',
              minHeight: '65vh',
              boxSizing: 'border-box'
            }}>
              {/* Background Blur */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `url(${currentTrack.artwork_url ? currentTrack.artwork_url.replace('-large', '-t500x500') : placeholderImg})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'blur(80px) brightness(0.25)', zIndex: 0
              }} />

              {/* Inner container for horizontal layout of artwork + controls */}
              <div style={{ zIndex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '60px', width: '100%', maxWidth: '900px', justifyContent: 'center' }}>
                {/* Artwork */}
                <div style={{
                  width: '320px',
                  height: '320px',
                  flexShrink: 0,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <img
                    src={currentTrack.artwork_url ? currentTrack.artwork_url.replace('-large', '-t500x500') : placeholderImg}
                    alt={currentTrack.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Controls */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '300px' }}>
                  <div>
                    <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '8px', lineHeight: 1.1 }}>{currentTrack.title}</h1>
                    <h2
                      onClick={() => { setActiveTab('Discover'); setViewingTrack(null); openArtist(currentTrack.user); }}
                      style={{ fontSize: '20px', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500 }}
                    >
                      {currentTrack.user?.username || 'Unknown Artist'}
                    </h2>
                  </div>

                  {/* Seek Bar */}
                  <div className="progress-container" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '16px', cursor: 'default' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', minWidth: '40px', fontVariantNumeric: 'tabular-nums' }}>{formatTime(seek)}</span>
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={seek}
                      onChange={handleSeek}
                      className="seek-slider"
                      style={{
                        flex: 1,
                        margin: 0,
                        height: '6px',
                        background: `linear-gradient(to right, var(--primary) ${(seek / duration) * 100}%, rgba(255,255,255,0.1) ${(seek / duration) * 100}%)`,
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', minWidth: '40px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatTime(duration)}</span>
                  </div>

                  {/* Main Buttons Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '10px' }}>
                    <button className="icon-btn" onClick={toggleShuffle} style={{ color: isShuffled ? 'var(--primary)' : 'var(--text-secondary)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
                    </button>
                    <button className="icon-btn" onClick={playPrevious}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
                    </button>
                    <button
                      onClick={togglePlay}
                      style={{
                        width: '72px', height: '72px', borderRadius: '50%', background: 'var(--primary)', color: 'white', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        transition: 'transform 0.1s', flexShrink: 0
                      }}
                    >
                      {isPlaying ? (
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                      ) : (
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                      )}
                    </button>
                    <button className="icon-btn" onClick={playNext}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="m6 18 8.5-6L6 6zM16 6v12h2V6z" /></svg>
                    </button>
                    <button className="icon-btn" onClick={toggleLoop} style={{ color: isLooping ? 'var(--primary)' : 'var(--text-secondary)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                    </button>
                  </div>

                  {/* Secondary Controls Row (Like, Gear, Volume) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
                    {/* Like Button */}
                    <button
                      className={`icon-btn ${isLiked(currentTrack) ? 'liked' : ''}`}
                      onClick={(e) => handleToggleLike(e, currentTrack)}
                      title={isLiked(currentTrack) ? "Unlike" : "Like"}
                      style={{ color: isLiked(currentTrack) ? 'var(--primary)' : 'var(--text-secondary)' }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill={isLiked(currentTrack) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    </button>

                    {/* Gear / Options */}
                    <div className="rate-menu-container" style={{ position: 'relative' }}>
                      <button
                        className="icon-btn"
                        onClick={(e) => { e.stopPropagation(); setTrackMenuOpen(!trackMenuOpen); }}
                        onMouseDown={(e) => e.stopPropagation()}
                        title="Track Options"
                        style={{ color: trackMenuOpen || playbackRate !== 1 ? 'var(--primary)' : 'var(--text-secondary)' }}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                      </button>
                      {trackMenuOpen && (
                        <div className="rate-menu" style={{
                          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                          marginBottom: '20px', minWidth: '220px', background: '#1c1c1f',
                          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '12px',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.7)', zIndex: 100,
                          animation: 'fadeIn 0.1s ease-out'
                        }} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>

                          {/* Pointer Arrow (Pointing Down) */}
                          <div style={{
                            position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)',
                            width: '12px', height: '12px', background: '#1c1c1f', borderRight: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)',
                            zIndex: 101, borderRadius: '0 0 2px 0'
                          }}></div>

                          <div style={{ position: 'relative', zIndex: 102, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <button className="menu-btn" style={{
                              display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 12px',
                              background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
                              borderRadius: '8px', textAlign: 'left', fontSize: '14px', transition: 'background 0.2s',
                              fontWeight: 500
                            }}
                              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                              onClick={(e) => { handleStartStation(e, currentTrack); setTrackMenuOpen(false); }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                              <span>{t('startStation')}</span>
                            </button>
                            <button className="menu-btn" style={{
                              display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 12px',
                              background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
                              borderRadius: '8px', textAlign: 'left', fontSize: '14px', transition: 'background 0.2s',
                              fontWeight: 500
                            }}
                              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                              onClick={(e) => { handleShare(e, currentTrack); setTrackMenuOpen(false); }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                              <span>{t('shareCard')}</span>
                            </button>

                            <div style={{ margin: '8px -12px 0 -12px', background: 'rgba(255,255,255,0.08)', height: '1px' }}></div>

                            <div style={{ paddingTop: '10px', paddingLeft: '4px', paddingRight: '4px' }}>
                              <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('playbackSpeed')}</span>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: '#d1d5db' }}>
                                {[0.5, 1.0, 1.5, 2.0].map(r => (
                                  <span key={r} onClick={() => handleRateChange(r)} style={{
                                    cursor: 'pointer',
                                    color: playbackRate === r ? 'var(--primary)' : 'inherit',
                                    fontWeight: playbackRate === r ? 800 : 400,
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    background: playbackRate === r ? 'rgba(255,85,0,0.1)' : 'transparent'
                                  }}>{r}x</span>
                                ))}
                              </div>
                              <input
                                type="range"
                                min="0.5"
                                max="2.0"
                                step="0.05"
                                value={playbackRate}
                                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                                className="rate-slider"
                                style={{ width: '100%', height: '4px', cursor: 'grab' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Volume */}
                    <div className="volume-section" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '140px' }}>
                      <button className="icon-btn" onClick={() => setVolume(volume === 0 ? 1 : 0)} style={{ padding: '0', color: volume === 0 ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
                        {volume === 0 ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                        ) : volume < 0.5 ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={e => setVolume(Number(e.target.value))}
                        className="volume-slider-minimal"
                        style={{
                          background: `linear-gradient(to right, var(--text-main) ${volume * 100}%, var(--bg-hover) ${volume * 100}%)`,
                          flex: 1, height: '4px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Queue Section - Full Width */}
            <div style={{
              width: '100%',
              background: 'var(--bg-dark)',
              position: 'relative',
              zIndex: 2,
              padding: '40px',
              borderTop: '1px solid var(--border-dim)',
              minHeight: '35vh'
            }}>
              <div style={{ maxWidth: '100%', margin: '0 40px' }}> {/* Wide container */}
                <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--border-dim)', marginBottom: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>Up Next</h3>
                </div>
                <div className="track-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {nextTracks.length > 0 ? nextTracks.map((track, i) => (
                    <div
                      key={`${track.id}-${i}`}
                      className="track-list-item"
                      onClick={() => playTrackSecure(track, queue)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', borderRadius: '12px',
                        cursor: 'pointer', transition: 'background 0.2s', background: 'var(--bg-panel)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-panel)'}
                    >
                      <img
                        src={track.artwork_url ? track.artwork_url.replace('large', 't500x500') : placeholderImg}
                        style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                        alt=""
                      />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 700, fontSize: '18px', color: 'var(--text-main)', marginBottom: '4px' }}>{track.title}</div>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '14px', color: 'var(--text-secondary)' }}>{track.user?.username}</div>
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {formatTime((track.duration || track.full_duration) / 1000)}
                      </div>
                    </div>
                  )) : (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-panel)', borderRadius: '16px' }}>
                      {settings.flowMode ? (
                        <>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--primary)" style={{ marginBottom: '16px', opacity: 0.8 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                          <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>Flow Mode Active</h3>
                          <p style={{ margin: 0, opacity: 0.7, fontSize: '15px' }}>We'll play similar tracks automatically.</p>
                        </>
                      ) : (
                        <p style={{ fontSize: '15px' }}>End of queue. enable Flow Mode to keep playing.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'Playlists':
        return (
          <section className="content">
            <h2 style={{ padding: '20px 0 0 0', margin: 0 }}>{t('likedPlaylistsTitle')}</h2>
            {likedPlaylists.length > 0 ? (
              <div className="track-grid">
                {likedPlaylists.map(playlist => renderTrackCard(playlist))}
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                <p>{t('noLikedPlaylists')}</p>
              </div>
            )}
          </section>
        );
      case 'Analytics':
        return (
          <section className="content">
            {renderAnalytics()}
          </section>
        );
      default:
        return null;
    }
  };
  const renderSettingsModal = () => {
    if (!settingsOpen) return null;
    return (
      <div className="modal-overlay" onClick={() => setSettingsOpen(false)}>
        <div className="settings-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{t('settings')}</h2>
            <button className="close-modal" onClick={() => setSettingsOpen(false)}>✕</button>
          </div>
          <div className="modal-content">
            <div className="settings-grid">
              { }
              <div className="settings-col">
                <div className="setting-section-header" style={{ marginBottom: '10px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Appearance
                </div>
                <div className="setting-item" style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
                  <div>
                    <h3>{t('theme')}</h3>
                    <p>{t('themeDesc')}</p>
                  </div>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                    style={{ width: '100%', marginBottom: '16px' }}
                  >
                    <option value="Deep Space">{t('themeDeepSpace')}</option>
                    <option value="Sunset">{t('themeSunset')}</option>
                    <option value="Emerald">{t('themeEmerald')}</option>
                    <option value="Pink Noir">{t('themePinkNoir')}</option>
                    <option value="Soft Pink">{t('themeSoftPink')}</option>
                    <option value="Old School">{t('themeOldSchool')}</option>
                    <option value="Windows 7">{t('themeWindows7')}</option>
                    <option value="Windows XP">{t('themeWindowsXP')}</option>
                    <option value="iPod Classic">{t('themeIPod')}</option>
                    <option value="Eclipse">{t('themeEclipse')}</option>
                    <option value="Custom">{t('themeCustom')}</option>
                  </select>
                  {settings.theme === 'Custom' && (
                    <div className="custom-theme-editor" style={{ width: '100%', background: 'var(--bg-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-dim)' }}>
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Theme Editor</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                        {[
                          { label: 'Primary', key: 'primary' },
                          { label: 'Background', key: 'bgDark' },
                          { label: 'Panel BG', key: 'bgPanel' },
                          { label: 'Element BG', key: 'bgElevated' },
                          { label: 'Hover BG', key: 'bgHover' },
                          { label: 'Text Main', key: 'textMain' },
                          { label: 'Text Dim', key: 'textSecondary' },
                          { label: 'Text Muted', key: 'textMuted' },
                          { label: 'Border', key: 'borderDim' },
                          { label: 'Logo Text', key: 'logoColor' },
                          { label: 'Visualizer', key: 'visColor' },
                          { label: 'Glass BG', key: 'glassBg' },
                          { label: 'Glass Border', key: 'glassBorder' },
                        ].map(field => (
                          <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{field.label}</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="color"
                                value={settings.customTheme?.[field.key] || '#000000'}
                                onChange={(e) => {
                                  const newCustomTheme = { ...settings.customTheme, [field.key]: e.target.value };
                                  setSettings({ ...settings, customTheme: newCustomTheme });
                                }}
                                style={{
                                  width: '32px', height: '32px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'none'
                                }}
                              />
                              <input
                                type="text"
                                value={settings.customTheme?.[field.key] || ''}
                                onChange={(e) => {
                                  const newCustomTheme = { ...settings.customTheme, [field.key]: e.target.value };
                                  setSettings({ ...settings, customTheme: newCustomTheme });
                                }}
                                style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-dim)', color: 'var(--text-main)', fontSize: '12px', padding: '4px 8px', borderRadius: '4px' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>{t('placeholderUrl')}</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={settings.customTheme?.placeholder || ''}
                            onChange={(e) => {
                              const newCustomTheme = { ...settings.customTheme, placeholder: e.target.value };
                              setSettings({ ...settings, customTheme: newCustomTheme });
                            }}
                            placeholder="https://example.com/image.png"
                            style={{ flex: 1, background: 'var(--bg-dark)', border: '1px solid var(--border-dim)', color: 'var(--text-main)', fontSize: '12px', padding: '6px 8px', borderRadius: '4px' }}
                          />
                          <button
                            onClick={handleSelectPlaceholder}
                            style={{
                              padding: '0 12px',
                              background: 'var(--bg-hover)',
                              border: '1px solid var(--border-dim)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              color: 'var(--text-main)'
                            }}
                            title={t('upload')}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                          </button>
                        </div>
                      </div>
                      { }
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                        <button
                          onClick={() => {
                            const themeCode = btoa(JSON.stringify(settings.customTheme));
                            navigator.clipboard.writeText(themeCode);
                            alert('Theme code copied to clipboard! Share it with friends.');
                          }}
                          style={{ flex: 1, padding: '8px', background: 'var(--bg-hover)', border: '1px solid var(--border-dim)', color: 'var(--text-main)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                        >
                          Export (Copy)
                        </button>
                        <button
                          onClick={() => {
                            const code = prompt('Paste theme code here:');
                            if (code) {
                              try {
                                const imported = JSON.parse(atob(code));
                                setSettings({ ...settings, customTheme: imported });
                              } catch (e) {
                                alert('Invalid theme code');
                              }
                            }
                          }}
                          style={{ flex: 1, padding: '8px', background: 'var(--bg-hover)', border: '1px solid var(--border-dim)', color: 'var(--text-main)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                        >
                          Import
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Reset custom theme to defaults?')) {
                              setSettings({
                                ...settings, customTheme: {
                                  primary: '#ff5500',
                                  bgDark: '#000000',
                                  bgPanel: '#121214',
                                  bgElevated: '#1c1c1f',
                                  textMain: '#ffffff',
                                  textSecondary: '#a1a1aa'
                                }
                              });
                            }
                          }}
                          style={{ flex: 1, padding: '8px', background: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.2)', color: '#ff4444', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                        >
                          Reset Default
                        </button>
                      </div>
                      { }
                      <div style={{ borderTop: '1px solid var(--border-dim)', paddingTop: '20px' }}>
                        <button
                          onClick={handleCustomBackground}
                          style={{
                            width: '100%',
                            background: 'var(--bg-hover)',
                            border: '1px solid var(--border-dim)',
                            borderRadius: '8px',
                            padding: '10px',
                            color: 'var(--text-main)',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                          {t('uploadBackground')}
                        </button>
                        <div style={{ marginTop: '12px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>{t('backgroundFit')}</label>
                          <select
                            value={settings.backgroundFit || 'cover'}
                            onChange={(e) => setSettings({ ...settings, backgroundFit: e.target.value })}
                            style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-dim)', padding: '6px', borderRadius: '4px', color: 'var(--text-main)' }}
                          >
                            <option value="cover">{t('bgCover')}</option>
                            <option value="contain">{t('bgContain')}</option>
                            <option value="100% 100%">{t('bgFill')}</option>
                          </select>
                        </div>
                      </div>
                      { }
                      <div style={{ borderTop: '1px solid var(--border-dim)', paddingTop: '20px', marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Card Size</label>
                          <span style={{ fontSize: '11px', color: 'var(--text-main)', fontWeight: 600 }}>{settings.customTheme?.cardSize || 180}px</span>
                        </div>
                        <input
                          type="range"
                          min="120"
                          max="300"
                          step="10"
                          value={settings.customTheme?.cardSize || 180}
                          onChange={(e) => {
                            const newCustomTheme = { ...settings.customTheme, cardSize: parseInt(e.target.value) };
                            setSettings({ ...settings, customTheme: newCustomTheme });
                          }}
                          style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>{t('visualizer')}</h3>
                    <p>{t('visualizerDesc')}</p>
                  </div>
                  <select
                    value={settings.visualizerStyle || 'Bars'}
                    onChange={(e) => setSettings({ ...settings, visualizerStyle: e.target.value })}
                  >
                    <option value="Bars">{t('visBars')}</option>
                    <option value="Waveform">{t('visWave')}</option>
                    <option value="Mirrored">{t('visMirrored')}</option>
                    <option value="Circles">{t('visCircles')}</option>
                    <option value="Particles">Particles (Background)</option>
                    <option value="Frequency">Frequency (Background)</option>
                  </select>
                </div>
                <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div className="setting-info">
                      <h3>{t('visPos')}</h3>
                      <p>{t('visualizerDesc')}</p>
                    </div>
                    <select
                      value={settings.visualizerPosition || 'Center'}
                      onChange={(e) => setSettings({ ...settings, visualizerPosition: e.target.value })}
                      style={{ width: '120px' }}
                    >
                      <option value="Center">{t('visPosCenter')}</option>
                      <option value="Left">{t('visPosLeft')}</option>
                      <option value="Right">{t('visPosRight')}</option>
                      <option value="Custom">{t('visPosCustom')}</option>
                    </select>
                  </div>
                  {settings.visualizerPosition === 'Custom' && (
                    <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '12px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { label: t('visPosX'), key: 'visCustomX', min: 0, max: 100, step: 1, unit: '%' },
                        { label: t('visPosY'), key: 'visCustomY', min: 0, max: 100, step: 1, unit: '%' },
                        { label: t('visWidth'), key: 'visCustomWidth', min: 50, max: 1200, step: 10, unit: 'px' },
                        { label: t('visHeight'), key: 'visCustomHeight', min: 20, max: 400, step: 5, unit: 'px' },
                      ].map(slider => (
                        <div key={slider.key}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                            <span>{slider.label}</span>
                            <span>{settings[slider.key]}{slider.unit}</span>
                          </div>
                          <input
                            type="range"
                            min={slider.min}
                            max={slider.max}
                            step={slider.step}
                            value={settings[slider.key]}
                            onChange={(e) => setSettings({ ...settings, [slider.key]: parseInt(e.target.value) })}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>{t('sidebarMode')}</h3>
                    <p>{t('sidebarModeDesc')}</p>
                  </div>
                  <select
                    value={settings.sidebarMode || 'Standard'}
                    onChange={(e) => setSettings({ ...settings, sidebarMode: e.target.value })}
                  >
                    <option value="Standard">{t('sidebarStandard')}</option>
                    <option value="Compact">{t('sidebarCompact')}</option>
                    <option value="Slim">{t('sidebarSlim')}</option>
                  </select>
                </div>
                <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-dim)' }}>
                  <div className="setting-info">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><path d="M4 7V4h16v3M9 20h6M12 4v16" /></svg>
                      {t('customFont')}
                    </h3>
                    <p>{t('customFontDesc')}</p>
                  </div>
                  {settings.customFont && (
                    <div style={{ fontSize: '11px', color: 'var(--primary)', background: 'rgba(255,85,0,0.1)', padding: '6px 10px', borderRadius: '6px', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Active: {decodeURIComponent(settings.customFont.split('/').pop())}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                    <button
                      onClick={handleSelectFont}
                      style={{
                        flex: 1,
                        background: 'var(--primary)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(255,85,0,0.2)'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                      {t('uploadFont')}
                    </button>
                    {settings.customFont && (
                      <button
                        onClick={handleResetFont}
                        style={{
                          background: 'var(--bg-hover)',
                          border: '1px solid var(--border-dim)',
                          borderRadius: '8px',
                          padding: '0 15px',
                          color: 'var(--text-secondary)',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {t('resetFont')}
                      </button>
                    )}
                  </div>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>{t('dynamicBg')}</h3>
                    <p>{t('dynamicBgDesc')}</p>
                  </div>
                  <div
                    className={`toggle-switch ${settings.dynamicBg ? 'active' : ''}`}
                    onClick={() => setSettings({ ...settings, dynamicBg: !settings.dynamicBg })}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>{t('language')}</h3>
                    <p>{t('languageDesc')}</p>
                  </div>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="setting-section-header" style={{ marginBottom: '10px', marginTop: '20px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Account
                </div>
                <div className="setting-item sc-connect-section" style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  background: 'rgba(255, 106, 0, 0.05)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 106, 0, 0.1)',
                  marginBottom: '10px'
                }}>
                  <div className="setting-info" style={{ marginBottom: '12px', width: '100%' }}>
                    <h3 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {t('scConnect')}
                      {scUser && (
                        <span style={{ fontSize: '11px', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Connected</span>
                      )}
                    </h3>
                    <p>{t('scConnectDesc')}</p>
                  </div>
                  {scUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px', background: 'var(--bg-hover)', padding: '10px 12px', borderRadius: '10px' }}>
                      <img src={scUser.avatar_url} style={{ width: '36px', height: '36px', borderRadius: '50%' }} alt="Avatar" />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>{scUser.username}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{t('scConnectedAs')}</p>
                      </div>
                      <button onClick={handleSCDisconnect} style={{ background: 'rgba(255,68,68,0.1)', border: 'none', color: '#ff4444', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
                        {t('scDisconnect')}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleSCConnect}
                      style={{
                        width: '100%',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                      {t('scLogin')}
                    </button>
                  )}
                </div>
                <div className="setting-item sc-import-section" style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  background: 'var(--bg-hover)',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '10px'
                }}>
                  <div className="setting-info" style={{ marginBottom: '12px' }}>
                    <h3>{t('importTitle')}</h3>
                    <p>{t('importDesc')}</p>
                  </div>
                  <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="https://soundcloud.com/your-profile"
                      value={scProfileUrl}
                      onChange={(e) => setScProfileUrl(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'var(--bg-panel)',
                        border: '1px solid var(--border-dim)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '13px'
                      }}
                    />
                    <button
                      onClick={handleImportLikes}
                      disabled={isImporting}
                      style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0 16px',
                        fontWeight: 700,
                        cursor: isImporting ? 'not-allowed' : 'pointer',
                        opacity: isImporting ? 0.6 : 1,
                        fontSize: '13px'
                      }}
                    >
                      {isImporting ? '...' : 'Import'}
                    </button>
                  </div>
                </div>
                <div className="setting-section-header" style={{ marginBottom: '10px', marginTop: '24px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t('discordRpc')}
                </div>
                <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                  <div className="setting-info" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <h3 style={{ margin: 0 }}>{t('discordRpc')}</h3>
                    <p style={{ margin: '4px 0 0 0' }}>{t('discordRpcDesc')}</p>
                  </div>
                  <div style={{ width: '100%' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>{t('discordClientId')}</label>
                    <input
                      type="text"
                      placeholder="123456789..."
                      value={settings.discordClientId || ''}
                      onChange={(e) => setSettings({ ...settings, discordClientId: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'var(--bg-panel)',
                        border: '1px solid var(--border-dim)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: 'white',
                        fontSize: '13px',
                        fontFamily: 'monospace'
                      }}
                    />
                    <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {t('discordClientIdDesc')} <a href="https://discord.com/developers/applications" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Discord Developers</a>
                    </p>
                  </div>
                </div>
              </div>
              { }
              <div className="settings-col">
                <div className="setting-section-header" style={{ marginBottom: '10px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Playback & Audio
                </div>
                <div className="setting-item">
                  <div className="setting-info" style={{ flex: 1, paddingRight: '20px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      {t('flowMode')}
                    </h3>
                    <p>{t('flowModeDesc')}</p>
                  </div>
                  <div
                    className={`toggle-switch ${settings.flowMode ? 'active' : ''}`}
                    onClick={() => setSettings({ ...settings, flowMode: !settings.flowMode })}
                  >
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>{t('audioQuality')}</h3>
                    <p>{t('audioQualityDesc')}</p>
                  </div>
                  <select
                    value={settings.audioQuality}
                    onChange={(e) => setSettings({ ...settings, audioQuality: e.target.value })}
                  >
                    <option value="Standard">{t('standard')}</option>
                    <option value="High">{t('high')}</option>
                    <option value="Extreme">{t('extreme')}</option>
                  </select>
                </div>
                <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="setting-info">
                      <h3>{t('crossfade')}</h3>
                      <p>{t('crossfadeDesc')}</p>
                    </div>
                    <div
                      className={`toggle-switch ${settings.crossfade ? 'active' : ''}`}
                      onClick={() => setSettings({ ...settings, crossfade: !settings.crossfade })}
                    >
                      <div className="toggle-thumb"></div>
                    </div>
                  </div>
                  {settings.crossfade && (
                    <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-dim)', paddingTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t('crossfadeDuration')}</label>
                        <span style={{ fontSize: '11px', color: 'var(--text-main)', fontWeight: 600 }}>
                          {(settings.crossfadeDuration || 2500) / 1000}{t('cfSeconds')}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="10000"
                        step="500"
                        value={settings.crossfadeDuration || 2500}
                        onChange={(e) => setSettings({ ...settings, crossfadeDuration: parseInt(e.target.value) })}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                      />
                    </div>
                  )}
                </div>
                <div className="eq-section" style={{ marginTop: '20px' }}>
                  <div className="setting-info" style={{ marginBottom: '16px' }}>
                    <h3>{t('eq')}</h3>
                    <p>{t('eqDesc')}</p>
                  </div>
                  <div className="eq-container">
                    {['32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'].map((freq, i) => (
                      <div key={freq} className="eq-band">
                        <span className="eq-value">{settings.eq[i] > 0 ? `+${settings.eq[i]}` : settings.eq[i]}</span>
                        <input
                          type="range"
                          min="-12"
                          max="12"
                          step="1"
                          value={settings.eq[i]}
                          onChange={(e) => {
                            const newEq = [...settings.eq];
                            newEq[i] = parseInt(e.target.value);
                            setSettings({ ...settings, eq: newEq });
                          }}
                          className="eq-slider"
                        />
                        <span className="eq-label">{freq}</span>
                      </div>
                    ))}
                  </div>
                  <div className="eq-presets" style={{
                    marginTop: '16px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    justifyContent: 'center'
                  }}>
                    {[
                      { name: 'Flat', key: 'eqFlat', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                      { name: 'Rock', key: 'eqRock', values: [5, 4, 3, 1, -1, -1, 1, 3, 4, 5] },
                      { name: 'Pop', key: 'eqPop', values: [-1, -1, 0, 2, 4, 4, 2, 0, -1, -2] },
                      { name: 'Bass', key: 'eqBass', values: [7, 6, 5, 2, 1, 0, 0, 0, 0, 0] },
                      { name: 'Vocal', key: 'eqVocal', values: [-2, -2, -1, 1, 5, 5, 3, 1, 0, -1] },
                      { name: 'Electronic', key: 'eqElectronic', values: [4, 3, 0, -1, -2, 0, 2, 4, 5, 4] },
                      { name: 'Jazz', key: 'eqJazz', values: [3, 2, 1, 2, -1, -1, 0, 1, 3, 4] },
                      { name: 'Classical', key: 'eqClassical', values: [5, 4, 3, 2, -1, -1, 0, 1, 3, 4] }
                    ].map(preset => (
                      <button
                        key={preset.name}
                        onClick={() => setSettings({ ...settings, eq: preset.values })}
                        style={{
                          background: JSON.stringify(settings.eq) === JSON.stringify(preset.values) ? 'var(--primary)' : 'var(--bg-elevated)',
                          color: JSON.stringify(settings.eq) === JSON.stringify(preset.values) ? 'white' : 'var(--text-main)',
                          border: '1px solid var(--border-dim)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {t(preset.key)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="setting-item" style={{ borderTop: '1px solid var(--border-dim)', paddingTop: '20px', marginTop: '10px' }}>
                  <div className="setting-info">
                    <h3 style={{ color: '#ff4444' }}>{t('dangerZone')}</h3>
                    <p>{t('clearLikesDesc')}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(t('clearLikes') + '?')) {
                        window.electronAPI.clearLikes();
                        setLikedTracks([]);
                      }
                    }}
                    style={{
                      background: 'rgba(255, 68, 68, 0.1)',
                      color: '#ff4444',
                      border: '1px solid rgba(255, 68, 68, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t('clearLikes')}
                  </button>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3 style={{ color: 'var(--text-main)', fontSize: '14px' }}>{t('clearHistory')}</h3>
                    <p>{t('clearHistoryDesc')}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(t('clearHistory') + '?')) {
                        window.electronAPI.clearHistory();
                        setHistory([]);
                      }
                    }}
                    style={{
                      background: 'var(--bg-hover)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-dim)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    {t('clearHistory')}
                  </button>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3 style={{ color: 'var(--text-main)', fontSize: '14px' }}>{t('clearStats')}</h3>
                    <p>{t('clearStatsDesc')}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(t('clearStats') + '?')) {
                        window.electronAPI.clearStats().then(setTrackStats);
                      }
                    }}
                    style={{
                      background: 'var(--bg-hover)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-dim)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    {t('clearStats')}
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="save-btn" onClick={() => setSettingsOpen(false)}>{t('close')}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderLoginScreen = () => {
    return (
      <div className="login-screen" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: 'var(--bg-main)',
        color: 'white'
      }}>
        <div style={{
          width: '400px',
          padding: '40px',
          background: 'var(--bg-panel)',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--primary)" style={{ marginBottom: '24px' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{t('loginWelcome')}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{t('loginSubtitle')}</p>
          <button
            onClick={handleSCConnect}
            disabled={isLoggingIn}
            style={{
              width: '100%',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: isLoggingIn ? 'not-allowed' : 'pointer',
              opacity: isLoggingIn ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'transform 0.1s'
            }}
          >
            {isLoggingIn ? (
              <span>{t('loginLoading')}</span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                {t('loginButton')}
              </>
            )}
          </button>
          <button
            onClick={() => setIsGuestMode(true)}
            style={{
              marginTop: '20px',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => (e.target.style.opacity = '1')}
            onMouseOut={(e) => (e.target.style.opacity = '0.8')}
          >
            {t('continueGuest')}
          </button>
        </div>
      </div>
    );
  };
  const renderMiniPlayer = () => {
    return (
      <div className="mini-player" style={{
        height: '100vh',
        width: '100vw',
        background: 'var(--bg-dark)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none'
      }}>
        { }
        {currentTrack && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: `url(${currentTrack.artwork_url?.replace('-large', '-t500x500') || ''})`,
            backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(20px) brightness(0.4)', zIndex: 0
          }} />
        )}
        { }
        <div className="title-bar" style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          height: '40px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '10px',
          WebkitAppRegion: 'drag',
          border: 'none'
        }}>
          <div className="window-controls" style={{ display: 'flex', gap: '8px', WebkitAppRegion: 'no-drag' }}>
            <button className="control-btn" onClick={() => window.electronAPI.toggleMiniPlayer()} title="Exit Mini-Player" style={{ color: 'white', opacity: 0.8, cursor: 'pointer', background: 'none', border: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            </button>
            <button className="control-btn close" onClick={() => window.electronAPI.close()} style={{ color: 'white', opacity: 0.8, cursor: 'pointer', background: 'none', border: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        { }
        {currentTrack ? (
          <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', padding: '20px', boxSizing: 'border-box' }}>
            { }
            <div style={{ position: 'relative', marginBottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', borderRadius: '12px', overflow: 'hidden' }}>
              <img
                src={currentTrack.artwork_url?.replace('-large', '-t500x500') || 'https://a-v2.sndcdn.com/assets/images/default_artwork_large-d36391.png'}
                style={{ width: '140px', height: '140px', objectFit: 'cover', display: 'block' }}
                alt=""
              />
            </div>
            { }
            <div style={{ textAlign: 'center', width: '100%', marginBottom: '16px', padding: '0 10px' }}>
              <h3 style={{ fontSize: '15px', color: 'white', fontWeight: 700, margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTrack.title}</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{currentTrack.user?.username}</p>
            </div>
            { }
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <button className="icon-btn" onClick={playPrevious} style={{ color: 'white', opacity: 0.9, cursor: 'pointer', background: 'none', border: 'none' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg></button>
              <button className="icon-btn" onClick={togglePlay} style={{
                background: 'white', color: 'black', borderRadius: '50%', width: '48px', height: '48px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transform: 'scale(1.1)',
                cursor: 'pointer', border: 'none'
              }}>
                {isPlaying ? <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>}
              </button>
              <button className="icon-btn" onClick={playNext} style={{ color: 'white', opacity: 0.9, cursor: 'pointer', background: 'none', border: 'none' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg></button>
            </div>
          </div>
        ) : (
          <div style={{ zIndex: 1, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
            <p>No track playing</p>
          </div>
        )}
      </div>
    );
  };
  const renderTitleBar = () => {
    return (
      <div className="title-bar">
        <div className="title-info">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" /></svg>
          <span style={{ marginRight: '8px' }}>SoundCloud Desktop</span>
        </div>
        <div className="window-controls">
          <button className="control-btn" onClick={() => window.electronAPI.toggleMiniPlayer()} title="Toggle Mini-Player">
            <svg width="14" height="14" viewBox="1 1 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="13" y="13" width="5" height="5"></rect></svg>
          </button>
          <button className="control-btn" onClick={() => window.electronAPI.minimize()}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg>
          </button>
          <button className="control-btn" onClick={() => window.electronAPI.maximize()}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="5" width="14" height="14" rx="1" /></svg>
          </button>
          <button className="control-btn close" onClick={() => window.electronAPI.close()}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    );
  };
  if (isMini) {
    return (
      <div className="App" data-theme={settings.theme}>
        {renderMiniPlayer()}
      </div>
    );
  }
  if (dataLoaded && !scUser && !isGuestMode) {
    return (
      <div className="App" data-theme={settings.theme}>
        {renderTitleBar()}
        {renderLoginScreen()}
      </div>
    );
  }
  return (
    <div
      className="App"
      data-theme={settings.theme}
      data-vibe={settings.dynamicBg}
      style={settings.theme === 'Custom' || settings.dynamicBg === true ? {
        '--primary': (settings.dynamicBg && vibeColors) ? vibeColors[0] : (settings.customTheme?.primary || settings.customThemeColor || '#ff5500'),
        '--bg-dark': (settings.dynamicBg && vibeColors) ? '#050505' : (settings.customTheme?.bgDark || '#000000'),
        '--bg-panel': (settings.dynamicBg && vibeColors) ? `color-mix(in srgb, ${vibeColors[0]} 5%, #121214e6)` : (settings.customTheme?.bgPanel || 'rgba(18, 18, 20, 0.4)'),
        '--bg-elevated': (settings.dynamicBg && vibeColors) ? `color-mix(in srgb, ${vibeColors[0]} 10%, rgba(255, 255, 255, 0.05))` : (settings.customTheme?.bgElevated || 'rgba(255, 255, 255, 0.05)'),
        '--bg-hover': (settings.dynamicBg && vibeColors) ? `color-mix(in srgb, ${vibeColors[0]} 15%, rgba(255, 255, 255, 0.1))` : (settings.customTheme?.bgHover || 'rgba(255, 255, 255, 0.1)'),
        '--text-main': settings.customTheme?.textMain || '#ffffff',
        '--text-secondary': settings.customTheme?.textSecondary || 'rgba(255, 255, 255, 0.85)',
        '--text-muted': settings.customTheme?.textMuted || 'rgba(255, 255, 255, 0.5)',
        '--border-dim': (settings.dynamicBg && vibeColors) ? `color-mix(in srgb, ${vibeColors[0]} 20%, rgba(255, 255, 255, 0.1))` : (settings.customTheme?.borderDim || 'rgba(255, 255, 255, 0.15)'),
        '--glass-bg': settings.customTheme?.glassBg || 'rgba(0, 0, 0, 0.4)',
        '--glass-border': settings.customTheme?.glassBorder || 'rgba(255, 255, 255, 0.1)',
        '--logo-color': (settings.dynamicBg && vibeColors) ? vibeColors[0] : (settings.customTheme?.logoColor || '#ff5500'),
        '--vis-color': (settings.dynamicBg && vibeColors) ? vibeColors[0] : (settings.customTheme?.visColor || '#ff5500'),
        '--bg-image': settings.backgroundImage && !settings.backgroundImage.match(/\.(mp4|webm)$/i) ? `url("${settings.backgroundImage}")` : 'none',
        backgroundSize: settings.backgroundFit || 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundImage: settings.backgroundImage && !settings.backgroundImage.match(/\.(mp4|webm)$/i)
          ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url("${settings.backgroundImage}")`
          : 'none'
      } : {}}
    >
      { }
      {settings.dynamicBg && vibeColors && (
        <div
          className="dynamic-vibe-bg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at 80% 20%, ${vibeColors[0]} 0%, transparent 50%),
                         radial-gradient(circle at 20% 80%, ${vibeColors[1]} 0%, transparent 50%),
                         radial-gradient(circle at 50% 50%, ${vibeColors[0]}22 0%, transparent 100%)`,
            filter: 'blur(80px) saturate(1.8)',
            opacity: 0.5,
            zIndex: 0,
            transition: 'background 2s ease, opacity 2s ease',
            pointerEvents: 'none'
          }}
        />
      )}
      { }
      <canvas
        ref={backgroundCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: settings.visualizerStyle === 'Particles' ? 1 : 0.6
        }}
      />
      {settings.theme === 'Custom' && settings.backgroundImage && settings.backgroundImage.match(/\.(mp4|webm)$/i) && (
        <div className="video-bg-container" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
          background: '#000'
        }}>
          <div className="video-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            zIndex: 2
          }}></div>
          <video
            src={settings.backgroundImage}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: settings.backgroundFit === '100% 100%' ? 'fill' : (settings.backgroundFit || 'cover'),
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1
            }}
          />
        </div>
      )}
      {renderTitleBar()}
      <div className={`main-container ${settings.sidebarMode === 'Compact' ? 'compact-sidebar' : ''}`} style={{ position: 'relative', zIndex: 10 }}>
        <aside className={`sidebar ${settings.sidebarMode === 'Compact' ? 'compact' : settings.sidebarMode === 'Slim' ? 'slim' : ''} ${sidebarOpen ? 'open' : ''}`}>
          <button className="sidebar-toggle" onClick={() => setSettingsOpen(true)} title="Settings">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
          </button>
          <nav>
            <ul>
              <li className={activeTab === 'Home' ? 'active' : ''} onClick={() => { setActiveTab('Home'); setSelectedPlaylist(null); setSelectedArtist(null); setViewingTrack(null); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg> <span>{t('home')}</span>
              </li>
              <li className={activeTab === 'Discover' ? 'active' : ''} onClick={() => { setActiveTab('Discover'); setSelectedPlaylist(null); setSelectedArtist(null); setViewingTrack(null); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg> <span>{t('discover')}</span>
              </li>
              <li className={activeTab === 'Library' ? 'active' : ''} onClick={() => { setActiveTab('Library'); setSelectedPlaylist(null); setSelectedArtist(null); setViewingTrack(null); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" /></svg> <span>{t('library')}</span>
              </li>
              <li className={activeTab === 'Playlists' ? 'active' : ''} onClick={() => { setActiveTab('Playlists'); setSelectedPlaylist(null); setSelectedArtist(null); setViewingTrack(null); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3-5-3z" /></svg> <span>{t('playlists')}</span>
              </li>
              <li className={activeTab === 'Player' ? 'active' : ''} onClick={() => { setActiveTab('Player'); setSelectedPlaylist(null); setSelectedArtist(null); setViewingTrack(null); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg> <span>{t('nowPlaying')}</span>
              </li>
              <li className={activeTab === 'Analytics' ? 'active' : ''} onClick={() => { setActiveTab('Analytics'); setSelectedPlaylist(null); setSelectedArtist(null); setViewingTrack(null); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11 20H4a1 1 0 01-1-1V5a1 1 0 011-1h7v16zm2 0h7a1 1 0 001-1V5a1 1 0 00-1-1h-7v16zm-7-7h2v2H6v-2zm0-4h2v2H6V9zm11 4h2v2h-2v-2zm0-4h2v2h-2V9z" /></svg> <span>{t('analytics')}</span>
              </li>
            </ul>
          </nav>
        </aside>
        <main
          className="main-content"
          style={settings.dynamicBg ? { background: 'transparent' } : {}}
        >
          {activeTab !== 'Player' && (
            <header className="App-header">
              <h1>SoundCloud</h1>
              {(activeTab === 'Home' || activeTab === 'Discover') && (
                <div className="search-bar">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    onKeyPress={(e) => e.key === 'Enter' && searchTracks(false)}
                  />
                  <button onClick={() => searchTracks(false)}>{t('search')}</button>
                </div>
              )}
            </header>
          )}
          {renderContent()}
          {currentTrack && activeTab !== 'Player' && (
            <footer className={`player ${settings.sidebarMode === 'Compact' ? 'full-width' : settings.sidebarMode === 'Slim' ? 'slim-sidebar' : ''}`}>
              <div className="play-controls" style={{ flexShrink: 0 }}>
                <button className="icon-btn" onClick={playPrevious}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
                </button>
                <button className="icon-btn play-btn" onClick={togglePlay}>
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </button>
                <button className="icon-btn" onClick={playNext}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="m6 18 8.5-6L6 6zM16 6v12h2V6z" /></svg>
                </button>
              </div>
              <canvas
                ref={canvasRef}
                width={300}
                height={60}
                style={{
                  position: 'absolute',
                  left: settings.visualizerPosition === 'Left' ? '0' : settings.visualizerPosition === 'Right' ? 'auto' : settings.visualizerPosition === 'Custom' ? `${settings.visCustomX}%` : '50%',
                  right: settings.visualizerPosition === 'Right' ? '0' : 'auto',
                  top: settings.visualizerPosition === 'Custom' ? `${settings.visCustomY}%` : '50%',
                  transform: settings.visualizerPosition === 'Custom' ? 'translate(-50%, -50%)' : settings.visualizerPosition === 'Center' ? 'translate(-50%, -50%)' : 'translate(0, -50%)',
                  width: settings.visualizerPosition === 'Custom' ? `${settings.visCustomWidth}px` : '400px',
                  height: settings.visualizerPosition === 'Custom' ? `${settings.visCustomHeight}px` : '80px',
                  zIndex: -1,
                  opacity: 0.3,
                  pointerEvents: 'none',
                  maskImage: settings.visualizerPosition === 'Custom' ? 'none' : 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
                  WebkitMaskImage: settings.visualizerPosition === 'Custom' ? 'none' : 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)'
                }}
              />
              <div className="player-meta-minimal" onClick={() => setViewingTrack(currentTrack)} style={{ cursor: 'pointer' }}>
                <span className="player-title-minimal" title="View Track Details">{currentTrack.title}</span>
                <span className="player-artist-minimal">{currentTrack.user?.username || 'Unknown Artist'}</span>
                <div className="progress-container" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px', marginTop: '6px', cursor: 'default' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', minWidth: '38px', flexShrink: 0, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{formatTime(seek)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={seek}
                    onChange={handleSeek}
                    className="seek-slider"
                    style={{
                      flex: 1,
                      margin: 0,
                      background: `linear-gradient(to right, var(--primary) ${(seek / duration) * 100}%, var(--bg-hover) ${(seek / duration) * 100}%)`,
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', minWidth: '38px', textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{formatTime(duration)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <button
                  className="icon-btn"
                  onClick={toggleShuffle}
                  title={t('shuffle')}
                  style={{ color: isShuffled ? 'var(--primary)' : 'var(--text-secondary)', marginRight: '4px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"></polyline>
                    <line x1="4" y1="20" x2="21" y2="3"></line>
                    <line x1="15" y1="15" x2="21" y2="21"></line>
                    <line x1="4" y1="4" x2="9" y2="9"></line>
                  </svg>
                </button>
                <button
                  className={`icon-btn ${isLiked(currentTrack) ? 'liked' : ''}`}
                  onClick={(e) => handleToggleLike(e, currentTrack)}
                  title={isLiked(currentTrack) ? "Unlike" : "Like"}
                  style={{ color: isLiked(currentTrack) ? 'var(--primary)' : 'inherit' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked(currentTrack) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                </button>
                <button
                  className="icon-btn"
                  onClick={toggleLoop}
                  title={isLooping ? "Disable Loop" : "Enable Loop"}
                  style={{ color: isLooping ? 'var(--primary)' : 'var(--text-secondary)' }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9"></polyline>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <polyline points="7 23 3 19 7 15"></polyline>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                  </svg>
                </button>
                <div className="rate-menu-container">
                  <button
                    className="icon-btn"
                    onClick={(e) => { e.stopPropagation(); setTrackMenuOpen(!trackMenuOpen); }}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Track Options"
                    style={{ color: trackMenuOpen || playbackRate !== 1 ? 'var(--primary)' : 'var(--text-secondary)' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    {playbackRate !== 1 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--primary)', color: 'white', fontSize: '8px', padding: '1px 3px', borderRadius: '4px', fontWeight: 900 }}>{playbackRate}x</span>}
                  </button>
                  {trackMenuOpen && (
                    <div className="rate-menu" style={{ right: '-40px', minWidth: '180px' }} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                      <button onClick={(e) => { handleStartStation(e, currentTrack); setTrackMenuOpen(false); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        <span>{t('startStation')}</span>
                      </button>
                      <button onClick={(e) => { handleShare(e, currentTrack); setTrackMenuOpen(false); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        <span>{t('shareCard')}</span>
                      </button>
                      <div className="rate-menu-divider" />
                      <div className="rate-slider-container">
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{t('playbackSpeed')}</span>
                          <span style={{ color: 'var(--primary)' }}>{playbackRate}x</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                            <button
                              key={rate}
                              className={playbackRate === rate ? 'active' : ''}
                              onClick={() => { handleRateChange(rate); setTrackMenuOpen(false); }}
                              style={{ flex: '1', padding: '4px 2px', fontSize: '11px', justifyContent: 'center', minWidth: '32px' }}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2.0"
                          step="0.05"
                          value={playbackRate}
                          onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                          className="rate-slider"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="volume-section">
                  <button className="icon-btn" onClick={() => setVolume(volume === 0 ? 1 : 0)} style={{ padding: '8px', color: volume === 0 ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
                    {volume === 0 ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                    ) : volume < 0.5 ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    className="volume-slider-minimal"
                    style={{
                      background: `linear-gradient(to right, var(--text-main) ${volume * 100}%, var(--bg-hover) ${volume * 100}%)`,
                    }}
                  />
                </div>
                <button className="icon-btn" style={{ marginLeft: '12px' }} onClick={() => {
                  if (sound) sound.unload();
                  setCurrentTrack(null);
                }} title="Close">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </footer>
          )}
        </main>
      </div>
      {updateStatus && (
        <div className="update-toast" style={{ bottom: currentTrack ? '110px' : '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)', fontWeight: 800 }}>
                {updateStatus === 'downloaded' ? t('updateDownloaded') : t('updateAvailable')}
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Version {updateVersion}
              </p>
            </div>
            <button
              onClick={() => setUpdateStatus(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          {updateStatus === 'downloading' ? (
            <div>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${updateProgress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s' }} />
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>{updateProgress}%</p>
            </div>
          ) : updateStatus === 'downloaded' ? (
            <button
              onClick={() => window.electronAPI.installUpdate()}
              style={{
                width: '100%', padding: '10px', background: 'var(--primary)', border: 'none',
                borderRadius: '8px', color: 'white', fontWeight: 800, cursor: 'pointer',
                fontSize: '13px', boxShadow: '0 4px 12px rgba(255,85,0,0.3)'
              }}
            >
              {t('updateInstall')}
            </button>
          ) : (
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{t('updateDownloading')}</p>
          )}
        </div>
      )}
      {renderSettingsModal()}
    </div>
  );
}
export default App;