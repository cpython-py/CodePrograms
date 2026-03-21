/**
 * Context Menu Manager - 类型定义文件
 * 定义扩展中使用的所有接口和类型
 */

import * as vscode from 'vscode';

/**
 * 菜单项执行类型
 */
export type MenuItemType = 'command' | 'script' | 'terminal' | 'url';

/**
 * 菜单主题类型
 */
export type MenuTheme = 'default' | 'dark' | 'light' | 'custom';

/**
 * 菜单项显示条件
 */
export interface MenuCondition {
    /** when 表达式 */
    when?: string;
    /** 是否需要选中文本 */
    hasSelection?: boolean;
    /** 最少文件数量 */
    minFiles?: number;
    /** 最大文件数量 */
    maxFiles?: number;
    /** 文件大小限制（字节） */
    maxFileSize?: number;
    /** 自定义条件函数名 */
    customCondition?: string;
    /** 工作区是否受信任 */
    requireTrustedWorkspace?: boolean;
}

/**
 * 右键菜单项配置
 */
export interface MenuItemConfig {
    /** 菜单项唯一标识符 */
    id: string;
    /** 菜单项显示文本 */
    label: string;
    /** 要执行的命令或脚本 */
    command: string;
    /** 执行类型 */
    type: MenuItemType;
    /** 图标路径或VS Code内置图标名称 */
    icon?: string;
    /** 自定义SVG图标路径 */
    iconPath?: string;
    /** 是否启用此菜单项 */
    enabled: boolean;
    /** 适用的文件类型（如 ['.js', '.ts']） */
    fileTypes?: string[];
    /** 排除的文件类型 */
    excludeFileTypes?: string[];
    /** 适用的项目路径 */
    projectPaths?: string[];
    /** 显示条件 */
    conditions?: MenuCondition;
    /** 菜单分组 */
    group: string;
    /** 快捷键 */
    shortcut?: string;
    /** 菜单项顺序（数字越小越靠前） */
    order?: number;
    /** 是否在编辑器右键菜单显示 */
    showInEditor: boolean;
    /** 是否在资源管理器右键菜单显示 */
    showInExplorer: boolean;
    /** 是否在标题栏右键菜单显示 */
    showInTitleBar?: boolean;
    /** 是否在编辑器标签右键菜单显示 */
    showInEditorTab?: boolean;
    /** 子菜单ID（如果有子菜单） */
    submenuId?: string;
    /** 是否为分隔线 */
    isSeparator?: boolean;
    /** 描述信息 */
    description?: string;
    /** 工作目录 */
    workingDirectory?: string;
    /** 环境变量 */
    environment?: Record<string, string>;
    /** 参数列表 */
    arguments?: string[];
    /** 是否显示输出 */
    showOutput?: boolean;
    /** 输出通道名称 */
    outputChannel?: string;
}

/**
 * 菜单配置文件
 */
export interface MenuConfigFile {
    /** 配置版本 */
    version: string;
    /** 配置名称 */
    name: string;
    /** 配置描述 */
    description?: string;
    /** 菜单项列表 */
    items: MenuItemConfig[];
    /** 导入时间 */
    importedAt?: string;
    /** 导出时间 */
    exportedAt?: string;
    /** 作者 */
    author?: string;
}

/**
 * 条件上下文
 */
export interface ConditionContext {
    /** 当前活动编辑器 */
    activeEditor?: vscode.TextEditor;
    /** 选中的文件URI列表 */
    selectedUris: vscode.Uri[];
    /** 当前工作区 */
    workspaceFolder?: vscode.WorkspaceFolder;
    /** 是否有选中文本 */
    hasSelection: boolean;
    /** 选中的文本 */
    selectedText?: string;
    /** 文件语言ID */
    languageId?: string;
    /** 文件扩展名 */
    fileExtension?: string;
    /** 文件路径 */
    filePath?: string;
    /** 工作区是否受信任 */
    isTrusted: boolean;
}

/**
 * 菜单项树节点（用于TreeView）
 */
export interface MenuItemTreeNode {
    /** 节点ID */
    id: string;
    /** 节点标签 */
    label: string;
    /** 节点描述 */
    description?: string;
    /** 图标路径 */
    iconPath?: vscode.ThemeIcon | vscode.Uri;
    /** 是否可折叠 */
    collapsibleState?: vscode.TreeItemCollapsibleState;
    /** 上下文值（用于判断右键菜单操作） */
    contextValue?: string;
    /** 关联的菜单配置 */
    config: MenuItemConfig;
    /** 子节点 */
    children?: MenuItemTreeNode[];
    /** 是否为分组节点 */
    isGroup?: boolean;
    /** 是否启用 */
    isEnabled?: boolean;
}

/**
 * 配置变更事件
 */
export interface ConfigChangeEvent {
    /** 变更类型 */
    type: 'add' | 'edit' | 'delete' | 'toggle' | 'reorder' | 'import' | 'reset';
    /** 变更的菜单项 */
    items?: MenuItemConfig[];
    /** 变更前状态 */
    oldState?: MenuItemConfig[];
    /** 变更后状态 */
    newState?: MenuItemConfig[];
    /** 时间戳 */
    timestamp: number;
}

/**
 * 执行结果
 */
export interface ExecutionResult {
    /** 是否成功 */
    success: boolean;
    /** 输出内容 */
    output?: string;
    /** 错误信息 */
    error?: string;
    /** 执行时间（毫秒） */
    duration: number;
    /** 退出码 */
    exitCode?: number;
}

/**
 * 快捷键绑定
 */
export interface Keybinding {
    /** 快捷键组合 */
    key: string;
    /** 命令ID */
    command: string;
    /** when条件 */
    when?: string;
    /** 是否在Mac上使用不同的快捷键 */
    mac?: string;
    /** 是否在Linux上使用不同的快捷键 */
    linux?: string;
    /** 是否在Windows上使用不同的快捷键 */
    win?: string;
}

/**
 * 主题样式配置
 */
export interface ThemeStyle {
    /** 主题名称 */
    name: MenuTheme;
    /** 背景色 */
    backgroundColor?: string;
    /** 前景色 */
    foregroundColor?: string;
    /** 边框色 */
    borderColor?: string;
    /** 悬停背景色 */
    hoverBackgroundColor?: string;
    /** 激活背景色 */
    activeBackgroundColor?: string;
    /** 图标颜色 */
    iconColor?: string;
    /** 分隔线颜色 */
    separatorColor?: string;
}

/**
 * 导出选项
 */
export interface ExportOptions {
    /** 是否包含系统菜单项 */
    includeSystem?: boolean;
    /** 是否包含禁用的菜单项 */
    includeDisabled?: boolean;
    /** 导出格式 */
    format?: 'json' | 'yaml';
    /** 是否压缩 */
    minify?: boolean;
}

/**
 * 导入选项
 */
export interface ImportOptions {
    /** 是否覆盖现有配置 */
    overwrite?: boolean;
    /** 是否合并 */
    merge?: boolean;
    /** 是否验证 */
    validate?: boolean;
    /** 是否备份当前配置 */
    backup?: boolean;
}

/**
 * 扩展设置
 */
export interface ExtensionSettings {
    /** 菜单项列表 */
    items: MenuItemConfig[];
    /** 是否启用自动隐藏 */
    enableAutoHide: boolean;
    /** 是否显示图标 */
    showIcons: boolean;
    /** 是否启用动画 */
    animationEnabled: boolean;
    /** 主题样式 */
    theme: MenuTheme;
}

/**
 * 模板菜单项
 */
export interface MenuTemplate {
    /** 模板ID */
    id: string;
    /** 模板名称 */
    name: string;
    /** 模板描述 */
    description: string;
    /** 模板类别 */
    category: string;
    /** 预览图片 */
    previewImage?: string;
    /** 菜单项配置 */
    config: Partial<MenuItemConfig>;
}

/**
 * 菜单项分组
 */
export interface MenuGroup {
    /** 分组ID */
    id: string;
    /** 分组名称 */
    name: string;
    /** 分组图标 */
    icon?: string;
    /** 分组顺序 */
    order: number;
    /** 分组内的菜单项 */
    items: MenuItemConfig[];
    /** 是否展开 */
    expanded: boolean;
}
