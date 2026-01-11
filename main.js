const { app, BrowserWindow, ipcMain, session, Tray, Menu, globalShortcut, dialog, net: electronNet } = require('electron');
const { spawn } = require('child_process');
require('dotenv').config();

app.name = 'SoundCloud Desktop';
if (process.platform === 'win32') {
  app.setAppUserModelId('com.soundcloud.desktop');
}

let tray = null;
let isQuitting = false;
let mainWindow;
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const net = require('net');
const DiscordRPC = require('discord-rpc');
let rpc;
let rpcClientId = '1458763452041662618';
let goodbyeDpiProcess = null;
const CURRENT_VERSION = app.getVersion();
const REPO_OWNER = 'dissstructed1337';
const REPO_NAME = 'soundcloud-desktop';
let updateDownloadedPath = null;

const DATA_PATH = app.getPath('userData');
const LIKES_FILE = path.join(DATA_PATH, 'likes.json');
const HISTORY_FILE = path.join(DATA_PATH, 'history.json');
const STATS_FILE = path.join(DATA_PATH, 'stats.json');
const SETTINGS_FILE = path.join(DATA_PATH, 'settings.json');
const AUTH_FILE = path.join(DATA_PATH, 'auth.json');
const PLAYLISTS_FILE = path.join(DATA_PATH, 'playlists.json');
const AUDIO_CACHE_DIR = path.join(DATA_PATH, 'audio_cache');

if (!fs.existsSync(AUDIO_CACHE_DIR)) fs.mkdirSync(AUDIO_CACHE_DIR, { recursive: true });
[HISTORY_FILE, STATS_FILE, SETTINGS_FILE, LIKES_FILE, PLAYLISTS_FILE].forEach(file => {
  if (!fs.existsSync(file)) fs.writeFileSync(file, file === SETTINGS_FILE ? '{}' : '[]');
});

function isNewer(latest, current) {
  const l = latest.split('.').map(Number);
  const c = current.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (l[i] > c[i]) return true;
    if (l[i] < c[i]) return false;
  }
  return false;
}

async function checkAndDownloadUpdate() {
  try {
    const res = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`);
    const latestVersion = res.data.tag_name.replace('v', '');

    if (isNewer(latestVersion, CURRENT_VERSION)) {
      console.log(`[Updater] New version found: ${latestVersion}. Starting download...`);
      mainWindow?.webContents.send('update-available', latestVersion);

      const asset = res.data.assets.find(a => a.name.endsWith('.exe') && !a.name.includes('blockmap'));
      if (asset) {
        const downloadUrl = asset.browser_download_url;
        const tempPath = path.join(app.getPath('temp'), `SoundCloudDesktop-Setup-${latestVersion}.exe`);

        const response = await axios({
          method: 'get',
          url: downloadUrl,
          responseType: 'stream'
        });

        const totalLength = response.headers['content-length'];
        let downloadedLength = 0;

        const writer = fs.createWriteStream(tempPath);
        response.data.on('data', (chunk) => {
          downloadedLength += chunk.length;
          const progress = Math.round((downloadedLength / totalLength) * 100);
          mainWindow?.webContents.send('update-progress', progress);
        });

        response.data.pipe(writer);

        writer.on('finish', () => {
          updateDownloadedPath = tempPath;
          console.log('[Updater] Update downloaded to:', tempPath);
          mainWindow?.webContents.send('update-downloaded', latestVersion);
        });
      }
    }
  } catch (err) {
    console.error('[Updater] Update check failed:', err);
  }
}



ipcMain.handle('install-update', () => {
  if (updateDownloadedPath) {
    const { shell } = require('electron');
    shell.openPath(updateDownloadedPath);
    setTimeout(() => app.quit(), 1000);
  }
});

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

initRPC(rpcClientId);

const RATE_LIMIT_DELAY = 1500;
let lastSendTime = 0;
let latestActivity = null;
let retryTimeout = null;

const sendActivity = async () => {
  if (!rpc || !rpcReady || !latestActivity) return;

  const now = Date.now();
  const timeSinceLast = now - lastSendTime;

  if (timeSinceLast < RATE_LIMIT_DELAY) {
    if (retryTimeout) clearTimeout(retryTimeout);
    retryTimeout = setTimeout(sendActivity, RATE_LIMIT_DELAY - timeSinceLast + 50);
    return;
  }

  if (retryTimeout) clearTimeout(retryTimeout);
  lastSendTime = now;

  try {
    await rpc.request('SET_ACTIVITY', {
      pid: process.pid,
      activity: latestActivity
    });
  } catch (err) {
    if (retryTimeout) clearTimeout(retryTimeout);
    retryTimeout = setTimeout(sendActivity, 5000);
  }
};

setInterval(() => {
  if (latestActivity && Date.now() - lastSendTime > 10000) {
    sendActivity();
  }
}, 5000);

ipcMain.on('rpc-update', (event, { title, artist, duration, seek, isPlaying, artworkUrl }) => {
  if (!rpcReady || !rpc) {
    return;
  }

  const presence = {
    details: title,
    state: artist ? `by ${artist}` : 'Unknown Artist',
    assets: {
      large_image: artworkUrl || 'icon',
      large_text: 'SoundCloud Desktop',
      small_image: isPlaying ? 'play' : 'pause',
      small_text: isPlaying ? 'Playing' : 'Paused',
    },
    type: 2,
    instance: false,
  };

  if (isPlaying) {
    presence.timestamps = {
      start: Date.now() - Math.round(seek * 1000),
      end: Date.now() + Math.round((duration - seek) * 1000)
    };
  } else {
    presence.timestamps = undefined;

    const cur = Math.floor(seek || 0);
    const tot = Math.floor(duration || 0);
    const fmt = n => `${Math.floor(n / 60)}:${(n % 60).toString().padStart(2, '0')}`;

    if (tot > 0) {
      presence.state = `${fmt(cur)} / ${fmt(tot)} (Paused)`;
    } else {
      presence.state = `${fmt(cur)} (Paused)`;
    }
  }

  latestActivity = presence;
  sendActivity();
});

ipcMain.on('rpc-clear', () => {
  latestActivity = null;
  if (retryTimeout) clearTimeout(retryTimeout);

  if (rpcReady && rpc) {
    rpc.clearActivity().catch(console.error);
  }
});




let CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID;
let OAUTH_TOKEN = null;
let SC_USER = null;

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
  if (url.includes('client_id=undefined') || !CLIENT_ID) {
    await getClientId();
    url = url.replace('client_id=undefined', `client_id=${CLIENT_ID}`);
  }

  return new Promise((resolve, reject) => {
    const request = electronNet.request({
      url,
      method: options.method || 'GET',
      session: session.defaultSession
    });


    request.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    request.setHeader('Accept', 'application/json, text/plain, */*');
    request.setHeader('Accept-Language', 'en-US,en;q=0.9');
    request.setHeader('Referer', 'https://soundcloud.com/');
    request.setHeader('Origin', 'https://soundcloud.com');
    request.setHeader('sec-ch-ua', '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"');
    request.setHeader('sec-ch-ua-mobile', '?0');
    request.setHeader('sec-ch-ua-platform', '"Windows"');
    request.setHeader('sec-fetch-dest', 'empty');
    request.setHeader('sec-fetch-mode', 'cors');
    request.setHeader('sec-fetch-site', 'same-site');

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

        if ((response.statusCode === 401 || response.statusCode === 400) && retries > 0 && !url.includes('soundcloud.com/connect')) {
          await getClientId();
          const newUrl = url.includes('client_id=')
            ? url.replace(/client_id=[^&]+/, `client_id=${CLIENT_ID}`)
            : (url.includes('?') ? `${url}&client_id=${CLIENT_ID}` : `${url}?client_id=${CLIENT_ID}`);
          try {
            const retryRes = await makeRequest(newUrl, options, retries - 1);
            resolve(retryRes);
          } catch (e) {
            reject(e);
          }
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
    setTimeout(checkAndDownloadUpdate, 5000);
  });
}


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
    const url = next_href ? `${next_href}&client_id=${CLIENT_ID}` : `https://api-v2.soundcloud.com/search/users?q=${encodeURIComponent(query)}&client_id=${CLIENT_ID}&limit=20&offset=0`;
    const response = await makeRequest(url);
    return response.data;
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
});

ipcMain.handle('get-artist-details', async (event, userId) => {
  try {


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





function cleanOldCache() {
  try {
    const files = fs.readdirSync(AUDIO_CACHE_DIR);
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000;

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

cleanOldCache();

let _likes = [];
try { _likes = JSON.parse(fs.readFileSync(LIKES_FILE)); } catch (e) { _likes = []; }




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

      if (_likes.length > 2000) {
        _likes = _likes.slice(0, 2000);
      }
    }

    fs.writeFileSync(LIKES_FILE, JSON.stringify(_likes));

    if (OAUTH_TOKEN && track.id && SC_USER) {
      syncActionToSC(track.id, isLiking, 'track');
    }

    return _likes;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
});

const syncQueue = [];
let isProcessingSync = false;

async function syncActionToSC(itemId, isLiking, type = 'track') {
  if (!OAUTH_TOKEN || !itemId) {
    console.warn(`[Sync] Skipping sync: missing credentials or item ID`);
    return;
  }

  syncQueue.push({ itemId, isLiking, type });
  processSyncQueue();
}

async function processSyncQueue() {
  if (isProcessingSync || syncQueue.length === 0) return;
  isProcessingSync = true;

  const { itemId, isLiking, type } = syncQueue.shift();
  const method = isLiking ? 'PUT' : 'DELETE';
  const endpoint = type === 'track' ? 'track_likes' : 'playlist_likes';


  const userId = (SC_USER && SC_USER.id) ? SC_USER.id : 'me';
  const url = `https://api-v2.soundcloud.com/users/${userId}/${endpoint}/${itemId}?client_id=${CLIENT_ID}`;

  console.log(`[Sync] Queue status: ${syncQueue.length} items left. Syncing ${type} ${itemId} via Hidden Window...`);

  let syncWindow = null;
  try {
    syncWindow = new BrowserWindow({
      show: false,
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        session: session.defaultSession
      },
    });

    await syncWindow.loadURL(`https://soundcloud.com`);

    const result = await syncWindow.webContents.executeJavaScript(`
      (async () => {
        try {
          const response = await fetch('${url}', {
            method: '${method}',
            headers: {
              'Authorization': 'OAuth ${OAUTH_TOKEN}',
              'Content-Type': 'application/json'
            },
            body: ${method === 'PUT' ? "JSON.stringify({})" : "null"},
            credentials: 'include'
          });
          return { ok: response.ok, status: response.status };
        } catch (e) {
          return { ok: false, error: e.message };
        }
      })();
    `);

    if (result.ok) {
      console.log(`[Sync] ${type} ${itemId} synced successfully (Status: ${result.status})`);
    } else {
      console.error(`[Sync] Failed ${type} ${itemId}. Status: ${result.status}, Error: ${result.error}`);
    }
  } catch (err) {
    console.error(`[Sync] Window error for ${type} ${itemId}:`, err.message);
  } finally {
    if (syncWindow && !syncWindow.isDestroyed()) {
      syncWindow.close();
    }
  }

  setTimeout(() => {
    isProcessingSync = false;
    processSyncQueue();
  }, 1500);
}


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

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    };

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
      const response = await makeRequest(`https://api-v2.soundcloud.com/charts?kind=top&genre=soundcloud%3Agenres%3Aall-music&client_id=${CLIENT_ID}&limit=20&offset=0&region=soundcloud%3Aregions%3Aall`, { headers });
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

ipcMain.handle('get-charts', async (event, genre = 'soundcloud:genres:all-music') => {
  try {

    if (!CLIENT_ID) await getClientId();

    let finalGenre = genre;
    if (finalGenre === 'soundcloud:all-music') finalGenre = 'all-music';
    if (!finalGenre.startsWith('soundcloud:genres:') && finalGenre !== 'all-music') {
      finalGenre = `soundcloud:genres:${finalGenre}`;
    }

    const constructUrl = (withRegion) => {
      let u = `https://api-v2.soundcloud.com/charts?kind=top&genre=${encodeURIComponent(finalGenre)}&client_id=${CLIENT_ID}&limit=50&offset=0`;
      if (withRegion) u += '&region=soundcloud:regions:all-nations';
      return u;
    };

    try {

      const response = await makeRequest(constructUrl(true));
      if (response.data && response.data.collection) {
        return response.data.collection
          .filter(item => item && item.track)
          .map(item => item.track);
      }
    } catch (firstError) {

      if (firstError.response && (firstError.response.status === 400 || firstError.response.status === 404)) {
        try {
          const fallbackResponse = await makeRequest(constructUrl(false));
          if (fallbackResponse.data && fallbackResponse.data.collection) {
            return fallbackResponse.data.collection
              .filter(item => item && item.track)
              .map(item => item.track);
          }
        } catch (secondError) {
          if (secondError.response && (secondError.response.status === 400 || secondError.response.status === 404)) {
            return [];
          }
          console.warn('[Charts] Fallback failed:', secondError.message || secondError);
          return [];
        }
      }


      console.warn('[Charts] Initial fetch failed:', firstError.message || firstError);
      return [];
    }

    return [];
  } catch (error) {
    console.error('Charts error (critical):', error);
    return [];
  }
});

ipcMain.handle('get-station-tracks', async (event, trackId) => {
  try {
    console.log(`[Station Request] Received ID: ${trackId} (Type: ${typeof trackId})`);


    const id = (typeof trackId === 'object' && trackId !== null) ? trackId.id : trackId;

    if (!id || isNaN(id)) {
      console.error(`[Station Request] Invalid Track ID: ${id}`);
      return [];
    }

    // Fetch related tracks to form a station
    const url = `https://api-v2.soundcloud.com/tracks/${id}/related?client_id=${CLIENT_ID}&limit=50&offset=0`;
    const response = await makeRequest(url);

    return response.data.collection || [];
  } catch (error) {
    console.error('Station error:', error);
    return [];
  }
});




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

if (fs.readFileSync(SETTINGS_FILE, 'utf8') === '{}') {
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



ipcMain.handle('save-settings', async (event, settings) => {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings));
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

ipcMain.handle('get-stats', async () => {
  try {
    const data = fs.readFileSync(STATS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading stats file:', error);
    return [];
  }
});

ipcMain.handle('record-play', async (event, playEvent) => {
  try {
    const data = fs.readFileSync(STATS_FILE, 'utf8');
    let stats = JSON.parse(data);
    stats.unshift({
      ...playEvent,
      timestamp: Date.now()
    });

    if (stats.length > 5000) {
      stats = stats.slice(0, 5000);
    }

    fs.writeFileSync(STATS_FILE, JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error('Error recording play stats:', error);
    return false;
  }
});

ipcMain.handle('clear-stats', async () => {
  try {
    fs.writeFileSync(STATS_FILE, '[]');
    return [];
  } catch (error) {
    console.error('Error clearing stats:', error);
    return [];
  }
});

ipcMain.handle('clear-history', async () => {
  try {
    fs.writeFileSync(HISTORY_FILE, '[]');
    return [];
  } catch (error) {
    console.error('Error clearing history:', error);
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

    let fullUrl = profileUrl;
    if (fullUrl.includes('/you') && OAUTH_TOKEN) {
      console.log(`[Import] Detected 'you' URL, using current account context`);
      const meRes = await makeRequest(`https://api-v2.soundcloud.com/me?client_id=${CLIENT_ID}`, {
        headers: { 'Authorization': `OAuth ${OAUTH_TOKEN}` }
      });
      fullUrl = meRes.data.permalink_url;
    } else if (!fullUrl.startsWith('http')) {
      fullUrl = `https://soundcloud.com/${fullUrl.replace('@', '')}`;
    }

    console.log(`[Import] Resolving profile: ${fullUrl}`);

    const resolveRes = await makeRequest(
      `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(fullUrl)}&client_id=${CLIENT_ID}`,
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

    allSCLikes.forEach(track => {
      if (track) track.kind = 'track';
    });

    const localIds = new Set(_likes.map(t => t.id));
    const newTracks = allSCLikes.filter(track => track && track.id && !localIds.has(track.id));

    if (newTracks.length > 0) {
      console.log(`[Import] Adding ${newTracks.length} new tracks to likes`);
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

    let fullUrl = profileUrl;
    if (fullUrl.includes('/you') && OAUTH_TOKEN) {
      console.log(`[Import] Detected 'you' URL for playlists, using current account context`);
      const meRes = await makeRequest(`https://api-v2.soundcloud.com/me?client_id=${CLIENT_ID}`, {
        headers: { 'Authorization': `OAuth ${OAUTH_TOKEN}` }
      });
      fullUrl = meRes.data.permalink_url;
    } else if (!fullUrl.startsWith('http')) {
      fullUrl = `https://soundcloud.com/${fullUrl.replace('@', '')}`;
    }

    console.log(`[Import] Resolving profile for playlists: ${fullUrl}`);

    const resolveRes = await makeRequest(
      `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(fullUrl)}&client_id=${CLIENT_ID}`,
      { headers }
    );
    const userId = resolveRes.data.id;

    if (!userId) throw new Error('Could not resolve user from URL');

    const allSCPlaylists = [];


    let playlistsUrl = `https://api-v2.soundcloud.com/users/${userId}/playlists?client_id=${CLIENT_ID}&limit=200&offset=0`;
    while (playlistsUrl && allSCPlaylists.length < 500) {
      try {
        const res = await makeRequest(playlistsUrl, { headers });
        const collection = res.data.collection || [];
        collection.forEach(item => {
          if (item && item.id) {
            item.kind = 'playlist';
            allSCPlaylists.push(item);
          }
        });
        playlistsUrl = res.data.next_href ? `${res.data.next_href}${res.data.next_href.includes('client_id') ? '' : `&client_id=${CLIENT_ID}`}` : null;
      } catch (e) { console.error('Error fetching created playlists:', e); break; }
    }


    if (allSCPlaylists.length < 50) {
      let altUrl = `https://api-v2.soundcloud.com/users/${userId}/playlists_without_albums?client_id=${CLIENT_ID}&limit=200&offset=0`;
      while (altUrl && allSCPlaylists.length < 500) {
        try {
          const res = await makeRequest(altUrl, { headers });
          const collection = res.data.collection || [];
          const ids = new Set(allSCPlaylists.map(p => p.id));
          collection.forEach(item => {
            if (item && item.id && !ids.has(item.id)) {
              item.kind = 'playlist';
              allSCPlaylists.push(item);
            }
          });
          altUrl = res.data.next_href ? `${res.data.next_href}${res.data.next_href.includes('client_id') ? '' : `&client_id=${CLIENT_ID}`}` : null;
        } catch (e) { break; }
      }
    }


    let likedPlaylistsUrl = `https://api-v2.soundcloud.com/users/${userId}/playlist_likes?client_id=${CLIENT_ID}&limit=200&offset=0`;
    while (likedPlaylistsUrl && allSCPlaylists.length < 500) {
      try {
        const res = await makeRequest(likedPlaylistsUrl, { headers });
        const collection = res.data.collection || [];
        const ids = new Set(allSCPlaylists.map(p => p.id));
        collection.forEach(item => {
          if (item && item.playlist && !ids.has(item.playlist.id)) {
            item.playlist.kind = 'playlist';
            allSCPlaylists.push(item.playlist);
          }
        });
        likedPlaylistsUrl = res.data.next_href ? `${res.data.next_href}${res.data.next_href.includes('client_id') ? '' : `&client_id=${CLIENT_ID}`}` : null;
      } catch (e) { break; }
    }

    console.log(`[Import] Found ${allSCPlaylists.length} total playlists from SoundCloud`);


    let existingPlaylists = [];
    try {
      const data = fs.readFileSync(PLAYLISTS_FILE, 'utf8');
      existingPlaylists = JSON.parse(data);
    } catch (e) {
      existingPlaylists = [];
    }

    const localIds = new Set(existingPlaylists.map(p => p.id));
    const newPlaylists = allSCPlaylists.filter(playlist => playlist && playlist.id && !localIds.has(playlist.id));

    if (newPlaylists.length > 0) {
      console.log(`[Import] Adding ${newPlaylists.length} new playlists to local storage`);
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

ipcMain.handle('get-comments', async (event, trackId) => {
  try {
    if (!CLIENT_ID) throw new Error('Client ID not found');
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    };
    const response = await makeRequest(`https://api-v2.soundcloud.com/tracks/${trackId}/comments?client_id=${CLIENT_ID}&limit=50&offset=0&threaded=0`, { headers });
    return response.data.collection || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
});

ipcMain.handle('get-track-likers', async (event, trackId) => {
  try {
    if (!CLIENT_ID) throw new Error('Client ID not found');
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    };
    const response = await makeRequest(`https://api-v2.soundcloud.com/tracks/${trackId}/likers?client_id=${CLIENT_ID}&limit=9&offset=0`, { headers });
    return response.data.collection || [];
  } catch (error) {
    console.error('Error fetching likers:', error);
    return [];
    return [];
  }
});

ipcMain.handle('get-lyrics', async (event, { artist, title }) => {
  try {
    const query = encodeURIComponent(`${artist} ${title}`.trim());

    const searchUrl = `https://genius.com/api/search/multi?per_page=5&q=${query}`;

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    const searchRes = await makeRequest(searchUrl, { headers });

    let sections = searchRes.data?.response?.sections;
    if (!sections) return null;

    const songSection = sections.find(s => s.type === 'song');
    if (!songSection || !songSection.hits || songSection.hits.length === 0) return null;


    let hits = songSection.hits;
    let bestHit = hits[0]; // Fallback to first hit

    if (artist && artist.length > 0) {
      const targetArtist = artist.toLowerCase();
      const match = hits.find(h => {
        const primaryArtist = h.result.primary_artist.name.toLowerCase();
        return primaryArtist.includes(targetArtist) || targetArtist.includes(primaryArtist);
      });
      if (match) bestHit = match;
    }

    const songUrl = bestHit.result.url;
    console.log(`[Lyrics] Selected hit: "${bestHit.result.full_title}" - URL: ${songUrl}`);

    const pageRes = await makeRequest(songUrl, { headers });
    const html = pageRes.data;

    if (typeof html !== 'string') return null;


    const regex = /<div[^>]*data-lyrics-container="true"[^>]*>([\s\S]*?)<\/div>/g;
    let match;
    let text = '';
    while ((match = regex.exec(html)) !== null) {
      text += match[1] + '\n';
    }


    if (!text.trim()) {
      const oldRegex = /<div[^>]*class="lyrics"[^>]*>([\s\S]*?)<\/div>/i;
      const oldMatch = html.match(oldRegex);
      if (oldMatch) text = oldMatch[1];
    }

    if (!text) {
      console.warn(`[Lyrics] Scraper found no content at ${songUrl}`);
      return null;
    }

    text = text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<p>|<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    return text.trim();
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }
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

    if (OAUTH_TOKEN && playlist.id && SC_USER) {
      syncActionToSC(playlist.id, existingIndex < 0, 'playlist');
    }

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

    return result;

  } catch (error) {
    console.error('Error fetching playlist details:', error);
    throw error;
  }
});

ipcMain.handle('select-font', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Custom Font',
    filters: [
      { name: 'Fonts', extensions: ['ttf', 'otf', 'woff', 'woff2'] }
    ],
    properties: ['openFile']
  });
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('select-image', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg', 'webp'] }]
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0].replace(/\\/g, '/');
});

ipcMain.handle('copy-image-to-clipboard', async (event, dataUrl) => {
  try {
    const { nativeImage, clipboard } = require('electron');
    const image = nativeImage.createFromDataURL(dataUrl);
    clipboard.writeImage(image);
    return true;
  } catch (error) {
    console.error('Failed to copy image to clipboard:', error);
    return false;
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

function startGoodbyeDPI() {
  const arch = 'x86_64';
  let baseDir;
  if (app.isPackaged) {
    baseDir = path.join(process.resourcesPath, 'goodbyedpi-0.2.3rc3-2');
  } else {
    baseDir = path.join(__dirname, 'goodbyedpi-0.2.3rc3-2');
  }
  const exePath = path.join(baseDir, arch, 'goodbyedpi.exe');
  const blacklist1 = path.join(baseDir, 'russia-blacklist.txt');
  const blacklist2 = path.join(baseDir, 'russia-youtube.txt');

  if (!fs.existsSync(exePath)) {
    console.warn('[GoodbyeDPI] Executable not found at:', exePath);
    return;
  }

  console.log('[GoodbyeDPI] Starting GoodbyeDPI...');


  const args = [
    '-9',
    '--blacklist', blacklist1,
    '--blacklist', blacklist2
  ];

  try {
    goodbyeDpiProcess = spawn(exePath, args, {
      cwd: path.dirname(exePath),
    });

    goodbyeDpiProcess.stdout.on('data', (data) => {
      console.log(`[GoodbyeDPI] ${data}`);
    });

    goodbyeDpiProcess.stderr.on('data', (data) => {
      console.error(`[GoodbyeDPI] Error: ${data}`);
    });

    goodbyeDpiProcess.on('close', (code) => {
      console.log(`[GoodbyeDPI] Process exited with code ${code}`);
      goodbyeDpiProcess = null;
    });

    console.log('[GoodbyeDPI] Started successfully with PID:', goodbyeDpiProcess.pid);
  } catch (error) {
    console.error('[GoodbyeDPI] Failed to start:', error);
  }
}

function stopGoodbyeDPI() {
  if (goodbyeDpiProcess) {
    console.log('[GoodbyeDPI] Stopping...');
    goodbyeDpiProcess.kill();
    goodbyeDpiProcess = null;
  }
}


const cleanup = async () => {
  if (retryTimeout) clearTimeout(retryTimeout);
  latestActivity = null;

  if (rpcReady && rpc) {
    console.log('[RPC] Cleaning up...');
    try {
      await rpc.clearActivity();
      await rpc.destroy();
    } catch (e) {
      console.error('[RPC] Cleanup error:', e);
    }
  }

  stopGoodbyeDPI();
};

app.on('before-quit', async () => {
  isQuitting = true;
  await cleanup();
});

process.on('SIGINT', async () => {
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(0);
});

app.whenReady().then(async () => {
  startGoodbyeDPI();
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