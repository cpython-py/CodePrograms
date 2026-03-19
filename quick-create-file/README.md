# Quick Create File 🚀

一个强大的 VSCode 插件，让你通过右键菜单快速创建各种编程语言文件。

## 功能特性

- ✅ **智能识别**: 根据右键点击的文件类型自动推荐相应的语言
- ✅ **多种语言支持**: 支持 25+ 种主流编程语言
- ✅ **自动扩展名**: 只需输入文件名，自动添加正确的扩展名
- ✅ **代码模板**: 自动生成基础代码模板
- ✅ **文件覆盖检测**: 检测文件是否已存在，避免误操作

## 支持的语言

| 语言 | 扩展名 | 语言 | 扩展名 |
|------|--------|------|--------|
| HTML | .html, .htm | CSS | .css |
| JavaScript | .js | TypeScript | .ts |
| React (JSX) | .jsx | React (TSX) | .tsx |
| Vue | .vue | PHP | .php |
| Java | .java | C | .c |
| C++ | .cpp, .cc, .cxx | C# | .cs |
| Python | .py | Go | .go |
| Rust | .rs | Markdown | .md |
| JSON | .json | XML | .xml |
| SQL | .sql | Shell | .sh |
| YAML | .yml, .yaml | Sass/SCSS | .scss, .sass |
| Less | .less | Dart | .dart |
| Kotlin | .kt | Swift | .swift |
| Ruby | .rb | Lua | .lua |
| R | .r |

## 使用方法

### 方式一：智能创建

1. 在文件资源管理器中右键点击文件或文件夹
2. 选择 **"Quick Create File (智能创建)"**
3. 选择要创建的文件类型
4. 输入文件名（无需输入扩展名）
5. 文件将自动创建并打开

### 方式二：指定扩展名

1. 在文件资源管理器中右键点击文件或文件夹
2. 选择 **"Quick Create File With Extension (指定扩展名)"**
3. 输入完整文件名（包含扩展名）
4. 文件将自动创建并打开

## 安装

### 从源码安装

1. 克隆或下载本项目
2. 在项目目录下运行：
   ```bash
   npm install
   npm run compile
   ```
3. 按 `F5` 启动调试，或打包后安装

### 打包安装

```bash
npm install -g @vscode/vsce
vsce package
# 生成 .vsix 文件，在 VSCode 中手动安装
```

## 配置选项

在 `settings.json` 中可配置：

```json
{
  "quickCreateFile.defaultLanguage": "javascript",
  "quickCreateFile.showExtensionInInput": true
}
```

## 示例

### 创建 Python 文件
1. 右键点击文件夹
2. 选择 "Quick Create File (智能创建)"
3. 选择 "🐍 Python"
4. 输入 "main"
5. 自动创建 `main.py` 并生成模板

### 创建 Vue 组件
1. 右键点击文件夹
2. 选择 "Quick Create File (智能创建)"
3. 选择 "💚 Vue"
4. 输入 "UserProfile"
5. 自动创建 `UserProfile.vue` 并生成组件模板

## 许可证

MIT License
