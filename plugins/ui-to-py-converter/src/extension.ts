import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec, execSync } from 'child_process';

// 转换器类型
type ConverterType = 'pyqt5' | 'pyside6' | 'pyside2' | 'pyqt6';

// Python版本信息
interface PythonInfo {
    path: string;
    version: string;
    converters: ConverterType[];
}

/**
 * 检测可用的Python解释器和转换工具
 */
async function detectPythonAndConverters(): Promise<PythonInfo[]> {
    const pythonInfos: PythonInfo[] = [];
    
    // 常见的Python启动方式
    const pythonCommands = ['py', 'python', 'python3'];
    
    for (const cmd of pythonCommands) {
        try {
            // 获取Python路径
            const pythonPath = execSync(`${cmd} -c "import sys; print(sys.executable)"`, {
                encoding: 'utf8',
                timeout: 5000
            }).trim();
            
            // 获取Python版本
            const version = execSync(`${cmd} --version`, {
                encoding: 'utf8',
                timeout: 5000
            }).trim().split(' ')[1];
            
            // 检测可用的转换工具
            const converters: ConverterType[] = [];
            
            // 检测PyQt5
            try {
                execSync(`${cmd} -c "import PyQt5.uic"`, { timeout: 5000 });
                converters.push('pyqt5');
            } catch {}
            
            // 检测PySide6
            try {
                execSync(`${cmd} -c "import PySide6.QtUiTools"`, { timeout: 5000 });
                converters.push('pyside6');
            } catch {}
            
            // 检测PySide2
            try {
                execSync(`${cmd} -c "import PySide2.QtUiTools"`, { timeout: 5000 });
                converters.push('pyside2');
            } catch {}
            
            // 检测PyQt6
            try {
                execSync(`${cmd} -c "import PyQt6.uic"`, { timeout: 5000 });
                converters.push('pyqt6');
            } catch {}
            
            if (converters.length > 0) {
                pythonInfos.push({
                    path: pythonPath,
                    version,
                    converters
                });
            }
        } catch {
            // 忽略错误，继续检测下一个
        }
    }
    
    return pythonInfos;
}

/**
 * 使用py启动器获取所有Python版本
 */
async function getAllPythonVersions(): Promise<{version: string, path: string}[]> {
    const versions: {version: string, path: string}[] = [];
    
    try {
        // 使用 py --list 获取所有已安装的Python版本
        const output = execSync('py --list', { encoding: 'utf8', timeout: 10000 });
        const lines = output.split('\n');
        
        for (const line of lines) {
            const match = line.match(/-V:(\d+\.\d+)\*?\s+Python\s+[\d.]+/);
            if (match) {
                const version = match[1];
                try {
                    const pythonPath = execSync(`py -${version} -c "import sys; print(sys.executable)"`, {
                        encoding: 'utf8',
                        timeout: 5000
                    }).trim();
                    versions.push({ version, path: pythonPath });
                } catch {}
            }
        }
    } catch {}
    
    return versions;
}

/**
 * 检查特定Python版本是否有转换工具
 */
function checkConverterForPython(pythonCmd: string): ConverterType[] {
    const converters: ConverterType[] = [];
    
    const checks: {type: ConverterType, module: string}[] = [
        { type: 'pyqt5', module: 'PyQt5.uic' },
        { type: 'pyside6', module: 'PySide6.QtUiTools' },
        { type: 'pyside2', module: 'PySide2.QtUiTools' },
        { type: 'pyqt6', module: 'PyQt6.uic' }
    ];
    
    for (const check of checks) {
        try {
            execSync(`${pythonCmd} -c "import ${check.module}"`, { timeout: 5000 });
            converters.push(check.type);
        } catch {}
    }
    
    return converters;
}

/**
 * 获取转换命令
 */
function getConversionCommand(
    pythonCmd: string,
    converter: ConverterType,
    uiPath: string,
    pyPath: string
): string {
    switch (converter) {
        case 'pyqt5':
            return `${pythonCmd} -m PyQt5.uic.pyuic "${uiPath}" -o "${pyPath}"`;
        case 'pyside6':
            return `${pythonCmd} -m pyside6-uic "${uiPath}" -o "${pyPath}"`;
        case 'pyside2':
            return `${pythonCmd} -m pyside2-uic "${uiPath}" -o "${pyPath}"`;
        case 'pyqt6':
            return `${pythonCmd} -m PyQt6.uic.pyuic "${uiPath}" -o "${pyPath}"`;
        default:
            return `${pythonCmd} -m PyQt5.uic.pyuic "${uiPath}" -o "${pyPath}"`;
    }
}

/**
 * 获取Python命令
 */
function getPythonCommand(version?: string): string {
    return version ? `py -${version}` : 'python';
}

/**
 * 执行转换
 */
async function convertUiToPy(
    uiPath: string,
    pyPath: string,
    converter: ConverterType,
    pythonVersion?: string
): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
        const pythonCmd = getPythonCommand(pythonVersion);
        const command = getConversionCommand(pythonCmd, converter, uiPath, pyPath);
        
        exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
            if (error) {
                resolve({
                    success: false,
                    message: `转换失败: ${error.message}\n${stderr}`
                });
            } else {
                resolve({
                    success: true,
                    message: `转换成功: ${path.basename(pyPath)}`
                });
            }
        });
    });
}

/**
 * 获取输出文件路径
 */
function getOutputPath(uiPath: string): string {
    const config = vscode.workspace.getConfiguration('uiToPy');
    const suffix = config.get<string>('outputSuffix', '_ui');
    const dir = path.dirname(uiPath);
    const baseName = path.basename(uiPath, '.ui');
    return path.join(dir, `${baseName}${suffix}.py`);
}

/**
 * 选择转换器
 */
async function selectConverter(
    converters: ConverterType[],
    autoSelect: boolean = true
): Promise<ConverterType | undefined> {
    if (converters.length === 0) {
        return undefined;
    }
    
    if (autoSelect && converters.length === 1) {
        return converters[0];
    }
    
    const config = vscode.workspace.getConfiguration('uiToPy');
    const defaultConverter = config.get<string>('defaultConverter', 'auto');
    
    // 如果默认是auto或指定的转换器可用，直接使用
    if (defaultConverter !== 'auto' && converters.includes(defaultConverter as ConverterType)) {
        return defaultConverter as ConverterType;
    }
    
    // 自动选择优先级: pyqt5 > pyside6 > pyside2 > pyqt6
    const priority: ConverterType[] = ['pyqt5', 'pyside6', 'pyside2', 'pyqt6'];
    for (const c of priority) {
        if (converters.includes(c)) {
            return c;
        }
    }
    
    return converters[0];
}

/**
 * 主转换函数
 */
async function doConvert(uri: vscode.Uri | undefined, showPreview: boolean = false) {
    // 获取UI文件路径
    let uiPath: string;
    
    if (uri) {
        uiPath = uri.fsPath;
    } else {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.fileName.endsWith('.ui')) {
            uiPath = editor.document.fileName;
        } else {
            vscode.window.showErrorMessage('请选择一个 .ui 文件');
            return;
        }
    }
    
    // 检查文件是否存在
    if (!fs.existsSync(uiPath)) {
        vscode.window.showErrorMessage(`文件不存在: ${uiPath}`);
        return;
    }
    
    // 显示进度
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "正在转换 UI 文件...",
        cancellable: false
    }, async (progress) => {
        progress.report({ message: "检测 Python 环境..." });
        
        // 获取所有Python版本
        const pythonVersions = await getAllPythonVersions();
        
        if (pythonVersions.length === 0) {
            vscode.window.showErrorMessage('未检测到已安装的 Python 版本');
            return;
        }
        
        // 让用户选择Python版本（如果检测到多个）
        let selectedVersion: string | undefined;
        let selectedConverter: ConverterType | undefined;
        
        // 收集所有有转换工具的Python版本
        const availableVersions: { version: string; converters: ConverterType[] }[] = [];
        
        for (const pv of pythonVersions) {
            const pythonCmd = getPythonCommand(pv.version);
            const converters = checkConverterForPython(pythonCmd);
            if (converters.length > 0) {
                availableVersions.push({
                    version: pv.version,
                    converters
                });
            }
        }
        
        if (availableVersions.length === 0) {
            vscode.window.showErrorMessage(
                '未检测到可用的 UI 转换工具。\n请安装 PyQt5 或 PySide6:\n' +
                'pip install PyQt5 或 pip install PySide6'
            );
            return;
        }
        
        // 如果只有一个版本，直接使用
        if (availableVersions.length === 1) {
            selectedVersion = availableVersions[0].version;
            selectedConverter = await selectConverter(availableVersions[0].converters);
        } else {
            // 让用户选择Python版本
            const items = availableVersions.map(v => ({
                label: `Python ${v.version}`,
                description: `可用转换器: ${v.converters.join(', ')}`,
                version: v.version,
                converters: v.converters
            }));
            
            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: '选择 Python 版本进行转换'
            });
            
            if (!selected) {
                return;
            }
            
            selectedVersion = selected.version;
            selectedConverter = await selectConverter(selected.converters, false);
        }
        
        if (!selectedConverter) {
            vscode.window.showErrorMessage('未选择转换器');
            return;
        }
        
        progress.report({ message: `使用 Python ${selectedVersion} + ${selectedConverter} 转换...` });
        
        // 获取输出路径
        const pyPath = getOutputPath(uiPath);
        
        // 检查输出文件是否已存在
        if (fs.existsSync(pyPath)) {
            const overwrite = await vscode.window.showWarningMessage(
                `文件 ${path.basename(pyPath)} 已存在，是否覆盖？`,
                '覆盖',
                '取消'
            );
            if (overwrite !== '覆盖') {
                return;
            }
        }
        
        // 执行转换
        const result = await convertUiToPy(uiPath, pyPath, selectedConverter, selectedVersion);
        
        const config = vscode.workspace.getConfiguration('uiToPy');
        
        if (result.success) {
            if (config.get<boolean>('showNotification', true)) {
                vscode.window.showInformationMessage(
                    `✅ ${result.message} (Python ${selectedVersion} + ${selectedConverter})`
                );
            }
            
            // 自动打开生成的文件
            if (config.get<boolean>('openAfterConvert', true)) {
                const document = await vscode.workspace.openTextDocument(pyPath);
                await vscode.window.showTextDocument(document);
            }
        } else {
            vscode.window.showErrorMessage(`❌ ${result.message}`);
        }
    });
}

/**
 * 插件激活
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('UI to Py Converter 插件已激活');
    
    // 注册转换命令
    const convertCommand = vscode.commands.registerCommand(
        'uiToPy.convertUiToPy',
        (uri) => doConvert(uri, false)
    );
    
    // 注册带预览的转换命令
    const convertWithPreviewCommand = vscode.commands.registerCommand(
        'uiToPy.convertUiToPyWithPreview',
        (uri) => doConvert(uri, true)
    );
    
    context.subscriptions.push(convertCommand, convertWithPreviewCommand);
}

/**
 * 插件停用
 */
export function deactivate() {
    console.log('UI to Py Converter 插件已停用');
}
