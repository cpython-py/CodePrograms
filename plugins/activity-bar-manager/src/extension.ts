import * as vscode from 'vscode';
import { ActivityBarManager } from './activityBarManager';
import { ViewManagerProvider, ProfilesProvider, SettingsPanel } from './viewProvider';
import { ActivityBarItem } from './types';

let activityBarManager: ActivityBarManager;
let viewManagerProvider: ViewManagerProvider;
let profilesProvider: ProfilesProvider;
let settingsPanel: SettingsPanel;

/**
 * 扩展入口点
 */
export function activate(context: vscode.ExtensionContext): void {
    console.log('Activity Bar Manager is now active!');

    // 初始化管理器
    activityBarManager = new ActivityBarManager(context);

    // 初始化视图提供者
    viewManagerProvider = new ViewManagerProvider(activityBarManager);
    profilesProvider = new ProfilesProvider(activityBarManager);

    // 初始化设置面板
    settingsPanel = new SettingsPanel(activityBarManager, context);

    // 注册树视图
    const mainView = vscode.window.createTreeView('activityBarManager.mainView', {
        treeDataProvider: viewManagerProvider,
        showCollapseAll: true
    });

    const profilesView = vscode.window.createTreeView('activityBarManager.profilesView', {
        treeDataProvider: profilesProvider,
        showCollapseAll: false
    });

    context.subscriptions.push(mainView, profilesView);

    // 注册命令
    registerCommands(context);

    // 注册状态栏
    context.subscriptions.push(activityBarManager);

    // 显示欢迎信息
    showWelcomeMessage(context);
}

/**
 * 注册所有命令
 */
function registerCommands(context: vscode.ExtensionContext): void {
    // 打开设置
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.openSettings', () => {
            settingsPanel.show();
        })
    );

    // 切换视图项显示/隐藏
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.toggleViewItem', async (item?: ActivityBarItem | string) => {
            const id = typeof item === 'string' ? item : await selectItem();
            if (id) {
                const visible = await activityBarManager.toggleViewItem(id);
                vscode.window.showInformationMessage(`视图项已${visible ? '显示' : '隐藏'}`);
                viewManagerProvider.refresh();
            }
        })
    );

    // 隐藏视图项
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.hideItem', async (item?: ActivityBarItem) => {
            if (item?.id) {
                await activityBarManager.hideViewItem(item.id);
                viewManagerProvider.refresh();
            }
        })
    );

    // 显示视图项
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.showItem', async (item?: ActivityBarItem) => {
            if (item?.id) {
                await activityBarManager.showViewItem(item.id);
                viewManagerProvider.refresh();
            }
        })
    );

    // 上移视图项
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.moveUp', async (item?: ActivityBarItem) => {
            const id = item?.id || await selectItem();
            if (id) {
                await activityBarManager.moveItem(id, 'up');
                viewManagerProvider.refresh();
            }
        })
    );

    // 下移视图项
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.moveDown', async (item?: ActivityBarItem) => {
            const id = item?.id || await selectItem();
            if (id) {
                await activityBarManager.moveItem(id, 'down');
                viewManagerProvider.refresh();
            }
        })
    );

    // 固定视图项
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.pinViewItem', async (item?: ActivityBarItem) => {
            const id = item?.id || await selectItem();
            if (id) {
                await activityBarManager.pinViewItem(id);
                vscode.window.showInformationMessage('视图项已固定');
                viewManagerProvider.refresh();
            }
        })
    );

    // 取消固定视图项
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.unpinViewItem', async (item?: ActivityBarItem) => {
            const id = item?.id || await selectItem();
            if (id) {
                await activityBarManager.unpinViewItem(id);
                vscode.window.showInformationMessage('视图项已取消固定');
                viewManagerProvider.refresh();
            }
        })
    );

    // 隐藏所有视图项
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.hideAll', async () => {
            await activityBarManager.hideAllItems();
            vscode.window.showInformationMessage('所有视图项已隐藏');
            viewManagerProvider.refresh();
        })
    );

    // 显示所有视图项
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.showAll', async () => {
            await activityBarManager.showAllItems();
            vscode.window.showInformationMessage('所有视图项已显示');
            viewManagerProvider.refresh();
        })
    );

    // 重置为默认布局
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.resetToDefault', async () => {
            const confirm = await vscode.window.showWarningMessage(
                '确定要重置为默认布局吗？',
                { modal: true },
                '确定',
                '取消'
            );
            if (confirm === '确定') {
                await activityBarManager.resetToDefault();
                vscode.window.showInformationMessage('已重置为默认布局');
                viewManagerProvider.refresh();
                profilesProvider.refresh();
            }
        })
    );

    // 创建配置文件
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.createProfile', async () => {
            const name = await vscode.window.showInputBox({
                prompt: '输入配置文件名称',
                placeHolder: '我的配置',
                validateInput: value => {
                    if (!value || value.trim().length === 0) {
                        return '请输入配置文件名称';
                    }
                    return null;
                }
            });

            if (name) {
                const description = await vscode.window.showInputBox({
                    prompt: '输入配置文件描述（可选）',
                    placeHolder: '配置文件描述'
                });

                const profile = await activityBarManager.createProfile(name, description);
                vscode.window.showInformationMessage(`配置文件 "${profile.name}" 已创建`);
                profilesProvider.refresh();
            }
        })
    );

    // 切换配置文件
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.switchProfile', async () => {
            const profiles = activityBarManager.getAllProfiles();
            const currentProfile = activityBarManager.getCurrentProfile();

            const selected = await vscode.window.showQuickPick(
                profiles.map(p => ({
                    label: p.name,
                    description: p.description || '',
                    detail: p.id === currentProfile?.id ? '当前活动' : '',
                    id: p.id
                })),
                {
                    placeHolder: '选择要切换的配置文件'
                }
            );

            if (selected && selected.id !== currentProfile?.id) {
                await activityBarManager.switchProfile(selected.id);
                vscode.window.showInformationMessage(`已切换到配置文件 "${selected.label}"`);
                viewManagerProvider.refresh();
                profilesProvider.refresh();
            }
        })
    );

    // 删除配置文件
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.deleteProfile', async (item?: any) => {
            const profiles = activityBarManager.getAllProfiles().filter(p => !p.isDefault);
            
            const selected = item?.id || (await vscode.window.showQuickPick(
                profiles.map(p => ({
                    label: p.name,
                    id: p.id
                })),
                { placeHolder: '选择要删除的配置文件' }
            ))?.id;

            if (selected) {
                const confirm = await vscode.window.showWarningMessage(
                    `确定要删除配置文件 "${selected}" 吗？`,
                    '确定',
                    '取消'
                );

                if (confirm === '确定') {
                    await activityBarManager.deleteProfile(selected);
                    vscode.window.showInformationMessage('配置文件已删除');
                    profilesProvider.refresh();
                }
            }
        })
    );

    // 导出配置
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.exportConfig', async () => {
            const config = await activityBarManager.exportConfig();
            const json = JSON.stringify(config, null, 2);

            const uri = await vscode.window.showSaveDialog({
                filters: { 'JSON': ['json'] },
                defaultUri: vscode.Uri.file('activity-bar-config.json')
            });

            if (uri) {
                await vscode.workspace.fs.writeFile(uri, Buffer.from(json));
                vscode.window.showInformationMessage('配置已导出');
            }
        })
    );

    // 导入配置
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.importConfig', async () => {
            const uris = await vscode.window.showOpenDialog({
                filters: { 'JSON': ['json'] },
                canSelectMany: false
            });

            if (uris && uris[0]) {
                const content = await vscode.workspace.fs.readFile(uris[0]);
                try {
                    const config = JSON.parse(content.toString());
                    await activityBarManager.importConfig(config);
                    vscode.window.showInformationMessage('配置已导入');
                    viewManagerProvider.refresh();
                    profilesProvider.refresh();
                } catch (e) {
                    vscode.window.showErrorMessage('配置文件格式无效');
                }
            }
        })
    );

    // 设置自定义图标
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.setCustomIcon', async (item?: ActivityBarItem) => {
            const id = item?.id || await selectItem();
            if (!id) return;

            const icon = await vscode.window.showInputBox({
                prompt: '输入图标 codicon 名称（如 files, search, debug）',
                placeHolder: 'files'
            });

            if (icon) {
                await activityBarManager.setCustomIcon(id, `$(${icon})`);
                vscode.window.showInformationMessage('图标已更新');
                viewManagerProvider.refresh();
            }
        })
    );

    // 恢复单项到默认状态
    context.subscriptions.push(
        vscode.commands.registerCommand('activityBarManager.resetItem', async (item?: ActivityBarItem) => {
            const id = item?.id || await selectItem();
            if (!id) return;

            const targetItem = activityBarManager.getAllItems().find(i => i.id === id);
            if (!targetItem) return;

            // 恢复可见性
            if (!targetItem.visible) {
                await activityBarManager.showViewItem(id);
            }

            // 取消固定
            if (targetItem.pinned) {
                await activityBarManager.unpinViewItem(id);
            }

            vscode.window.showInformationMessage(`"${targetItem.name}" 已恢复默认状态`);
            viewManagerProvider.refresh();
        })
    );
}

/**
 * 选择视图项
 */
async function selectItem(): Promise<string | undefined> {
    const items = activityBarManager.getAllItems();
    
    const selected = await vscode.window.showQuickPick(
        items.map(item => ({
            label: item.name,
            description: item.category === 'builtin' ? '内置' : '扩展',
            detail: item.id,
            id: item.id
        })),
        {
            placeHolder: '选择一个视图项'
        }
    );

    return selected?.id;
}

/**
 * 显示欢迎信息
 */
function showWelcomeMessage(context: vscode.ExtensionContext): void {
    const hasShownWelcome = context.globalState.get<boolean>('hasShownWelcome', false);

    if (!hasShownWelcome) {
        vscode.window.showInformationMessage(
            '🎉 Activity Bar Manager 已安装！点击设置按钮开始自定义您的活动栏。',
            '打开设置',
            '稍后'
        ).then(selection => {
            if (selection === '打开设置') {
                settingsPanel.show();
            }
        });

        context.globalState.update('hasShownWelcome', true);
    }
}

/**
 * 扩展停用
 */
export function deactivate(): void {
    if (activityBarManager) {
        activityBarManager.dispose();
    }
}
