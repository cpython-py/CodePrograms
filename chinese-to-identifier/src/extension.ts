import * as vscode from 'vscode';
import { TranslationManager, NamingConverter } from './translator';

let translationManager: TranslationManager;

/**
 * 插件激活时调用
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('中文转标识符插件已激活');

    translationManager = new TranslationManager();

    // 注册大驼峰命令
    const toPascalCase = vscode.commands.registerCommand(
        'chineseToIdentifier.toPascalCase',
        () => convertSelection('pascal')
    );

    // 注册小驼峰命令
    const toCamelCase = vscode.commands.registerCommand(
        'chineseToIdentifier.toCamelCase',
        () => convertSelection('camel')
    );

    // 注册下划线命令
    const toSnakeCase = vscode.commands.registerCommand(
        'chineseToIdentifier.toSnakeCase',
        () => convertSelection('snake')
    );

    // 注册短横线命令
    const toKebabCase = vscode.commands.registerCommand(
        'chineseToIdentifier.toKebabCase',
        () => convertSelection('kebab')
    );

    context.subscriptions.push(toPascalCase, toCamelCase, toSnakeCase, toKebabCase);
}

/**
 * 转换选中的文本
 */
async function convertSelection(format: 'pascal' | 'camel' | 'snake' | 'kebab') {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('没有打开的编辑器');
        return;
    }

    const selections = editor.selections;

    if (selections.length === 0 || selections.every(s => s.isEmpty)) {
        vscode.window.showErrorMessage('请先选择要转换的文本');
        return;
    }

    // 显示加载提示
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: "正在翻译...",
            cancellable: false
        },
        async () => {
            try {
                await editor.edit(editBuilder => {
                    selections.forEach(async (selection) => {
                        if (!selection.isEmpty) {
                            const text = editor.document.getText(selection);
                            try {
                                const translated = await translationManager.translateChinese(text);
                                const result = convertToFormat(translated, format);
                                editBuilder.replace(selection, result);
                            } catch (error: any) {
                                vscode.window.showErrorMessage(`翻译失败: ${error.message}`);
                            }
                        }
                    });
                });
            } catch (error: any) {
                vscode.window.showErrorMessage(`转换失败: ${error.message}`);
            }
        }
    );
}

/**
 * 根据格式转换文本
 */
function convertToFormat(text: string, format: 'pascal' | 'camel' | 'snake' | 'kebab'): string {
    switch (format) {
        case 'pascal':
            return NamingConverter.toPascalCase(text);
        case 'camel':
            return NamingConverter.toCamelCase(text);
        case 'snake':
            return NamingConverter.toSnakeCase(text);
        case 'kebab':
            return NamingConverter.toKebabCase(text);
        default:
            return text;
    }
}

/**
 * 插件停用时调用
 */
export function deactivate() {
    console.log('中文转标识符插件已停用');
}
