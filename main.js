const { app, BrowserWindow, ipcMain, session, Tray, Menu, Notification, globalShortcut, dialog, net: electronNet } = require('electron');

// Load environment variables
require('dotenv').config();

app.name = 'SoundCloud Desktop';
if (process.platform === 'win32') {
  app.setAppUserModelId('com.soundcloud.desktop');
}

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
const DiscordRPC = require('discord-rpc');
let rpc;
let rpcClientId = '1458763452041662618'; // Public Discord Application ID (Safe to share)

let rpcReady = false;

function initRPC(clientId) {
  if (rpc) {
    try {
      rpc.clearActivity();
      rpc.destroy();
    } catch (e) {
      console.error('Error destroying RPC:', e);
    }
  }

  if (!clientId) return;

  rpcClientId = clientId;
  rpc = new DiscordRPC.Client({ transport: 'ipc' });

  rpc.on('ready', () => {
    rpcReady = true;
    console.log(`Discord RPC ready for Client ID: ${rpcClientId}`);
  });

  rpc.login({ clientId: rpcClientId }).catch(err => {
    console.error('Failed to connect to Discord RPC:', err);
    rpcReady = false;
  });
}

// Initialize with default or loaded settings later
initRPC(rpcClientId);

ipcMain.on('rpc-update', (event, { title, artist, duration, seek, isPlaying, artworkUrl }) => {
  if (!rpcReady || !rpc) return;

  const presence = {
    details: title,
    state: artist ? `by ${artist}` : 'Unknown Artist',
    assets: {
      large_image: artworkUrl || 'icon',
      large_text: 'SoundCloud Desktop',
      small_image: isPlaying ? 'play' : 'pause',
      small_text: isPlaying ? 'Playing' : 'Paused',
    },
    type: 2, // LISTENING
    instance: false,
  };

  if (duration && isPlaying) {
    presence.timestamps = {
      start: Math.round(Date.now() - (seek * 1000)),
      end: Math.round(Date.now() + ((duration - seek) * 1000))
    };
  }

  // Use raw request to force type: 2 (Listening) which might be filtered by setActivity helpers
  rpc.request('SET_ACTIVITY', {
    pid: process.pid,
    activity: presence
  }).catch(console.error);
});

ipcMain.on('rpc-clear', () => {
  if (rpcReady && rpc) {
    rpc.clearActivity();
  }
});

const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpProxyAgent } = require('http-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { execSync } = require('child_process');


let CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID; // Loaded from .env
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
    let hiddenWindow = null;
    let timeoutId = null;

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      try {
        session.defaultSession.webRequest.onBeforeRequest(null);
      } catch (e) { }
      if (hiddenWindow && !hiddenWindow.isDestroyed()) {
        hiddenWindow.close();
        hiddenWindow = null;
      }
    };

    try {
      hiddenWindow = new BrowserWindow({
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
              cleanup();
              resolve(clientId);
              return;
            }
          } catch (e) { }
        }
        callback({});
      };

      session.defaultSession.webRequest.onBeforeRequest(filter, onBeforeRequest);
      hiddenWindow.loadURL('https://soundcloud.com').catch(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(CLIENT_ID);
        }
      });

      timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(CLIENT_ID);
        }
      }, 15000);

      hiddenWindow.on('closed', () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(CLIENT_ID);
        }
      });
    } catch (e) {
      cleanup();
      resolve(CLIENT_ID);
    }
  });
}

async function makeRequest(url, options = {}, retries = 1) {
  return new Promise(async (resolve, reject) => {
    // Auto-fetch ID if missing before request
    if (url.includes('client_id=undefined') || !CLIENT_ID) {
      await getClientId();
      url = url.replace('client_id=undefined', `client_id=${CLIENT_ID}`);
    }

    const request = electronNet.request({
      url,
      method: options.method || 'GET',
      session: session.defaultSession
    });

    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        request.setHeader(key, value);
      });
    }

    request.on('response', (response) => {
      const chunks = [];
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      response.on('end', async () => {
        const data = Buffer.concat(chunks);
        const dataString = data.toString();

        // Clear chunks array to free memory
        chunks.length = 0;

        // Handle 401 Unauthorized by refreshing Client ID
        if (response.statusCode === 401 && retries > 0 && !url.includes('soundcloud.com/connect')) {
          await getClientId();
          const newUrl = url.includes('client_id=')
            ? url.replace(/client_id=[^&]+/, `client_id=${CLIENT_ID}`)
            : url;
          resolve(await makeRequest(newUrl, options, retries - 1));
          return;
        }

        if (response.statusCode >= 400) {
          reject({ response: { status: response.statusCode, data: dataString } });
        } else {
          try {
            resolve({ data: JSON.parse(dataString), status: response.statusCode });
          } catch (e) {
            resolve({ data: dataString, status: response.statusCode });
          }
        }
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    if (options.data) {
      request.write(typeof options.data === 'string' ? options.data : JSON.stringify(options.data));
    }
    request.end();
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
      devTools: true,
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

  mainWindow.on('closed', () => {
    // Window is already destroyed, just clean up reference
    mainWindow = null;
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

  let isMiniPlayer = false;
  let normalBounds = { width: 1200, height: 800, x: undefined, y: undefined };

  ipcMain.on('window-toggle-mini', () => {
    isMiniPlayer = !isMiniPlayer;
    if (isMiniPlayer) {
      normalBounds = mainWindow.getBounds();
      mainWindow.setAlwaysOnTop(true, 'floating');
      mainWindow.setResizable(false);
      mainWindow.setMinimumSize(320, 320);
      mainWindow.setSize(320, 320);
      mainWindow.webContents.send('mini-player-state', true);
    } else {
      mainWindow.setAlwaysOnTop(false);
      mainWindow.setResizable(true);
      mainWindow.setMinimumSize(1000, 700);
      mainWindow.setSize(normalBounds.width, normalBounds.height);
      if (normalBounds.x !== undefined) mainWindow.setPosition(normalBounds.x, normalBounds.y);
      mainWindow.webContents.send('mini-player-state', false);
    }
  });

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

    const response = await makeRequest(url);
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

    const response = await makeRequest(url);
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

    const trackResponse = await makeRequest(`https://api-v2.soundcloud.com/tracks/${trackId}?client_id=${CLIENT_ID}`);
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

    const streamResponse = await makeRequest(`${streamInfo.url}?client_id=${CLIENT_ID}`);
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
    // For large file downloads, we still use axios for simplicity with streams
    // but in a real DPI bypass scenario, we'd use native net. For now,
    // since this is just the audio file, the OS level DPI bypass works better anyway.
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Failed to cache track:', error);
  }
}

ipcMain.handle('search-users', async (event, query, next_href) => {
  try {
    // if (!CLIENT_ID) throw new Error('Client ID not found');
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
    // if (!CLIENT_ID) throw new Error('Client ID not found');

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    };




    const [profileRes, tracksRes, likesRes, playlistsRes] = await Promise.all([
      makeRequest(`https://api-v2.soundcloud.com/users/${userId}?client_id=${CLIENT_ID}`, { headers }),
      makeRequest(`https://api-v2.soundcloud.com/users/${userId}/tracks?client_id=${CLIENT_ID}&limit=200`, { headers }),
      makeRequest(`https://api-v2.soundcloud.com/users/${userId}/likes?client_id=${CLIENT_ID}&limit=100`, { headers }),
      makeRequest(`https://api-v2.soundcloud.com/users/${userId}/playlists?client_id=${CLIENT_ID}&limit=50`, { headers }).catch(() => ({ data: { collection: [] } }))
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

// Clean old cache files to prevent disk space bloat
function cleanOldCache() {
  try {
    const files = fs.readdirSync(AUDIO_CACHE_DIR);
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    let deletedCount = 0;
    files.forEach(file => {
      const filePath = path.join(AUDIO_CACHE_DIR, file);
      try {
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > maxAge) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      } catch (e) { }
    });

    if (deletedCount > 0) {
      console.log(`[CACHE] Cleaned ${deletedCount} old files`);
    }
  } catch (e) {
    console.error('[CACHE] Cleanup error:', e);
  }
}

// Run cache cleanup on startup
cleanOldCache();

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

      // Limit likes array to prevent memory bloat (max 2000 tracks)
      if (_likes.length > 2000) {
        _likes = _likes.slice(0, 2000);
      }
    }

    fs.writeFile(LIKES_FILE, JSON.stringify(_likes), () => { });
    // Sync to SoundCloud profile if connected
    if (OAUTH_TOKEN && track.id && SC_USER) {
      const likeUrl = `https://api-v2.soundcloud.com/users/${SC_USER.id}/track_likes/${track.id}?client_id=${CLIENT_ID}`;
      const method = isLiking ? 'PUT' : 'DELETE';

      let syncWindow = null;
      const closeSyncWindow = () => {
        if (syncWindow && !syncWindow.isDestroyed()) {
          syncWindow.close();
          syncWindow = null;
        }
      };

      try {
        syncWindow = new BrowserWindow({
          show: false,
          webPreferences: { nodeIntegration: false, contextIsolation: true }
        });

        // Set timeout to force close window after 10 seconds
        const timeoutId = setTimeout(() => {
          closeSyncWindow();
        }, 10000);

        syncWindow.on('closed', () => {
          clearTimeout(timeoutId);
          syncWindow = null;
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
            clearTimeout(timeoutId);
            closeSyncWindow();
          }).catch(e => {
            console.warn('SC Sync error:', e.message);
            clearTimeout(timeoutId);
            closeSyncWindow();
          });
        }).catch(() => {
          clearTimeout(timeoutId);
          closeSyncWindow();
        });
      } catch (e) {
        console.error('Failed to create sync window:', e);
        closeSyncWindow();
      }
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
    // if (!CLIENT_ID) throw new Error('Client ID not found');
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
      const response = await makeRequest(`https://api-v2.soundcloud.com/charts?kind=top&genre=soundcloud%3Aall-music&client_id=${CLIENT_ID}&limit=20`, { headers });
      return response.data.collection.map(item => item.track);
    }


    const relatedPromises = seedTrackIds.map(id =>
      makeRequest(`https://api-v2.soundcloud.com/tracks/${id}/related?client_id=${CLIENT_ID}&limit=10`, { headers })
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
    const response = await makeRequest(`https://api-v2.soundcloud.com/charts?kind=top&genre=${encodeURIComponent(genre)}&client_id=${CLIENT_ID}&limit=30`, { headers });
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
  eq: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  volume: 1,
  language: 'ru',
  sidebarMode: 'Standard',
  discordClientId: '1458763452041662618'
};

if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings));
}

ipcMain.handle('get-settings', async () => {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
    const settings = JSON.parse(data);
    return settings;
  } catch (error) {
    return defaultSettings;
  }
});

async function applyProxy(settings) {
  if (settings && settings.proxyEnabled) {
    let proxyUrl = settings.proxyUrl;
    if (settings.proxyType === 'Builtin') {
      proxyUrl = 'http://52.188.28.218:3128';
    }

    if (proxyUrl) {
      try {
        // console.log(`[PROXY] Activating: ${proxyUrl}`);
        if (session.defaultSession) {
          await session.defaultSession.setProxy({
            proxyRules: proxyUrl,
            proxyBypassRules: 'localhost,127.0.0.1'
          });
        }

        // Use proper agents for axios (Universal SOCKS/HTTP/HTTPS support)
        try {
          const url = new URL(proxyUrl);
          axios.defaults.proxy = false; // Disable default axios proxy logic

          if (url.protocol.startsWith('socks')) {
            const agent = new SocksProxyAgent(proxyUrl);
            axios.defaults.httpAgent = agent;
            axios.defaults.httpsAgent = agent;
          } else {
            const httpAgent = new HttpProxyAgent(proxyUrl);
            const httpsAgent = new HttpsProxyAgent(proxyUrl);
            axios.defaults.httpAgent = httpAgent;
            axios.defaults.httpsAgent = httpsAgent;
          }
          axios.defaults.timeout = 25000;
        } catch (e) {
          // console.error('[PROXY] Agent creation failed:', e);
        }
        // console.log(`[PROXY] System-wide routing initialized.`);
      } catch (e) {
        console.error('[PROXY] Setup error:', e);
      }
    }
  } else {
    try {
      if (session.defaultSession) {
        await session.defaultSession.setProxy({ proxyRules: '' });
      }
      axios.defaults.proxy = false;
      axios.defaults.httpAgent = null;
      axios.defaults.httpsAgent = null;
      axios.defaults.timeout = 30000;
      // console.log('[PROXY] Disabled');
    } catch (e) { }
  }
}

ipcMain.handle('save-settings', async (event, settings) => {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings));
    applyProxy(settings);
    if (settings.discordClientId && settings.discordClientId !== rpcClientId) {
      initRPC(settings.discordClientId);
    }
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

    const resolveRes = await makeRequest(
      `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(profileUrl)}&client_id=${CLIENT_ID}`,
      { headers }
    );
    const userId = resolveRes.data.id;

    if (!userId) throw new Error('Could not resolve user from URL');

    const allSCLikes = [];
    let nextUrl = `https://api-v2.soundcloud.com/users/${userId}/likes?client_id=${CLIENT_ID}&limit=200&offset=0`;

    while (nextUrl && allSCLikes.length < 1000) {
      const likesRes = await makeRequest(nextUrl, { headers });
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
      _likes = [...newTracks, ..._likes];
      fs.writeFileSync(LIKES_FILE, JSON.stringify(_likes));
    }

    return _likes;
  } catch (error) {
    console.error('Import error details:', error.response ? error.response.status + ' ' + JSON.stringify(error.response.data) : error.message);
    throw error;
  }
});

ipcMain.handle('import-sc-playlists', async (event, profileUrl) => {
  try {
    if (!CLIENT_ID) throw new Error('Client ID not found');

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    };

    if (OAUTH_TOKEN) headers['Authorization'] = `OAuth ${OAUTH_TOKEN}`;

    const resolveRes = await makeRequest(
      `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(profileUrl)}&client_id=${CLIENT_ID}`,
      { headers }
    );
    const userId = resolveRes.data.id;

    if (!userId) throw new Error('Could not resolve user from URL');

    const allSCPlaylists = [];
    let nextUrl = `https://api-v2.soundcloud.com/users/${userId}/playlists_without_albums?client_id=${CLIENT_ID}&limit=200&offset=0`;

    while (nextUrl && allSCPlaylists.length < 500) {
      const playlistsRes = await makeRequest(nextUrl, { headers });
      const collection = playlistsRes.data.collection || [];

      collection.forEach(item => {
        if (item && item.id) {
          allSCPlaylists.push(item);
        }
      });

      nextUrl = playlistsRes.data.next_href ? `${playlistsRes.data.next_href}&client_id=${CLIENT_ID}` : null;
      if (!playlistsRes.data.next_href) break;
    }

    // Also fetch liked playlists (playlists liked by the user, not created by them)
    let likedPlaylistsUrl = `https://api-v2.soundcloud.com/users/${userId}/playlist_likes?client_id=${CLIENT_ID}&limit=200&offset=0`;

    while (likedPlaylistsUrl && allSCPlaylists.length < 500) {
      const likedPlaylistsRes = await makeRequest(likedPlaylistsUrl, { headers }).catch(() => ({ data: { collection: [] } }));
      const collection = likedPlaylistsRes.data.collection || [];

      collection.forEach(item => {
        if (item && item.playlist) {
          allSCPlaylists.push(item.playlist);
        }
      });

      likedPlaylistsUrl = likedPlaylistsRes.data.next_href ? `${likedPlaylistsRes.data.next_href}&client_id=${CLIENT_ID}` : null;
      if (!likedPlaylistsRes.data.next_href) break;
    }

    // Read existing playlists
    let existingPlaylists = [];
    try {
      const data = fs.readFileSync(PLAYLISTS_FILE);
      existingPlaylists = JSON.parse(data);
    } catch (e) {
      existingPlaylists = [];
    }

    const localIds = new Set(existingPlaylists.map(p => p.id));
    const newPlaylists = allSCPlaylists.filter(playlist => playlist && playlist.id && !localIds.has(playlist.id));

    if (newPlaylists.length > 0) {
      existingPlaylists = [...newPlaylists, ...existingPlaylists];
      fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(existingPlaylists));
    }

    return existingPlaylists;
  } catch (error) {
    console.error('Import playlists error details:', error.response ? error.response.status + ' ' + JSON.stringify(error.response.data) : error.message);
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
    let loginWindow = null;
    let resolved = false;

    const cleanup = () => {
      try {
        session.defaultSession.webRequest.onBeforeSendHeaders(null);
      } catch (e) { }
      if (loginWindow && !loginWindow.isDestroyed()) {
        loginWindow.close();
        loginWindow = null;
      }
    };

    try {
      loginWindow = new BrowserWindow({
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
          if (token && token !== OAUTH_TOKEN && !resolved) {
            OAUTH_TOKEN = token;

            makeRequest(`https://api-v2.soundcloud.com/me?client_id=${CLIENT_ID}`, {
              headers: { 'Authorization': `OAuth ${OAUTH_TOKEN}` }
            }).then(res => {
              SC_USER = res.data;
              fs.writeFileSync(AUTH_FILE, JSON.stringify({ token: OAUTH_TOKEN, user: SC_USER }));
              resolved = true;
              cleanup();
              resolve({ success: true, user: SC_USER });
            }).catch(err => {
              console.error('Failed to get user info:', err);
              if (!resolved) {
                resolved = true;
                cleanup();
                resolve({ success: false });
              }
            });
          }
        }
        callback({ requestHeaders: details.requestHeaders });
      };

      session.defaultSession.webRequest.onBeforeSendHeaders(filter, onBeforeSendHeaders);
      loginWindow.loadURL('https://soundcloud.com/signin').catch(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve({ success: false });
        }
      });

      loginWindow.on('closed', () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve({ success: false });
        }
      });
    } catch (e) {
      console.error('Failed to create login window:', e);
      cleanup();
      resolve({ success: false });
    }
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
    const response = await makeRequest(url);
    let playlistData = response.data;
    let initialTracks = playlistData.tracks || [];
    const expectedCount = playlistData.track_count || 0;


    if (initialTracks.length < expectedCount && playlistData.permalink_url) {
      try {
        const htmlResponse = await makeRequest(playlistData.permalink_url);
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
        const batchResponse = await makeRequest(batchUrl);
        const tracksData = Array.isArray(batchResponse.data) ? batchResponse.data : (batchResponse.data.collection || []);

        tracksData.forEach(track => {
          fetchedTracksMap.set(track.id, track);
        });
      } catch (e) {
        console.error('Error fetching track batch:', e);
      }
    }

    const result = allTrackIds.map(id => {
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

    // Clear Map to free memory
    fetchedTracksMap.clear();

    return result;

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
  // Load settings and apply proxy before ClientID fetch
  let settings = defaultSettings;
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    }
  } catch (e) { }
  await applyProxy(settings);

  await getClientId();
  createWindow();
  createTray();


  globalShortcut.register('MediaPlayPause', () => {
    if (mainWindow) mainWindow.webContents.send('media-control', 'play-pause');
  });

  globalShortcut.register('MediaNextTrack', () => {
    if (mainWindow) mainWindow.webContents.send('media-control', 'next');
  });

  globalShortcut.register('MediaPreviousTrack', () => {
    if (mainWindow) mainWindow.webContents.send('media-control', 'previous');
  });

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    if (mainWindow) mainWindow.webContents.toggleDevTools();
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