import { useState, useEffect } from 'react';
import './MenuBar.css';

interface MenuBarProps {
  onOpenLaunchpad: () => void;
  activeApp: string;
}

function MenuBar({ onOpenLaunchpad, activeApp }: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMenu, setShowMenu] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日 ${days[date.getDay()]}`;
  };

  const menuItems = [
    {
      id: 'apple',
      label: '',
      isApple: true,
      submenu: [
        { label: '关于本机', action: () => alert('macOS Browser Edition v1.0') },
        { divider: true },
        { label: '系统偏好设置...', action: () => {} },
        { label: 'App Store...', action: () => {} },
        { divider: true },
        { label: '最近使用的项目', action: () => {} },
        { divider: true },
        { label: '强制退出...', action: () => {} },
        { divider: true },
        { label: '睡眠', action: () => {} },
        { label: '重新启动...', action: () => {} },
        { label: '关机...', action: () => {} },
      ]
    },
    {
      id: 'app',
      label: activeApp,
      submenu: [
        { label: `关于 ${activeApp}`, action: () => {} },
        { divider: true },
        { label: '偏好设置...', action: () => {} },
        { divider: true },
        { label: `隐藏 ${activeApp}`, action: () => {} },
        { label: '隐藏其他', action: () => {} },
        { label: '显示全部', action: () => {} },
        { divider: true },
        { label: '退出', action: () => {} },
      ]
    },
    {
      id: 'file',
      label: '文件',
      submenu: [
        { label: '新建窗口', action: () => {} },
        { label: '新建文件夹', action: () => {} },
        { divider: true },
        { label: '打开...', action: () => {} },
        { label: '关闭窗口', action: () => {} },
        { divider: true },
        { label: '获取信息', action: () => {} },
      ]
    },
    {
      id: 'edit',
      label: '编辑',
      submenu: [
        { label: '撤销', action: () => {} },
        { label: '重做', action: () => {} },
        { divider: true },
        { label: '剪切', action: () => {} },
        { label: '拷贝', action: () => {} },
        { label: '粘贴', action: () => {} },
        { label: '全选', action: () => {} },
      ]
    },
    {
      id: 'view',
      label: '显示',
      submenu: [
        { label: '作为图标', action: () => {} },
        { label: '作为列表', action: () => {} },
        { label: '分栏', action: () => {} },
        { label: '画廊', action: () => {} },
        { divider: true },
        { label: '显示路径栏', action: () => {} },
        { label: '显示状态栏', action: () => {} },
      ]
    },
    {
      id: 'go',
      label: '前往',
      submenu: [
        { label: '后退', action: () => {} },
        { label: '前进', action: () => {} },
        { divider: true },
        { label: '最近使用的文件夹', action: () => {} },
        { divider: true },
        { label: '文稿', action: () => {} },
        { label: '桌面', action: () => {} },
        { label: '下载', action: () => {} },
        { label: '个人收藏', action: () => {} },
        { label: 'iCloud 云盘', action: () => {} },
        { label: '应用程序', action: () => {} },
      ]
    },
    {
      id: 'window',
      label: '窗口',
      submenu: [
        { label: '最小化', action: () => {} },
        { label: '缩放', action: () => {} },
        { divider: true },
        { label: '将所有窗口移到前面', action: () => {} },
      ]
    },
    {
      id: 'help',
      label: '帮助',
      submenu: [
        { label: 'macOS 帮助', action: () => {} },
        { label: '查看键盘快捷键', action: () => {} },
      ]
    },
  ];

  return (
    <div className="menubar">
      <div className="menubar-left">
        {menuItems.map((menu) => (
          <div 
            key={menu.id} 
            className="menu-item"
            onMouseEnter={() => showMenu && setShowMenu(menu.id)}
            onClick={() => setShowMenu(showMenu === menu.id ? null : menu.id)}
          >
            {menu.isApple ? (
              <span className="apple-icon"> </span>
            ) : (
              <span className="menu-label">{menu.label}</span>
            )}
            {showMenu === menu.id && (
              <div className="submenu">
                {menu.submenu.map((item, index) => (
                  item.divider ? (
                    <div key={index} className="submenu-divider" />
                  ) : (
                    <div 
                      key={index} 
                      className="submenu-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        item.action?.();
                        setShowMenu(null);
                      }}
                    >
                      <span>{item.label}</span>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="menubar-right">
        <div className="menubar-icon" title="电池">
          <span className="battery-icon">🔋</span>
          <span className="battery-text">100%</span>
        </div>
        <div className="menubar-icon" title="Wi-Fi">
          <span>📶</span>
        </div>
        <div className="menubar-icon" title="搜索" onClick={onOpenLaunchpad}>
          <span>🔍</span>
        </div>
        <div className="menubar-icon" title="控制中心">
          <span>🎛️</span>
        </div>
        <div className="menubar-icon time">
          <span>{formatDate(currentTime)}</span>
          <span className="time-display">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}

export default MenuBar;