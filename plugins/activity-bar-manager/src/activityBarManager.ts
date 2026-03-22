import * as vscode from 'vscode';
import {
    ActivityBarItem,
    ActivityBarProfile,
    ActivityBarConfig,
    ActivityBarEvent,
    ActivityBarEventType,
    ExportedConfig
} from './types';

/**
 * 活动栏管理器
 * 负责管理所有活动栏视图项的添加、删除、隐藏、排序等操作
 */
export class ActivityBarManager {
    private context: vscode.ExtensionContext;
    private items: Map<string, ActivityBarItem> = new Map();
    private profiles: Map<string, ActivityBarProfile> = new Map();
    private activeProfile: string = 'default';
    private eventListeners: Map<ActivityBarEventType, ((event: ActivityBarEvent) => void)[]> = new Map();
    private statusBarItem: vscode.StatusBarItem;
    private autoHideTimer: NodeJS.Timeout | null = null;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.initialize();
    }

    /**
     * 初始化管理器
     */
    private async initialize(): Promise<void> {
        await this.loadConfiguration();
        await this.detectActivityBarItems();
        this.setupEventListeners();
        this.updateStatusBar();
    }

    /**
     * 加载配置
     */
    private async loadConfiguration(): Promise<void> {
        const config = vscode.workspace.getConfiguration('activityBarManager');

        // 加载隐藏项
        const hiddenItems = config.get<string[]>('hiddenItems', []);
        hiddenItems.forEach(id => {
            const item = this.items.get(id);
            if (item) {
                item.visible = false;
            }
        });

        // 加载排序
        const itemOrder = config.get<string[]>('itemOrder', []);
        this.applyItemOrder(itemOrder);

        // 加载固定项
        const pinnedItems = config.get<string[]>('pinnedItems', []);
        pinnedItems.forEach(id => {
            const item = this.items.get(id);
            if (item) {
                item.pinned = true;
            }
        });

        // 加载配置文件
        const profiles = config.get<Record<string, ActivityBarProfile>>('profiles', {});
        Object.entries(profiles).forEach(([id, profile]) => {
            this.profiles.set(id, profile);
        });

        // 设置活动配置文件
        this.activeProfile = config.get<string>('activeProfile', 'default');

        // 确保默认配置文件存在
        if (!this.profiles.has('default')) {
            this.createDefaultProfile();
        }
    }

    /**
     * 检测活动栏项
     * 通过分析 VSCode 的 package.json 和扩展来检测所有活动栏视图容器
     */
    private async detectActivityBarItems(): Promise<void> {
        // 内置活动栏项
        const builtinItems: ActivityBarItem[] = [
            { id: 'workbench.view.explorer', name: '资源管理器', icon: '$(files)', visible: true, pinned: false, order: 1, category: 'builtin' },
            { id: 'workbench.view.search', name: '搜索', icon: '$(search)', visible: true, pinned: false, order: 2, category: 'builtin' },
            { id: 'workbench.view.scm', name: '源代码管理', icon: '$(source-control)', visible: true, pinned: false, order: 3, category: 'builtin' },
            { id: 'workbench.view.debug', name: '运行和调试', icon: '$(debug)', visible: true, pinned: false, order: 4, category: 'builtin' },
            { id: 'workbench.view.extensions', name: '扩展', icon: '$(extensions)', visible: true, pinned: false, order: 5, category: 'builtin' },
        ];

        builtinItems.forEach(item => {
            if (!this.items.has(item.id)) {
                this.items.set(item.id, item);
            }
        });

        // 检测扩展添加的活动栏项
        await this.detectExtensionItems();

        // 应用用户配置
        await this.applyUserConfiguration();
    }

    /**
     * 检测扩展添加的活动栏项
     */
    private async detectExtensionItems(): Promise<void> {
        const extensions = vscode.extensions.all;
        let order = 100;

        for (const ext of extensions) {
            const contributes = ext.packageJSON?.contributes;
            if (contributes?.viewsContainers?.activitybar) {
                for (const container of contributes.viewsContainers.activitybar) {
                    const itemId = container.id;
                    if (!this.items.has(itemId)) {
                        const item: ActivityBarItem = {
                            id: itemId,
                            name: container.title || ext.packageJSON.displayName || itemId,
                            icon: typeof container.icon === 'string' ? container.icon : '$(symbol-color)',
                            visible: true,
                            pinned: false,
                            order: order++,
                            category: 'extension',
                            enabled: true
                        };
                        this.items.set(itemId, item);
                    }
                }
            }
        }
    }

    /**
     * 应用用户配置
     */
    private async applyUserConfiguration(): Promise<void> {
        const config = vscode.workspace.getConfiguration('activityBarManager');

        // 应用隐藏状态
        const hiddenItems = config.get<string[]>('hiddenItems', []);
        for (const id of hiddenItems) {
            const item = this.items.get(id);
            if (item) {
                item.visible = false;
            }
        }

        // 应用排序
        const itemOrder = config.get<string[]>('itemOrder', []);
        this.applyItemOrder(itemOrder);

        // 应用固定状态
        const pinnedItems = config.get<string[]>('pinnedItems', []);
        for (const id of pinnedItems) {
            const item = this.items.get(id);
            if (item) {
                item.pinned = true;
            }
        }
    }

    /**
     * 设置事件监听器
     */
    private setupEventListeners(): void {
        // 监听配置变化
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('activityBarManager')) {
                this.onConfigurationChanged();
            }
        });

        // 监听扩展变化
        vscode.extensions.onDidChange(() => {
            this.detectExtensionItems();
        });

        // 监听活动视图变化
        vscode.window.onDidChangeActiveTextEditor(() => {
            this.onActiveViewChanged();
        });
    }

    /**
     * 配置变化处理
     */
    private async onConfigurationChanged(): Promise<void> {
        await this.loadConfiguration();
        this.emitEvent({
            type: ActivityBarEventType.ItemOrderChanged,
            timestamp: Date.now()
        });
    }

    /**
     * 活动视图变化处理
     */
    private onActiveViewChanged(): void {
        const config = vscode.workspace.getConfiguration('activityBarManager');
        if (config.get<boolean>('rememberLastActiveView', true)) {
            const activeView = this.getActiveViewId();
            if (activeView) {
                config.update('lastActiveView', activeView, vscode.ConfigurationTarget.Global);
            }
        }
    }

    /**
     * 获取活动视图 ID
     */
    private getActiveViewId(): string | undefined {
        // 获取当前活动的视图
        return vscode.window.activeTextEditor?.document.uri.toString();
    }

    /**
     * 创建默认配置文件
     */
    private createDefaultProfile(): void {
        const defaultProfile: ActivityBarProfile = {
            id: 'default',
            name: '默认配置',
            description: 'VSCode 默认活动栏布局',
            hiddenItems: [],
            itemOrder: [],
            pinnedItems: [],
            customIcons: {},
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isDefault: true
        };
        this.profiles.set('default', defaultProfile);
        this.saveProfiles();
    }

    /**
     * 获取所有活动栏项
     */
    getAllItems(): ActivityBarItem[] {
        return Array.from(this.items.values()).sort((a, b) => a.order - b.order);
    }

    /**
     * 获取可见的活动栏项
     */
    getVisibleItems(): ActivityBarItem[] {
        return this.getAllItems().filter(item => item.visible);
    }

    /**
     * 获取隐藏的活动栏项
     */
    getHiddenItems(): ActivityBarItem[] {
        return this.getAllItems().filter(item => !item.visible);
    }

    /**
     * 获取固定的活动栏项
     */
    getPinnedItems(): ActivityBarItem[] {
        return this.getAllItems().filter(item => item.pinned);
    }

    /**
     * 切换视图项显示/隐藏
     */
    async toggleViewItem(id: string): Promise<boolean> {
        const item = this.items.get(id);
        if (!item) {
            return false;
        }

        item.visible = !item.visible;
        await this.saveHiddenItems();

        this.emitEvent({
            type: ActivityBarEventType.ItemVisibilityChanged,
            data: { id, visible: item.visible },
            timestamp: Date.now()
        });

        return item.visible;
    }

    /**
     * 隐藏视图项
     */
    async hideViewItem(id: string): Promise<void> {
        const item = this.items.get(id);
        if (item) {
            item.visible = false;
            await this.saveHiddenItems();
            this.emitEvent({
                type: ActivityBarEventType.ItemVisibilityChanged,
                data: { id, visible: false },
                timestamp: Date.now()
            });
        }
    }

    /**
     * 显示视图项
     */
    async showViewItem(id: string): Promise<void> {
        const item = this.items.get(id);
        if (item) {
            item.visible = true;
            await this.saveHiddenItems();
            this.emitEvent({
                type: ActivityBarEventType.ItemVisibilityChanged,
                data: { id, visible: true },
                timestamp: Date.now()
            });
        }
    }

    /**
     * 隐藏所有视图项
     */
    async hideAllItems(): Promise<void> {
        this.items.forEach(item => {
            item.visible = false;
        });
        await this.saveHiddenItems();
    }

    /**
     * 显示所有视图项
     */
    async showAllItems(): Promise<void> {
        this.items.forEach(item => {
            item.visible = true;
        });
        await this.saveHiddenItems();
    }

    /**
     * 移动视图项
     * @returns 是否移动成功
     */
    async moveItem(id: string, direction: 'up' | 'down'): Promise<boolean> {
        const items = this.getAllItems();
        const currentIndex = items.findIndex(item => item.id === id);
        if (currentIndex === -1) {
            return false;
        }

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= items.length) {
            return false;
        }

        // 交换顺序
        const tempOrder = items[currentIndex].order;
        items[currentIndex].order = items[newIndex].order;
        items[newIndex].order = tempOrder;

        await this.saveItemOrder();
        this.emitEvent({
            type: ActivityBarEventType.ItemOrderChanged,
            timestamp: Date.now()
        });
        
        return true;
    }

    /**
     * 应用排序
     */
    private applyItemOrder(order: string[]): void {
        order.forEach((id, index) => {
            const item = this.items.get(id);
            if (item) {
                item.order = index;
            }
        });
    }

    /**
     * 固定视图项
     */
    async pinViewItem(id: string): Promise<void> {
        const item = this.items.get(id);
        if (item) {
            item.pinned = true;
            await this.savePinnedItems();
            this.emitEvent({
                type: ActivityBarEventType.ItemPinned,
                data: { id, pinned: true },
                timestamp: Date.now()
            });
        }
    }

    /**
     * 取消固定视图项
     */
    async unpinViewItem(id: string): Promise<void> {
        const item = this.items.get(id);
        if (item) {
            item.pinned = false;
            await this.savePinnedItems();
            this.emitEvent({
                type: ActivityBarEventType.ItemPinned,
                data: { id, pinned: false },
                timestamp: Date.now()
            });
        }
    }

    /**
     * 设置自定义图标
     */
    async setCustomIcon(id: string, icon: string): Promise<void> {
        const config = vscode.workspace.getConfiguration('activityBarManager');
        const customIcons = config.get<Record<string, string>>('customIcons', {});
        customIcons[id] = icon;
        await config.update('customIcons', customIcons, vscode.ConfigurationTarget.Global);

        const item = this.items.get(id);
        if (item) {
            item.icon = icon;
        }
    }

    /**
     * 创建配置文件
     */
    async createProfile(name: string, description?: string): Promise<ActivityBarProfile> {
        const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        const profile: ActivityBarProfile = {
            id,
            name,
            description,
            hiddenItems: Array.from(this.items.values())
                .filter(item => !item.visible)
                .map(item => item.id),
            itemOrder: this.getVisibleItems().map(item => item.id),
            pinnedItems: this.getPinnedItems().map(item => item.id),
            customIcons: vscode.workspace.getConfiguration('activityBarManager')
                .get<Record<string, string>>('customIcons', {}),
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        this.profiles.set(id, profile);
        await this.saveProfiles();
        return profile;
    }

    /**
     * 删除配置文件
     */
    async deleteProfile(id: string): Promise<boolean> {
        const profile = this.profiles.get(id);
        if (!profile || profile.isDefault) {
            return false;
        }

        this.profiles.delete(id);
        await this.saveProfiles();
        return true;
    }

    /**
     * 切换配置文件
     */
    async switchProfile(id: string): Promise<boolean> {
        const profile = this.profiles.get(id);
        if (!profile) {
            return false;
        }

        this.activeProfile = id;

        // 应用配置文件
        for (const [itemId, item] of this.items) {
            item.visible = !profile.hiddenItems.includes(itemId);
            item.pinned = profile.pinnedItems.includes(itemId);
        }
        this.applyItemOrder(profile.itemOrder);

        // 保存配置
        const config = vscode.workspace.getConfiguration('activityBarManager');
        await config.update('activeProfile', id, vscode.ConfigurationTarget.Global);
        await this.saveHiddenItems();
        await this.saveItemOrder();
        await this.savePinnedItems();

        this.emitEvent({
            type: ActivityBarEventType.ProfileSwitched,
            data: { profileId: id },
            timestamp: Date.now()
        });

        return true;
    }

    /**
     * 获取所有配置文件
     */
    getAllProfiles(): ActivityBarProfile[] {
        return Array.from(this.profiles.values());
    }

    /**
     * 获取当前配置文件
     */
    getCurrentProfile(): ActivityBarProfile | undefined {
        return this.profiles.get(this.activeProfile);
    }

    /**
     * 导出配置
     */
    async exportConfig(): Promise<ExportedConfig> {
        const config: ExportedConfig = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            profiles: Object.fromEntries(this.profiles),
            activeProfile: this.activeProfile,
            customIcons: vscode.workspace.getConfiguration('activityBarManager')
                .get<Record<string, string>>('customIcons', {}),
            metadata: {
                vscodeVersion: vscode.version,
                extensionVersion: this.context.extension?.packageJSON?.version || '1.0.0'
            }
        };

        this.emitEvent({
            type: ActivityBarEventType.ConfigExported,
            data: config,
            timestamp: Date.now()
        });

        return config;
    }

    /**
     * 导入配置
     */
    async importConfig(config: ExportedConfig): Promise<void> {
        // 导入配置文件
        Object.entries(config.profiles).forEach(([id, profile]) => {
            this.profiles.set(id, profile);
        });

        // 切换到导入的活动配置文件
        if (config.activeProfile && this.profiles.has(config.activeProfile)) {
            await this.switchProfile(config.activeProfile);
        }

        await this.saveProfiles();

        this.emitEvent({
            type: ActivityBarEventType.ConfigImported,
            data: config,
            timestamp: Date.now()
        });
    }

    /**
     * 重置为默认布局
     */
    async resetToDefault(): Promise<void> {
        // 重置所有项的可见性
        this.items.forEach(item => {
            item.visible = true;
            item.pinned = false;
        });

        // 重置排序
        const builtinOrder = [
            'workbench.view.explorer',
            'workbench.view.search',
            'workbench.view.scm',
            'workbench.view.debug',
            'workbench.view.extensions'
        ];

        let order = 1;
        builtinOrder.forEach(id => {
            const item = this.items.get(id);
            if (item) {
                item.order = order++;
            }
        });

        // 扩展项排在后面
        this.items.forEach(item => {
            if (!builtinOrder.includes(item.id)) {
                item.order = order++;
            }
        });

        // 清空配置
        const config = vscode.workspace.getConfiguration('activityBarManager');
        await config.update('hiddenItems', [], vscode.ConfigurationTarget.Global);
        await config.update('itemOrder', [], vscode.ConfigurationTarget.Global);
        await config.update('pinnedItems', [], vscode.ConfigurationTarget.Global);
        await config.update('customIcons', {}, vscode.ConfigurationTarget.Global);
        await config.update('activeProfile', 'default', vscode.ConfigurationTarget.Global);

        // 重新创建默认配置文件
        this.profiles.clear();
        this.createDefaultProfile();
    }

    /**
     * 保存隐藏项配置
     */
    private async saveHiddenItems(): Promise<void> {
        const config = vscode.workspace.getConfiguration('activityBarManager');
        const hiddenItems = Array.from(this.items.values())
            .filter(item => !item.visible)
            .map(item => item.id);
        await config.update('hiddenItems', hiddenItems, vscode.ConfigurationTarget.Global);
    }

    /**
     * 保存排序配置
     */
    private async saveItemOrder(): Promise<void> {
        const config = vscode.workspace.getConfiguration('activityBarManager');
        const itemOrder = this.getVisibleItems().map(item => item.id);
        await config.update('itemOrder', itemOrder, vscode.ConfigurationTarget.Global);
    }

    /**
     * 保存固定项配置
     */
    private async savePinnedItems(): Promise<void> {
        const config = vscode.workspace.getConfiguration('activityBarManager');
        const pinnedItems = this.getPinnedItems().map(item => item.id);
        await config.update('pinnedItems', pinnedItems, vscode.ConfigurationTarget.Global);
    }

    /**
     * 保存配置文件
     */
    private async saveProfiles(): Promise<void> {
        const config = vscode.workspace.getConfiguration('activityBarManager');
        const profiles: Record<string, ActivityBarProfile> = {};
        this.profiles.forEach((profile, id) => {
            profiles[id] = profile;
        });
        await config.update('profiles', profiles, vscode.ConfigurationTarget.Global);
    }

    /**
     * 更新状态栏
     */
    private updateStatusBar(): void {
        const visibleCount = this.getVisibleItems().length;
        const totalCount = this.items.size;
        const profile = this.getCurrentProfile();

        this.statusBarItem.text = `$(layout-activitybar-left) ${visibleCount}/${totalCount}`;
        this.statusBarItem.tooltip = `活动栏管理器 - 当前配置: ${profile?.name || '默认'}`;
        this.statusBarItem.command = 'activityBarManager.openSettings';
        this.statusBarItem.show();
    }

    /**
     * 发送事件
     */
    private emitEvent(event: ActivityBarEvent): void {
        const listeners = this.eventListeners.get(event.type) || [];
        listeners.forEach(listener => listener(event));
        this.updateStatusBar();
    }

    /**
     * 添加事件监听器
     */
    on(eventType: ActivityBarEventType, listener: (event: ActivityBarEvent) => void): void {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }
        this.eventListeners.get(eventType)?.push(listener);
    }

    /**
     * 移除事件监听器
     */
    off(eventType: ActivityBarEventType, listener: (event: ActivityBarEvent) => void): void {
        const listeners = this.eventListeners.get(eventType);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * 销毁管理器
     */
    dispose(): void {
        this.statusBarItem.dispose();
        if (this.autoHideTimer) {
            clearTimeout(this.autoHideTimer);
        }
    }
}
