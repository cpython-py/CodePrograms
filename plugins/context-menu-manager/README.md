# Context Menu Manager - 右键菜单管理器

[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)](package.json)

🎯 **功能强大且高度可自定义的VS Code右键菜单管理扩展**

## ✨ 核心功能

### 🎨 菜单项管理
- ✅ 动态添加、编辑、删除右键菜单项
- ✅ 支持编辑器右键菜单和资源管理器右键菜单
- ✅ 自定义菜单项图标（SVG图标支持）
- ✅ 设置快捷键绑定
- ✅ 菜单项分组和排序

### 🔍 智能条件显示
- ✅ 根据文件类型自动显示/隐藏菜单项
- ✅ 根据项目路径动态控制菜单项可见性
- ✅ 支持选中文本条件判断
- ✅ 工作区信任检查
- ✅ 文件数量限制条件

### 🛠️ 执行类型支持
- **VS Code命令**: 执行内置或扩展命令
- **脚本执行**: 运行自定义脚本
- **终端命令**: 在终端中执行命令
- **打开URL**: 在浏览器中打开链接

### 💾 配置管理
- ✅ 导出配置到JSON文件
- ✅ 从JSON文件导入配置
- ✅ 配置备份和恢复
- ✅ 重置为默认配置

### 🎯 可视化配置界面
- ✅ 友好的WebView配置面板
- ✅ 侧边栏菜单项列表视图
- ✅ 实时预览和测试功能
- ✅ 拖拽排序支持

## 📦 安装

### 从VS Code市场安装
1. 打开VS Code
2. 按 `Ctrl+Shift+X` 打开扩展面板
3. 搜索 "Context Menu Manager"
4. 点击安装

### 从源码安装
```bash
# 克隆仓库
git clone https://github.com/yourusername/context-menu-manager.git

# 进入项目目录
cd context-menu-manager

# 安装依赖
npm install

# 编译
npm run compile

# 打包
npm run package

# 安装.vsix文件
# 在VS Code中按 Ctrl+Shift+P，输入 "Install from VSIX"
```

## 🚀 快速开始

### 1. 打开配置面板
- 按 `Ctrl+Shift+P` 打开命令面板
- 输入 "打开右键菜单配置面板"
- 或点击左侧活动栏的菜单图标

### 2. 添加菜单项
1. 点击 "添加菜单项" 按钮
2. 填写基本信息：
   - **ID**: 唯一标识符（如：`myCustomCommand`）
   - **显示文本**: 菜单项显示的文本
   - **执行命令**: VS Code命令ID或脚本
   - **执行类型**: 选择命令类型
   - **图标**: 设置菜单图标

3. 配置显示条件（可选）：
   - 适用文件类型
   - 项目路径
   - 其他条件

4. 保存并测试

### 3. 使用菜单项
在编辑器或资源管理器中右键，即可看到自定义的菜单项！

## 📖 使用示例

### 示例1: 为JavaScript文件添加格式化菜单
```json
{
  "id": "formatJavaScript",
  "label": "格式化JS代码",
  "command": "editor.action.formatDocument",
  "type": "command",
  "icon": "$(code)",
  "fileTypes": [".js", ".jsx", ".ts", ".tsx"],
  "showInEditor": true,
  "showInExplorer": false,
  "shortcut": "Shift+Alt+F"
}
```

### 示例2: 在终端中运行Python脚本
```json
{
  "id": "runPythonScript",
  "label": "运行Python脚本",
  "command": "python ${file}",
  "type": "terminal",
  "icon": "$(play)",
  "fileTypes": [".py"],
  "showInEditor": true,
  "showInExplorer": true
}
```

### 示例3: 在浏览器中打开文档
```json
{
  "id": "openDocs",
  "label": "查看文档",
  "command": "https://docs.example.com/${languageId}",
  "type": "url",
  "icon": "$(book)",
  "showInEditor": true
}
```

### 示例4: 仅在选中代码时显示
```json
{
  "id": "searchSelectedCode",
  "label": "搜索选中代码",
  "command": "workbench.action.findInFiles",
  "type": "command",
  "icon": "$(search)",
  "conditions": {
    "hasSelection": true
  },
  "showInEditor": true
}
```

## ⚙️ 配置选项

### `contextMenuManager.items`
菜单项配置数组。

### `contextMenuManager.enableAutoHide`
根据文件类型自动隐藏不适用的菜单项。

**类型**: `boolean`  
**默认值**: `true`

### `contextMenuManager.showIcons`
在菜单项中显示图标。

**类型**: `boolean`  
**默认值**: `true`

### `contextMenuManager.theme`
菜单主题样式。

**可选值**: `default`, `dark`, `light`, `custom`  
**默认值**: `default`

## 🎨 自定义SVG图标

扩展支持在 `resources/icons` 目录中添加自定义SVG图标：

1. 创建SVG文件（推荐尺寸: 24x24）
2. 在菜单项配置中引用：
```json
{
  "iconPath": "resources/icons/custom-icon.svg"
}
```

### SVG图标设计建议
- 使用渐变和阴影增强视觉效果
- 保持图标简洁明了
- 使用白色或浅色图标（深色背景）
- 添加动画效果（可选）

## 🔧 开发指南

### 项目结构
```
context-menu-manager/
├── src/
│   ├── extension.ts           # 扩展入口
│   ├── contextMenuManager.ts  # 核心管理器
│   ├── configurationPanel.ts  # 配置面板
│   ├── menuItemsViewProvider.ts # 视图提供者
│   ├── types.ts               # 类型定义
│   └── utils.ts               # 工具函数
├── resources/
│   └── icons/                 # SVG图标
├── images/
│   └── icon.png               # 扩展图标
├── package.json               # 扩展清单
├── tsconfig.json              # TypeScript配置
└── README.md                  # 文档
```

### 本地开发
```bash
# 安装依赖
npm install

# 监听模式编译
npm run watch

# 运行测试
npm test

# 代码检查
npm run lint
```

### 调试扩展
1. 在VS Code中打开项目
2. 按 `F5` 启动调试
3. 这将打开一个新的扩展开发主机窗口
4. 进行测试和调试

## 📦 打包和发布

### 打包扩展

#### 1. 安装vsce工具
```bash
npm install -g @vscode/vsce
```

#### 2. 编译项目
```bash
npm run compile
```

#### 3. 打包为.vsix文件
```bash
vsce package
```

这将生成一个 `context-menu-manager-1.0.0.vsix` 文件。

#### 4. 本地测试
```bash
# 安装.vsix文件
code --install-extension context-menu-manager-1.0.0.vsix
```

### 发布到VS Code市场

#### 1. 创建Microsoft账号
访问 https://marketplace.visualstudio.com/ 并使用Microsoft账号登录

#### 2. 创建Personal Access Token (PAT)
1. 访问 https://dev.azure.com/
2. 点击用户设置 -> Personal access tokens
3. 创建新的Token：
   - 名称: `vsce-publish-token`
   - 组织: All accessible organizations
   - 过期时间: 90天（或更长）
   - 权限: 
     - Marketplace (Manage)
     - Marketplace (Publish)

#### 3. 登录vsce
```bash
vsce login <your-publisher-name>
```

输入你的PAT token。

#### 4. 发布扩展
```bash
# 首次发布
vsce publish

# 发布新版本
vsce publish 1.0.1

# 或使用npm脚本
npm run publish
```

#### 5. 发布预览版本
```bash
vsce publish --pre-release
```

### 自动化发布流程

#### GitHub Actions配置
创建 `.github/workflows/publish.yml`:

```yaml
name: Publish Extension

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - run: npm ci
      
      - run: npm run compile
      
      - name: Publish to VS Code Marketplace
        uses: HaaLeo/publish-vscode-extension@v1
        with:
          pat: ${{ secrets.VSCE_PAT }}
          registryUrl: https://marketplace.visualstudio.com
```

## 🐛 故障排除

### 扩展未激活
- 检查VS Code版本是否满足最低要求（^1.74.0）
- 查看扩展主机日志：`Help > Toggle Developer Tools`

### 菜单项不显示
- 确认菜单项已启用
- 检查文件类型条件是否匹配
- 查看输出面板的日志信息

### 配置未保存
- 检查工作区权限
- 确保有足够的磁盘空间
- 查看VS Code设置是否正确保存

### 图标不显示
- 确认SVG文件路径正确
- 检查SVG文件格式是否有效
- 尝试使用VS Code内置图标 `$(icon-name)`

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 提交Issue
- 描述问题的详细步骤
- 提供VS Code版本和扩展版本
- 附上相关日志或截图

### 提交Pull Request
1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 代码规范
- 使用TypeScript
- 遵循ESLint规则
- 添加必要的注释
- 编写单元测试

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有贡献者和VS Code团队！

---

**开发者**: Your Name  
**仓库**: [GitHub](https://github.com/yourusername/context-menu-manager)  
**问题反馈**: [Issues](https://github.com/yourusername/context-menu-manager/issues)  
**文档**: [Wiki](https://github.com/yourusername/context-menu-manager/wiki)
