const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hotspringAPI', {
  getInterfaces: () => ipcRenderer.invoke('get-adapters')
});
