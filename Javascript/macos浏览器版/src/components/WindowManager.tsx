import { WindowState } from '../types';
import Window from './Window';
import './WindowManager.css';

interface WindowManagerProps {
  windows: WindowState[];
  onClose: (windowId: string) => void;
  onMinimize: (windowId: string) => void;
  onMaximize: (windowId: string) => void;
  onActivate: (windowId: string) => void;
  onMove: (windowId: string, x: number, y: number) => void;
  onResize: (windowId: string, width: number, height: number) => void;
}

function WindowManager({
  windows,
  onClose,
  onMinimize,
  onMaximize,
  onActivate,
  onMove,
  onResize,
}: WindowManagerProps) {
  return (
    <div className="window-manager">
      {windows.map((window) => (
        !window.isMinimized && (
          <Window
            key={window.id}
            window={window}
            onClose={() => onClose(window.id)}
            onMinimize={() => onMinimize(window.id)}
            onMaximize={() => onMaximize(window.id)}
            onActivate={() => onActivate(window.id)}
            onMove={onMove}
            onResize={onResize}
          />
        )
      ))}
    </div>
  );
}

export default WindowManager;