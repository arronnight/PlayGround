// OpenEgregoria — desktop wrapper (Electron).
// Desktop packaging: `npm i -D electron && npx electron .`
// (The game itself is a zero-build static site: index.html + game.js + vendor/.)
const { app, BrowserWindow } = require('electron');
const path = require('path');
function create() {
  const win = new BrowserWindow({
    width: 1400, height: 900, title: 'OpenEgregoria — 3D City Builder',
    backgroundColor: '#0b1020',
    webPreferences: { contextIsolation: true },
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  win.setMenuBarVisibility(false);
}
app.whenReady().then(create);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) create(); });
