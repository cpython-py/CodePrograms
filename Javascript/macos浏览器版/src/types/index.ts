export interface WindowState {
  id: string;
  title: string;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  isActive: boolean;
}

export interface AppState {
  id: string;
  name: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
}

export interface DockItem {
  id: string;
  name: string;
  icon: string;
  appId: string;
  isRunning: boolean;
  hasDot: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon: string;
  size?: string;
  modifiedDate?: string;
}