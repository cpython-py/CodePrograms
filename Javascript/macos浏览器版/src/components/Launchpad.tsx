import { useState } from 'react';
import { DockItem } from '../types';
import './Launchpad.css';

interface LaunchpadProps {
  apps: DockItem[];
  onOpenApp: (appId: string) => void;
  onClose: () => void;
}

function Launchpad({ apps, onOpenApp, onClose }: LaunchpadProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="launchpad" onClick={handleBackgroundClick}>
      <div className="launchpad-backdrop" />
      <div className="launchpad-content">
        <div className="launchpad-search">
          <input
            type="text"
            placeholder="搜索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="launchpad-search-input"
          />
        </div>
        <div className="launchpad-apps">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="launchpad-app"
              onClick={() => onOpenApp(app.appId)}
            >
              <div className="launchpad-app-icon">
                <span className="launchpad-icon-emoji">{app.icon}</span>
              </div>
              <span className="launchpad-app-name">{app.name}</span>
            </div>
          ))}
        </div>
        <div className="launchpad-dots">
          {[...Array(Math.ceil(filteredApps.length / 24))].map((_, i) => (
            <div key={i} className={`launchpad-dot ${i === 0 ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Launchpad;