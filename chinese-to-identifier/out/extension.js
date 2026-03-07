"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const translator_1 = require("./translator");
let translationManager;
/**
 * 插件激活时调用
 */
function activate(context) {
    console.log('中文转标识符插件已激活');
    translationManager = new translator_1.TranslationManager();
    // 注册大驼峰命令
    const toPascalCase = vscode.commands.registerCommand('chineseToIdentifier.toPascalCase', () => convertSelection('pascal'));
    // 注册小驼峰命令
    const toCamelCase = vscode.commands.registerCommand('chineseToIdentifier.toCamelCase', () => convertSelection('camel'));
    // 注册下划线命令
    const toSnakeCase = vscode.commands.registerCommand('chineseToIdentifier.toSnakeCase', () => convertSelection('snake'));
    // 注册短横线命令
    const toKebabCase = vscode.commands.registerCommand('chineseToIdentifier.toKebabCase', () => convertSelection('kebab'));
    context.subscriptions.push(toPascalCase, toCamelCase, toSnakeCase, toKebabCase);
}
exports.activate = activate;
/**
 * 转换选中的文本
 */
async function convertSelection(format) {
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
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "正在翻译...",
        cancellable: false
    }, async () => {
        try {
            await editor.edit(editBuilder => {
                selections.forEach(async (selection) => {
                    if (!selection.isEmpty) {
                        const text = editor.document.getText(selection);
                        try {
                            const translated = await translationManager.translateChinese(text);
                            const result = convertToFormat(translated, format);
                            editBuilder.replace(selection, result);
                        }
                        catch (error) {
                            vscode.window.showErrorMessage(`翻译失败: ${error.message}`);
                        }
                    }
                });
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`转换失败: ${error.message}`);
        }
    });
}
/**
 * 根据格式转换文本
 */
function convertToFormat(text, format) {
    switch (format) {
        case 'pascal':
            return translator_1.NamingConverter.toPascalCase(text);
        case 'camel':
            return translator_1.NamingConverter.toCamelCase(text);
        case 'snake':
            return translator_1.NamingConverter.toSnakeCase(text);
        case 'kebab':
            return translator_1.NamingConverter.toKebabCase(text);
        default:
            return text;
    }
}
/**
 * 插件停用时调用
 */
function deactivate() {
    console.log('中文转标识符插件已停用');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map