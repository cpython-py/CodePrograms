import * as vscode from 'vscode';
import { ActivityBarItem, ActivityBarProfile, ActivityBarEventType } from './types';
import { ActivityBarManager } from './activityBarManager';

/**
 * 视图管理树数据提供者
 */
export class ViewManagerProvider implements vscode.TreeDataProvider<ViewItemTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ViewItemTreeItem | undefined | null | void> = new vscode.EventEmitter<ViewItemTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ViewItemTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private manager: ActivityBarManager;

    constructor(manager: ActivityBarManager) {
        this.manager = manager;

        // 监听变化
        this.manager.on(ActivityBarEventType.ItemVisibilityChanged, () => this.refresh());
        this.manager.on(ActivityBarEventType.ItemOrderChanged, () => this.refresh());
        this.manager.on(ActivityBarEventType.ItemPinned, () => this.refresh());
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ViewItemTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ViewItemTreeItem): Promise<ViewItemTreeItem[]> {
        if (!element) {
            // 根节点 - 显示所有项目
            const allItems = this.manager.getAllItems();
            return allItems.map(item => this.createViewItem(item));
        }
        return [];
    }

    private createViewItem(item: ActivityBarItem): ViewItemTreeItem {
        // 构建 contextValue 用于右键菜单
        let contextValue = 'item-';
        contextValue += item.visible ? 'visible' : 'hidden';
        contextValue += '-';
        contextValue += item.pinned ? 'pinned' : 'unpinned';

        const treeItem = new ViewItemTreeItem(
            item.name,
            item.id,
            vscode.TreeItemCollapsibleState.None,
            contextValue
        );

        treeItem.description = item.category === 'builtin' ? '内置' : '扩展';
        treeItem.tooltip = this.createTooltip(item);
        
        // 设置图标
        const iconName = this.extractIconName(item.icon);
        treeItem.iconPath = new vscode.ThemeIcon(iconName);

        return treeItem;
    }

    private createTooltip(item: ActivityBarItem): string {
        const lines = [
            `**${item.name}**`,
            `ID: ${item.id}`,
            `类型: ${item.category === 'builtin' ? '内置' : '扩展'}`,
            `状态: ${item.visible ? '✅ 可见' : '❌ 隐藏'}`,
            `固定: ${item.pinned ? '📌 已固定' : '○ 未固定'}`,
            `排序: #${item.order}`
        ];
        return lines.join('\n');
    }

    private extractIconName(icon: string): string {
        // 从 $(icon-name) 格式中提取图标名
        const match = icon.match(/\$\(([^)]+)\)/);
        return match ? match[1] : 'symbol-misc';
    }

    /**
     * 获取项目的当前位置信息
     */
    getItemPosition(id: string): { current: number; total: number } {
        const items = this.manager.getAllItems();
        const index = items.findIndex(item => item.id === id);
        return { current: index + 1, total: items.length };
    }
}

/**
 * 配置文件树数据提供者
 */
export class ProfilesProvider implements vscode.TreeDataProvider<ProfileTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ProfileTreeItem | undefined | null | void> = new vscode.EventEmitter<ProfileTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ProfileTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private manager: ActivityBarManager;

    constructor(manager: ActivityBarManager) {
        this.manager = manager;
        this.manager.on(ActivityBarEventType.ProfileSwitched, () => this.refresh());
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ProfileTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ProfileTreeItem): Promise<ProfileTreeItem[]> {
        if (!element) {
            const profiles = this.manager.getAllProfiles();
            const currentProfileId = this.manager.getCurrentProfile()?.id;

            return profiles.map(profile => {
                const contextValue = profile.isDefault ? 'profile-default' : 'profile-custom';
                const treeItem = new ProfileTreeItem(
                    profile.name,
                    profile.id,
                    vscode.TreeItemCollapsibleState.None,
                    contextValue
                );

                treeItem.description = profile.description || '';
                treeItem.tooltip = `配置文件: ${profile.name}\n创建时间: ${new Date(profile.createdAt).toLocaleString()}`;
                treeItem.iconPath = profile.id === currentProfileId
                    ? new vscode.ThemeIcon('check')
                    : new vscode.ThemeIcon('account');

                return treeItem;
            });
        }

        return [];
    }
}

/**
 * 视图项树节点
 */
class ViewItemTreeItem extends vscode.TreeItem {
    public readonly itemId: string;

    constructor(
        public readonly label: string,
        itemId: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue: string
    ) {
        super(label, collapsibleState);
        this.itemId = itemId;
    }
}

/**
 * 配置文件树节点
 */
class ProfileTreeItem extends vscode.TreeItem {
    public readonly profileId: string;

    constructor(
        public readonly label: string,
        profileId: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue: string
    ) {
        super(label, collapsibleState);
        this.profileId = profileId;
    }
}

/**
 * 设置面板 - 支持完整的交互功能
 */
export class SettingsPanel {
    private static readonly viewType = 'activityBarManager.settingsPanel';
    private panel: vscode.WebviewPanel | undefined;
    private manager: ActivityBarManager;
    private context: vscode.ExtensionContext;

    constructor(manager: ActivityBarManager, context: vscode.ExtensionContext) {
        this.manager = manager;
        this.context = context;
    }

    /**
     * 显示设置面板
     */
    show(): void {
        if (this.panel) {
            this.panel.reveal();
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            SettingsPanel.viewType,
            '活动栏管理器设置',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                enableCommandUris: true
            }
        );

        this.panel.webview.html = this.getHtmlContent();

        // 处理来自 webview 的消息
        this.panel.webview.onDidReceiveMessage(async message => {
            await this.handleMessage(message);
        });

        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });
    }

    /**
     * 处理消息
     */
    private async handleMessage(message: any): Promise<void> {
        switch (message.command) {
            // 切换显示/隐藏状态
            case 'toggleVisibility':
                await this.manager.toggleViewItem(message.id);
                this.updateWebView();
                this.showStatusMessage(`已${message.visible ? '隐藏' : '显示'}: ${message.name}`);
                break;

            // 隐藏项目
            case 'hideItem':
                await this.manager.hideViewItem(message.id);
                this.updateWebView();
                this.showStatusMessage(`已隐藏: ${message.name || message.id}`);
                break;

            // 显示项目
            case 'showItem':
                await this.manager.showViewItem(message.id);
                this.updateWebView();
                this.showStatusMessage(`已显示: ${message.name || message.id}`);
                break;

            // 上移
            case 'moveUp':
                const upResult = await this.manager.moveItem(message.id, 'up');
                if (upResult) {
                    this.updateWebView();
                    this.showStatusMessage(`已上移: ${message.name || message.id}`);
                }
                break;

            // 下移
            case 'moveDown':
                const downResult = await this.manager.moveItem(message.id, 'down');
                if (downResult) {
                    this.updateWebView();
                    this.showStatusMessage(`已下移: ${message.name || message.id}`);
                }
                break;

            // 固定
            case 'pinItem':
                await this.manager.pinViewItem(message.id);
                this.updateWebView();
                this.showStatusMessage(`已固定: ${message.name || message.id}`);
                break;

            // 取消固定
            case 'unpinItem':
                await this.manager.unpinViewItem(message.id);
                this.updateWebView();
                this.showStatusMessage(`已取消固定: ${message.name || message.id}`);
                break;

            // 切换固定状态
            case 'togglePin':
                const item = this.manager.getAllItems().find(i => i.id === message.id);
                if (item) {
                    if (item.pinned) {
                        await this.manager.unpinViewItem(message.id);
                        this.showStatusMessage(`已取消固定: ${item.name}`);
                    } else {
                        await this.manager.pinViewItem(message.id);
                        this.showStatusMessage(`已固定: ${item.name}`);
                    }
                    this.updateWebView();
                }
                break;

            // 隐藏全部
            case 'hideAll':
                await this.manager.hideAllItems();
                this.updateWebView();
                this.showStatusMessage('已隐藏所有项目');
                break;

            // 显示全部
            case 'showAll':
                await this.manager.showAllItems();
                this.updateWebView();
                this.showStatusMessage('已显示所有项目');
                break;

            // 重置为默认
            case 'reset':
                const confirm = await vscode.window.showWarningMessage(
                    '确定要重置为默认布局吗？所有自定义设置将丢失。',
                    { modal: true },
                    '确定',
                    '取消'
                );
                if (confirm === '确定') {
                    await this.manager.resetToDefault();
                    this.updateWebView();
                    this.showStatusMessage('已重置为默认布局');
                }
                break;

            // 恢复单个项目到默认状态
            case 'resetItem':
                await this.resetItemToDefault(message.id);
                this.updateWebView();
                break;

            // 创建配置文件
            case 'createProfile':
                const name = await vscode.window.showInputBox({
                    prompt: '输入配置文件名称',
                    placeHolder: '我的配置',
                    validateInput: value => {
                        if (!value || value.trim().length === 0) {
                            return '请输入配置文件名称';
                        }
                        if (value.length > 50) {
                            return '名称不能超过50个字符';
                        }
                        return null;
                    }
                });
                if (name) {
                    const description = await vscode.window.showInputBox({
                        prompt: '输入配置文件描述（可选）',
                        placeHolder: '配置文件描述'
                    });
                    await this.manager.createProfile(name.trim(), description);
                    this.updateWebView();
                    this.showStatusMessage(`配置文件 "${name}" 已创建`);
                }
                break;

            // 切换配置文件
            case 'switchProfile':
                await this.manager.switchProfile(message.id);
                this.updateWebView();
                break;

            // 删除配置文件
            case 'deleteProfile':
                const confirmDelete = await vscode.window.showWarningMessage(
                    `确定要删除配置文件 "${message.name}" 吗？`,
                    '确定',
                    '取消'
                );
                if (confirmDelete === '确定') {
                    await this.manager.deleteProfile(message.id);
                    this.updateWebView();
                    this.showStatusMessage('配置文件已删除');
                }
                break;

            // 导出配置
            case 'exportConfig':
                await this.exportConfig();
                break;

            // 导入配置
            case 'importConfig':
                await this.importConfig();
                break;

            // 拖拽排序
            case 'reorderItems':
                await this.handleReorder(message.itemIds);
                this.updateWebView();
                break;

            // 批量操作
            case 'batchOperation':
                await this.handleBatchOperation(message.operation, message.ids);
                this.updateWebView();
                break;
        }
    }

    /**
     * 恢复项目到默认状态
     */
    private async resetItemToDefault(id: string): Promise<void> {
        const item = this.manager.getAllItems().find(i => i.id === id);
        if (!item) return;

        // 恢复可见性
        if (!item.visible) {
            await this.manager.showViewItem(id);
        }

        // 取消固定
        if (item.pinned) {
            await this.manager.unpinViewItem(id);
        }

        this.showStatusMessage(`"${item.name}" 已恢复默认状态`);
    }

    /**
     * 处理拖拽重排序
     */
    private async handleReorder(itemIds: string[]): Promise<void> {
        const config = vscode.workspace.getConfiguration('activityBarManager');
        await config.update('itemOrder', itemIds, vscode.ConfigurationTarget.Global);
        this.showStatusMessage('排序已更新');
    }

    /**
     * 处理批量操作
     */
    private async handleBatchOperation(operation: string, ids: string[]): Promise<void> {
        switch (operation) {
            case 'hide':
                for (const id of ids) {
                    await this.manager.hideViewItem(id);
                }
                this.showStatusMessage(`已隐藏 ${ids.length} 个项目`);
                break;
            case 'show':
                for (const id of ids) {
                    await this.manager.showViewItem(id);
                }
                this.showStatusMessage(`已显示 ${ids.length} 个项目`);
                break;
            case 'pin':
                for (const id of ids) {
                    await this.manager.pinViewItem(id);
                }
                this.showStatusMessage(`已固定 ${ids.length} 个项目`);
                break;
            case 'unpin':
                for (const id of ids) {
                    await this.manager.unpinViewItem(id);
                }
                this.showStatusMessage(`已取消固定 ${ids.length} 个项目`);
                break;
        }
    }

    /**
     * 显示状态消息
     */
    private showStatusMessage(message: string): void {
        vscode.window.showInformationMessage(message);
    }

    /**
     * 更新 WebView 内容
     */
    private updateWebView(): void {
        if (this.panel) {
            const items = this.manager.getAllItems();
            const profiles = this.manager.getAllProfiles();
            const activeProfile = this.manager.getCurrentProfile();

            this.panel.webview.postMessage({
                command: 'update',
                data: {
                    items: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        icon: item.icon,
                        category: item.category,
                        visible: item.visible,
                        pinned: item.pinned,
                        order: item.order
                    })),
                    profiles,
                    activeProfile
                }
            });
        }
    }

    /**
     * 导出配置
     */
    private async exportConfig(): Promise<void> {
        const config = await this.manager.exportConfig();
        const json = JSON.stringify(config, null, 2);

        const uri = await vscode.window.showSaveDialog({
            filters: { 'JSON': ['json'] },
            defaultUri: vscode.Uri.file('activity-bar-config.json')
        });

        if (uri) {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(json));
            this.showStatusMessage('配置已导出');
        }
    }

    /**
     * 导入配置
     */
    private async importConfig(): Promise<void> {
        const uris = await vscode.window.showOpenDialog({
            filters: { 'JSON': ['json'] },
            canSelectMany: false
        });

        if (uris && uris[0]) {
            const content = await vscode.workspace.fs.readFile(uris[0]);
            try {
                const config = JSON.parse(content.toString());
                await this.manager.importConfig(config);
                this.updateWebView();
                this.showStatusMessage('配置已导入');
            } catch (e) {
                vscode.window.showErrorMessage('配置文件格式无效');
            }
        }
    }

    /**
     * 获取 HTML 内容
     */
    private getHtmlContent(): string {
        const items = this.manager.getAllItems();
        const profiles = this.manager.getAllProfiles();
        const activeProfile = this.manager.getCurrentProfile();

        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>活动栏管理器</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            user-select: none;
        }
        
        h1 { font-size: 24px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        h2 { font-size: 16px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
        
        .section {
            margin-bottom: 25px;
            padding: 15px;
            background: var(--vscode-editorWidget-background);
            border-radius: 8px;
            border: 1px solid var(--vscode-widget-border, transparent);
        }
        
        .toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 15px;
            padding: 10px;
            background: var(--vscode-input-background);
            border-radius: 6px;
        }
        
        .item-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 15px;
            background: var(--vscode-input-background);
            border-radius: 6px;
            border: 1px solid var(--vscode-input-border);
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .item:hover {
            background: var(--vscode-list-hoverBackground);
            border-color: var(--vscode-focusBorder);
        }
        
        .item.selected {
            background: var(--vscode-list-activeSelectionBackground);
            border-color: var(--vscode-focusBorder);
        }
        
        .item.hidden-item {
            opacity: 0.6;
        }
        
        .item.pinned-item {
            border-left: 3px solid var(--vscode-button-background);
        }
        
        .item.dragging {
            opacity: 0.5;
            transform: scale(0.98);
        }
        
        .item.drag-over {
            border-top: 2px solid var(--vscode-focusBorder);
        }
        
        .item-left {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        }
        
        .item-drag-handle {
            cursor: grab;
            color: var(--vscode-descriptionForeground);
            padding: 4px;
        }
        
        .item-drag-handle:active { cursor: grabbing; }
        
        .item-icon {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }
        
        .item-info { display: flex; flex-direction: column; gap: 2px; }
        
        .item-name {
            font-weight: 500;
            font-size: 14px;
        }
        
        .item-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
        
        .badges { display: flex; gap: 6px; margin-left: auto; }
        
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
        }
        
        .badge-visible { background: #2ea043; color: white; }
        .badge-hidden { background: #da3633; color: white; }
        .badge-pinned { background: #1f6feb; color: white; }
        .badge-order { background: var(--vscode-badge-background); color: var(--vscode-badge-foreground); }
        
        .item-actions {
            display: flex;
            gap: 4px;
            margin-left: 10px;
        }
        
        button {
            padding: 6px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            transition: background 0.15s;
        }
        
        button:hover { background: var(--vscode-button-hoverBackground); }
        button:active { transform: scale(0.95); }
        
        button.secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        button.secondary:hover { background: var(--vscode-button-secondaryHoverBackground); }
        
        button.icon-btn {
            padding: 4px 8px;
            min-width: 28px;
        }
        
        button.danger { background: #b91c1c; }
        button.danger:hover { background: #dc2626; }
        
        button.success { background: #15803d; }
        button.success:hover { background: #16a34a; }
        
        .profile-bar {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        select {
            flex: 1;
            max-width: 250px;
            padding: 8px 12px;
            border: 1px solid var(--vscode-input-border);
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 4px;
            font-size: 13px;
            cursor: pointer;
        }
        
        .stats {
            display: flex;
            gap: 20px;
            padding: 10px;
            background: var(--vscode-editorInfo-background, var(--vscode-input-background));
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 12px;
        }
        
        .stat { display: flex; flex-direction: column; align-items: center; }
        .stat-value { font-size: 18px; font-weight: bold; }
        .stat-label { color: var(--vscode-descriptionForeground); }
        
        .empty-state {
            text-align: center;
            padding: 40px;
            color: var(--vscode-descriptionForeground);
        }
        
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: var(--vscode-notifications-background);
            border: 1px solid var(--vscode-notifications-border);
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
    </style>
</head>
<body>
    <h1>🎯 活动栏管理器</h1>
    
    <!-- 配置文件区域 -->
    <div class="section">
        <h2>📁 配置文件</h2>
        <div class="profile-bar">
            <select id="profileSelect" onchange="switchProfile(this.value)">
                ${profiles.map(p => `<option value="${p.id}" ${p.id === activeProfile?.id ? 'selected' : ''}>${p.name}</option>`).join('')}
            </select>
            <button onclick="createProfile()">➕ 新建</button>
            <button class="secondary" onclick="exportConfig()">📤 导出</button>
            <button class="secondary" onclick="importConfig()">📥 导入</button>
        </div>
    </div>
    
    <!-- 统计信息 -->
    <div class="stats">
        <div class="stat">
            <span class="stat-value">${items.length}</span>
            <span class="stat-label">总项目</span>
        </div>
        <div class="stat">
            <span class="stat-value">${items.filter(i => i.visible).length}</span>
            <span class="stat-label">可见</span>
        </div>
        <div class="stat">
            <span class="stat-value">${items.filter(i => i.pinned).length}</span>
            <span class="stat-label">固定</span>
        </div>
    </div>
    
    <!-- 项目列表区域 -->
    <div class="section">
        <h2>📋 视图项目 <span style="font-weight:normal;color:var(--vscode-descriptionForeground)">(拖拽排序 · 点击切换状态)</span></h2>
        
        <div class="toolbar">
            <button onclick="showAll()">✅ 显示全部</button>
            <button class="secondary" onclick="hideAll()">❌ 隐藏全部</button>
            <button class="secondary" onclick="unpinAll()">📍 取消全部固定</button>
            <button class="danger" onclick="resetAll()">🔄 重置默认</button>
        </div>
        
        <div class="item-list" id="itemList">
            ${items.map((item, index) => `
            <div class="item ${!item.visible ? 'hidden-item' : ''} ${item.pinned ? 'pinned-item' : ''}" 
                 data-id="${item.id}" 
                 data-index="${index}"
                 draggable="true"
                 onclick="handleItemClick(event, '${item.id}')"
                 ondblclick="toggleVisibility('${item.id}', ${item.visible}, '${item.name.replace(/'/g, "\\'")}')">
                
                <div class="item-left">
                    <span class="item-drag-handle" title="拖拽排序">⋮⋮</span>
                    <div class="item-icon">${this.getIconEmoji(item.icon)}</div>
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <div class="item-meta">
                            <span>${item.category === 'builtin' ? '内置' : '扩展'}</span>
                            <span class="badge badge-order">#${index + 1}</span>
                        </div>
                    </div>
                </div>
                
                <div class="badges">
                    <span class="badge ${item.visible ? 'badge-visible' : 'badge-hidden'}">${item.visible ? '可见' : '隐藏'}</span>
                    ${item.pinned ? '<span class="badge badge-pinned">📌 固定</span>' : ''}
                </div>
                
                <div class="item-actions" onclick="event.stopPropagation()">
                    <button class="icon-btn" title="上移" onclick="moveUp('${item.id}', '${item.name.replace(/'/g, "\\'")}')">⬆️</button>
                    <button class="icon-btn" title="下移" onclick="moveDown('${item.id}', '${item.name.replace(/'/g, "\\'")}')">⬇️</button>
                    <button class="${item.visible ? 'secondary' : 'success'}" onclick="toggleVisibility('${item.id}', ${item.visible}, '${item.name.replace(/'/g, "\\'")}')">${item.visible ? '隐藏' : '显示'}</button>
                    <button class="secondary" onclick="togglePin('${item.id}', ${item.pinned}, '${item.name.replace(/'/g, "\\'")}')">${item.pinned ? '取消固定' : '📌 固定'}</button>
                    <button class="icon-btn secondary" title="恢复默认" onclick="resetItem('${item.id}')">↩️</button>
                </div>
            </div>
            `).join('')}
        </div>
    </div>
    
    <!-- 提示信息 -->
    <div class="toast" id="toast"></div>

    <script>
        const vscode = acquireVsCodeApi();
        let draggedItem = null;
        let selectedItems = new Set();
        
        // 初始化拖拽
        function initDragAndDrop() {
            const list = document.getElementById('itemList');
            const items = list.querySelectorAll('.item');
            
            items.forEach(item => {
                item.addEventListener('dragstart', handleDragStart);
                item.addEventListener('dragend', handleDragEnd);
                item.addEventListener('dragover', handleDragOver);
                item.addEventListener('drop', handleDrop);
                item.addEventListener('dragleave', handleDragLeave);
            });
        }
        
        function handleDragStart(e) {
            draggedItem = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.dataset.id);
        }
        
        function handleDragEnd(e) {
            this.classList.remove('dragging');
            document.querySelectorAll('.item').forEach(item => {
                item.classList.remove('drag-over');
            });
        }
        
        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (this !== draggedItem) {
                this.classList.add('drag-over');
            }
        }
        
        function handleDragLeave(e) {
            this.classList.remove('drag-over');
        }
        
        function handleDrop(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (this !== draggedItem && draggedItem) {
                const list = document.getElementById('itemList');
                const allItems = Array.from(list.querySelectorAll('.item'));
                const draggedIndex = allItems.indexOf(draggedItem);
                const dropIndex = allItems.indexOf(this);
                
                if (draggedIndex < dropIndex) {
                    this.parentNode.insertBefore(draggedItem, this.nextSibling);
                } else {
                    this.parentNode.insertBefore(draggedItem, this);
                }
                
                // 发送新的排序
                const newOrder = Array.from(list.querySelectorAll('.item')).map(item => item.dataset.id);
                vscode.postMessage({ command: 'reorderItems', itemIds: newOrder });
                showToast('排序已更新');
            }
        }
        
        // 点击处理
        function handleItemClick(event, id) {
            if (event.target.closest('.item-actions')) return;
            
            const item = document.querySelector(\`.item[data-id="\${id}"]\`);
            if (event.ctrlKey || event.metaKey) {
                // 多选
                if (selectedItems.has(id)) {
                    selectedItems.delete(id);
                    item.classList.remove('selected');
                } else {
                    selectedItems.add(id);
                    item.classList.add('selected');
                }
            } else {
                // 单选
                document.querySelectorAll('.item.selected').forEach(el => el.classList.remove('selected'));
                selectedItems.clear();
                selectedItems.add(id);
                item.classList.add('selected');
            }
        }
        
        // 切换可见性
        function toggleVisibility(id, currentVisible, name) {
            vscode.postMessage({ command: 'toggleVisibility', id, visible: currentVisible, name });
        }
        
        // 切换固定状态
        function togglePin(id, currentPinned, name) {
            vscode.postMessage({ command: 'togglePin', id, pinned: currentPinned, name });
        }
        
        // 移动操作
        function moveUp(id, name) {
            vscode.postMessage({ command: 'moveUp', id, name });
        }
        
        function moveDown(id, name) {
            vscode.postMessage({ command: 'moveDown', id, name });
        }
        
        // 批量操作
        function showAll() {
            vscode.postMessage({ command: 'showAll' });
        }
        
        function hideAll() {
            vscode.postMessage({ command: 'hideAll' });
        }
        
        function unpinAll() {
            const items = document.querySelectorAll('.item[data-id]');
            items.forEach(item => {
                const id = item.dataset.id;
                vscode.postMessage({ command: 'unpinItem', id });
            });
            showToast('已取消全部固定');
        }
        
        function resetAll() {
            vscode.postMessage({ command: 'reset' });
        }
        
        function resetItem(id) {
            vscode.postMessage({ command: 'resetItem', id });
        }
        
        // 配置文件操作
        function createProfile() {
            vscode.postMessage({ command: 'createProfile' });
        }
        
        function switchProfile(id) {
            vscode.postMessage({ command: 'switchProfile', id });
        }
        
        function exportConfig() {
            vscode.postMessage({ command: 'exportConfig' });
        }
        
        function importConfig() {
            vscode.postMessage({ command: 'importConfig' });
        }
        
        // Toast 提示
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }
        
        // 接收更新消息
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'update') {
                // 可以在这里更新 UI 或重新加载页面
                showToast('配置已更新');
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.item.selected').forEach(el => el.classList.remove('selected'));
                selectedItems.clear();
            }
        });
        
        // 初始化
        initDragAndDrop();
    </script>
</body>
</html>`;
    }

    /**
     * 获取图标对应的 emoji
     */
    private getIconEmoji(icon: string): string {
        const iconMap: Record<string, string> = {
            'files': '📁',
            'search': '🔍',
            'source-control': '🔀',
            'debug': '🐛',
            'extensions': '🧩',
            'testing': '🧪',
            'remote-explorer': '🌐',
            'timeline': '📅',
            'outline': '📝',
            'explorer': '📂'
        };

        const iconName = this.extractIconName(icon);
        return iconMap[iconName] || '📦';
    }

    private extractIconName(icon: string): string {
        const match = icon.match(/\$\(([^)]+)\)/);
        return match ? match[1] : 'symbol-misc';
    }
}
