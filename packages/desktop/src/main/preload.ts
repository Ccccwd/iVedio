import { contextBridge, ipcRenderer } from 'electron';

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取应用版本
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // 平台信息
  platform: process.platform,
  
  // 窗口控制
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // 文件系统操作（如果需要）
  showOpenDialog: (options: any) => ipcRenderer.invoke('show-open-dialog', options),
  
  // 监听主进程消息
  onMessage: (callback: (message: string) => void) => {
    ipcRenderer.on('message', (event, message) => callback(message));
  }
});

// 类型定义
declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>;
      platform: string;
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      showOpenDialog: (options: any) => Promise<any>;
      onMessage: (callback: (message: string) => void) => void;
    };
  }
}