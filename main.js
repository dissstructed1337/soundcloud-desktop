const { app, BrowserWindow, ipcMain, session, Tray, Menu, Notification, globalShortcut, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
let tray = null;
let isQuitting = false;
let mainWindow;
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const net = require('net');
const { execSync } = require('child_process');
const DiscordRPC = require('discord-rpc');

const DISCORD_CLIENT_ID = '951475510626304001';
let rpcConnected = false;
let rpc = null;
let rpcRetryTimeout = null;
let rpcFailuresCount = 0;
const RPC_BACKOFF_BASE = 20000; // 20s
const RPC_BACKOFF_MAX = 5 * 60 * 1000; // 5 minutes

function connectRPC() {
  // If process is elevated on Windows, IPC from/to Discord may be blocked/closed.
  const isElevated = () => {
    if (process.platform !== 'win32') return false;
    try {
      execSync('NET SESSION', { stdio: 'ignore' });
      return true;
    } catch (e) {
      return false;
    }
  };

  if (isElevated()) {
    console.log('⚠️ DISCORD RPC: process running with elevated privileges — skipping RPC attempts (run app without Admin privileges)');
    try {
      new Notification({
        title: 'Discord RPC disabled (elevated)',
        body: 'Приложение запущено как администратор — Discord Rich Presence будет отключён. Запустите приложение без прав администратора.'
      }).show();
    } catch (e) { }
    return;
  }

  if (rpcConnected) return;
  if (rpcRetryTimeout) clearTimeout(rpcRetryTimeout);

  if (rpc) {
    try {
      // Prevent internal library crashes by manually unbinding if needed
      rpc.removeAllListeners();
      if (rpc.transport && rpc.transport.close) rpc.transport.close();
    } catch (e) { }
    rpc = null;
  }

  try {
    // Fire off a short diagnostic of existing named pipes for debugging
    try {
      const pipes = fs.readdirSync('\\\\.\\pipe\\');
      const discordPipes = pipes.filter(p => p && p.toString().toLowerCase().includes('discord-ipc'));
      console.log('ℹ️ DISCORD RPC: available pipes ->', discordPipes);
      // Try connecting to each discord ipc pipe with a short timeout to see if it's reachable
      discordPipes.forEach(pipeName => {
        const path = `\\\\.\\pipe\\${pipeName}`;
        const socket = net.connect({ path }, () => {
          console.log(`ℹ️ DISCORD RPC: test connect SUCCESS -> ${path}`);
          socket.destroy();
        });
        socket.setTimeout(2000);
        socket.on('error', (e) => {
          console.log(`ℹ️ DISCORD RPC: test connect ERROR -> ${path} (${e.code || e.message})`);
        });
        socket.on('timeout', () => {
          console.log(`ℹ️ DISCORD RPC: test connect TIMEOUT -> ${path}`);
          socket.destroy();
        });
      });
    } catch (e) {
      console.log('ℹ️ DISCORD RPC: pipe inspection failed', e && e.message ? e.message : e);
    }

    rpc = new DiscordRPC.Client({ transport: 'ipc' });

    rpc.on('ready', () => {
      rpcConnected = true;
      rpcFailuresCount = 0;
      console.log('✅ DISCORD RPC: CONNECTED!');
    });

    rpc.on('disconnected', () => {
      console.log('❌ DISCORD RPC: DISCONNECTED');
      rpcConnected = false;
      rpc = null;
      rpcFailuresCount++;
      const delay = Math.min(RPC_BACKOFF_BASE * Math.pow(2, rpcFailuresCount - 1), RPC_BACKOFF_MAX);
      console.log(`⚠️ DISCORD RPC: disconnected — scheduling reconnect in ${Math.round(delay / 1000)}s (failure #${rpcFailuresCount})`);
      if (rpcFailuresCount >= 3) {
        try {
          new Notification({
            title: 'Discord RPC: connection issues',
            body: 'Не удаётся подключиться к Discord Rich Presence — проверьте, запущен ли Discord и не блокирует ли его антивирус.'
          }).show();
        } catch (e) { }
      }
      rpcRetryTimeout = setTimeout(connectRPC, delay);
    });

    rpc.login({ clientId: DISCORD_CLIENT_ID }).catch((err) => {
      rpcFailuresCount++;
      const delay = Math.min(RPC_BACKOFF_BASE * Math.pow(2, rpcFailuresCount - 1), RPC_BACKOFF_MAX);
      console.log(`⚠️ DISCORD RPC: LOGIN ERROR (${err.code || err.message}) — scheduling reconnect in ${Math.round(delay / 1000)}s (failure #${rpcFailuresCount})`);
      console.error(err && err.stack ? err.stack : err);
      rpcConnected = false;
      rpc = null;
      if (rpcFailuresCount >= 3) {
        try {
          new Notification({
            title: 'Discord RPC: login failed',
            body: 'Не удалось подключиться к Discord Rich Presence. Убедитесь, что Discord Desktop запущен и не блокируется.'
          }).show();
        } catch (e) { }
      }
      rpcRetryTimeout = setTimeout(connectRPC, delay);
    });
  } catch (err) {
    console.error('CRITICAL: RPC SETUP ERROR:', err && err.stack ? err.stack : err);
    rpcRetryTimeout = setTimeout(connectRPC, 40000);
  }
}

connectRPC();

async function setRPCActivity(data) {
  if (!rpcConnected || !rpc) return;

  try {
    // Double check transport as some async events might clear it
    if (!rpc.transport || !rpc.transport.socket) {
      rpcConnected = false;
      return;
    }

    const { title, artist, duration, seek, isPaused } = data;
    const cleanTitle = (title || 'Track').substring(0, 127);
    const cleanArtist = `by ${artist || 'Unknown'}`.substring(0, 127);

    const activity = {
      details: isPaused ? `Paused: ${cleanTitle}` : cleanTitle,
      state: cleanArtist,
      instance: false,
      largeImageKey: 'soundcloud_logo',
      largeImageText: 'SoundCloud Desktop',
    };

    if (!isPaused && duration && seek !== null) {
      activity.startTimestamp = Math.floor(Date.now() / 1000) - Math.floor(seek);
      activity.endTimestamp = activity.startTimestamp + Math.floor(duration);
    }

    rpc.setActivity(activity).catch(() => { });
  } catch (err) {
    // Ignore updates errors
  }
}

let CLIENT_ID = 'F889PrS0Yvg2mUonAOk7P7zNSrt4un63';
let OAUTH_TOKEN = null;
let SC_USER = null;

const AUTH_FILE = path.join(app.getPath('userData'), 'auth.json');
try {
  if (fs.existsSync(AUTH_FILE)) {
    const auth = JSON.parse(fs.readFileSync(AUTH_FILE));
    OAUTH_TOKEN = auth.token;
    SC_USER = auth.user;
  }
} catch (e) { console.error('Failed to load auth:', e); }

async function getClientId() {
  return new Promise((resolve) => {
    let resolved = false;
    const hiddenWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });


    const filter = {
      urls: ['*://*.soundcloud.com/*']
    };

    const onBeforeRequest = (details, callback) => {
      const url = details.url;
      if (url.includes('client_id=')) {
        try {
          const parsedUrl = new URL(url);
          const clientId = parsedUrl.searchParams.get('client_id');
          if (clientId && clientId !== CLIENT_ID && !resolved) {
            resolved = true;
            CLIENT_ID = clientId;

            session.defaultSession.webRequest.onBeforeRequest(null);
            if (!hiddenWindow.isDestroyed()) {
              hiddenWindow.close();
            }
            resolve(clientId);
            return;
          }
        } catch (e) { }
      }
      callback({});
    };

    session.defaultSession.webRequest.onBeforeRequest(filter, onBeforeRequest);

    hiddenWindow.loadURL('https://soundcloud.com');


    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        session.defaultSession.webRequest.onBeforeRequest(null);
        if (!hiddenWindow.isDestroyed()) {
          hiddenWindow.close();
        }
        resolve(CLIENT_ID);
      }
    }, 15000);

    hiddenWindow.on('closed', () => {
      clearTimeout(timeoutId);
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    icon: path.join(__dirname, 'src', 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    autoHideMenuBar: true,
    frame: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
      devTools: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });


  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });


  ipcMain.on('window-minimize', () => mainWindow.minimize());
  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on('window-close', () => mainWindow.close());

  ipcMain.on('show-notification', (event, { title, body, silent }) => {
    new Notification({
      title,
      body,
      silent,
      icon: path.join(__dirname, 'src', 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png')
    }).show();
  });


  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000').catch(() => {
      mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }


  mainWindow.setMenu(null);
  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.webContents.closeDevTools();
  });


  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}


autoUpdater.on('update-available', () => {
  if (mainWindow) {
    mainWindow.webContents.send('show-notification', {
      title: 'Обновление доступно',
      body: 'Новая версия загружается...',
      silent: false
    });
  }
});

autoUpdater.on('update-downloaded', () => {
  if (mainWindow) {
    mainWindow.webContents.send('show-notification', {
      title: 'Обновление готово',
      body: 'Перезапустите приложение для установки',
      silent: false
    });

  }
});

autoUpdater.on('error', (err) => {
  console.error('Auto-update error:', err);
});

ipcMain.handle('search-tracks', async (event, query, nextHref = null) => {
  try {
    let url;
    if (nextHref) {
      url = nextHref.includes('client_id') ? nextHref : `${nextHref}&client_id=${CLIENT_ID}`;
    } else {
      url = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${CLIENT_ID}&limit=50`;
    }

    const response = await axios.get(url);
    return {
      collection: response.data.collection || [],
      next_href: response.data.next_href
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
});

ipcMain.handle('search-playlists', async (event, query, nextHref = null) => {
  try {
    let url;
    if (nextHref) {
      url = nextHref.includes('client_id') ? nextHref : `${nextHref}&client_id=${CLIENT_ID}`;
    } else {
      url = `https://api-v2.soundcloud.com/search/playlists?q=${encodeURIComponent(query)}&client_id=${CLIENT_ID}&limit=50`;
    }

    const response = await axios.get(url);
    return {
      collection: response.data.collection || [],
      next_href: response.data.next_href
    };
  } catch (error) {
    console.error('Playlist search error:', error);
    throw error;
  }
});

ipcMain.handle('get-track-stream', async (event, trackId) => {
  try {
    const cachePath = path.join(AUDIO_CACHE_DIR, `${trackId}.mp3`);


    if (fs.existsSync(cachePath)) {

      return `file://${cachePath}`;
    }

    const trackResponse = await axios.get(`https://api-v2.soundcloud.com/tracks/${trackId}?client_id=${CLIENT_ID}`);
    const fullTrack = trackResponse.data;

    if (!fullTrack.media || !fullTrack.media.transcodings) {
      throw new Error('No media data');
    }

    let streamInfo = fullTrack.media.transcodings.find(
      t => t.format.protocol === 'progressive' && t.format.mime_type === 'audio/mpeg'
    );

    if (!streamInfo) {
      streamInfo = fullTrack.media.transcodings[0];
    }

    const streamResponse = await axios.get(`${streamInfo.url}?client_id=${CLIENT_ID}`);
    const streamUrl = streamResponse.data.url;


    if (streamInfo.format.protocol === 'progressive') {
      downloadTrackToCache(streamUrl, cachePath);
    }

    return streamUrl;
  } catch (error) {
    console.error('Stream error:', error);
    throw error;
  }
});

async function downloadTrackToCache(url, filePath) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {

        resolve();
      });
      writer.on('error', (err) => {
        console.error('Error caching track:', err);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        reject(err);
      });
    });
  } catch (e) {
    console.error('Download to cache failed:', e.message);
  }
}

ipcMain.handle('search-users', async (event, query, next_href) => {
  try {
    if (!CLIENT_ID) throw new Error('Client ID not found');
    const url = next_href ? `${next_href}&client_id=${CLIENT_ID}` : `https://api-v2.soundcloud.com/search/users?q=${encodeURIComponent(query)}&client_id=${CLIENT_ID}&limit=20&offset=0`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
});

ipcMain.handle('get-artist-details', async (event, userId) => {
  try {
    if (!CLIENT_ID) throw new Error('Client ID not found');

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    };




    const [profileRes, tracksRes, likesRes, playlistsRes] = await Promise.all([
      axios.get(`https://api-v2.soundcloud.com/users/${userId}?client_id=${CLIENT_ID}`, { headers }),
      axios.get(`https://api-v2.soundcloud.com/users/${userId}/tracks?client_id=${CLIENT_ID}&limit=200`, { headers }),
      axios.get(`https://api-v2.soundcloud.com/users/${userId}/likes?client_id=${CLIENT_ID}&limit=100`, { headers }),
      axios.get(`https://api-v2.soundcloud.com/users/${userId}/playlists?client_id=${CLIENT_ID}&limit=50`, { headers }).catch(() => ({ data: { collection: [] } }))
    ]);

    const allTracks = tracksRes.data.collection || [];
    const artistLikes = (likesRes.data.collection || [])
      .filter(item => item && item.track)
      .map(item => item.track);
    const artistPlaylists = playlistsRes.data.collection || [];



    return {
      profile: profileRes.data,
      tracks: allTracks,
      likes: artistLikes,
      playlists: artistPlaylists
    };
  } catch (error) {
    console.error('Artist details error:', error);
    throw error;
  }
});



const LIKES_FILE = path.join(app.getPath('userData'), 'likes.json');
const AUDIO_CACHE_DIR = path.join(app.getPath('userData'), 'audio_cache');

if (!fs.existsSync(AUDIO_CACHE_DIR)) {
  fs.mkdirSync(AUDIO_CACHE_DIR, { recursive: true });
}

let _likes = [];
try { _likes = JSON.parse(fs.readFileSync(LIKES_FILE)); } catch (e) { _likes = []; }


if (!fs.existsSync(LIKES_FILE)) {
  fs.writeFileSync(LIKES_FILE, '[]');
}

ipcMain.handle('get-likes', async () => {
  return _likes;
});

ipcMain.handle('toggle-like', async (event, track) => {
  try {
    const existingIndex = _likes.findIndex(t => t.id === track.id);
    const isLiking = existingIndex < 0;

    if (!isLiking) {
      _likes.splice(existingIndex, 1);
    } else {
      _likes.unshift(track);
    }

    fs.writeFile(LIKES_FILE, JSON.stringify(_likes), () => { });


    if (OAUTH_TOKEN && track.id && SC_USER) {
      const likeUrl = `https://api-v2.soundcloud.com/users/${SC_USER.id}/track_likes/${track.id}?client_id=${CLIENT_ID}`;
      const method = isLiking ? 'PUT' : 'DELETE';


      const syncWindow = new BrowserWindow({
        show: false,
        webPreferences: { nodeIntegration: false, contextIsolation: true }
      });

      syncWindow.loadURL('https://soundcloud.com').then(() => {
        const script = `
          fetch('${likeUrl}', {
            method: '${method}',
            headers: {
              'Authorization': 'OAuth ${OAUTH_TOKEN}',
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          }).then(r => r.ok ? 'OK' : r.status).catch(e => e.message);
        `;
        syncWindow.webContents.executeJavaScript(script).then(result => {
          if (result === 'OK') {
            console.log('✔ ${method === "PUT" ? "Like" : "Unlike"} synced to SoundCloud');
          } else {
            console.warn('SC Sync result:', result);
          }
          syncWindow.close();
        }).catch(e => {
          console.warn('SC Sync error:', e.message);
          syncWindow.close();
        });
      }).catch(() => syncWindow.close());
    }

    return _likes;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
});

ipcMain.handle('clear-likes', async () => {
  try {
    _likes = [];
    fs.writeFile(LIKES_FILE, '[]', () => { });
    return [];
  } catch (error) {
    console.error('Error clearing likes:', error);
    throw error;
  }
});

ipcMain.handle('get-recommendations', async (event, trackIds) => {
  try {
    if (!CLIENT_ID) throw new Error('Client ID not found');
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    };

    // Use specific track IDs if provided, otherwise pick from history/likes
    let seedTrackIds = trackIds;
    if (!seedTrackIds || seedTrackIds.length === 0) {
      try {
        const likesData = fs.readFileSync(LIKES_FILE, 'utf8');
        const likes = JSON.parse(likesData);
        const historyData = fs.readFileSync(HISTORY_FILE, 'utf8');
        const history = JSON.parse(historyData);

        const allSeeds = [...history.slice(0, 10), ...likes.slice(-10)];
        seedTrackIds = [...new Set(allSeeds.filter(t => t && t.id).map(t => t.id))].slice(0, 5);
      } catch (e) {
        seedTrackIds = [];
      }
    }

    if (seedTrackIds.length === 0) {

      const response = await axios.get(`https://api-v2.soundcloud.com/charts?kind=top&genre=soundcloud%3Aall-music&client_id=${CLIENT_ID}&limit=20`, { headers });
      return response.data.collection.map(item => item.track);
    }


    const relatedPromises = seedTrackIds.map(id =>
      axios.get(`https://api-v2.soundcloud.com/tracks/${id}/related?client_id=${CLIENT_ID}&limit=10`, { headers })
        .catch(() => ({ data: { collection: [] } }))
    );

    const relatedResults = await Promise.all(relatedPromises);
    let recommended = [];
    relatedResults.forEach(res => {
      recommended = [...recommended, ...(res.data.collection || [])];
    });


    const uniqueRecommended = Array.from(new Map(recommended.map(t => [t.id, t])).values());
    return uniqueRecommended.sort(() => Math.random() - 0.5).slice(0, 50);
  } catch (error) {
    console.error('Recommendations error:', error);
    return [];
  }
});

ipcMain.handle('get-charts', async (event, genre = 'soundcloud:all-music') => {
  try {
    if (!CLIENT_ID) throw new Error('Client ID not found');
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    };
    const response = await axios.get(`https://api-v2.soundcloud.com/charts?kind=top&genre=${encodeURIComponent(genre)}&client_id=${CLIENT_ID}&limit=30`, { headers });
    return response.data.collection.map(item => item.track);
  } catch (error) {
    console.error('Charts error:', error);
    return [];
  }
});

const PLAYLISTS_FILE = path.join(app.getPath('userData'), 'playlists.json');

if (!fs.existsSync(PLAYLISTS_FILE)) {
  fs.writeFileSync(PLAYLISTS_FILE, '[]');
}

const HISTORY_FILE = path.join(app.getPath('userData'), 'history.json');


if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));
}

const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');


const defaultSettings = {
  audioQuality: 'High',
  theme: 'Deep Space',
  notifications: true,
  eq: [0, 0, 0, 0, 0],
  volume: 1,
  language: 'ru',
  sidebarMode: 'Standard'
};

if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings));
}

ipcMain.handle('get-settings', async () => {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return defaultSettings;
  }
});

ipcMain.handle('save-settings', async (event, settings) => {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
});

ipcMain.handle('get-history', async () => {
  try {
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading history file:', error);
    return [];
  }
});

ipcMain.handle('import-sc-likes', async (event, profileUrl) => {
  try {
    if (!CLIENT_ID) throw new Error('Client ID not found');

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    };

    if (OAUTH_TOKEN) headers['Authorization'] = `OAuth ${OAUTH_TOKEN}`;

    const resolveRes = await axios.get(
      `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(profileUrl)}&client_id=${CLIENT_ID}`,
      { headers }
    );
    const userId = resolveRes.data.id;

    if (!userId) throw new Error('Could not resolve user from URL');

    const allSCLikes = [];
    let nextUrl = `https://api-v2.soundcloud.com/users/${userId}/likes?client_id=${CLIENT_ID}&limit=200&offset=0`;

    while (nextUrl && allSCLikes.length < 1000) {
      const likesRes = await axios.get(nextUrl, { headers });
      const collection = likesRes.data.collection || [];

      collection.forEach(item => {
        if (item && item.track) {
          allSCLikes.push(item.track);
        }
      });

      nextUrl = likesRes.data.next_href ? `${likesRes.data.next_href}&client_id=${CLIENT_ID}` : null;
      if (!likesRes.data.next_href) break;
    }

    const localIds = new Set(_likes.map(t => t.id));
    const newTracks = allSCLikes.filter(track => track && track.id && !localIds.has(track.id));

    if (newTracks.length > 0) {
      // Prepend new tracks to local likes
      _likes = [...newTracks, ..._likes];
      fs.writeFileSync(LIKES_FILE, JSON.stringify(_likes));
    }

    return _likes;
  } catch (error) {
    console.error('Import error details:', error.response ? error.response.status + ' ' + JSON.stringify(error.response.data) : error.message);
    throw error;
  }
});

ipcMain.handle('select-custom-background', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Media', extensions: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'webm'] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const sourcePath = result.filePaths[0];
  const backgroundsDir = path.join(app.getPath('userData'), 'backgrounds');

  if (!fs.existsSync(backgroundsDir)) {
    fs.mkdirSync(backgroundsDir);
  }

  const ext = path.extname(sourcePath);
  const fileName = `bg-${Date.now()}${ext}`;
  const destPath = path.join(backgroundsDir, fileName);

  fs.copyFileSync(sourcePath, destPath);

  return `file://${destPath.replace(/\\/g, '/')}`;
});

ipcMain.handle('connect-soundcloud', async () => {
  return new Promise((resolve) => {
    const loginWindow = new BrowserWindow({
      width: 600,
      height: 800,
      show: true,
      autoHideMenuBar: true,
      title: 'Login to SoundCloud'
    });

    const filter = {
      urls: ['*://*.soundcloud.com/*']
    };

    const onBeforeSendHeaders = (details, callback) => {
      const authHeader = details.requestHeaders['Authorization'] || details.requestHeaders['authorization'];
      if (authHeader && authHeader.startsWith('OAuth ')) {
        const token = authHeader.replace('OAuth ', '');
        if (token && token !== OAUTH_TOKEN) {
          OAUTH_TOKEN = token;


          axios.get(`https://api-v2.soundcloud.com/me?client_id=${CLIENT_ID}`, {
            headers: { 'Authorization': `OAuth ${OAUTH_TOKEN}` }
          }).then(res => {
            SC_USER = res.data;
            fs.writeFileSync(AUTH_FILE, JSON.stringify({ token: OAUTH_TOKEN, user: SC_USER }));
            session.defaultSession.webRequest.onBeforeSendHeaders(null);
            if (!loginWindow.isDestroyed()) loginWindow.close();
            resolve({ success: true, user: SC_USER });
          }).catch(err => {
            console.error('Failed to get user info:', err);
          });
        }
      }
      callback({ requestHeaders: details.requestHeaders });
    };

    session.defaultSession.webRequest.onBeforeSendHeaders(filter, onBeforeSendHeaders);
    loginWindow.loadURL('https://soundcloud.com/signin');

    loginWindow.on('closed', () => {
      session.defaultSession.webRequest.onBeforeSendHeaders(null);
      resolve({ success: false });
    });
  });
});

ipcMain.handle('get-sc-user', async () => {
  return SC_USER;
});

ipcMain.handle('disconnect-soundcloud', async () => {
  OAUTH_TOKEN = null;
  SC_USER = null;
  if (fs.existsSync(AUTH_FILE)) fs.unlinkSync(AUTH_FILE);
  return true;
});

ipcMain.on('update-discord-rpc', (event, data) => {
  setRPCActivity(data);
});

ipcMain.handle('add-to-history', async (event, item) => {
  try {
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    let history = JSON.parse(data);


    history = history.filter(i => i.id !== item.id);


    history.unshift(item);


    if (history.length > 50) {
      history = history.slice(0, 50);
    }

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history));
    return history;
  } catch (error) {
    console.error('Error adding to history:', error);
    throw error;
  }
});

ipcMain.handle('get-liked-playlists', async () => {
  try {
    const data = fs.readFileSync(PLAYLISTS_FILE);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading playlists:', error);
    return [];
  }
});

ipcMain.handle('toggle-like-playlist', async (event, playlist) => {
  try {
    const data = fs.readFileSync(PLAYLISTS_FILE);
    let playlists = JSON.parse(data);
    const existingIndex = playlists.findIndex(p => p.id === playlist.id);

    if (existingIndex >= 0) {
      playlists.splice(existingIndex, 1);
    } else {
      playlists.unshift(playlist);
    }

    fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(playlists));
    return playlists;
  } catch (error) {
    console.error('Error toggling playlist like:', error);
    throw error;
  }
});

ipcMain.handle('get-playlist-details', async (event, playlistId) => {
  try {

    const url = `https://api-v2.soundcloud.com/playlists/${playlistId}?client_id=${CLIENT_ID}&representation=full&limit=500`;
    const response = await axios.get(url);
    let playlistData = response.data;
    let initialTracks = playlistData.tracks || [];
    const expectedCount = playlistData.track_count || 0;


    if (initialTracks.length < expectedCount && playlistData.permalink_url) {
      try {

        const htmlResponse = await axios.get(playlistData.permalink_url);
        const html = htmlResponse.data;

        const hydrationMatch = html.match(/window\.__sc_hydration\s*=\s*(\[.*?\]);/);
        if (hydrationMatch && hydrationMatch[1]) {
          const hydrationData = JSON.parse(hydrationMatch[1]);


          const hydratedPlaylist = hydrationData.find(item =>
            item.hydratable === 'playlist' && item.data.id === parseInt(playlistId)
          );

          if (hydratedPlaylist && hydratedPlaylist.data.tracks) {
            const hydratedTracks = hydratedPlaylist.data.tracks;

            if (hydratedTracks.length > initialTracks.length) {

              initialTracks = hydratedTracks;
            }
          }
        }
      } catch (scrapeError) {
        console.error('Scraping fallback failed:', scrapeError);
      }
    }


    const allTrackIds = initialTracks.reduce((acc, t) => {
      if (typeof t === 'number') {
        acc.push(t);
      } else if (typeof t === 'object') {
        acc.push(t.id);
      }
      return acc;
    }, []);

    const idsToFetch = initialTracks.reduce((acc, t) => {
      if (typeof t === 'number') {
        acc.push(t);
      } else if (typeof t === 'object') {

        if (!t.title || !t.user || !t.artwork_url) {
          acc.push(t.id);
        }
      }
      return acc;
    }, []);

    const fetchedTracksMap = new Map();
    const uniqueIdsToFetch = [...new Set(idsToFetch)];
    const batchSize = 50;

    for (let i = 0; i < uniqueIdsToFetch.length; i += batchSize) {
      const batchIds = uniqueIdsToFetch.slice(i, i + batchSize);
      const batchUrl = `https://api-v2.soundcloud.com/tracks?ids=${batchIds.join(',')}&client_id=${CLIENT_ID}&limit=${batchSize}&representation=full`;
      try {
        const batchResponse = await axios.get(batchUrl);
        const tracksData = Array.isArray(batchResponse.data) ? batchResponse.data : (batchResponse.data.collection || []);

        tracksData.forEach(track => {
          fetchedTracksMap.set(track.id, track);
        });
      } catch (e) {
        console.error('Error fetching track batch:', e);
      }
    }



    return allTrackIds.map(id => {

      const original = initialTracks.find(t => (typeof t === 'object' && t.id === id));
      const fetched = fetchedTracksMap.get(id);


      let final = fetched;


      if (!final && original && original.title && original.user) {
        final = original;
      }


      if (!final) {
        final = { id, title: 'Unknown Track', user: { username: 'Unknown' } };
      }


      if (!final.artwork_url && final.user && final.user.avatar_url) {
        final.artwork_url = final.user.avatar_url;
      }

      return final;
    });

  } catch (error) {
    console.error('Error fetching playlist details:', error);
    throw error;
  }
});

function createTray() {
  const iconPath = path.join(__dirname, 'src', 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png');
  console.log('Tray Icon Path:', iconPath);

  const { nativeImage } = require('electron');
  let icon = nativeImage.createFromPath(iconPath);

  if (icon.isEmpty()) {
    console.error('Tray icon is empty! Trying PNG fallback...');
    const pngPath = path.join(__dirname, 'src', 'assets', 'icon.png');
    icon = nativeImage.createFromPath(pngPath);
    if (icon.isEmpty()) {
      console.error('PNG fallback also empty!');
    }
  }

  // Resize for better compatibility if needed, though usually ICO is multi-size
  // icon = icon.resize({ width: 16, height: 16 });

  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Открыть SoundCloud', click: () => mainWindow.show() },
    { type: 'separator' },
    {
      label: 'Выход', click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('SoundCloud Desktop');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

app.on('before-quit', () => {
  isQuitting = true;
});

app.whenReady().then(async () => {
  await getClientId();
  console.log('Client ID:', CLIENT_ID);
  createWindow();
  createTray();
  connectRPC();


  globalShortcut.register('MediaPlayPause', () => {
    if (mainWindow) mainWindow.webContents.send('media-control', 'play-pause');
  });

  globalShortcut.register('MediaNextTrack', () => {
    if (mainWindow) mainWindow.webContents.send('media-control', 'next');
  });

  globalShortcut.register('MediaPreviousTrack', () => {
    if (mainWindow) mainWindow.webContents.send('media-control', 'previous');
  });
});

app.on('will-quit', () => {

  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});