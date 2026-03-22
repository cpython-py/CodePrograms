/**
 * Context Menu Manager - 核心管理器
 * 负责管理右键菜单项的创建、更新、删除和动态显示逻辑
 */

import * as vscode from 'vscode';
import {
    MenuItemConfig,
    ConditionContext,
    ExecutionResult,
    ConfigChangeEvent,
    MenuConfigFile,
    ExportOptions,
    ImportOptions
} from './types';

/**
 * 右键菜单管理器类
 * 提供完整的菜单项生命周期管理
 */
export class ContextMenuManager implements vscode.Disposable {
    /** 菜单项配置列表 */
    private menuItems: Map<string, MenuItemConfig> = new Map();
    /** 配置变更事件发射器 */
    private readonly onDidChangeConfigEmitter = new vscode.EventEmitter<ConfigChangeEvent>();
    /** 配置变更事件 */
    public readonly onDidChangeConfig = this.onDidChangeConfigEmitter.event;
    /** 命令注册列表 */
    private commands: vscode.Disposable[] = [];
    /** 文件系统监听器 */
    private fileWatcher?: vscode.FileSystemWatcher;
    /** 状态管理 */
    private context: vscode.ExtensionContext;
    /** 输出通道 */
    private outputChannel: vscode.OutputChannel;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.outputChannel = vscode.window.createOutputChannel('Context Menu Manager');
        this.initialize();
    }

    /**
     * 初始化管理器
     */
    private async initialize(): Promise<void> {
        // 加载保存的配置
        await this.loadConfig();
        // 注册所有菜单项命令
        await this.registerMenuCommands();
        // 设置文件监听
        this.setupFileWatcher();
        // 监听配置变更
        this.setupConfigListener();
    }

    /**
     * 从VS Code配置和持久化存储加载配置
     */
    private async loadConfig(): Promise<void> {
        try {
            // 首先尝试从工作区存储加载
            const savedItems = this.context.globalState.get<MenuItemConfig[]>('menuItems');
            if (savedItems && savedItems.length > 0) {
                savedItems.forEach(item => this.menuItems.set(item.id, item));
                this.log(`已从持久化存储加载 ${savedItems.length} 个菜单项`);
                return;
            }

            // 如果没有保存的配置，从settings加载
            const config = vscode.workspace.getConfiguration('contextMenuManager');
            const items = config.get<MenuItemConfig[]>('items', []);
            if (items && items.length > 0) {
                items.forEach(item => this.menuItems.set(item.id, item));
                this.log(`已从配置文件加载 ${items.length} 个菜单项`);
            } else {
                // 加载默认菜单项
                await this.loadDefaultItems();
            }
        } catch (error) {
            this.logError('加载配置失败', error);
            await this.loadDefaultItems();
        }
    }

    /**
     * 加载默认菜单项
     */
    private async loadDefaultItems(): Promise<void> {
        const defaultItems: MenuItemConfig[] = [
            {
                id: 'openInTerminal',
                label: '在终端中打开',
                command: 'workbench.action.terminal.new',
                type: 'command',
                icon: '$(terminal)',
                enabled: true,
                showInEditor: false,
                showInExplorer: true,
                group: 'navigation',
                order: 1,
                fileTypes: [],
                description: '在当前目录打开新的终端'
            },
            {
                id: 'copyPath',
                label: '复制文件路径',
                command: 'workbench.action.files.copyPathOfActiveFile',
                type: 'command',
                icon: '$(copy)',
                enabled: true,
                showInEditor: true,
                showInExplorer: true,
                group: 'navigation',
                order: 2,
                description: '复制当前文件的完整路径到剪贴板'
            },
            {
                id: 'copyRelativePath',
                label: '复制相对路径',
                command: 'workbench.action.files.copyRelativePathOfActiveFile',
                type: 'command',
                icon: '$(file-symlink-file)',
                enabled: true,
                showInEditor: true,
                showInExplorer: true,
                group: 'navigation',
                order: 3,
                description: '复制当前文件相对于工作区的路径'
            },
            {
                id: 'revealInExplorer',
                label: '在资源管理器中显示',
                command: 'workbench.action.revealActiveFileInWindows',
                type: 'command',
                icon: '$(folder)',
                enabled: true,
                showInEditor: true,
                showInExplorer: false,
                group: 'navigation',
                order: 4,
                description: '在系统文件管理器中显示当前文件'
            },
            {
                id: 'separator1',
                label: '',
                command: '',
                type: 'command',
                enabled: true,
                showInEditor: true,
                showInExplorer: true,
                group: 'navigation',
                order: 5,
                isSeparator: true
            },
            {
                id: 'formatDocument',
                label: '格式化文档',
                command: 'editor.action.formatDocument',
                type: 'command',
                icon: '$(checklist)',
                enabled: true,
                showInEditor: true,
                showInExplorer: false,
                group: '1_modification',
                order: 10,
                conditions: {
                    hasSelection: false
                },
                shortcut: 'Shift+Alt+F',
                description: '格式化当前文档'
            },
            {
                id: 'formatSelection',
                label: '格式化选中代码',
                command: 'editor.action.formatSelection',
                type: 'command',
                icon: '$(list-selection)',
                enabled: true,
                showInEditor: true,
                showInExplorer: false,
                group: '1_modification',
                order: 11,
                conditions: {
                    hasSelection: true
                },
                description: '格式化选中的代码'
            },
            {
                id: 'separator2',
                label: '',
                command: '',
                type: 'command',
                enabled: true,
                showInEditor: true,
                showInExplorer: true,
                group: 'navigation',
                order: 20,
                isSeparator: true
            },
            {
                id: 'gitStage',
                label: 'Git: 暂存更改',
                command: 'git.stage',
                type: 'command',
                icon: '$(git-add)',
                enabled: true,
                showInEditor: true,
                showInExplorer: true,
                group: 'git',
                order: 30,
                description: '将当前文件的更改添加到Git暂存区'
            },
            {
                id: 'gitCommit',
                label: 'Git: 提交',
                command: 'git.commit',
                type: 'command',
                icon: '$(git-commit)',
                enabled: true,
                showInEditor: true,
                showInExplorer: true,
                group: 'git',
                order: 31,
                description: '提交暂存的更改'
            }
        ];

        defaultItems.forEach(item => this.menuItems.set(item.id, item));
        await this.saveConfig();
        this.log('已加载默认菜单项');
    }

    /**
     * 保存配置到持久化存储
     */
    private async saveConfig(): Promise<void> {
        try {
            const items = Array.from(this.menuItems.values());
            await this.context.globalState.update('menuItems', items);

            // 同步到VS Code配置
            const config = vscode.workspace.getConfiguration('contextMenuManager');
            await config.update('items', items, vscode.ConfigurationTarget.Global);
        } catch (error) {
            this.logError('保存配置失败', error);
        }
    }

    /**
     * 设置文件监听器
     */
    private setupFileWatcher(): void {
        // 监听文件变化以更新动态菜单
        this.fileWatcher = vscode.workspace.createFileSystemWatcher('**/*');
        this.fileWatcher.onDidChange(this.onFileChanged, this, this.commands);
        this.fileWatcher.onDidCreate(this.onFileCreated, this, this.commands);
        this.fileWatcher.onDidDelete(this.onFileDeleted, this, this.commands);
    }

    /**
     * 设置配置监听器
     */
    private setupConfigListener(): void {
        vscode.workspace.onDidChangeConfiguration(async (e) => {
            if (e.affectsConfiguration('contextMenuManager')) {
                this.log('检测到配置变更，重新加载...');
                await this.loadConfig();
                await this.registerMenuCommands();
                this.emitChangeEvent('import');
            }
        }, this, this.commands);
    }

    /**
     * 文件变更处理
     */
    private onFileChanged(uri: vscode.Uri): void {
        // 更新相关菜单项状态
        this.updateMenuStateForUri(uri);
    }

    /**
     * 文件创建处理
     */
    private onFileCreated(uri: vscode.Uri): void {
        this.updateMenuStateForUri(uri);
    }

    /**
     * 文件删除处理
     */
    private onFileDeleted(uri: vscode.Uri): void {
        this.updateMenuStateForUri(uri);
    }

    /**
     * 更新指定URI相关的菜单状态
     */
    private updateMenuStateForUri(uri: vscode.Uri): void {
        // 根据文件类型和路径更新菜单项可见性
        // 这将在动态显示逻辑中处理
    }

    /**
     * 注册所有菜单项命令
     */
    private async registerMenuCommands(): Promise<void> {
        // 清除之前的命令注册
        this.commands.forEach(cmd => cmd.dispose());
        this.commands = [];

        // 注册每个菜单项的命令
        this.menuItems.forEach((item, id) => {
            if (!item.enabled) {
                return;
            }

            const command = vscode.commands.registerCommand(
                `contextMenuManager.execute.${id}`,
                async () => {
                    await this.executeMenuItem(item);
                }
            );
            this.commands.push(command);
        });

        // 更新菜单
        await this.updateMenus();
    }

    /**
     * 更新VS Code菜单
     */
    private async updateMenus(): Promise<void> {
        // 动态更新package.json中定义的菜单
        // VS Code API限制，这里通过状态变化来触发UI更新
        this.emitChangeEvent('edit');
    }

    /**
     * 执行菜单项命令
     * @param item 菜单项配置
     */
    public async executeMenuItem(item: MenuItemConfig): Promise<ExecutionResult> {
        const startTime = Date.now();
        this.log(`执行菜单项: ${item.label}`);

        try {
            let result: ExecutionResult;

            switch (item.type) {
                case 'command':
                    result = await this.executeVSCodeCommand(item);
                    break;
                case 'script':
                    result = await this.executeScript(item);
                    break;
                case 'terminal':
                    result = await this.executeInTerminal(item);
                    break;
                case 'url':
                    result = await this.openUrl(item);
                    break;
                default:
                    throw new Error(`未知的执行类型: ${item.type}`);
            }

            result.duration = Date.now() - startTime;
            this.log(`执行完成，耗时: ${result.duration}ms`);
            return result;

        } catch (error) {
            const result: ExecutionResult = {
                success: false,
                error: error instanceof Error ? error.message : String(error),
                duration: Date.now() - startTime,
                exitCode: 1
            };
            this.logError(`执行失败: ${item.label}`, error);
            vscode.window.showErrorMessage(`执行失败: ${result.error}`);
            return result;
        }
    }

    /**
     * 执行VS Code命令
     */
    private async executeVSCodeCommand(item: MenuItemConfig): Promise<ExecutionResult> {
        await vscode.commands.executeCommand(item.command);
        return {
            success: true,
            duration: 0
        };
    }

    /**
     * 执行脚本命令
     */
    private async executeScript(item: MenuItemConfig): Promise<ExecutionResult> {
        const terminal = vscode.window.createTerminal({
            name: item.label,
            cwd: item.workingDirectory || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
        });

        terminal.show();
        terminal.sendText(item.command);

        return {
            success: true,
            duration: 0
        };
    }

    /**
     * 在终端中执行命令
     */
    private async executeInTerminal(item: MenuItemConfig): Promise<ExecutionResult> {
        const terminal = vscode.window.createTerminal({
            name: item.label,
            cwd: item.workingDirectory || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
        });

        terminal.show();
        terminal.sendText(item.command);

        return {
            success: true,
            duration: 0
        };
    }

    /**
     * 打开URL
     */
    private async openUrl(item: MenuItemConfig): Promise<ExecutionResult> {
        await vscode.env.openExternal(vscode.Uri.parse(item.command));
        return {
            success: true,
            duration: 0
        };
    }

    /**
     * 检查菜单项是否应该在当前上下文中显示
     * @param item 菜单项配置
     * @param context 条件上下文
     */
    public shouldShowMenuItem(item: MenuItemConfig, context: ConditionContext): boolean {
        // 如果菜单项被禁用，不显示
        if (!item.enabled) {
            return false;
        }

        // 检查文件类型
        if (item.fileTypes && item.fileTypes.length > 0) {
            if (context.fileExtension && !item.fileTypes.includes(context.fileExtension)) {
                return false;
            }
        }

        // 检查排除的文件类型
        if (item.excludeFileTypes && item.excludeFileTypes.length > 0) {
            if (context.fileExtension && item.excludeFileTypes.includes(context.fileExtension)) {
                return false;
            }
        }

        // 检查项目路径
        if (item.projectPaths && item.projectPaths.length > 0) {
            if (context.filePath) {
                const inProject = item.projectPaths.some(path => 
                    context.filePath!.includes(path)
                );
                if (!inProject) {
                    return false;
                }
            }
        }

        // 检查条件
        if (item.conditions) {
            // 检查是否需要选中文本
            if (item.conditions.hasSelection !== undefined) {
                if (item.conditions.hasSelection !== context.hasSelection) {
                    return false;
                }
            }

            // 检查工作区信任
            if (item.conditions.requireTrustedWorkspace && !context.isTrusted) {
                return false;
            }

            // 检查文件数量限制
            if (item.conditions.minFiles !== undefined) {
                if (context.selectedUris.length < item.conditions.minFiles) {
                    return false;
                }
            }

            if (item.conditions.maxFiles !== undefined) {
                if (context.selectedUris.length > item.conditions.maxFiles) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 获取当前条件上下文
     */
    public async getConditionContext(
        selectedUris: vscode.Uri[] = [],
        activeEditor?: vscode.TextEditor
    ): Promise<ConditionContext> {
        const editor = activeEditor || vscode.window.activeTextEditor;
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(
            selectedUris[0] || editor?.document.uri
        );

        const context: ConditionContext = {
            activeEditor: editor,
            selectedUris,
            workspaceFolder,
            hasSelection: false,
            isTrusted: vscode.workspace.isTrusted
        };

        if (editor) {
            const selection = editor.selection;
            context.hasSelection = !selection.isEmpty;
            context.selectedText = editor.document.getText(selection);
            context.languageId = editor.document.languageId;
            context.filePath = editor.document.uri.fsPath;
            context.fileExtension = this.getFileExtension(context.filePath);
        }

        if (selectedUris.length > 0 && !editor) {
            const uri = selectedUris[0];
            context.filePath = uri.fsPath;
            context.fileExtension = this.getFileExtension(context.filePath);
        }

        return context;
    }

    /**
     * 获取文件扩展名
     */
    private getFileExtension(filePath: string): string {
        const match = filePath.match(/\.[^.]+$/);
        return match ? match[0] : '';
    }

    /**
     * 添加菜单项
     */
    public async addMenuItem(item: MenuItemConfig): Promise<boolean> {
        if (this.menuItems.has(item.id)) {
            vscode.window.showWarningMessage(`菜单项ID "${item.id}" 已存在`);
            return false;
        }

        this.menuItems.set(item.id, item);
        await this.saveConfig();
        await this.registerMenuCommands();
        this.emitChangeEvent('add', [item]);

        this.log(`添加菜单项: ${item.label}`);
        return true;
    }

    /**
     * 更新菜单项
     */
    public async updateMenuItem(id: string, updates: Partial<MenuItemConfig>): Promise<boolean> {
        const item = this.menuItems.get(id);
        if (!item) {
            vscode.window.showWarningMessage(`菜单项 "${id}" 不存在`);
            return false;
        }

        const updatedItem = { ...item, ...updates };
        this.menuItems.set(id, updatedItem);
        await this.saveConfig();
        await this.registerMenuCommands();
        this.emitChangeEvent('edit', [updatedItem]);

        this.log(`更新菜单项: ${item.label}`);
        return true;
    }

    /**
     * 删除菜单项
     */
    public async deleteMenuItem(id: string): Promise<boolean> {
        const item = this.menuItems.get(id);
        if (!item) {
            vscode.window.showWarningMessage(`菜单项 "${id}" 不存在`);
            return false;
        }

        this.menuItems.delete(id);
        await this.saveConfig();
        await this.registerMenuCommands();
        this.emitChangeEvent('delete', [item]);

        this.log(`删除菜单项: ${item.label}`);
        return true;
    }

    /**
     * 切换菜单项启用状态
     */
    public async toggleMenuItem(id: string): Promise<boolean> {
        const item = this.menuItems.get(id);
        if (!item) {
            vscode.window.showWarningMessage(`菜单项 "${id}" 不存在`);
            return false;
        }

        item.enabled = !item.enabled;
        this.menuItems.set(id, item);
        await this.saveConfig();
        await this.registerMenuCommands();
        this.emitChangeEvent('toggle', [item]);

        this.log(`${item.enabled ? '启用' : '禁用'}菜单项: ${item.label}`);
        return true;
    }

    /**
     * 重新排序菜单项
     */
    public async reorderItems(itemIds: string[]): Promise<boolean> {
        const reorderedItems: MenuItemConfig[] = [];

        itemIds.forEach((id, index) => {
            const item = this.menuItems.get(id);
            if (item) {
                item.order = index;
                reorderedItems.push(item);
            }
        });

        this.menuItems.clear();
        reorderedItems.forEach(item => this.menuItems.set(item.id, item));

        await this.saveConfig();
        await this.registerMenuCommands();
        this.emitChangeEvent('reorder');

        this.log('菜单项顺序已更新');
        return true;
    }

    /**
     * 获取所有菜单项
     */
    public getAllMenuItems(): MenuItemConfig[] {
        return Array.from(this.menuItems.values())
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    /**
     * 获取指定菜单项
     */
    public getMenuItem(id: string): MenuItemConfig | undefined {
        return this.menuItems.get(id);
    }

    /**
     * 根据条件过滤菜单项
     */
    public async filterMenuItems(
        context: ConditionContext,
        menuType: 'editor' | 'explorer' | 'titleBar' | 'editorTab'
    ): Promise<MenuItemConfig[]> {
        return this.getAllMenuItems().filter(item => {
            // 检查是否在指定菜单类型中显示
            const shouldShowInMenu = 
                (menuType === 'editor' && item.showInEditor) ||
                (menuType === 'explorer' && item.showInExplorer) ||
                (menuType === 'titleBar' && item.showInTitleBar) ||
                (menuType === 'editorTab' && item.showInEditorTab);

            if (!shouldShowInMenu) {
                return false;
            }

            // 检查其他条件
            return this.shouldShowMenuItem(item, context);
        });
    }

    /**
     * 导出配置
     */
    public async exportConfig(options: ExportOptions = {}): Promise<MenuConfigFile> {
        const items = this.getAllMenuItems().filter(item => {
            if (!options.includeDisabled && !item.enabled) {
                return false;
            }
            return true;
        });

        const config: MenuConfigFile = {
            version: '1.0.0',
            name: 'Context Menu Configuration',
            description: '导出的右键菜单配置',
            items,
            exportedAt: new Date().toISOString()
        };

        return config;
    }

    /**
     * 导入配置
     */
    public async importConfig(
        config: MenuConfigFile,
        options: ImportOptions = {}
    ): Promise<boolean> {
        try {
            if (options.backup) {
                // 备份当前配置
                const currentItems = this.getAllMenuItems();
                await this.context.globalState.update('menuItemsBackup', currentItems);
            }

            if (options.validate) {
                // 验证配置
                const validation = this.validateConfig(config);
                if (!validation.valid) {
                    throw new Error(`配置验证失败: ${validation.errors?.join(', ')}`);
                }
            }

            if (options.overwrite) {
                // 覆盖现有配置
                this.menuItems.clear();
                config.items.forEach(item => this.menuItems.set(item.id, item));
            } else if (options.merge) {
                // 合并配置
                config.items.forEach(item => {
                    if (!this.menuItems.has(item.id)) {
                        this.menuItems.set(item.id, item);
                    }
                });
            } else {
                // 默认合并
                config.items.forEach(item => this.menuItems.set(item.id, item));
            }

            await this.saveConfig();
            await this.registerMenuCommands();
            this.emitChangeEvent('import');

            this.log(`导入配置完成: ${config.items.length} 个菜单项`);
            return true;

        } catch (error) {
            this.logError('导入配置失败', error);
            return false;
        }
    }

    /**
     * 验证配置
     */
    private validateConfig(config: MenuConfigFile): { valid: boolean; errors?: string[] } {
        const errors: string[] = [];

        if (!config.version) {
            errors.push('缺少版本信息');
        }

        if (!config.items || !Array.isArray(config.items)) {
            errors.push('菜单项列表无效');
            return { valid: false, errors };
        }

        config.items.forEach((item, index) => {
            if (!item.id) {
                errors.push(`菜单项 ${index}: 缺少ID`);
            }
            if (!item.label && !item.isSeparator) {
                errors.push(`菜单项 ${index}: 缺少标签`);
            }
            if (!item.command && !item.isSeparator) {
                errors.push(`菜单项 ${index}: 缺少命令`);
            }
        });

        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };
    }

    /**
     * 重置为默认配置
     */
    public async resetToDefault(): Promise<void> {
        this.menuItems.clear();
        await this.loadDefaultItems();
        await this.registerMenuCommands();
        this.emitChangeEvent('reset');
        this.log('已重置为默认配置');
    }

    /**
     * 发送配置变更事件
     */
    private emitChangeEvent(
        type: ConfigChangeEvent['type'],
        items?: MenuItemConfig[]
    ): void {
        this.onDidChangeConfigEmitter.fire({
            type,
            items,
            timestamp: Date.now()
        });
    }

    /**
     * 记录日志
     */
    private log(message: string): void {
        this.outputChannel.appendLine(`[${new Date().toISOString()}] ${message}`);
    }

    /**
     * 记录错误日志
     */
    private logError(message: string, error: unknown): void {
        const errorMsg = error instanceof Error ? error.message : String(error);
        this.outputChannel.appendLine(`[${new Date().toISOString()}] ERROR: ${message} - ${errorMsg}`);
        console.error(message, error);
    }

    /**
     * 释放资源
     */
    public dispose(): void {
        this.commands.forEach(cmd => cmd.dispose());
        this.fileWatcher?.dispose();
        this.outputChannel.dispose();
        this.onDidChangeConfigEmitter.dispose();
        this.menuItems.clear();
    }
}
