import * as vscode from 'vscode';
import { CustomCommand, CommandGroup, DEFAULT_COMMAND_GROUPS } from './types';

/**
 * 命令管理器
 */
export class CommandManager {
    private context: vscode.ExtensionContext;
    private customCommands: CustomCommand[] = [];
    private commandGroups: Map<string, CommandGroup> = new Map();
    
    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.initializeDefaultGroups();
        this.loadCustomCommands();
    }
    
    /**
     * 初始化默认分组
     */
    private initializeDefaultGroups(): void {
        for (const group of DEFAULT_COMMAND_GROUPS) {
            this.commandGroups.set(group.id, group);
        }
    }
    
    /**
     * 获取所有分组
     */
    getAllGroups(): CommandGroup[] {
        const groups = Array.from(this.commandGroups.values());
        
        // 如果有自定义命令且没有分组，添加到"自定义"分组
        if (this.customCommands.length > 0) {
            const customGroup = groups.find(g => g.id === 'custom');
            if (!customGroup) {
                groups.push({
                    id: 'custom',
                    name: '自定义命令',
                    icon: 'star',
                    commands: this.customCommands
                });
            } else {
                customGroup.commands = [...customGroup.commands, ...this.customCommands];
            }
        }
        
        return groups;
    }
    
    /**
     * 获取分组
     */
    getGroup(id: string): CommandGroup | undefined {
        const group = this.commandGroups.get(id);
        if (group) {
            return group;
        }
        
        // 检查是否是自定义分组
        if (id === 'custom') {
            return {
                id: 'custom',
                name: '自定义命令',
                icon: 'star',
                commands: this.customCommands
            };
        }
        
        return undefined;
    }
    
    /**
     * 获取所有命令
     */
    getAllCommands(): CustomCommand[] {
        const commands: CustomCommand[] = [];
        
        for (const group of this.commandGroups.values()) {
            commands.push(...group.commands);
        }
        
        commands.push(...this.customCommands);
        
        return commands;
    }
    
    /**
     * 获取命令
     */
    getCommand(id: string): CustomCommand | undefined {
        return this.getAllCommands().find(c => c.id === id);
    }
    
    /**
     * 添加自定义命令
     */
    async addCommand(): Promise<CustomCommand | undefined> {
        // 输入命令名称
        const name = await vscode.window.showInputBox({
            prompt: '输入命令名称',
            placeHolder: '例如: 启动服务'
        });
        
        if (!name) {
            return undefined;
        }
        
        // 输入命令
        const command = await vscode.window.showInputBox({
            prompt: '输入要执行的命令',
            placeHolder: '例如: npm run dev'
        });
        
        if (!command) {
            return undefined;
        }
        
        // 选择分组
        const groups = this.getAllGroups().map(g => ({
            label: g.name,
            id: g.id
        }));
        
        groups.push({ label: '➕ 新建分组', id: 'new-group' });
        
        const selectedGroup = await vscode.window.showQuickPick(groups, {
            placeHolder: '选择命令分组'
        });
        
        if (!selectedGroup) {
            return undefined;
        }
        
        let groupId = selectedGroup.id;
        
        // 如果选择新建分组
        if (selectedGroup.id === 'new-group') {
            const newGroupName = await vscode.window.showInputBox({
                prompt: '输入新分组名称',
                placeHolder: '例如: 我的项目'
            });
            
            if (newGroupName) {
                groupId = newGroupName.toLowerCase().replace(/\s+/g, '-');
                this.commandGroups.set(groupId, {
                    id: groupId,
                    name: newGroupName,
                    icon: 'folder',
                    commands: []
                });
            }
        }
        
        const id = `custom-${Date.now()}`;
        const newCommand: CustomCommand = {
            id,
            name,
            command,
            group: groupId
        };
        
        this.customCommands.push(newCommand);
        this.saveCustomCommands();
        
        return newCommand;
    }
    
    /**
     * 编辑命令
     */
    async editCommand(id: string): Promise<boolean> {
        const command = this.customCommands.find(c => c.id === id);
        if (!command) {
            vscode.window.showErrorMessage('命令不存在');
            return false;
        }
        
        // 编辑名称
        const newName = await vscode.window.showInputBox({
            prompt: '编辑命令名称',
            value: command.name
        });
        
        if (!newName) {
            return false;
        }
        
        // 编辑命令
        const newCommandStr = await vscode.window.showInputBox({
            prompt: '编辑命令',
            value: command.command
        });
        
        if (!newCommandStr) {
            return false;
        }
        
        command.name = newName;
        command.command = newCommandStr;
        
        this.saveCustomCommands();
        return true;
    }
    
    /**
     * 删除命令
     */
    deleteCommand(id: string): boolean {
        const index = this.customCommands.findIndex(c => c.id === id);
        if (index === -1) {
            return false;
        }
        
        this.customCommands.splice(index, 1);
        this.saveCustomCommands();
        return true;
    }
    
    /**
     * 加载自定义命令
     */
    private loadCustomCommands(): void {
        const config = vscode.workspace.getConfiguration('smartTerminal');
        this.customCommands = config.get<CustomCommand[]>('customCommands', []);
    }
    
    /**
     * 保存自定义命令
     */
    private saveCustomCommands(): void {
        const config = vscode.workspace.getConfiguration('smartTerminal');
        config.update('customCommands', this.customCommands, vscode.ConfigurationTarget.Global);
    }
    
    /**
     * 搜索命令
     */
    searchCommands(query: string): CustomCommand[] {
        const lowerQuery = query.toLowerCase();
        return this.getAllCommands().filter(c => 
            c.name.toLowerCase().includes(lowerQuery) ||
            c.command.toLowerCase().includes(lowerQuery) ||
            (c.group && c.group.toLowerCase().includes(lowerQuery))
        );
    }
    
    /**
     * 执行命令
     */
    executeCommand(command: CustomCommand, terminal?: vscode.Terminal): vscode.Terminal {
        const targetTerminal = terminal || this.createTerminal();
        
        targetTerminal.show();
        targetTerminal.sendText(command.command);
        
        return targetTerminal;
    }
    
    /**
     * 创建终端
     */
    createTerminal(name?: string): vscode.Terminal {
        const terminalName = name || 'Smart Terminal';
        
        return vscode.window.createTerminal({
            name: terminalName,
            iconPath: new vscode.ThemeIcon('terminal')
        });
    }
    
    /**
     * 显示命令选择面板
     */
    async showQuickCommandPicker(): Promise<void> {
        const commands = this.getAllCommands();
        
        const items = commands.map(c => ({
            label: c.name,
            description: c.command,
            detail: c.group ? `分组: ${c.group}` : undefined,
            command: c
        }));
        
        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: '选择要执行的命令',
            matchOnDescription: true,
            matchOnDetail: true
        });
        
        if (selected) {
            this.executeCommand(selected.command);
        }
    }
}
