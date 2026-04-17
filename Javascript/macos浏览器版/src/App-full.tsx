import { useState, useCallback } from 'react';
import MenuBar from './components/MenuBar';
import Dock from './components/Dock';
import Desktop from './components/Desktop';
import WindowManager from './components/WindowManager';
import Launchpad from './components/Launchpad';
import { WindowState, DockItem } from './types';
import './App.css';

const appIcons: Record<string, string> = {
  finder: '📁', safari: '🌐', messages: '💬', mail: '📧',
  maps: '🗺️', photos: '📷', music: '🎵', settings: '⚙️',
  calculator: '🔢', terminal: '💻', launchpad: '🚀',
};

const defaultApps: DockItem[] = [
  { id: '1', name: 'Finder', icon: appIcons.finder, appId: 'finder', isRunning: false, hasDot: false },
  { id: '2', name: 'Safari', icon: appIcons.safari, appId: 'safari', isRunning: false, hasDot: false },
  { id: '3', name: '信息', icon: appIcons.messages, appId: 'messages', isRunning: false, hasDot: false },
  { id: '4', name: '邮件', icon: appIcons.mail, appId: 'mail', isRunning: false, hasDot: false },
  { id: '5', name: '地图', icon: appIcons.maps, appId: 'maps', isRunning: false, hasDot: false },
  { id: '6', name: '照片', icon: appIcons.photos, appId: 'photos', isRunning: false, hasDot: false },
  { id: '7', name: '音乐', icon: appIcons.music, appId: 'music', isRunning: false, hasDot: false },
  { id: '8', name: '设置', icon: appIcons.settings, appId: 'settings', isRunning: false, hasDot: false },
  { id: '9', name: '计算器', icon: appIcons.calculator, appId: 'calculator', isRunning: false, hasDot: false },
  { id: '10', name: '终端', icon: appIcons.terminal, appId: 'terminal', isRunning: false, hasDot: false },
];

function App() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [dockItems, setDockItems] = useState<DockItem[]>(defaultApps);
  const [showLaunchpad, setShowLaunchpad] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(100);

  const openApp = useCallback((appId: string) => {
    const existingWindow = windows.find(w => w.appId === appId && !w.isMinimized);
    if (existingWindow) {
      activateWindow(existingWindow.id);
      return;
    }
    const minimizedWin = windows.find(w => w.appId === appId && w.isMinimized);
    if (minimizedWin) {
      restoreWindow(minimizedWin.id);
      return;
    }

    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);

    const configs: Record<string, { width: number; height: number; minWidth: number; minHeight: number }> = {
      finder: { width: 800, height: 500, minWidth: 600, minHeight: 400 },
      safari: { width: 1000, height: 700, minWidth: 600, minHeight: 400 },
      messages: { width: 700, height: 500, minWidth: 400, minHeight: 300 },
      mail: { width: 900, height: 600, minWidth: 600, minHeight: 400 },
      maps: { width: 800, height: 600, minWidth: 500, minHeight: 400 },
      photos: { width: 900, height: 600, minWidth: 600, minHeight: 400 },
      music: { width: 900, height: 600, minWidth: 600, minHeight: 400 },
      settings: { width: 700, height: 500, minWidth: 500, minHeight: 400 },
      calculator: { width: 240, height: 360, minWidth: 240, minHeight: 360 },
      terminal: { width: 700, height: 450, minWidth: 500, minHeight: 300 },
    };
    const cfg = configs[appId] || { width: 800, height: 500, minWidth: 600, minHeight: 400 };

    const newWin: WindowState = {
      id: `w-${Date.now()}`,
      title: defaultApps.find(a => a.appId === appId)?.name || appId,
      appId,
      x: 100 + (windows.length % 5) * 30,
      y: 60 + (windows.length % 5) * 30,
      width: cfg.width, height: cfg.height,
      minWidth: cfg.minWidth, minHeight: cfg.minHeight,
      isMinimized: false, isMaximized: false,
      zIndex: newZIndex, isActive: true,
    };

    setWindows(prev => prev.map(w => ({ ...w, isActive: false })).concat(newWin));
    setDockItems(prev => prev.map(item =>
      item.appId === appId ? { ...item, isRunning: true, hasDot: true } : item
    ));
  }, [windows, maxZIndex]);

  const closeWindow = useCallback((wid: string) => {
    const winData = windows.find(w => w.id === wid);
    if (winData) {
      setWindows(prev => prev.filter(w => w.id !== wid));
      const remaining = windows.filter(w => w.appId === winData.appId && w.id !== wid);
      if (remaining.length === 0) {
        setDockItems(prev => prev.map(item =>
          item.appId === winData.appId ? { ...item, isRunning: false, hasDot: false } : item
        ));
      }
    }
  }, [windows]);

  const minimizeWindow = useCallback((wid: string) => {
    setWindows(prev => prev.map(w => w.id === wid ? { ...w, isMinimized: true, isActive: false } : w));
  }, []);

  const restoreWindow = useCallback((wid: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setWindows(prev => prev.map(w =>
      w.id === wid ? { ...w, isMinimized: false, isActive: true, zIndex: newZIndex } : { ...w, isActive: false }
    ));
  }, [maxZIndex]);

  const toggleMaximize = useCallback((wid: string) => {
    setWindows(prev => prev.map(w => w.id === wid ? { ...w, isMaximized: !w.isMaximized } : w));
  }, []);

  const activateWindow = useCallback((wid: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setWindows(prev => prev.map(w =>
      w.id === wid ? { ...w, isActive: true, zIndex: newZIndex, isMinimized: false } : { ...w, isActive: false }
    ));
  }, [maxZIndex]);

  const moveWindow = useCallback((wid: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === wid ? { ...w, x, y } : w));
  }, []);

  const resizeWindow = useCallback((wid: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === wid ? { ...w, width, height } : w));
  }, []);

  return (
    <div className="macos-container">
      <MenuBar onOpenLaunchpad={() => setShowLaunchpad(true)} activeApp={windows.find(w => w.isActive)?.title || '访达'} />
      <Desktop />
      <WindowManager windows={windows} onClose={closeWindow} onMinimize={minimizeWindow}
        onMaximize={toggleMaximize} onActivate={activateWindow} onMove={moveWindow} onResize={resizeWindow} />
      {showLaunchpad && (
        <Launchpad apps={defaultApps} onOpenApp={(aid) => { openApp(aid); setShowLaunchpad(false); }} onClose={() => setShowLaunchpad(false)} />
      )}
      <Dock items={dockItems} onItemClick={(aid) => {
        const ew = windows.find(w => w.appId === aid);
        ew?.isMinimized ? restoreWindow(ew.id) : openApp(aid);
      }} onLaunchpadClick={() => setShowLaunchpad(true)} />
    </div>
  );
}

export default App;