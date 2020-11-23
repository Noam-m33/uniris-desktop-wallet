const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev');   
const path = require('path')

const open = require('open')

function createWindow () {
  const win = new BrowserWindow({
    width: 1024,
    height: 800,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.setIcon(path.join(__dirname, './public/favicon.png'));

  win.loadURL(`file://${path.join(__dirname, './build/index.html')}`)

  win.webContents.on('new-window', function(event, url){
    event.preventDefault();
    open(url);
  });

  // win.webContents.openDevTools()
}

app.whenReady().then(createWindow)



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
