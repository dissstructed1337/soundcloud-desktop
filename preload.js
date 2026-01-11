const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    searchTracks: (query, nextHref) => ipcRenderer.invoke('search-tracks', query, nextHref),
    searchPlaylists: (query, nextHref) => ipcRenderer.invoke('search-playlists', query, nextHref),
    searchUsers: (query, nextHref) => ipcRenderer.invoke('search-users', query, nextHref),
    getTrackStream: (trackId) => ipcRenderer.invoke('get-track-stream', trackId),
    getArtistDetails: (userId) => ipcRenderer.invoke('get-artist-details', userId),
    getLikes: () => ipcRenderer.invoke('get-likes'),
    toggleLike: (track) => ipcRenderer.invoke('toggle-like', track),
    clearLikes: () => ipcRenderer.invoke('clear-likes'),
    getRecommendations: () => ipcRenderer.invoke('get-recommendations'),
    getStationTracks: (trackId) => ipcRenderer.invoke('get-station-tracks', trackId),
    getCharts: (genre) => ipcRenderer.invoke('get-charts', genre),
    getHistory: () => ipcRenderer.invoke('get-history'),
    addToHistory: (item) => ipcRenderer.invoke('add-to-history', item),
    getStats: () => ipcRenderer.invoke('get-stats'),
    recordPlay: (playEvent) => ipcRenderer.invoke('record-play', playEvent),
    clearStats: () => ipcRenderer.invoke('clear-stats'),
    clearHistory: () => ipcRenderer.invoke('clear-history'),
    importSCLikes: (profileUrl) => ipcRenderer.invoke('import-sc-likes', profileUrl),
    importSCPlaylists: (profileUrl) => ipcRenderer.invoke('import-sc-playlists', profileUrl),
    getLikedPlaylists: () => ipcRenderer.invoke('get-liked-playlists'),
    toggleLikePlaylist: (playlist) => ipcRenderer.invoke('toggle-like-playlist', playlist),
    getPlaylistDetails: (playlistId) => ipcRenderer.invoke('get-playlist-details', playlistId),
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    selectImage: () => ipcRenderer.invoke('select-image'),
    selectFont: () => ipcRenderer.invoke('select-font'),
    copyImageToClipboard: (dataUrl) => ipcRenderer.invoke('copy-image-to-clipboard', dataUrl),
    getComments: (trackId) => ipcRenderer.invoke('get-comments', trackId),
    getTrackLikers: (trackId) => ipcRenderer.invoke('get-track-likers', trackId),
    getLyrics: (data) => ipcRenderer.invoke('get-lyrics', data),
    selectCustomBackground: () => ipcRenderer.invoke('select-custom-background'),
    connectSoundCloud: () => ipcRenderer.invoke('connect-soundcloud'),
    getSCUser: () => ipcRenderer.invoke('get-sc-user'),
    disconnectSoundCloud: () => ipcRenderer.invoke('disconnect-soundcloud'),
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    showNotification: (data) => ipcRenderer.send('show-notification', data),
    onMediaControl: (callback) => {
        const listener = (event, action) => callback(action);
        ipcRenderer.on('media-control', listener);
        return () => ipcRenderer.removeListener('media-control', listener);
    },
    toggleMiniPlayer: () => ipcRenderer.send('window-toggle-mini'),
    rpcUpdate: (data) => ipcRenderer.send('rpc-update', data),
    rpcClear: () => ipcRenderer.send('rpc-clear'),
    onMiniPlayerState: (callback) => {
        const listener = (event, isMini) => callback(isMini);
        ipcRenderer.on('mini-player-state', listener);
        return () => ipcRenderer.removeListener('mini-player-state', listener);
    },
    installUpdate: () => ipcRenderer.invoke('install-update'),
    onUpdateAvailable: (callback) => {
        const listener = (event, version) => callback(version);
        ipcRenderer.on('update-available', listener);
        return () => ipcRenderer.removeListener('update-available', listener);
    },
    onUpdateProgress: (callback) => {
        const listener = (event, progress) => callback(progress);
        ipcRenderer.on('update-progress', listener);
        return () => ipcRenderer.removeListener('update-progress', listener);
    },
    onUpdateDownloaded: (callback) => {
        const listener = (event, version) => callback(version);
        ipcRenderer.on('update-downloaded', listener);
        return () => ipcRenderer.removeListener('update-downloaded', listener);
    },
});

