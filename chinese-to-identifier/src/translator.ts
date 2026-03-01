import * as vscode from 'vscode';
import axios from 'axios';
import * as crypto from 'crypto';

/**
 * 翻译服务接口
 */
interface TranslationService {
    translate(text: string): Promise<string>;
}

/**
 * Google 翻译服务（免费，无需 API Key）
 */
class GoogleTranslationService implements TranslationService {
    async translate(text: string): Promise<string> {
        try {
            const url = `https://translate.googleapis.com/translate_a/single`;
            const response = await axios.get(url, {
                params: {
                    client: 'gtx',
                    sl: 'zh-CN',
                    tl: 'en',
                    dt: 't',
                    q: text
                },
                timeout: 10000
            });

            if (response.data && response.data[0]) {
                return response.data[0]
                    .map((item: any[]) => item[0])
                    .join('');
            }
            throw new Error('翻译结果解析失败');
        } catch (error: any) {
            // 尝试备用 Google 翻译 API
            try {
                const backupUrl = `https://clients5.google.com/translate_a/t`;
                const backupResponse = await axios.get(backupUrl, {
                    params: {
                        client: 'dict-chrome-ex',
                        sl: 'zh-CN',
                        tl: 'en',
                        q: text
                    },
                    timeout: 10000
                });
                
                if (backupResponse.data && backupResponse.data[0]) {
                    return backupResponse.data[0];
                }
            } catch (backupError) {
                // 忽略备用 API 错误
            }
            
            throw new Error(`Google 翻译失败: ${error.message}`);
        }
    }
}

/**
 * 百度翻译服务（需要 API Key）
 */
class BaiduTranslationService implements TranslationService {
    private appId: string;
    private secretKey: string;

    constructor(appId: string, secretKey: string) {
        this.appId = appId;
        this.secretKey = secretKey;
    }

    async translate(text: string): Promise<string> {
        if (!this.appId || !this.secretKey) {
            throw new Error('请配置百度翻译 API App ID 和 Secret Key');
        }

        const salt = Date.now().toString();
        const sign = crypto
            .createHash('md5')
            .update(this.appId + text + salt + this.secretKey)
            .digest('hex');

        try {
            const url = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
            const response = await axios.get(url, {
                params: {
                    q: text,
                    from: 'zh',
                    to: 'en',
                    appid: this.appId,
                    salt: salt,
                    sign: sign
                },
                timeout: 10000
            });

            if (response.data && response.data.trans_result && response.data.trans_result[0]) {
                return response.data.trans_result[0].dst;
            }
            throw new Error('翻译结果解析失败');
        } catch (error: any) {
            throw new Error(`百度翻译失败: ${error.message}`);
        }
    }
}

/**
 * 有道翻译服务（需要 API Key）
 */
class YoudaoTranslationService implements TranslationService {
    private appKey: string;
    private appSecret: string;

    constructor(appKey: string, appSecret: string) {
        this.appKey = appKey;
        this.appSecret = appSecret;
    }

    async translate(text: string): Promise<string> {
        if (!this.appKey || !this.appSecret) {
            throw new Error('请配置有道翻译 API App Key 和 App Secret');
        }

        const salt = Date.now().toString();
        const curtime = Math.floor(Date.now() / 1000).toString();
        const input = text.length > 20 
            ? text.substring(0, 10) + text.length + text.substring(text.length - 10)
            : text;
        
        const sign = crypto
            .createHash('sha256')
            .update(this.appKey + input + salt + curtime + this.appSecret)
            .digest('hex');

        try {
            const url = 'https://openapi.youdao.com/api';
            const response = await axios.get(url, {
                params: {
                    q: text,
                    from: 'zh-CHS',
                    to: 'en',
                    appKey: this.appKey,
                    salt: salt,
                    sign: sign,
                    signType: 'v3',
                    curtime: curtime
                },
                timeout: 10000
            });

            if (response.data && response.data.translation && response.data.translation[0]) {
                return response.data.translation[0];
            }
            throw new Error('翻译结果解析失败');
        } catch (error: any) {
            throw new Error(`有道翻译失败: ${error.message}`);
        }
    }
}

/**
 * 命名转换器
 */
export class NamingConverter {
    /**
     * 转换为大驼峰 (PascalCase)
     * 例如: "user name" -> "UserName"
     */
    static toPascalCase(text: string): string {
        const words = this.extractWords(text);
        return words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    /**
     * 转换为小驼峰 (camelCase)
     * 例如: "user name" -> "userName"
     */
    static toCamelCase(text: string): string {
        const words = this.extractWords(text);
        if (words.length === 0) {
            return '';
        }
        return words[0].toLowerCase() + words
            .slice(1)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    /**
     * 转换为下划线命名 (snake_case)
     * 例如: "user name" -> "user_name"
     */
    static toSnakeCase(text: string): string {
        const words = this.extractWords(text);
        return words.map(word => word.toLowerCase()).join('_');
    }

    /**
     * 转换为短横线命名 (kebab-case)
     * 例如: "user name" -> "user-name"
     */
    static toKebabCase(text: string): string {
        const words = this.extractWords(text);
        return words.map(word => word.toLowerCase()).join('-');
    }

    /**
     * 从文本中提取单词
     */
    private static extractWords(text: string): string[] {
        // 移除特殊字符，只保留字母、数字和空格
        let cleaned = text.replace(/[^a-zA-Z0-9\s]/g, ' ');
        
        // 分割单词（按空格和大写字母分割）
        let words: string[] = [];
        
        // 先按空格分割
        const spaceSplit = cleaned.split(/\s+/).filter(w => w.length > 0);
        
        for (const part of spaceSplit) {
            // 按大写字母分割（处理驼峰转其他格式的情况）
            const camelSplit = part.split(/(?=[A-Z])/);
            words = words.concat(camelSplit.filter(w => w.length > 0));
        }

        return words;
    }
}

/**
 * 翻译管理器
 */
export class TranslationManager {
    private config: vscode.WorkspaceConfiguration;

    constructor() {
        this.config = vscode.workspace.getConfiguration('chineseToIdentifier');
    }

    /**
     * 获取翻译服务实例
     */
    getTranslationService(): TranslationService {
        const service = this.config.get<string>('translationService', 'google');

        switch (service) {
            case 'baidu':
                return new BaiduTranslationService(
                    this.config.get<string>('baiduAppId', ''),
                    this.config.get<string>('baiduSecretKey', '')
                );
            case 'youdao':
                return new YoudaoTranslationService(
                    this.config.get<string>('youdaoAppKey', ''),
                    this.config.get<string>('youdaoAppSecret', '')
                );
            case 'google':
            default:
                return new GoogleTranslationService();
        }
    }

    /**
     * 翻译中文文本
     */
    async translateChinese(text: string): Promise<string> {
        // 检查是否包含中文
        if (!/[\u4e00-\u9fa5]/.test(text)) {
            // 如果不包含中文，直接返回原文
            return text;
        }

        const service = this.getTranslationService();
        return await service.translate(text);
    }
}
