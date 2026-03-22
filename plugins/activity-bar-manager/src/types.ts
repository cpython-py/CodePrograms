/**
 * 活动栏管理器 - 类型定义
 */

/**
 * 活动栏视图项
 */
export interface ActivityBarItem {
    id: string;
    name: string;
    icon: string;
    visible: boolean;
    pinned: boolean;
    order: number;
    badge?: string;
    badgeTooltip?: string;
    tooltip?: string;
    enabled?: boolean;
    category?: string;
}

/**
 * 配置文件
 */
export interface ActivityBarProfile {
    id: string;
    name: string;
    description?: string;
    hiddenItems: string[];
    itemOrder: string[];
    pinnedItems: string[];
    customIcons: Record<string, string>;
    createdAt: number;
    updatedAt: number;
    isDefault?: boolean;
}

/**
 * 配置选项
 */
export interface ActivityBarConfig {
    hiddenItems: string[];
    itemOrder: string[];
    pinnedItems: string[];
    customIcons: Record<string, string>;
    profiles: Record<string, ActivityBarProfile>;
    activeProfile: string;
    enableWorkspaceSync: boolean;
    rememberLastActiveView: boolean;
    lastActiveView: string;
    autoHideDelay: number;
    enableAnimations: boolean;
}

/**
 * 视图项树节点
 */
export interface ViewItemNode {
    id: string;
    label: string;
    description?: string;
    iconPath?: string | { light: string; dark: string };
    collapsibleState?: vscode.TreeItemCollapsibleState;
    contextValue?: string;
    command?: vscode.Command;
    children?: ViewItemNode[];
}

/**
 * 活动栏事件类型
 */
export enum ActivityBarEventType {
    ItemAdded = 'itemAdded',
    ItemRemoved = 'itemRemoved',
    ItemVisibilityChanged = 'itemVisibilityChanged',
    ItemOrderChanged = 'itemOrderChanged',
    ItemPinned = 'itemPinned',
    ProfileSwitched = 'profileSwitched',
    ConfigImported = 'configImported',
    ConfigExported = 'configExported'
}

/**
 * 活动栏事件
 */
export interface ActivityBarEvent {
    type: ActivityBarEventType;
    data?: any;
    timestamp: number;
}

/**
 * 导入的配置数据
 */
export interface ExportedConfig {
    version: string;
    exportDate: string;
    profiles: Record<string, ActivityBarProfile>;
    activeProfile: string;
    customIcons: Record<string, string>;
    metadata?: {
        vscodeVersion?: string;
        extensionVersion?: string;
    };
}

import * as vscode from 'vscode';
