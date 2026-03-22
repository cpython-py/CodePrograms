/**
 * Context Menu Manager - 扩展入口文件
 * 初始化扩展并注册所有命令和视图
 */

import * as vscode from 'vscode';
import { ContextMenuManager } from './contextMenuManager';
import { ConfigurationPanel } from './configurationPanel';
import { MenuItemsViewProvider } from './menuItemsViewProvider';

/**
 * 扩展激活函数
 * 在VS Code启动时自动调用
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
    console.log('Context Menu Manager 扩展正在激活...');

    try {
        // 初始化菜单管理器
        const manager = new ContextMenuManager(context);
        
        // 初始化配置面板
        const configPanel = new ConfigurationPanel(context, manager);

        // 注册打开配置面板命令
        const openConfigPanelCommand = vscode.commands.registerCommand(
            'contextMenuManager.openConfigPanel',
            () => {
                configPanel.show();
            }
        );

        // 注册添加菜单项命令
        const addMenuItemCommand = vscode.commands.registerCommand(
            'contextMenuManager.addMenuItem',
            async () => {
                configPanel.show();
                // 自动打开添加对话框
                await vscode.commands.executeCommand('contextMenuManager.addItem');
            }
        );

        // 注册编辑菜单项命令
        const editMenuItemCommand = vscode.commands.registerCommand(
            'contextMenuManager.editMenuItem',
            async (itemId?: string) => {
                if (itemId) {
                    const item = manager.getMenuItem(itemId);
                    if (item) {
                        // 显示编辑对话框
                        await vscode.commands.executeCommand('contextMenuManager.editItem', itemId);
                    }
                } else {
                    // 如果没有提供ID，显示选择列表
                    const items = manager.getAllMenuItems();
                    const selected = await vscode.window.showQuickPick(
                        items.map(item => ({
                            label: item.label || '分隔线',
                            description: item.description || item.command,
                            detail: `类型: ${item.type} | 启用: ${item.enabled}`,
                            id: item.id
                        })),
                        {
                            placeHolder: '选择要编辑的菜单项'
                        }
                    );
                    if (selected) {
                        await vscode.commands.executeCommand('contextMenuManager.editItem', selected.id);
                    }
                }
            }
        );

        // 注册删除菜单项命令
        const deleteMenuItemCommand = vscode.commands.registerCommand(
            'contextMenuManager.deleteMenuItem',
            async (itemId?: string) => {
                if (itemId) {
                    await manager.deleteMenuItem(itemId);
                } else {
                    const items = manager.getAllMenuItems();
                    const selected = await vscode.window.showQuickPick(
                        items.map(item => ({
                            label: item.label || '分隔线',
                            description: item.description || item.command,
                            id: item.id
                        })),
                        {
                            placeHolder: '选择要删除的菜单项'
                        }
                    );
                    if (selected) {
                        await manager.deleteMenuItem(selected.id);
                    }
                }
            }
        );

        // 注册切换菜单项状态命令
        const toggleMenuItemCommand = vscode.commands.registerCommand(
            'contextMenuManager.toggleMenuItem',
            async (itemId?: string) => {
                if (itemId) {
                    await manager.toggleMenuItem(itemId);
                } else {
                    const items = manager.getAllMenuItems();
                    const selected = await vscode.window.showQuickPick(
                        items.map(item => ({
                            label: item.label || '分隔线',
                            description: `状态: ${item.enabled ? '已启用' : '已禁用'}`,
                            id: item.id
                        })),
                        {
                            placeHolder: '选择要切换状态的菜单项'
                        }
                    );
                    if (selected) {
                        await manager.toggleMenuItem(selected.id);
                    }
                }
            }
        );

        // 注册导出配置命令
        const exportConfigCommand = vscode.commands.registerCommand(
            'contextMenuManager.exportConfig',
            async () => {
                const config = await manager.exportConfig();
                const configStr = JSON.stringify(config, null, 2);

                const uri = await vscode.window.showSaveDialog({
                    defaultUri: vscode.Uri.file('context-menu-config.json'),
                    filters: {
                        'JSON': ['json']
                    }
                });

                if (uri) {
                    await vscode.workspace.fs.writeFile(uri, Buffer.from(configStr, 'utf-8'));
                    vscode.window.showInformationMessage('✅ 配置已成功导出');
                }
            }
        );

        // 注册导入配置命令
        const importConfigCommand = vscode.commands.registerCommand(
            'contextMenuManager.importConfig',
            async () => {
                const uris = await vscode.window.showOpenDialog({
                    filters: {
                        'JSON': ['json']
                    },
                    canSelectMany: false
                });

                if (uris && uris[0]) {
                    try {
                        const content = await vscode.workspace.fs.readFile(uris[0]);
                        const configStr = Buffer.from(content).toString('utf-8');
                        const config = JSON.parse(configStr);

                        const result = await manager.importConfig(config, {
                            merge: true,
                            validate: true,
                            backup: true
                        });

                        if (result) {
                            vscode.window.showInformationMessage('✅ 配置已成功导入');
                        } else {
                            vscode.window.showErrorMessage('❌ 配置导入失败');
                        }
                    } catch (error) {
                        vscode.window.showErrorMessage(`❌ 导入失败: ${error}`);
                    }
                }
            }
        );

        // 注册重置配置命令
        const resetToDefaultCommand = vscode.commands.registerCommand(
            'contextMenuManager.resetToDefault',
            async () => {
                const confirm = await vscode.window.showWarningMessage(
                    '确定要重置为默认配置吗？当前所有自定义菜单项将被清除。',
                    { modal: true },
                    '重置',
                    '取消'
                );

                if (confirm === '重置') {
                    await manager.resetToDefault();
                    vscode.window.showInformationMessage('✅ 配置已重置为默认值');
                }
            }
        );

        // 创建菜单项列表视图
        const viewProvider = new MenuItemsViewProvider(context.extensionUri, manager);

        // 注册视图
        const viewDisposable = vscode.window.registerTreeDataProvider(
            'contextMenuManager.itemsView',
            viewProvider
        );

        // 监听配置变更，刷新视图
        manager.onDidChangeConfig(() => {
            viewProvider.refresh();
        });

        // 注册刷新视图命令
        const refreshViewCommand = vscode.commands.registerCommand(
            'contextMenuManager.refreshView',
            () => {
                viewProvider.refresh();
            }
        );

        // 注册从资源管理器添加菜单项的命令
        const addFromExplorerCommand = vscode.commands.registerCommand(
            'contextMenuManager.addFromExplorer',
            async (uri: vscode.Uri) => {
                if (uri) {
                    // 预填充文件路径相关的信息
                    const fileName = uri.path.split('/').pop() || '';
                    const config = {
                        id: `custom_${Date.now()}`,
                        label: `处理 ${fileName}`,
                        command: '',
                        type: 'command' as const,
                        enabled: true,
                        showInEditor: false,
                        showInExplorer: true,
                        group: 'custom',
                        order: 100
                    };
                    await manager.addMenuItem(config);
                    vscode.window.showInformationMessage(`已为 "${fileName}" 创建新的菜单项模板`);
                }
            }
        );

        // 注册动态菜单命令
        await registerDynamicMenuCommands(context, manager);

        // 添加所有命令到订阅列表
        context.subscriptions.push(
            openConfigPanelCommand,
            addMenuItemCommand,
            editMenuItemCommand,
            deleteMenuItemCommand,
            toggleMenuItemCommand,
            exportConfigCommand,
            importConfigCommand,
            resetToDefaultCommand,
            viewDisposable,
            refreshViewCommand,
            addFromExplorerCommand,
            manager
        );

        console.log('Context Menu Manager 扩展激活完成');
        vscode.window.showInformationMessage('🎯 Context Menu Manager 扩展已激活');
    } catch (error) {
        console.error('Context Menu Manager 激活失败:', error);
        vscode.window.showErrorMessage(`扩展激活失败: ${error}`);
    }
}

/**
 * 注册动态菜单命令
 * 根据当前配置动态生成菜单项
 */
async function registerDynamicMenuCommands(
    context: vscode.ExtensionContext,
    manager: ContextMenuManager
): Promise<void> {
    // 动态命令将在菜单管理器中处理
    // 这里预留扩展点，用于实现更复杂的动态菜单逻辑
}

/**
 * 扩展停用函数
 * 清理资源
 */
export function deactivate(): void {
    console.log('Context Menu Manager 扩展正在停用...');
}
