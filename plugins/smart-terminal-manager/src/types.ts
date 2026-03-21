/**
 * 终端主题类型定义
 */
export interface TerminalTheme {
    id: string;
    name: string;
    description?: string;
    colors: TerminalColors;
    recommendedFont?: {
        size?: number;
        family?: string;
        weight?: 'normal' | 'bold' | 'light';
    };
}

/**
 * 终端颜色配置
 */
export interface TerminalColors {
    background: string;
    foreground: string;
    cursor?: string;
    cursorAccent?: string;
    selection?: string;
    black?: string;
    red?: string;
    green?: string;
    yellow?: string;
    blue?: string;
    magenta?: string;
    cyan?: string;
    white?: string;
    brightBlack?: string;
    brightRed?: string;
    brightGreen?: string;
    brightYellow?: string;
    brightBlue?: string;
    brightMagenta?: string;
    brightCyan?: string;
    brightWhite?: string;
}

/**
 * 智能字体配置
 */
export interface SmartFontConfig {
    enabled: boolean;
    minSize: number;
    maxSize: number;
    adjustByLuminance: boolean;
}

/**
 * 自定义命令类型定义
 */
export interface CustomCommand {
    id: string;
    name: string;
    command: string;
    group?: string;
    icon?: string;
    shortcut?: string;
    description?: string;
}

/**
 * 命令分组类型定义
 */
export interface CommandGroup {
    id: string;
    name: string;
    icon?: string;
    commands: CustomCommand[];
}

/**
 * 终端配置类型定义
 */
export interface TerminalConfig {
    fontSize: number;
    fontFamily: string;
    cursorStyle: 'block' | 'underline' | 'line';
    cursorBlink: boolean;
    scrollback: number;
    shellPath?: string;
    autoClose: boolean;
}

/**
 * 终端选项卡信息
 */
export interface TerminalTab {
    id: string;
    name: string;
    terminalId: number;
    icon: string;
    isMinimized: boolean;
    color?: string;
}

/**
 * 预设主题
 */
export const PRESET_THEMES: TerminalTheme[] = [
    {
        id: 'default',
        name: '默认主题',
        description: 'VS Code 默认终端配色',
        colors: {
            background: '#1e1e1e',
            foreground: '#d4d4d4',
            cursor: '#aeafad',
            selection: '#264f78',
            black: '#000000',
            red: '#cd3131',
            green: '#0dbc79',
            yellow: '#e5e510',
            blue: '#2472c8',
            magenta: '#bc3fbc',
            cyan: '#11a8cd',
            white: '#e5e5e5',
            brightBlack: '#666666',
            brightRed: '#f14c4c',
            brightGreen: '#23d18b',
            brightYellow: '#f5f543',
            brightBlue: '#3b8eea',
            brightMagenta: '#d670d6',
            brightCyan: '#29b8db',
            brightWhite: '#e5e5e5'
        },
        recommendedFont: { size: 14, family: 'Consolas', weight: 'normal' }
    },
    {
        id: 'dark',
        name: '深色主题',
        description: '经典深色终端配色',
        colors: {
            background: '#0c0c0c',
            foreground: '#cccccc',
            cursor: '#ffffff',
            selection: '#454545',
            black: '#0c0c0c',
            red: '#c50f1f',
            green: '#13a10e',
            yellow: '#c19c00',
            blue: '#0037da',
            magenta: '#881798',
            cyan: '#3a96dd',
            white: '#cccccc',
            brightBlack: '#767676',
            brightRed: '#e74856',
            brightGreen: '#16c60c',
            brightYellow: '#f9f1a5',
            brightBlue: '#3b78ff',
            brightMagenta: '#b4009e',
            brightCyan: '#61d6d6',
            brightWhite: '#f2f2f2'
        },
        recommendedFont: { size: 14, family: 'Consolas', weight: 'normal' }
    },
    {
        id: 'ocean',
        name: '海洋主题',
        description: '清新海洋配色方案',
        colors: {
            background: '#1a2833',
            foreground: '#d4e5f5',
            cursor: '#70c0ba',
            selection: '#2a4a5a',
            black: '#1a2833',
            red: '#ec6b6b',
            green: '#70c0ba',
            yellow: '#f7d673',
            blue: '#5b9fe3',
            magenta: '#c68aee',
            cyan: '#70c0ba',
            white: '#d4e5f5',
            brightBlack: '#4a5b66',
            brightRed: '#ff8d8d',
            brightGreen: '#a0e0d8',
            brightYellow: '#ffe5a0',
            brightBlue: '#8bc0f0',
            brightMagenta: '#e0b0ff',
            brightCyan: '#a0e0d8',
            brightWhite: '#ffffff'
        },
        recommendedFont: { size: 15, family: 'JetBrains Mono', weight: 'normal' }
    },
    {
        id: 'forest',
        name: '森林主题',
        description: '自然森林配色方案',
        colors: {
            background: '#1e2418',
            foreground: '#c8d4b8',
            cursor: '#a0b080',
            selection: '#3a4a28',
            black: '#1e2418',
            red: '#d06050',
            green: '#90a060',
            yellow: '#d0a050',
            blue: '#6080a0',
            magenta: '#a060a0',
            cyan: '#60a0a0',
            white: '#c8d4b8',
            brightBlack: '#5a6050',
            brightRed: '#f08070',
            brightGreen: '#b0c080',
            brightYellow: '#f0c070',
            brightBlue: '#80a0c0',
            brightMagenta: '#c080c0',
            brightCyan: '#80c0c0',
            brightWhite: '#e8f0d8'
        },
        recommendedFont: { size: 14, family: 'Fira Code', weight: 'light' }
    },
    {
        id: 'sunset',
        name: '日落主题',
        description: '温暖日落配色方案',
        colors: {
            background: '#2a1f1a',
            foreground: '#f0e0d0',
            cursor: '#f0a050',
            selection: '#4a3020',
            black: '#2a1f1a',
            red: '#e05030',
            green: '#a08040',
            yellow: '#f0a050',
            blue: '#8070a0',
            magenta: '#c06060',
            cyan: '#809060',
            white: '#f0e0d0',
            brightBlack: '#6a5a50',
            brightRed: '#f07050',
            brightGreen: '#c0a060',
            brightYellow: '#f0c070',
            brightBlue: '#a090c0',
            brightMagenta: '#e08080',
            brightCyan: '#a0b080',
            brightWhite: '#fff0e0'
        },
        recommendedFont: { size: 15, family: 'Source Code Pro', weight: 'normal' }
    },
    {
        id: 'neon',
        name: '霓虹主题',
        description: '炫酷霓虹配色方案',
        colors: {
            background: '#0a0a0a',
            foreground: '#f0f0f0',
            cursor: '#ff00ff',
            selection: '#303030',
            black: '#0a0a0a',
            red: '#ff0050',
            green: '#00ff80',
            yellow: '#ffff00',
            blue: '#00a0ff',
            magenta: '#ff00ff',
            cyan: '#00ffff',
            white: '#f0f0f0',
            brightBlack: '#505050',
            brightRed: '#ff5080',
            brightGreen: '#80ffc0',
            brightYellow: '#ffff80',
            brightBlue: '#80c0ff',
            brightMagenta: '#ff80ff',
            brightCyan: '#80ffff',
            brightWhite: '#ffffff'
        },
        recommendedFont: { size: 16, family: 'JetBrains Mono', weight: 'bold' }
    },
    {
        id: 'dracula',
        name: 'Dracula',
        description: '经典 Dracula 配色方案',
        colors: {
            background: '#282a36',
            foreground: '#f8f8f2',
            cursor: '#f8f8f0',
            selection: '#44475a',
            black: '#21222c',
            red: '#ff5555',
            green: '#50fa7b',
            yellow: '#f1fa8c',
            blue: '#bd93f9',
            magenta: '#ff79c6',
            cyan: '#8be9fd',
            white: '#f8f8f2',
            brightBlack: '#6272a4',
            brightRed: '#ff6e6e',
            brightGreen: '#69ff94',
            brightYellow: '#ffffa5',
            brightBlue: '#d6acff',
            brightMagenta: '#ff92df',
            brightCyan: '#a4ffff',
            brightWhite: '#ffffff'
        },
        recommendedFont: { size: 14, family: 'Fira Code', weight: 'normal' }
    },
    {
        id: 'material',
        name: 'Material',
        description: 'Google Material Design 配色方案',
        colors: {
            background: '#263238',
            foreground: '#eeffff',
            cursor: '#80cbc4',
            selection: '#546e7a',
            black: '#000000',
            red: '#f07178',
            green: '#c3e88d',
            yellow: '#ffcb6b',
            blue: '#82aaff',
            magenta: '#c792ea',
            cyan: '#89ddff',
            white: '#eeffff',
            brightBlack: '#546e7a',
            brightRed: '#f07178',
            brightGreen: '#c3e88d',
            brightYellow: '#ffcb6b',
            brightBlue: '#82aaff',
            brightMagenta: '#c792ea',
            brightCyan: '#89ddff',
            brightWhite: '#ffffff'
        },
        recommendedFont: { size: 14, family: 'Roboto Mono', weight: 'normal' }
    },
    {
        id: 'solarized',
        name: 'Solarized',
        description: '经典 Solarized 配色方案',
        colors: {
            background: '#002b36',
            foreground: '#839496',
            cursor: '#839496',
            selection: '#073642',
            black: '#073642',
            red: '#dc322f',
            green: '#859900',
            yellow: '#b58900',
            blue: '#268bd2',
            magenta: '#d33682',
            cyan: '#2aa198',
            white: '#eee8d5',
            brightBlack: '#002b36',
            brightRed: '#cb4b16',
            brightGreen: '#586e75',
            brightYellow: '#657b83',
            brightBlue: '#839496',
            brightMagenta: '#6c71c4',
            brightCyan: '#93a1a1',
            brightWhite: '#fdf6e3'
        },
        recommendedFont: { size: 14, family: 'Source Code Pro', weight: 'light' }
    },
    {
        id: 'gruvbox',
        name: 'Gruvbox',
        description: '复古 Gruvbox 配色方案',
        colors: {
            background: '#282828',
            foreground: '#ebdbb2',
            cursor: '#ebdbb2',
            selection: '#504945',
            black: '#282828',
            red: '#cc241d',
            green: '#98971a',
            yellow: '#d79921',
            blue: '#458588',
            magenta: '#b16286',
            cyan: '#689d6a',
            white: '#a89984',
            brightBlack: '#928374',
            brightRed: '#fb4934',
            brightGreen: '#b8bb26',
            brightYellow: '#fabd2f',
            brightBlue: '#83a598',
            brightMagenta: '#d3869b',
            brightCyan: '#8ec07c',
            brightWhite: '#ebdbb2'
        },
        recommendedFont: { size: 14, family: 'JetBrains Mono', weight: 'normal' }
    }
];

/**
 * 默认命令分组
 */
export const DEFAULT_COMMAND_GROUPS: CommandGroup[] = [
    {
        id: 'git',
        name: 'Git 命令',
        icon: 'git-branch',
        commands: [
            { id: 'git-status', name: 'Git Status', command: 'git status', group: 'git', icon: 'check' },
            { id: 'git-log', name: 'Git Log', command: 'git log --oneline -10', group: 'git', icon: 'history' },
            { id: 'git-pull', name: 'Git Pull', command: 'git pull', group: 'git', icon: 'arrow-down' },
            { id: 'git-push', name: 'Git Push', command: 'git push', group: 'git', icon: 'arrow-up' },
            { id: 'git-branch', name: 'Git Branch', command: 'git branch -a', group: 'git', icon: 'git-branch' },
            { id: 'git-diff', name: 'Git Diff', command: 'git diff', group: 'git', icon: 'diff' }
        ]
    },
    {
        id: 'npm',
        name: 'NPM 命令',
        icon: 'package',
        commands: [
            { id: 'npm-install', name: 'NPM Install', command: 'npm install', group: 'npm', icon: 'package' },
            { id: 'npm-run-dev', name: 'NPM Run Dev', command: 'npm run dev', group: 'npm', icon: 'play' },
            { id: 'npm-run-build', name: 'NPM Run Build', command: 'npm run build', group: 'npm', icon: 'server-process' },
            { id: 'npm-run-test', name: 'NPM Run Test', command: 'npm test', group: 'npm', icon: 'beaker' },
            { id: 'npm-update', name: 'NPM Update', command: 'npm update', group: 'npm', icon: 'sync' },
            { id: 'npm-outdated', name: 'NPM Outdated', command: 'npm outdated', group: 'npm', icon: 'warning' }
        ]
    },
    {
        id: 'python',
        name: 'Python 命令',
        icon: 'symbol-method',
        commands: [
            { id: 'pip-list', name: 'Pip List', command: 'pip list', group: 'python', icon: 'list-unordered' },
            { id: 'pip-install', name: 'Pip Install', command: 'pip install', group: 'python', icon: 'package' },
            { id: 'pip-freeze', name: 'Pip Freeze', command: 'pip freeze > requirements.txt', group: 'python', icon: 'file' },
            { id: 'python-run', name: 'Python Run', command: 'python', group: 'python', icon: 'play' },
            { id: 'venv-activate', name: 'Venv Activate', command: '.venv\\Scripts\\activate', group: 'python', icon: 'terminal' }
        ]
    },
    {
        id: 'docker',
        name: 'Docker 命令',
        icon: 'server',
        commands: [
            { id: 'docker-ps', name: 'Docker PS', command: 'docker ps -a', group: 'docker', icon: 'server' },
            { id: 'docker-images', name: 'Docker Images', command: 'docker images', group: 'docker', icon: 'package' },
            { id: 'docker-compose-up', name: 'Docker Compose Up', command: 'docker-compose up -d', group: 'docker', icon: 'play' },
            { id: 'docker-compose-down', name: 'Docker Compose Down', command: 'docker-compose down', group: 'docker', icon: 'stop' },
            { id: 'docker-logs', name: 'Docker Logs', command: 'docker logs -f', group: 'docker', icon: 'output' }
        ]
    },
    {
        id: 'system',
        name: '系统命令',
        icon: 'server',
        commands: [
            { id: 'ls', name: '列出文件', command: 'dir', group: 'system', icon: 'folder' },
            { id: 'clear', name: '清屏', command: 'cls', group: 'system', icon: 'clear-all' },
            { id: 'pwd', name: '当前目录', command: 'cd', group: 'system', icon: 'home' },
            { id: 'ipconfig', name: '网络配置', command: 'ipconfig', group: 'system', icon: 'globe' },
            { id: 'tasklist', name: '进程列表', command: 'tasklist', group: 'system', icon: 'list-unordered' }
        ]
    }
];
