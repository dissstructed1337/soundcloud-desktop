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
    getCharts: (genre) => ipcRenderer.invoke('get-charts', genre),
    getHistory: () => ipcRenderer.invoke('get-history'),
    addToHistory: (item) => ipcRenderer.invoke('add-to-history', item),
    importSCLikes: (profileUrl) => ipcRenderer.invoke('import-sc-likes', profileUrl),
    getLikedPlaylists: () => ipcRenderer.invoke('get-liked-playlists'),
    toggleLikePlaylist: (playlist) => ipcRenderer.invoke('toggle-like-playlist', playlist),
    getPlaylistDetails: (playlistId) => ipcRenderer.invoke('get-playlist-details', playlistId),
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
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
});
