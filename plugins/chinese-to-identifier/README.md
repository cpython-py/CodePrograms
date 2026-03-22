# 中文转标识符 VS Code 插件

一个强大的 VS Code 插件，可以将编辑器中的中文文本自动翻译成英文，并转换为各种标识符命名格式。

## 功能特性

- ✅ 支持中文自动翻译成英文
- ✅ 支持多种命名格式转换：
  - **大驼峰 (PascalCase)**: `用户名称` → `UserName`
  - **小驼峰 (camelCase)**: `用户名称` → `userName`
  - **下划线 (snake_case)**: `用户名称` → `user_name`
  - **短横线 (kebab-case)**: `用户名称` → `user-name`
- ✅ 支持多种翻译服务：
  - Google 翻译（免费，默认）
  - 百度翻译（需要 API Key）
  - 有道翻译（需要 API Key）
- ✅ 右键菜单快速操作
- ✅ 自定义快捷键支持

## 安装方法

### 方式一：从源码安装

1. 克隆或下载此项目
2. 在项目目录下运行：
   ```bash
   npm install
   npm run compile
   ```
3. 按 `F5` 启动调试，会打开一个新的 VS Code 窗口
4. 在新窗口中测试插件功能

### 方式二：打包安装

1. 安装 vsce 工具：
   ```bash
   npm install -g @vscode/vsce
   ```

2. 打包插件：
   ```bash
   vsce package
   ```

3. 在 VS Code 中安装生成的 `.vsix` 文件

## 使用方法

### 方式一：右键菜单

1. 在编辑器中选中要转换的中文文本
2. 右键点击，选择对应的转换命令：
   - **中文转大驼峰 (PascalCase)**
   - **中文转小驼峰 (camelCase)**
   - **中文转下划线 (snake_case)**
   - **中文转短横线 (kebab-case)**

### 方式二：快捷键

选中中文文本后，使用以下快捷键：

| 功能 | 快捷键 |
|------|--------|
| 大驼峰 | `Ctrl + Alt + P` |
| 小驼峰 | `Ctrl + Alt + C` |
| 下划线 | `Ctrl + Alt + S` |
| 短横线 | `Ctrl + Alt + K` |

### 方式三：命令面板

1. 按 `Ctrl + Shift + P` 打开命令面板
2. 输入 "中文转" 搜索命令
3. 选择需要的转换格式

## 配置选项

在 VS Code 设置中搜索 "中文转标识符" 可以配置以下选项：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `chineseToIdentifier.translationService` | 翻译服务选择 | `google` |
| `chineseToIdentifier.baiduAppId` | 百度翻译 API App ID | - |
| `chineseToIdentifier.baiduSecretKey` | 百度翻译 API Secret Key | - |
| `chineseToIdentifier.youdaoAppKey` | 有道翻译 API App Key | - |
| `chineseToIdentifier.youdaoAppSecret` | 有道翻译 API App Secret | - |

### 使用百度翻译

1. 访问 [百度翻译开放平台](https://fanyi-api.baidu.com/)
2. 注册并创建应用，获取 App ID 和 Secret Key
3. 在 VS Code 设置中填入相应的配置

### 使用有道翻译

1. 访问 [有道智云](https://ai.youdao.com/)
2. 注册并创建应用，获取 App Key 和 App Secret
3. 在 VS Code 设置中填入相应的配置

## 示例

| 中文原文 | 大驼峰 | 小驼峰 | 下划线 | 短横线 |
|----------|--------|--------|--------|--------|
| 用户名称 | UserName | userName | user_name | user-name |
| 商品列表 | ProductList | productList | product_list | product-list |
| 订单详情 | OrderDetail | orderDetail | order_detail | order-detail |
| 登录状态 | LoginStatus | loginStatus | login_status | login-status |

## 注意事项

- Google 翻译服务免费使用，但可能在某些网络环境下不稳定
- 如需稳定的翻译服务，建议配置百度或有道翻译 API
- 插件会自动检测选中文本是否包含中文，不包含中文则不会翻译

## 许可证

MIT License
