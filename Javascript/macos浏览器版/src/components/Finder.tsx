import { useState } from 'react';
import { FileItem } from '../types';
import './Finder.css';

const mockFiles: FileItem[] = [
  { id: '1', name: '文稿', type: 'folder', icon: '📁' },
  { id: '2', name: '下载', type: 'folder', icon: '📥' },
  { id: '3', name: '桌面', type: 'folder', icon: '🖥️' },
  { id: '4', name: '图片', type: 'folder', icon: '🖼️' },
  { id: '5', name: '音乐', type: 'folder', icon: '🎵' },
  { id: '6', name: '影片', type: 'folder', icon: '🎬' },
  { id: '7', name: '应用程序', type: 'folder', icon: '📦' },
  { id: '8', name: '报告.pdf', type: 'file', icon: '📄', size: '2.4 MB', modifiedDate: '2024-01-15' },
  { id: '9', name: '项目提案.docx', type: 'file', icon: '📝', size: '856 KB', modifiedDate: '2024-01-14' },
  { id: '10', name: '设计稿.png', type: 'file', icon: '🖼️', size: '5.2 MB', modifiedDate: '2024-01-13' },
  { id: '11', name: '演示文稿.pptx', type: 'file', icon: '📊', size: '12.8 MB', modifiedDate: '2024-01-12' },
  { id: '12', name: '数据表格.xlsx', type: 'file', icon: '📈', size: '1.1 MB', modifiedDate: '2024-01-11' },
];

function Finder() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>(['个人收藏']);
  const [viewMode, setViewMode] = useState<'icons' | 'list'>('icons');

  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file.id);
  };

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath([...currentPath, file.name]);
    }
  };

  return (
    <div className="finder">
      <div className="finder-sidebar">
        <div className="finder-section">
          <div className="finder-section-title">个人收藏</div>
          <div className="finder-item active">
            <span className="finder-item-icon">📁</span>
            <span className="finder-item-name">个人收藏</span>
          </div>
          <div className="finder-item">
            <span className="finder-item-icon">🖥️</span>
            <span className="finder-item-name">桌面</span>
          </div>
          <div className="finder-item">
            <span className="finder-item-icon">📥</span>
            <span className="finder-item-name">下载</span>
          </div>
          <div className="finder-item">
            <span className="finder-item-icon">📄</span>
            <span className="finder-item-name">文稿</span>
          </div>
        </div>
        <div className="finder-section">
          <div className="finder-section-title">iCloud</div>
          <div className="finder-item">
            <span className="finder-item-icon">☁️</span>
            <span className="finder-item-name">iCloud 云盘</span>
          </div>
        </div>
        <div className="finder-section">
          <div className="finder-section-title">位置</div>
          <div className="finder-item">
            <span className="finder-item-icon">💻</span>
            <span className="finder-item-name">MacBook Pro</span>
          </div>
        </div>
      </div>
      <div className="finder-main">
        <div className="finder-toolbar">
          <div className="finder-nav">
            <button className="finder-nav-btn" disabled>◀</button>
            <button className="finder-nav-btn" disabled>▶</button>
          </div>
          <div className="finder-path">
            {currentPath.map((path, i) => (
              <span key={i}>
                <span className="finder-path-item">{path}</span>
                {i < currentPath.length - 1 && <span className="finder-path-sep">›</span>}
              </span>
            ))}
          </div>
          <div className="finder-view-modes">
            <button 
              className={`finder-view-btn ${viewMode === 'icons' ? 'active' : ''}`}
              onClick={() => setViewMode('icons')}
            >
              ⊞
            </button>
            <button 
              className={`finder-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>
        </div>
        <div className={`finder-content ${viewMode}`}>
          {mockFiles.map((file) => (
            <div
              key={file.id}
              className={`finder-file ${selectedFile === file.id ? 'selected' : ''}`}
              onClick={() => handleFileClick(file)}
              onDoubleClick={() => handleFileDoubleClick(file)}
            >
              <span className="finder-file-icon">{file.icon}</span>
              <span className="finder-file-name">{file.name}</span>
              {viewMode === 'list' && (
                <>
                  <span className="finder-file-size">{file.size || '--'}</span>
                  <span className="finder-file-date">{file.modifiedDate || '--'}</span>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="finder-status">
          <span>{mockFiles.length} 个项目</span>
          {selectedFile && <span> • 已选择 1 个项目</span>}
        </div>
      </div>
    </div>
  );
}

export default Finder;