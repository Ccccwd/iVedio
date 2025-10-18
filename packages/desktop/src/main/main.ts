import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

const isDev = process.env.NODE_ENV === 'development';

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    minHeight: 600,
    minWidth: 800,
    titleBarStyle: 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // 开发环境下禁用web安全以允许本地资源加载
      allowRunningInsecureContent: true, // 允许不安全内容（仅开发环境）
    },
  });

  // 设置CSP安全策略
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
          "script-src * 'unsafe-inline' 'unsafe-eval' blob:;",
          "style-src * 'unsafe-inline';",
          "img-src * data: blob:;",
          "connect-src *;",
          "font-src * data:;",
          "media-src * blob: data:;",
        ].join(' ')
      }
    });
  });

  // 开发环境加载本地服务器，生产环境加载构建后的文件
  if (isDev) {
    // 添加重试机制和错误处理
    const loadDevServer = () => {
      mainWindow.loadURL('http://localhost:5173').catch((error) => {
        console.error('加载开发服务器失败:', error);
        // 如果加载失败，显示错误页面
        mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
          <html>
            <head><title>开发服务器连接失败</title></head>
            <body>
              <h1>无法连接到开发服务器</h1>
              <p>请确保web应用正在运行在 http://localhost:5173</p>
              <p>错误信息: ${error.message}</p>
              <button onclick="location.reload()">重试</button>
            </body>
          </html>
        `)}`);
      });
    };
    
    loadDevServer();
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    const webDistPath = path.join(__dirname, '..', '..', '..', 'web', 'dist');
    const indexPath = path.join(webDistPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath).catch((error) => {
        console.error('加载本地文件失败:', error);
        // 如果加载失败，显示错误页面
        mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
          <html>
            <head><title>本地文件加载失败</title></head>
            <body>
              <h1>无法加载本地文件</h1>
              <p>路径: ${indexPath}</p>
              <p>错误信息: ${error.message}</p>
            </body>
          </html>
        `)}`);
      });
    } else {
      // 如果构建文件不存在，显示错误页面
      mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
        <html>
          <head><title>Error</title></head>
          <body>
            <h1>Web应用构建文件未找到</h1>
            <p>请先运行 npm run build:web 构建web应用</p>
            <p>路径: ${indexPath}</p>
          </body>
        </html>
      `)}`);
    }
  }

  // 监听窗口关闭事件
  mainWindow.on('closed', () => {
    // 清理资源
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 处理协议
app.setAsDefaultProtocolClient('ivedio');

// IPC处理程序
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('minimize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.minimize();
  }
});

ipcMain.handle('maximize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
});

ipcMain.handle('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.close();
  }
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    const result = await dialog.showOpenDialog(window, options);
    return result;
  }
  return { canceled: true, filePaths: [] };
});