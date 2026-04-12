import { useState, useRef } from 'react';
import { DockItem } from '../types';
import './Dock.css';

interface DockProps {
  items: DockItem[];
  onItemClick: (appId: string) => void;
  onLaunchpadClick: () => void;
}

function Dock({ items, onItemClick, onLaunchpadClick }: DockProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dockItems, setDockItems] = useState<DockItem[]>(items);
  const dockRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const newItems = [...dockItems];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem);
    const targetIndex = newItems.findIndex(item => item.id === targetId);
    
    const [draggedItemData] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItemData);
    
    setDockItems(newItems);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const getScale = (itemId: string) => {
    if (!hoveredItem) return 1;
    if (hoveredItem === itemId) return 1.5;
    
    const hoveredIndex = dockItems.findIndex(item => item.id === hoveredItem);
    const currentIndex = dockItems.findIndex(item => item.id === itemId);
    const distance = Math.abs(hoveredIndex - currentIndex);
    
    if (distance === 1) return 1.25;
    if (distance === 2) return 1.1;
    return 1;
  };

  return (
    <div className="dock-container">
      <div className="dock" ref={dockRef}>
        <div className="dock-items">
          {dockItems.map((item) => (
            <div
              key={item.id}
              className={`dock-item ${draggedItem === item.id ? 'dragging' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => item.appId === 'launchpad' ? onLaunchpadClick() : onItemClick(item.appId)}
              style={{
                transform: `scale(${getScale(item.id)}) translateY(${hoveredItem === item.id ? '-8px' : '0'})`,
              }}
            >
              <div className="dock-icon">
                <span className="icon-emoji">{item.icon}</span>
              </div>
              <div className="dock-tooltip">{item.name}</div>
              {item.hasDot && <div className="dock-dot" />}
            </div>
          ))}
        </div>
        <div className="dock-separator" />
        <div 
          className="dock-item launchpad-item"
          onClick={onLaunchpadClick}
          onMouseEnter={() => setHoveredItem('launchpad')}
          onMouseLeave={() => setHoveredItem(null)}
          style={{
            transform: `scale(${getScale('launchpad')}) translateY(${hoveredItem === 'launchpad' ? '-8px' : '0'})`,
          }}
        >
          <div className="dock-icon launchpad">
            <div className="launchpad-grid">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="launchpad-dot" />
              ))}
            </div>
          </div>
          <div className="dock-tooltip">启动台</div>
        </div>
      </div>
    </div>
  );
}

export default Dock;