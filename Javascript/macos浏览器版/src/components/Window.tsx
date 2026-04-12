import { useState, useRef, useCallback, useEffect } from 'react';
import { WindowState } from '../types';
import Finder from './Finder';
import Calculator from './Calculator';
import Terminal from './Terminal';
import './Window.css';

interface WindowProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onActivate: () => void;
  onMove: (windowId: string, x: number, y: number) => void;
  onResize: (windowId: string, width: number, height: number) => void;
}

function Window({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onActivate,
  onMove,
  onResize,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);

  // 窗口内容渲染
  const renderContent = () => {
    switch (window.appId) {
      case 'finder':
        return <Finder />;
      case 'calculator':
        return <Calculator />;
      case 'terminal':
        return <Terminal />;
      case 'safari':
        return (
          <div className="app-content safari">
            <div className="safari-toolbar">
              <input type="text" className="url-bar" placeholder="搜索或输入网站名称" defaultValue="https://www.apple.com" />
            </div>
            <div className="safari-content">
              <div className="safari-start">
                <h2>欢迎使用 Safari</h2>
                <p>开始浏览互联网</p>
              </div>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="app-content messages">
            <div className="messages-sidebar">
              <div className="conversation active">
                <span className="avatar">💬</span>
                <span className="name">信息</span>
              </div>
            </div>
            <div className="messages-main">
              <p>选择一个对话开始聊天</p>
            </div>
          </div>
        );
      case 'mail':
        return (
          <div className="app-content mail">
            <div className="mail-sidebar">
              <div className="mail-folder active">📥 收件箱</div>
              <div className="mail-folder">📤 已发送</div>
              <div className="mail-folder">📝 草稿</div>
              <div className="mail-folder">🗑️ 废纸篓</div>
            </div>
            <div className="mail-content">
              <p>选择一封邮件查看</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="app-content settings">
            <div className="settings-sidebar">
              {['通用', '外观', '辅助功能', '屏幕使用时间', '隐私与安全性'].map((item, i) => (
                <div key={i} className={`settings-item ${i === 0 ? 'active' : ''}`}>{item}</div>
              ))}
            </div>
            <div className="settings-main">
              <h2>通用</h2>
              <div className="settings-option">
                <span>关于本机</span>
                <span>macOS Browser Edition</span>
              </div>
            </div>
          </div>
        );
      case 'music':
        return (
          <div className="app-content music">
            <div className="music-sidebar">
              <div className="music-section">🎵 现在收听</div>
              <div className="music-section">📻 电台</div>
              <div className="music-section">🎤 艺人</div>
            </div>
            <div className="music-main">
              <h2>音乐库</h2>
              <p>浏览您的音乐收藏</p>
            </div>
          </div>
        );
      case 'photos':
        return (
          <div className="app-content photos">
            <div className="photos-sidebar">
              <div className="photos-section">📷 照片</div>
              <div className="photos-section">🎬 媒体类型</div>
              <div className="photos-section">📁 相簿</div>
            </div>
            <div className="photos-main">
              <h2>照片库</h2>
              <p>您的回忆都在这里</p>
            </div>
          </div>
        );
      case 'maps':
        return (
          <div className="app-content maps">
            <div className="maps-main">
              <div className="maps-placeholder">
                <span className="maps-icon">🗺️</span>
                <p>地图功能加载中...</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="app-content default">
            <h2>{window.title}</h2>
            <p>应用内容区域</p>
          </div>
        );
    }
  };

  // 拖拽开始
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    onActivate();
  }, [onActivate]);

  // 拖拽移动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = Math.max(25, e.clientY - dragOffset.y); // 不能超过菜单栏
        onMove(window.id, newX, newY);
      }
      
      if (isResizing && windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        const newWidth = Math.max(window.minWidth, e.clientX - rect.left);
        const newHeight = Math.max(window.minHeight, e.clientY - rect.top);
        onResize(window.id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, window.id, window.minWidth, window.minHeight, onMove, onResize]);

  // 关闭动画
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  // 双击标题栏最大化
  const handleDoubleClick = () => {
    onMaximize();
  };

  const style: React.CSSProperties = window.isMaximized
    ? {
        top: 25,
        left: 0,
        width: '100%',
        height: 'calc(100vh - 100px)',
        borderRadius: 0,
        zIndex: window.zIndex,
      }
    : {
        top: window.y,
        left: window.x,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className={`window ${window.isActive ? 'active' : ''} ${isClosing ? 'closing' : ''}`}
      style={style}
      onMouseDown={onActivate}
    >
      <div 
        className="window-header"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="window-controls">
          <button className="control close" onClick={handleClose} title="关闭">
            <span className="icon">×</span>
          </button>
          <button className="control minimize" onClick={onMinimize} title="最小化">
            <span className="icon">−</span>
          </button>
          <button className="control maximize" onClick={onMaximize} title="最大化">
            <span className="icon">+</span>
          </button>
        </div>
        <div className="window-title">{window.title}</div>
      </div>
      <div className="window-content">
        {renderContent()}
      </div>
      {!window.isMaximized && (
        <div
          className="window-resize"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        />
      )}
    </div>
  );
}

export default Window;