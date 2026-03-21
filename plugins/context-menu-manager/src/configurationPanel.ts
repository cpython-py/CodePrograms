/**
 * Context Menu Manager - 配置面板
 * 提供可视化的菜单项配置界面
 */

import * as vscode from 'vscode';
import { MenuItemConfig, MenuItemType, MenuCondition } from './types';
import { ContextMenuManager } from './contextMenuManager';

/**
 * 配置面板类
 * 使用WebView实现可视化的配置界面
 */
export class ConfigurationPanel {
    /** WebView面板 */
    private panel: vscode.WebviewPanel | undefined;
    /** 扩展上下文 */
    private context: vscode.ExtensionContext;
    /** 菜单管理器 */
    private manager: ContextMenuManager;
    /** 当前编辑的菜单项 */
    private currentEditingItem: MenuItemConfig | undefined;

    constructor(context: vscode.ExtensionContext, manager: ContextMenuManager) {
        this.context = context;
        this.manager = manager;
    }

    /**
     * 显示配置面板
     */
    public show(): void {
        // 如果面板已存在，则聚焦
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.One);
            return;
        }

        // 创建WebView面板
        this.panel = vscode.window.createWebviewPanel(
            'contextMenuConfig',
            '右键菜单配置',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                enableCommandUris: true
            }
        );

        // 设置HTML内容
        this.panel.webview.html = this.getWebviewContent();

        // 处理来自WebView的消息
        this.panel.webview.onDidReceiveMessage(
            async (message) => {
                await this.handleWebviewMessage(message);
            },
            undefined,
            this.context.subscriptions
        );

        // 面板关闭时清理
        this.panel.onDidDispose(
            () => {
                this.panel = undefined;
            },
            undefined,
            this.context.subscriptions
        );
    }

    /**
     * 处理来自WebView的消息
     */
    private async handleWebviewMessage(message: any): Promise<void> {
        switch (message.command) {
            case 'getItems':
                await this.sendItemsToWebview();
                break;

            case 'addItem':
                await this.showAddItemDialog();
                break;

            case 'editItem':
                await this.showEditItemDialog(message.data);
                break;

            case 'deleteItem':
                await this.deleteItem(message.data.id);
                break;

            case 'toggleItem':
                await this.manager.toggleMenuItem(message.data.id);
                await this.sendItemsToWebview();
                break;

            case 'reorderItems':
                await this.manager.reorderItems(message.data.itemIds);
                await this.sendItemsToWebview();
                break;

            case 'exportConfig':
                await this.exportConfiguration();
                break;

            case 'importConfig':
                await this.importConfiguration();
                break;

            case 'resetConfig':
                await this.resetConfiguration();
                break;

            case 'saveItem':
                await this.saveMenuItem(message.data);
                break;

            case 'testItem':
                await this.testMenuItem(message.data);
                break;
        }
    }

    /**
     * 发送菜单项列表到WebView
     */
    private async sendItemsToWebview(): Promise<void> {
        const items = this.manager.getAllMenuItems();
        this.panel?.webview.postMessage({
            command: 'updateItems',
            data: items
        });
    }

    /**
     * 显示添加菜单项对话框
     */
    private async showAddItemDialog(): Promise<void> {
        this.currentEditingItem = undefined;
        this.panel?.webview.postMessage({
            command: 'showItemEditor',
            data: {
                isNew: true,
                item: this.createDefaultItem()
            }
        });
    }

    /**
     * 显示编辑菜单项对话框
     */
    private async showEditItemDialog(itemId: string): Promise<void> {
        const item = this.manager.getMenuItem(itemId);
        if (item) {
            this.currentEditingItem = item;
            this.panel?.webview.postMessage({
                command: 'showItemEditor',
                data: {
                    isNew: false,
                    item
                }
            });
        }
    }

    /**
     * 创建默认菜单项配置
     */
    private createDefaultItem(): MenuItemConfig {
        return {
            id: `menuItem_${Date.now()}`,
            label: '新菜单项',
            command: '',
            type: 'command',
            enabled: true,
            showInEditor: true,
            showInExplorer: true,
            group: 'navigation',
            order: 100,
            description: ''
        };
    }

    /**
     * 保存菜单项
     */
    private async saveMenuItem(data: any): Promise<void> {
        const item: MenuItemConfig = {
            id: data.id,
            label: data.label,
            command: data.command,
            type: data.type as MenuItemType,
            icon: data.icon,
            iconPath: data.iconPath,
            enabled: data.enabled ?? true,
            fileTypes: data.fileTypes ? data.fileTypes.split(',').map((s: string) => s.trim()) : [],
            excludeFileTypes: data.excludeFileTypes ? data.excludeFileTypes.split(',').map((s: string) => s.trim()) : [],
            projectPaths: data.projectPaths ? data.projectPaths.split(',').map((s: string) => s.trim()) : [],
            conditions: data.conditions,
            group: data.group || 'navigation',
            shortcut: data.shortcut,
            order: data.order || 100,
            showInEditor: data.showInEditor ?? true,
            showInExplorer: data.showInExplorer ?? true,
            description: data.description,
            workingDirectory: data.workingDirectory,
            arguments: data.arguments ? data.arguments.split(',').map((s: string) => s.trim()) : []
        };

        if (this.currentEditingItem) {
            await this.manager.updateMenuItem(item.id, item);
        } else {
            await this.manager.addMenuItem(item);
        }

        await this.sendItemsToWebview();
        vscode.window.showInformationMessage(`菜单项 "${item.label}" 已保存`);
    }

    /**
     * 删除菜单项
     */
    private async deleteItem(itemId: string): Promise<void> {
        const confirm = await vscode.window.showWarningMessage(
            '确定要删除此菜单项吗？',
            { modal: true },
            '删除',
            '取消'
        );

        if (confirm === '删除') {
            await this.manager.deleteMenuItem(itemId);
            await this.sendItemsToWebview();
        }
    }

    /**
     * 测试菜单项
     */
    private async testMenuItem(data: any): Promise<void> {
        const item: MenuItemConfig = {
            id: data.id,
            label: data.label,
            command: data.command,
            type: data.type as MenuItemType,
            enabled: true,
            showInEditor: true,
            showInExplorer: true,
            group: 'navigation'
        };

        await this.manager.executeMenuItem(item);
    }

    /**
     * 导出配置
     */
    private async exportConfiguration(): Promise<void> {
        const config = await this.manager.exportConfig();
        const configStr = JSON.stringify(config, null, 2);

        const uri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file('context-menu-config.json'),
            filters: {
                'JSON': ['json']
            }
        });

        if (uri) {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(configStr, 'utf-8'));
            vscode.window.showInformationMessage('配置已导出');
        }
    }

    /**
     * 导入配置
     */
    private async importConfiguration(): Promise<void> {
        const uris = await vscode.window.showOpenDialog({
            filters: {
                'JSON': ['json']
            },
            canSelectMany: false
        });

        if (uris && uris[0]) {
            const content = await vscode.workspace.fs.readFile(uris[0]);
            const configStr = Buffer.from(content).toString('utf-8');
            const config = JSON.parse(configStr);

            const result = await this.manager.importConfig(config, {
                merge: true,
                validate: true,
                backup: true
            });

            if (result) {
                await this.sendItemsToWebview();
                vscode.window.showInformationMessage('配置已导入');
            }
        }
    }

    /**
     * 重置配置
     */
    private async resetConfiguration(): Promise<void> {
        const confirm = await vscode.window.showWarningMessage(
            '确定要重置为默认配置吗？当前配置将被清除。',
            { modal: true },
            '重置',
            '取消'
        );

        if (confirm === '重置') {
            await this.manager.resetToDefault();
            await this.sendItemsToWebview();
            vscode.window.showInformationMessage('配置已重置');
        }
    }

    /**
     * 生成WebView HTML内容
     */
    private getWebviewContent(): string {
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>右键菜单配置</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: var(--vscode-font-family);
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            padding: 20px;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .header h1 {
            font-size: 24px;
            font-weight: 600;
            color: var(--vscode-titleBar-activeForeground);
        }

        .toolbar {
            display: flex;
            gap: 10px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .btn-primary {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }

        .btn-primary:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        .btn-secondary {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }

        .btn-secondary:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }

        .btn-danger {
            background-color: #d32f2f;
            color: white;
        }

        .btn-danger:hover {
            background-color: #b71c1c;
        }

        .btn-icon {
            padding: 6px;
            background: transparent;
            border: 1px solid var(--vscode-panel-border);
            color: var(--vscode-foreground);
        }

        .btn-icon:hover {
            background-color: var(--vscode-toolbar-hoverBackground);
        }

        .menu-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .menu-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background-color: var(--vscode-editorWidget-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .menu-item:hover {
            border-color: var(--vscode-focusBorder);
            background-color: var(--vscode-list-hoverBackground);
        }

        .menu-item.disabled {
            opacity: 0.5;
        }

        .menu-item-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            background-color: var(--vscode-badge-background);
            border-radius: 6px;
            font-size: 16px;
        }

        .menu-item-content {
            flex: 1;
        }

        .menu-item-title {
            font-weight: 600;
            margin-bottom: 4px;
        }

        .menu-item-description {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }

        .menu-item-meta {
            display: flex;
            gap: 10px;
            margin-top: 8px;
            font-size: 11px;
        }

        .tag {
            padding: 2px 8px;
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            border-radius: 10px;
        }

        .menu-item-actions {
            display: flex;
            gap: 5px;
        }

        .editor-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .editor-overlay.active {
            display: flex;
        }

        .editor-panel {
            width: 600px;
            max-height: 80vh;
            background-color: var(--vscode-editorWidget-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            overflow: hidden;
        }

        .editor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background-color: var(--vscode-editorGroupHeader-tabsBackground);
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .editor-body {
            padding: 20px;
            max-height: 60vh;
            overflow-y: auto;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 13px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--vscode-input-border);
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 4px;
            font-size: 13px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .checkbox-group {
            display: flex;
            gap: 20px;
        }

        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .checkbox-item input[type="checkbox"] {
            width: auto;
        }

        .editor-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 15px 20px;
            background-color: var(--vscode-editorGroupHeader-tabsBackground);
            border-top: 1px solid var(--vscode-panel-border);
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: var(--vscode-descriptionForeground);
        }

        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }

        .tabs {
            display: flex;
            gap: 5px;
            margin-bottom: 20px;
        }

        .tab {
            padding: 8px 16px;
            background-color: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            color: var(--vscode-descriptionForeground);
            cursor: pointer;
            font-size: 13px;
        }

        .tab.active {
            color: var(--vscode-foreground);
            border-bottom-color: var(--vscode-focusBorder);
        }

        .separator {
            height: 1px;
            background-color: var(--vscode-panel-border);
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 右键菜单配置</h1>
            <div class="toolbar">
                <button class="btn btn-primary" onclick="addItem()">
                    <span>+</span> 添加菜单项
                </button>
                <button class="btn btn-secondary" onclick="importConfig()">
                    <span>📥</span> 导入
                </button>
                <button class="btn btn-secondary" onclick="exportConfig()">
                    <span>📤</span> 导出
                </button>
                <button class="btn btn-danger" onclick="resetConfig()">
                    <span>🔄</span> 重置
                </button>
            </div>
        </div>

        <div id="menuList" class="menu-list">
            <!-- 菜单项列表将通过JavaScript动态生成 -->
        </div>

        <div id="emptyState" class="empty-state" style="display: none;">
            <div class="empty-state-icon">📋</div>
            <p>暂无菜单项</p>
            <p>点击上方"添加菜单项"按钮开始配置</p>
        </div>
    </div>

    <!-- 编辑面板 -->
    <div id="editorOverlay" class="editor-overlay">
        <div class="editor-panel">
            <div class="editor-header">
                <h2 id="editorTitle">添加菜单项</h2>
                <button class="btn-icon" onclick="closeEditor()">✕</button>
            </div>
            <div class="editor-body">
                <div class="tabs">
                    <button class="tab active" onclick="switchTab('basic')">基本设置</button>
                    <button class="tab" onclick="switchTab('conditions')">显示条件</button>
                    <button class="tab" onclick="switchTab('advanced')">高级选项</button>
                </div>

                <div id="basicTab">
                    <div class="form-group">
                        <label>菜单项ID *</label>
                        <input type="text" id="itemId" placeholder="唯一标识符，如：myCustomCommand">
                    </div>
                    <div class="form-group">
                        <label>显示文本 *</label>
                        <input type="text" id="itemLabel" placeholder="菜单项显示的文本">
                    </div>
                    <div class="form-group">
                        <label>执行命令 *</label>
                        <input type="text" id="itemCommand" placeholder="VS Code命令ID或脚本">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>执行类型</label>
                            <select id="itemType">
                                <option value="command">VS Code命令</option>
                                <option value="script">执行脚本</option>
                                <option value="terminal">终端命令</option>
                                <option value="url">打开URL</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>图标</label>
                            <input type="text" id="itemIcon" placeholder="$(icon-name) 或路径">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>描述</label>
                        <textarea id="itemDescription" rows="2" placeholder="菜单项的功能描述"></textarea>
                    </div>
                    <div class="form-group">
                        <label>快捷键</label>
                        <input type="text" id="itemShortcut" placeholder="如：ctrl+shift+c">
                    </div>
                    <div class="form-group checkbox-group">
                        <div class="checkbox-item">
                            <input type="checkbox" id="itemShowInEditor" checked>
                            <label for="itemShowInEditor">编辑器右键菜单</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="itemShowInExplorer" checked>
                            <label for="itemShowInExplorer">资源管理器右键菜单</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="itemEnabled" checked>
                            <label for="itemEnabled">启用</label>
                        </div>
                    </div>
                </div>

                <div id="conditionsTab" style="display: none;">
                    <div class="form-group">
                        <label>适用文件类型</label>
                        <input type="text" id="itemFileTypes" placeholder=".js, .ts, .py（留空表示所有）">
                        <small style="color: var(--vscode-descriptionForeground);">用逗号分隔多个扩展名</small>
                    </div>
                    <div class="form-group">
                        <label>排除文件类型</label>
                        <input type="text" id="itemExcludeFileTypes" placeholder=".min.js, .lock">
                    </div>
                    <div class="form-group">
                        <label>适用项目路径</label>
                        <input type="text" id="itemProjectPaths" placeholder="路径包含的关键词">
                    </div>
                    <div class="form-group checkbox-group">
                        <div class="checkbox-item">
                            <input type="checkbox" id="itemHasSelection">
                            <label for="itemHasSelection">需要选中文本</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="itemRequireTrusted">
                            <label for="itemRequireTrusted">需要受信任工作区</label>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>最少文件数量</label>
                            <input type="number" id="itemMinFiles" min="0" placeholder="0">
                        </div>
                        <div class="form-group">
                            <label>最多文件数量</label>
                            <input type="number" id="itemMaxFiles" min="0" placeholder="无限制">
                        </div>
                    </div>
                </div>

                <div id="advancedTab" style="display: none;">
                    <div class="form-row">
                        <div class="form-group">
                            <label>分组</label>
                            <select id="itemGroup">
                                <option value="navigation">导航</option>
                                <option value="1_modification">修改</option>
                                <option value="git">Git</option>
                                <option value="custom">自定义</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>排序</label>
                            <input type="number" id="itemOrder" min="0" value="100">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>工作目录</label>
                        <input type="text" id="itemWorkingDirectory" placeholder="命令执行的工作目录">
                    </div>
                    <div class="form-group">
                        <label>参数</label>
                        <input type="text" id="itemArguments" placeholder="命令参数，逗号分隔">
                    </div>
                    <div class="form-group">
                        <label>自定义图标路径</label>
                        <input type="text" id="itemIconPath" placeholder="SVG图标文件路径">
                    </div>
                </div>
            </div>
            <div class="editor-footer">
                <button class="btn btn-secondary" onclick="testItem()">测试</button>
                <button class="btn btn-secondary" onclick="closeEditor()">取消</button>
                <button class="btn btn-primary" onclick="saveItem()">保存</button>
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let menuItems = [];
        let isEditing = false;

        // 初始化
        document.addEventListener('DOMContentLoaded', () => {
            vscode.postMessage({ command: 'getItems' });
        });

        // 接收来自扩展的消息
        window.addEventListener('message', (event) => {
            const message = event.data;
            switch (message.command) {
                case 'updateItems':
                    menuItems = message.data;
                    renderMenuList();
                    break;
                case 'showItemEditor':
                    isEditing = !message.data.isNew;
                    showEditor(message.data.item);
                    break;
            }
        });

        // 渲染菜单列表
        function renderMenuList() {
            const listContainer = document.getElementById('menuList');
            const emptyState = document.getElementById('emptyState');

            if (menuItems.length === 0) {
                listContainer.innerHTML = '';
                emptyState.style.display = 'block';
                return;
            }

            emptyState.style.display = 'none';
            listContainer.innerHTML = menuItems.map(item => \`
                <div class="menu-item \${!item.enabled ? 'disabled' : ''}" data-id="\${item.id}">
                    <div class="menu-item-icon">
                        \${item.icon || '📄'}
                    </div>
                    <div class="menu-item-content">
                        <div class="menu-item-title">\${item.label || '分隔线'}</div>
                        \${item.description ? \`<div class="menu-item-description">\${item.description}</div>\` : ''}
                        <div class="menu-item-meta">
                            <span class="tag">\${item.type}</span>
                            \${item.shortcut ? \`<span class="tag">\${item.shortcut}</span>\` : ''}
                            \${item.fileTypes && item.fileTypes.length > 0 ? \`<span class="tag">\${item.fileTypes.join(', ')}</span>\` : ''}
                        </div>
                    </div>
                    <div class="menu-item-actions">
                        <button class="btn-icon" onclick="toggleItem('\${item.id}')" title="\${item.enabled ? '禁用' : '启用'}">
                            \${item.enabled ? '👁️' : '👁️‍🗨️'}
                        </button>
                        <button class="btn-icon" onclick="editItem('\${item.id}')" title="编辑">
                            ✏️
                        </button>
                        <button class="btn-icon" onclick="deleteItem('\${item.id}')" title="删除">
                            🗑️
                        </button>
                    </div>
                </div>
            \`).join('');
        }

        // 切换标签页
        function switchTab(tabName) {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            
            document.getElementById('basicTab').style.display = 'none';
            document.getElementById('conditionsTab').style.display = 'none';
            document.getElementById('advancedTab').style.display = 'none';
            document.getElementById(tabName + 'Tab').style.display = 'block';
        }

        // 显示编辑器
        function showEditor(item) {
            document.getElementById('editorOverlay').classList.add('active');
            document.getElementById('editorTitle').textContent = isEditing ? '编辑菜单项' : '添加菜单项';
            
            // 填充表单
            document.getElementById('itemId').value = item.id || '';
            document.getElementById('itemLabel').value = item.label || '';
            document.getElementById('itemCommand').value = item.command || '';
            document.getElementById('itemType').value = item.type || 'command';
            document.getElementById('itemIcon').value = item.icon || '';
            document.getElementById('itemDescription').value = item.description || '';
            document.getElementById('itemShortcut').value = item.shortcut || '';
            document.getElementById('itemShowInEditor').checked = item.showInEditor !== false;
            document.getElementById('itemShowInExplorer').checked = item.showInExplorer !== false;
            document.getElementById('itemEnabled').checked = item.enabled !== false;
            
            document.getElementById('itemFileTypes').value = (item.fileTypes || []).join(', ');
            document.getElementById('itemExcludeFileTypes').value = (item.excludeFileTypes || []).join(', ');
            document.getElementById('itemProjectPaths').value = (item.projectPaths || []).join(', ');
            document.getElementById('itemHasSelection').checked = item.conditions?.hasSelection || false;
            document.getElementById('itemRequireTrusted').checked = item.conditions?.requireTrustedWorkspace || false;
            document.getElementById('itemMinFiles').value = item.conditions?.minFiles || '';
            document.getElementById('itemMaxFiles').value = item.conditions?.maxFiles || '';
            
            document.getElementById('itemGroup').value = item.group || 'navigation';
            document.getElementById('itemOrder').value = item.order || 100;
            document.getElementById('itemWorkingDirectory').value = item.workingDirectory || '';
            document.getElementById('itemArguments').value = (item.arguments || []).join(', ');
            document.getElementById('itemIconPath').value = item.iconPath || '';
        }

        // 关闭编辑器
        function closeEditor() {
            document.getElementById('editorOverlay').classList.remove('active');
        }

        // 添加菜单项
        function addItem() {
            isEditing = false;
            vscode.postMessage({ command: 'addItem' });
        }

        // 编辑菜单项
        function editItem(id) {
            vscode.postMessage({ command: 'editItem', data: { id } });
        }

        // 删除菜单项
        function deleteItem(id) {
            vscode.postMessage({ command: 'deleteItem', data: { id } });
        }

        // 切换菜单项状态
        function toggleItem(id) {
            vscode.postMessage({ command: 'toggleItem', data: { id } });
        }

        // 保存菜单项
        function saveItem() {
            const data = {
                id: document.getElementById('itemId').value,
                label: document.getElementById('itemLabel').value,
                command: document.getElementById('itemCommand').value,
                type: document.getElementById('itemType').value,
                icon: document.getElementById('itemIcon').value,
                description: document.getElementById('itemDescription').value,
                shortcut: document.getElementById('itemShortcut').value,
                showInEditor: document.getElementById('itemShowInEditor').checked,
                showInExplorer: document.getElementById('itemShowInExplorer').checked,
                enabled: document.getElementById('itemEnabled').checked,
                fileTypes: document.getElementById('itemFileTypes').value,
                excludeFileTypes: document.getElementById('itemExcludeFileTypes').value,
                projectPaths: document.getElementById('itemProjectPaths').value,
                conditions: {
                    hasSelection: document.getElementById('itemHasSelection').checked,
                    requireTrustedWorkspace: document.getElementById('itemRequireTrusted').checked,
                    minFiles: parseInt(document.getElementById('itemMinFiles').value) || undefined,
                    maxFiles: parseInt(document.getElementById('itemMaxFiles').value) || undefined
                },
                group: document.getElementById('itemGroup').value,
                order: parseInt(document.getElementById('itemOrder').value) || 100,
                workingDirectory: document.getElementById('itemWorkingDirectory').value,
                arguments: document.getElementById('itemArguments').value,
                iconPath: document.getElementById('itemIconPath').value
            };

            vscode.postMessage({ command: 'saveItem', data });
            closeEditor();
        }

        // 测试菜单项
        function testItem() {
            const data = {
                id: document.getElementById('itemId').value,
                label: document.getElementById('itemLabel').value,
                command: document.getElementById('itemCommand').value,
                type: document.getElementById('itemType').value
            };
            vscode.postMessage({ command: 'testItem', data });
        }

        // 导入配置
        function importConfig() {
            vscode.postMessage({ command: 'importConfig' });
        }

        // 导出配置
        function exportConfig() {
            vscode.postMessage({ command: 'exportConfig' });
        }

        // 重置配置
        function resetConfig() {
            vscode.postMessage({ command: 'resetConfig' });
        }
    </script>
</body>
</html>`;
    }
}
