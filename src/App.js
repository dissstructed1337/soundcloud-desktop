import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
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
    notifications: 'Уведомления',
    notificationsDesc: 'Показывать уведомление при смене трека',
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
    sidebarMode: 'Боковая панель',
    sidebarModeDesc: 'Вид навигационной панели',
    visualizer: 'Визуализатор',
    visualizerDesc: 'Стиль анимации музыки',
    visBars: 'Классические столбики',
    visWave: 'Волна (Осциллограф)',
    visMirrored: 'Зеркальные столбики',
    visCircles: 'Пульсирующие круги',
    sidebarStandard: 'Стандартная',
    sidebarCompact: 'Горизонтальная (сверху)',
    sidebarSlim: 'Узкая (слева)',
    close: 'Закрыть',
    save: 'Применить',
    searchPlaceholder: 'Поиск...',
    history: 'История',
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
    scConnect: 'Синхронизация с SoundCloud',
    scConnectDesc: 'Войдите в аккаунт, чтобы лайки в приложении добавлялись на сайт',
    scConnectedAs: 'Подключено как',
    scDisconnect: 'Выйти',
    scLogin: 'Войти',
    loginWelcome: 'Добро пожаловать',
    loginSubtitle: 'Войдите в свой аккаунт SoundCloud',
    loginButton: 'Войти через SoundCloud',
    loginLoading: 'Подключение...',
    viewAll: 'Показать все',
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
    notifications: 'Desktop Notifications',
    notificationsDesc: 'Show track notifications on track change',
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
    sidebarMode: 'Sidebar Layout',
    sidebarModeDesc: 'Navigation bar appearance',
    visualizer: 'Visualizer Style',
    visualizerDesc: 'Choose how your music looks',
    visBars: 'Classic Bars',
    visWave: 'Sine Wave',
    visMirrored: 'Mirrored Bars',
    visCircles: 'Pulsing Circles',
    sidebarStandard: 'Standard',
    sidebarCompact: 'Horizontal (Top)',
    sidebarSlim: 'Slim (Left)',
    close: 'Close',
    save: 'Save',
    searchPlaceholder: 'Search...',
    history: 'History',
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
  const [activeTab, setActiveTab] = useState('Home');
  const [likedTracks, setLikedTracks] = useState([]);
  const [likedPlaylists, setLikedPlaylists] = useState([]);
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


  const [settings, setSettings] = useState({
    audioQuality: 'High',
    theme: 'Deep Space',
    notifications: true,
    eq: [0, 0, 0, 0, 0],
    language: 'ru',
    crossfade: true,
    crossfade: true,
    crossfade: true,
    visualizerStyle: 'Bars',
    backgroundImage: null,
    backgroundFit: 'cover',
    customThemeColor: '#ff5500'
  });

  const t = (key) => {
    const lang = settings.language || 'ru';
    return translations[lang][key] || translations['en'][key] || key;
  };


  const filtersRef = useRef([]);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const CROSSFADE_DURATION = 2500;
  const isTransitioningRef = useRef(false);


  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);

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
      setTracks([]);
      setPlaylists([]);
      setArtists([]);
      setSelectedPlaylist(null);
      setSelectedArtist(null);
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
    triggerRPCUpdate(newSeek);
  };

  const triggerRPCUpdate = (customSeek = null) => {
    if (window.electronAPI && window.electronAPI.updateDiscordRPC && currentTrack) {
      window.electronAPI.updateDiscordRPC({
        title: currentTrack.title || 'Track',
        artist: currentTrack.user?.username || 'Unknown Artist',
        duration: duration || 0,
        seek: customSeek !== null ? customSeek : (seek || 0),
        isPaused: !isPlaying
      });
    }
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
        // Only allow seek updates if we aren't fetching a new track stream
        if (isTransitioningRef.current && !sound.playing()) return;

        const currentSeek = sound.seek();
        if (typeof currentSeek === 'number') {
          setSeek(currentSeek);
        }

        // Auto-crossfade logic: start next track early
        const soundDuration = sound.duration();
        const useCrossfade = settings.crossfade && !isLoopingRef.current;
        if (useCrossfade && soundDuration > 0 && (soundDuration - currentSeek) <= (CROSSFADE_DURATION / 1000) && !isTransitioningRef.current) {
          // Disable onend immediately for the current sound since we are handling it now
          sound.off('end');
          playNext();
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sound]);


  useEffect(() => {
    triggerRPCUpdate();
  }, [currentTrack, isPlaying, duration]);

  useEffect(() => {
    // Pulse update after startup to ensure RPC catches up if it connected late
    const timer = setTimeout(() => {
      if (currentTrack) triggerRPCUpdate();
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const addToHistory = async (item) => {
    if (window.electronAPI) {
      const updated = await window.electronAPI.addToHistory(item);
      setHistory(updated);
    }
  };


  const queueRef = useRef([]);

  useEffect(() => {
    queueRef.current = currentQueue;
  }, [currentQueue]);

  const isLoopingRef = useRef(isLooping);
  useEffect(() => {
    isLoopingRef.current = isLooping;
    if (sound) {
      sound.loop(isLooping);
    }
  }, [isLooping, sound]);

  const togglePlay = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  };

  const playNext = () => {
    const q = queueRef.current;
    if (!currentTrack || q.length === 0) {
      setIsPlaying(false);
      return;
    }
    const idx = q.findIndex(t => t.id === currentTrack.id);
    if (idx !== -1 && idx < q.length - 1) {
      playTrackSecure(q[idx + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  const playPrevious = () => {
    const q = queueRef.current;
    if (!currentTrack || q.length === 0) return;
    const idx = q.findIndex(t => t.id === currentTrack.id);
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

    isTransitioningRef.current = true;
    const previousSound = sound;
    const useCrossfade = settings.crossfade && !isLoopingRef.current;

    // Remove ALL listeners from previous sound immediately
    // This prevents its onpause/onstop from flipping setIsPlaying(false) during transition
    if (previousSound) {
      previousSound.off();
    }

    // Update UI immediately
    setCurrentTrack(track);
    setSeek(0);
    setDuration(0);

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
        volume: useCrossfade ? 0 : volume,
        loop: isLoopingRef.current,
        onplay: () => {
          setIsPlaying(true);
          setDuration(newSound.duration());
          if (useCrossfade) {
            newSound.fade(0, volume, CROSSFADE_DURATION);
          }

          if (previousSound && useCrossfade) {
            previousSound.fade(previousSound.volume(), 0, CROSSFADE_DURATION);
            setTimeout(() => {
              try { previousSound.unload(); } catch (e) { }
            }, CROSSFADE_DURATION + 1000);
          }

          isTransitioningRef.current = false;

          if (window.Howler && window.Howler.ctx) {
            if (window.Howler.ctx.state === 'suspended') {
              window.Howler.ctx.resume();
            }
            connectEQ();

            if (settings.notifications && window.electronAPI) {
              window.electronAPI.showNotification({
                title: track.title,
                body: track.user?.username || 'Unknown Artist',
              });
            }
          }
        },
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
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

  const closePlaylist = () => {
    setSelectedPlaylist(null);
  };

  const toggleLoop = () => {
    const newLoop = !isLooping;
    setIsLooping(newLoop);
  };

  useEffect(() => {
    if (sound) {
      sound.volume(volume);
    }
  }, [volume, sound]);




  const connectEQ = () => {
    if (typeof window === 'undefined' || !window.Howler || !window.Howler.ctx || window.Howler.ctx.state === 'closed') return;

    const ctx = window.Howler.ctx;


    if (filtersRef.current.length === 0) {

      const freqs = [60, 230, 910, 4000, 14000];
      filtersRef.current = freqs.map((freq, i) => {
        const filter = ctx.createBiquadFilter();
        filter.type = i === 0 ? 'lowshelf' : i === 4 ? 'highshelf' : 'peaking';
        filter.frequency.value = freq;
        filter.gain.value = settings.eq[i];
        return filter;
      });
    }


    if (!analyserRef.current) {
      analyserRef.current = ctx.createAnalyser();
      analyserRef.current.fftSize = 256;
    }


    try {

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
            setSettings(savedSettings);
            if (savedSettings.volume !== undefined) setVolume(savedSettings.volume);
          }

          const likes = await window.electronAPI.getLikes();
          setLikedTracks(likes);
          const savedPlaylists = await window.electronAPI.getLikedPlaylists();
          setLikedPlaylists(savedPlaylists);

          const hist = await window.electronAPI.getHistory();
          setHistory(hist);

          const user = await window.electronAPI.getSCUser();
          setScUser(user);

          // Auto-sync likes from SoundCloud on startup
          if (user && user.permalink_url) {
            try {
              const updatedLikes = await window.electronAPI.importSCLikes(user.permalink_url);
              setLikedTracks(updatedLikes);
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
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    // Resolve theme color to RGB for alpha mixing
    let r = 255, g = 85, b = 0; // Default #ff5500
    if (canvasRef.current) {
      // We must use the canvas element (or any element inside .App) to get the correct overridden var
      const computed = getComputedStyle(canvasRef.current).getPropertyValue('--primary').trim();

      // Use a temporary element to safely resolve any CSS color string (hex, rgb, names) to rgb()
      const tempEl = document.createElement('div');
      tempEl.style.color = computed || '#ff5500';
      document.body.appendChild(tempEl);
      const rgbStr = getComputedStyle(tempEl).color; // "rgb(r, g, b)"
      document.body.removeChild(tempEl);

      const match = rgbStr.match(/\d+/g);
      if (match && match.length >= 3) {
        [r, g, b] = match.map(Number);
      }
    }
    const rgb = `${r}, ${g}, ${b}`;

    const draw = () => {
      if (!analyserRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;
      const style = settings.visualizerStyle || 'Bars';

      ctx.clearRect(0, 0, width, height);

      if (style === 'Bars') {
        const barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * height;
          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, `rgba(${rgb}, 0.2)`);
          gradient.addColorStop(1, `rgba(${rgb}, 0.8)`);
          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      } else if (style === 'Waveform') {
        analyser.getByteTimeDomainData(dataArray);
        ctx.lineWidth = 3;
        ctx.strokeStyle = `rgb(${rgb})`;
        ctx.beginPath();
        const sliceWidth = width * 1.0 / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * height / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else if (style === 'Mirrored') {
        const barWidth = (width / bufferLength) * 1.2;
        let barHeight;
        const centerX = width / 2;
        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * height * 0.8;
          const alpha = 0.3 + (dataArray[i] / 255) * 0.7;
          ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
          ctx.fillRect(centerX + (i * (barWidth + 1)), height / 2 - barHeight / 2, barWidth, barHeight);
          ctx.fillRect(centerX - (i * (barWidth + 1)), height / 2 - barHeight / 2, barWidth, barHeight);
        }
      } else if (style === 'Circles') {
        const centerX = width / 2;
        const centerY = height / 2;
        for (let i = 0; i < bufferLength; i += 4) {
          const radius = (dataArray[i] / 255) * (height / 2);
          const alpha = Math.max(0, 0.1 - (i / bufferLength) * 0.1);
          // Note: using simple hex math previously was buggy anyway for small values
          // Here we can use strokeStyle with explicit alpha, but strokeStyle usually prefers solid or rgba
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(${rgb}, ${Math.max(0.1, alpha + 0.2)})`; // slightly more visible
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, settings.visualizerStyle, settings.theme]);

  const handleImportLikes = async () => {
    if (!scProfileUrl) return;
    if (!window.electronAPI) {
      alert('Sync API not available. Please restart the desktop app.');
      return;
    }
    setIsImporting(true);
    try {
      const updatedLikes = await window.electronAPI.importSCLikes(scProfileUrl);
      setLikedTracks(updatedLikes);
      alert(`${updatedLikes.length} tracks are now in your library!`);
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
        video.currentTime = 1; // Seek to 1s to avoid black start frame
        video.onloadeddata = () => {
          // small delay to ensure frame is ready
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
        // Trigger load
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
          // Check brightness to avoid white/light colors
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
              const updatedLikes = await window.electronAPI.importSCLikes(result.user.permalink_url);
              setLikedTracks(updatedLikes);
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

  const isLiked = (item) => {
    if (item.kind === 'playlist') {
      return likedPlaylists.some(p => p.id === item.id);
    }
    return likedTracks.some(t => t.id === item.id);
  };


  const placeholderImg = require('./assets/holder.png');


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
        <div className="track-grid no-scrollbar" style={{
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
      setArtistTab('tracks');
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
      </div>
    );
  };

  const renderContent = () => {
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
                {tracks.length > 0 && (
                  <div className="search-section">
                    <h2 style={{ padding: '20px 0 16px 0', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" /></svg>
                      {t('tracks')}
                    </h2>
                    <div className="track-grid">
                      {tracks.slice(0, 10).map(track => renderTrackCard(track))}
                    </div>
                    {tracks.length > 10 && (
                      <button className="view-all-btn" onClick={() => setSearchType('tracks')}>{t('viewAll')} →</button>
                    )}
                  </div>
                )}

                {playlists.length > 0 && (
                  <div className="search-section">
                    <h2 style={{ padding: '20px 0 16px 0', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                      {t('playlists')}
                    </h2>
                    <div className="track-grid">
                      {playlists.slice(0, 5).map(playlist => renderTrackCard(playlist))}
                    </div>
                    {playlists.length > 5 && (
                      <button className="view-all-btn" onClick={() => setSearchType('playlists')}>{t('viewAll')} →</button>
                    )}
                  </div>
                )}

                {artists.length > 0 && (
                  <div className="search-section">
                    <h2 style={{ padding: '20px 0 16px 0', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                      {t('artists')}
                    </h2>
                    <div className="track-grid">
                      {artists.slice(0, 5).map(artist => renderArtistCard(artist))}
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
        const recentTracks = history.filter(item => item.kind === 'track' || !item.kind).slice(0, 10);
        const recentPlaylists = history.filter(item => item.kind === 'playlist').slice(0, 10);

        return (
          <div className="content" style={{ padding: '40px', color: 'var(--text-main)' }}>
            <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: 900 }}>{t('discover')}</h1>


            {recommendations.length > 0 && renderHorizontalList(recommendations, t('forYou'), t('basedOnTaste'))}


            {charts.length > 0 && renderHorizontalList(charts.slice(0, 20), t('globalTop50'), t('trendingNow'))}


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
        return (
          <section className="content">
            <h2 style={{ padding: '20px 0 0 0', margin: 0 }}>{t('likedTracksTitle')}</h2>
            {likedTracks.length > 0 ? (
              <div className="track-grid">
                {likedTracks.map(track => renderTrackCard(track))}
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                <p>{t('noLikedTracks')}</p>
              </div>
            )}
          </section>
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
              {/* LEFT COLUMN: Appearance & Account */}
              <div className="settings-col">
                <div className="setting-section-header" style={{ marginBottom: '10px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Appearance
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>{t('theme')}</h3>
                    <p>{t('themeDesc')}</p>
                  </div>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
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
                    <div style={{ marginTop: '24px', width: '100%', borderTop: '1px solid var(--border-dim)', paddingTop: '20px' }}>
                      <button
                        onClick={handleCustomBackground}
                        style={{
                          width: '100%',
                          marginBottom: '20px',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-dim)',
                          borderRadius: '8px',
                          padding: '12px',
                          color: 'var(--text-main)',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'var(--bg-hover)';
                          e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'var(--bg-elevated)';
                          e.currentTarget.style.borderColor = 'var(--border-dim)';
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                        {t('uploadBackground')}
                      </button>

                      <div className="setting-info" style={{ marginBottom: '12px' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{t('backgroundFit')}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>How the content scales</p>
                      </div>
                      <select
                        value={settings.backgroundFit || 'cover'}
                        onChange={(e) => setSettings({ ...settings, backgroundFit: e.target.value })}
                        style={{ width: '100%' }}
                      >
                        <option value="cover">{t('bgCover')}</option>
                        <option value="contain">{t('bgContain')}</option>
                        <option value="100% 100%">{t('bgFill')}</option>
                      </select>
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
                  </select>
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

              </div>

              {/* RIGHT COLUMN: Playback & EQ */}
              <div className="settings-col">
                <div className="setting-section-header" style={{ marginBottom: '10px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Playback & Audio
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

                <div className="setting-item">
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

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>{t('notifications')}</h3>
                    <p>{t('notificationsDesc')}</p>
                  </div>
                  <div
                    className={`toggle-switch ${settings.notifications ? 'active' : ''}`}
                    onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                  >
                    <div className="toggle-thumb"></div>
                  </div>
                </div>

                <div className="eq-section" style={{ marginTop: '20px' }}>
                  <div className="setting-info" style={{ marginBottom: '16px' }}>
                    <h3>{t('eq')}</h3>
                    <p>{t('eqDesc')}</p>
                  </div>
                  <div className="eq-container">
                    {['60', '230', '910', '4k', '14k'].map((freq, i) => (
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
                </div>

                <div className="setting-item" style={{ borderTop: '1px solid var(--border-dim)', paddingTop: '20px', marginTop: '10px' }}>
                  <div className="setting-info">
                    <h3 style={{ color: '#ff4444' }}>{t('dangerZone')}</h3>
                    <p>{t('clearLikesDesc')}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all liked tracks?')) {
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
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#ff4444';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)';
                      e.currentTarget.style.color = '#ff4444';
                    }}
                  >
                    {t('clearLikes')}
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
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
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

  const renderTitleBar = () => {
    return (
      <div className="title-bar">
        <div className="title-info">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" /></svg>
          <span>SoundCloud Desktop</span>
        </div>
        <div className="window-controls">
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
      style={settings.theme === 'Custom' && settings.backgroundImage ? {
        '--bg-image': !settings.backgroundImage.match(/\.(mp4|webm)$/i) ? `url("${settings.backgroundImage}")` : 'none',
        '--primary': settings.customThemeColor,
        backgroundSize: settings.backgroundFit || 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundImage: !settings.backgroundImage.match(/\.(mp4|webm)$/i)
          ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url("${settings.backgroundImage}")`
          : 'none'
      } : {}}
    >
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
              <li className={activeTab === 'Home' ? 'active' : ''} onClick={() => { setActiveTab('Home'); setSelectedPlaylist(null); setSelectedArtist(null); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg> <span>{t('home')}</span>
              </li>
              <li className={activeTab === 'Discover' ? 'active' : ''} onClick={() => { setActiveTab('Discover'); setSelectedPlaylist(null); setSelectedArtist(null); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg> <span>{t('discover')}</span>
              </li>
              <li className={activeTab === 'Library' ? 'active' : ''} onClick={() => { setActiveTab('Library'); setSelectedPlaylist(null); setSelectedArtist(null); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" /></svg> <span>{t('library')}</span>
              </li>
              <li className={activeTab === 'Playlists' ? 'active' : ''} onClick={() => { setActiveTab('Playlists'); setSelectedPlaylist(null); setSelectedArtist(null); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg> <span>{t('playlists')}</span>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          <header className="App-header">
            <h1>SoundCloud</h1>
            {activeTab === 'Home' && (
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
          {renderContent()}
          {currentTrack && (
            <footer className={`player ${settings.sidebarMode === 'Compact' ? 'full-width' : settings.sidebarMode === 'Slim' ? 'slim-sidebar' : ''}`}>
              <div className="play-controls">
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
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '400px',
                  height: '80px',
                  zIndex: -1,
                  opacity: 0.3,
                  pointerEvents: 'none'
                }}
              />

              <div className="player-meta-minimal">
                <span className="player-title-minimal">{currentTrack.title}</span>
                <span className="player-artist-minimal">{currentTrack.user?.username || 'Unknown Artist'}</span>
                <div className="progress-container" style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', minWidth: '45px' }}>{formatTime(seek)}</span>
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
                      margin: '0 12px',
                      background: `linear-gradient(to right, var(--primary) ${(seek / duration) * 100}%, var(--bg-hover) ${(seek / duration) * 100}%)`,
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', minWidth: '45px', textAlign: 'right' }}>{formatTime(duration)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
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
      {renderSettingsModal()}
    </div>
  );
}

export default App;