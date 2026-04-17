import { useState, useRef, useEffect } from 'react';
import './Terminal.css';

interface TerminalLine {
  type: 'input' | 'output';
  content: string;
}

function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Last login: Fri Jan 15 10:30:00 on ttys000' },
    { type: 'output', content: 'Welcome to macOS Browser Edition Terminal' },
    { type: 'output', content: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output = '';

    switch (trimmedCmd) {
      case 'help':
        output = `Available commands:
  help      - 显示帮助信息
  clear     - 清屏
  date      - 显示当前日期和时间
  whoami    - 显示当前用户
  ls        - 列出文件
  pwd       - 显示当前目录
  echo [text] - 输出文本
  uname     - 显示系统信息`;
        break;
      case 'clear':
        setLines([]);
        return;
      case 'date':
        output = new Date().toString();
        break;
      case 'whoami':
        output = 'guest';
        break;
      case 'ls':
        output = 'Documents  Downloads  Desktop  Pictures  Music  Movies  Applications';
        break;
      case 'pwd':
        output = '/Users/guest';
        break;
      case 'uname':
        output = 'macOS Browser Edition 1.0';
        break;
      default:
        if (trimmedCmd.startsWith('echo ')) {
          output = cmd.substring(5);
        } else if (trimmedCmd === '') {
          output = '';
        } else {
          output = `zsh: command not found: ${cmd}`;
        }
    }

    setLines(prev => [
      ...prev,
      { type: 'input', content: `guest@macbook ~ % ${cmd}` },
      ...(output ? [{ type: 'output' as const, content: output }] : []),
      { type: 'output', content: '' },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      setCommandHistory(prev => [...prev, currentInput]);
    }
    executeCommand(currentInput);
    setCurrentInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-content" ref={containerRef}>
        {lines.map((line, i) => (
          <div key={i} className={`terminal-line ${line.type}`}>
            {line.content}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="terminal-prompt">guest@macbook ~ %</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}

export default Terminal;