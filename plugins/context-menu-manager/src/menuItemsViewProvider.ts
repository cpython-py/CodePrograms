/**
 * Context Menu Manager - 菜单项视图提供者
 * 在侧边栏显示菜单项列表
 */

import * as vscode from 'vscode';
import { MenuItemConfig } from './types';
import { ContextMenuManager } from './contextMenuManager';

/**
 * 菜单项树视图提供者
 * 实现 TreeDataProvider 接口
 */
export class MenuItemsViewProvider implements vscode.TreeDataProvider<MenuItemTreeItem> {
    /** 数据变更事件发射器 */
    private readonly onDidChangeTreeDataEmitter = new vscode.EventEmitter<MenuItemTreeItem | undefined | null | void>();
    /** 数据变更事件 */
    public readonly onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;

    /**
     * 构造函数
     * @param extensionUri 扩展URI
     * @param manager 菜单管理器实例
     */
    constructor(
        private readonly extensionUri: vscode.Uri,
        private readonly manager: ContextMenuManager
    ) {}

    /**
     * 刷新视图
     */
    public refresh(): void {
        this.onDidChangeTreeDataEmitter.fire();
    }

    /**
     * 获取树项
     */
    public getTreeItem(element: MenuItemTreeItem): vscode.TreeItem {
        return element;
    }

    /**
     * 获取子项
     */
    public async getChildren(element?: MenuItemTreeItem): Promise<MenuItemTreeItem[]> {
        if (element) {
            // 如果有父元素，返回其子项（暂不支持嵌套）
            return [];
        }

        // 获取所有菜单项并按分组组织
        const items = this.manager.getAllMenuItems();
        return items.map(item => new MenuItemTreeItem(item));
    }
}

/**
 * 菜单项树节点类
 */
class MenuItemTreeItem extends vscode.TreeItem {
    /**
     * 构造函数
     * @param config 菜单项配置
     */
    constructor(public readonly config: MenuItemConfig) {
        super(
            config.label || '分隔线',
            vscode.TreeItemCollapsibleState.None
        );

        // 设置描述
        this.description = config.description || config.command || '';

        // 设置提示文本
        this.tooltip = this.createTooltip(config);

        // 设置图标
        if (config.isSeparator) {
            this.iconPath = new vscode.ThemeIcon('separator');
        } else if (config.icon) {
            // 解析图标
            if (config.icon.startsWith('$(') && config.icon.endsWith(')')) {
                const iconName = config.icon.slice(2, -1);
                this.iconPath = new vscode.ThemeIcon(iconName);
            }
        }

        // 设置上下文值（用于右键菜单判断）
        this.contextValue = this.getContextValue(config);

        // 设置命令（点击时执行）
        if (!config.isSeparator && config.enabled) {
            this.command = {
                command: `contextMenuManager.execute.${config.id}`,
                title: config.label || '',
                tooltip: this.tooltip
            };
        }

        // 设置资源URI装饰
        this.resourceUri = undefined;
    }

    /**
     * 创建提示文本
     */
    private createTooltip(config: MenuItemConfig): string {
        const parts: string[] = [];

        parts.push(`ID: ${config.id}`);
        parts.push(`类型: ${config.type}`);

        if (config.command) {
            parts.push(`命令: ${config.command}`);
        }

        if (config.shortcut) {
            parts.push(`快捷键: ${config.shortcut}`);
        }

        if (config.fileTypes && config.fileTypes.length > 0) {
            parts.push(`文件类型: ${config.fileTypes.join(', ')}`);
        }

        if (config.projectPaths && config.projectPaths.length > 0) {
            parts.push(`项目路径: ${config.projectPaths.join(', ')}`);
        }

        parts.push(`状态: ${config.enabled ? '✅ 已启用' : '❌ 已禁用'}`);

        if (config.conditions) {
            const conditions: string[] = [];
            if (config.conditions.hasSelection !== undefined) {
                conditions.push(config.conditions.hasSelection ? '需要选中' : '无需选中');
            }
            if (config.conditions.requireTrustedWorkspace) {
                conditions.push('需要受信任工作区');
            }
            if (conditions.length > 0) {
                parts.push(`条件: ${conditions.join(', ')}`);
            }
        }

        return parts.join('\n');
    }

    /**
     * 获取上下文值
     */
    private getContextValue(config: MenuItemConfig): string {
        const contexts: string[] = ['menuItem'];

        if (config.enabled) {
            contexts.push('enabled');
        } else {
            contexts.push('disabled');
        }

        if (config.isSeparator) {
            contexts.push('separator');
        }

        return contexts.join('.');
    }
}
