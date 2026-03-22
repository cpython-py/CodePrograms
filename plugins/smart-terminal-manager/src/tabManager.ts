import * as vscode from 'vscode';
import { TerminalTab } from './types';

/**
 * 终端选项卡管理器
 */
export class TabManager {
    private context: vscode.ExtensionContext;
    private tabs: Map<string, TerminalTab> = new Map();
    private minimizedTabs: Set<string> = new Set();
    private isBarMinimized: boolean = false;
    private onDidChangeTabs: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    
    readonly onTabsChanged = this.onDidChangeTabs.event;
    
    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.loadState();
        
        // 监听终端变化
        vscode.window.onDidOpenTerminal(this.onTerminalOpened, this, context.subscriptions);
        vscode.window.onDidCloseTerminal(this.onTerminalClosed, this, context.subscriptions);
    }
    
    /**
     * 获取所有选项卡
     */
    getAllTabs(): TerminalTab[] {
        return Array.from(this.tabs.values());
    }
    
    /**
     * 获取非最小化的选项卡
     */
    getVisibleTabs(): TerminalTab[] {
        return this.getAllTabs().filter(t => !this.minimizedTabs.has(t.id));
    }
    
    /**
     * 获取最小化的选项卡
     */
    getMinimizedTabs(): TerminalTab[] {
        return this.getAllTabs().filter(t => this.minimizedTabs.has(t.id));
    }
    
    /**
     * 判断选项卡栏是否最小化
     */
    isTabBarMinimized(): boolean {
        return this.isBarMinimized;
    }
    
    /**
     * 切换选项卡栏状态
     */
    toggleTabBar(): void {
        this.isBarMinimized = !this.isBarMinimized;
        this.saveState();
        this.onDidChangeTabs.fire();
    }
    
    /**
     * 最小化单个选项卡
     */
    minimizeTab(tabId: string): void {
        this.minimizedTabs.add(tabId);
        this.saveState();
        this.onDidChangeTabs.fire();
    }
    
    /**
     * 恢复单个选项卡
     */
    restoreTab(tabId: string): void {
        this.minimizedTabs.delete(tabId);
        this.saveState();
        this.onDidChangeTabs.fire();
    }
    
    /**
     * 最小化所有选项卡
     */
    minimizeAllTabs(): void {
        for (const tabId of this.tabs.keys()) {
            this.minimizedTabs.add(tabId);
        }
        this.saveState();
        this.onDidChangeTabs.fire();
    }
    
    /**
     * 恢复所有选项卡
     */
    restoreAllTabs(): void {
        this.minimizedTabs.clear();
        this.saveState();
        this.onDidChangeTabs.fire();
    }
    
    /**
     * 关闭选项卡
     */
    closeTab(tabId: string): void {
        const tab = this.tabs.get(tabId);
        if (tab) {
            // 找到对应的终端并关闭
            const terminals = vscode.window.terminals;
            for (const terminal of terminals) {
                if (terminal.name === tab.name || terminal.creationOptions?.name === tab.name) {
                    terminal.dispose();
                    break;
                }
            }
        }
    }
    
    /**
     * 关闭所有选项卡
     */
    closeAllTabs(): void {
        for (const terminal of vscode.window.terminals) {
            terminal.dispose();
        }
    }
    
    /**
     * 聚焦选项卡
     */
    focusTab(tabId: string): void {
        const tab = this.tabs.get(tabId);
        if (tab) {
            const terminals = vscode.window.terminals;
            for (const terminal of terminals) {
                if (terminal.name === tab.name || terminal.creationOptions?.name === tab.name) {
                    terminal.show();
                    break;
                }
            }
        }
    }
    
    /**
     * 重命名选项卡
     */
    async renameTab(tabId: string): Promise<void> {
        const tab = this.tabs.get(tabId);
        if (!tab) {
            return;
        }
        
        const newName = await vscode.window.showInputBox({
            prompt: '输入新的终端名称',
            placeHolder: tab.name,
            value: tab.name
        });
        
        if (newName && newName !== tab.name) {
            tab.name = newName;
            this.saveState();
            this.onDidChangeTabs.fire();
        }
    }
    
    /**
     * 设置选项卡颜色
     */
    async setTabColor(tabId: string): Promise<void> {
        const tab = this.tabs.get(tabId);
        if (!tab) {
            return;
        }
        
        const colors = [
            { label: '🔴 红色', value: '#ff6b6b' },
            { label: '🟢 绿色', value: '#4ecdc4' },
            { label: '🔵 蓝色', value: '#45b7d1' },
            { label: '🟡 黄色', value: '#f9ca24' },
            { label: '🟣 紫色', value: '#a55eea' },
            { label: '🟠 橙色', value: '#ff9f43' },
            { label: '⚪ 默认', value: '' }
        ];
        
        const selected = await vscode.window.showQuickPick(colors, {
            placeHolder: '选择选项卡颜色'
        });
        
        if (selected) {
            tab.color = selected.value;
            this.saveState();
            this.onDidChangeTabs.fire();
        }
    }
    
    /**
     * 终端打开时
     */
    private onTerminalOpened(terminal: vscode.Terminal): void {
        const id = `tab-${Date.now()}`;
        const tab: TerminalTab = {
            id,
            name: terminal.name || 'Terminal',
            terminalId: Date.now(),
            icon: 'terminal',
            isMinimized: false
        };
        
        this.tabs.set(id, tab);
        this.saveState();
        this.onDidChangeTabs.fire();
    }
    
    /**
     * 终端关闭时
     */
    private onTerminalClosed(terminal: vscode.Terminal): void {
        for (const [id, tab] of this.tabs) {
            if (tab.name === terminal.name || terminal.creationOptions?.name === tab.name) {
                this.tabs.delete(id);
                this.minimizedTabs.delete(id);
                break;
            }
        }
        this.saveState();
        this.onDidChangeTabs.fire();
    }
    
    /**
     * 加载状态
     */
    private loadState(): void {
        const config = vscode.workspace.getConfiguration('smartTerminal');
        this.isBarMinimized = config.get<boolean>('tabBarMinimized', false);
        
        // 从全局状态加载选项卡
        const savedTabs = this.context.globalState.get<TerminalTab[]>('terminalTabs', []);
        const savedMinimized = this.context.globalState.get<string[]>('minimizedTabs', []);
        
        for (const tab of savedTabs) {
            this.tabs.set(tab.id, tab);
        }
        
        for (const id of savedMinimized) {
            this.minimizedTabs.add(id);
        }
    }
    
    /**
     * 保存状态
     */
    private saveState(): void {
        const config = vscode.workspace.getConfiguration('smartTerminal');
        config.update('tabBarMinimized', this.isBarMinimized, vscode.ConfigurationTarget.Global);
        
        this.context.globalState.update('terminalTabs', Array.from(this.tabs.values()));
        this.context.globalState.update('minimizedTabs', Array.from(this.minimizedTabs));
    }
}
