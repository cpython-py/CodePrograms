# Modern Icons for JetBrains IDE

一个现代化图标插件，用于替换 JetBrains IDE 中的文件、文件夹和工具窗口图标。

## 功能特性

- **现代化文件图标**：为常见文件类型提供彩色扁平化图标
- **智能文件夹图标**：根据文件夹名称自动匹配图标（src, test, resources 等）
- **工具窗口图标**：替换 Project、Structure、Commit 等工具窗口图标
- **可配置**：通过设置界面启用/禁用各类图标替换
- **高性能**：图标缓存机制，不影响 IDE 性能

## 项目结构

```
modern-icons-plugin/
├── requirements.md              # 详细需求分析文档
├── project-structure.md         # 完整项目文件结构说明
├── build.gradle.kts             # Gradle 构建脚本
├── src/main/kotlin/             # Kotlin 源代码
│   └── com/example/modernicons/
│       ├── icon/                # 图标提供者
│       ├── decorator/           # 项目视图装饰器
│       ├── toolwindow/          # 工具窗口图标替换
│       └── config/              # 配置管理
├── src/main/resources/          # 资源文件
│   ├── META-INF/plugin.xml      # 插件配置文件
│   └── icons/                   # 图标资源（SVG格式）
└── README.md                    # 本文件
```

## 快速开始

### 环境要求
- JDK 17+
- IntelliJ IDEA 2023.3+ (用于开发)
- Gradle 8.6+

### 构建插件
```bash
./gradlew buildPlugin
```

构建后的插件文件位于 `build/distributions/modern-icons-plugin-*.zip`

### 运行测试
```bash
./gradlew test
```

### 在 IDE 中运行插件
```bash
./gradlew runIde
```

这将启动一个安装了本插件的 IntelliJ IDEA 实例。

## 配置说明

插件安装后，可以在以下位置找到配置选项：
- **Settings/Preferences** → **Appearance & Behavior** → **Modern Icons**

配置选项包括：
- 启用/禁用文件图标替换
- 启用/禁用文件夹图标替换
- 启用/禁用工具窗口图标替换
- 图标饱和度调节

## 开发指南

### 添加新文件图标
1. 在 `src/main/resources/icons/file/` 目录下添加 SVG 图标文件
2. 在 `ModernIconLoader.kt` 的 `getIconPathForExtension` 方法中添加扩展名映射
3. 图标命名规范：`{file-extension}.svg`（如 `java.svg`）

### 添加新文件夹图标
1. 在 `src/main/resources/icons/folder/` 目录下添加 SVG 图标文件
2. 在 `ModernIconLoader.kt` 的 `getIconPathForFolder` 方法中添加文件夹名称映射

### 添加新工具窗口图标
1. 在 `src/main/resources/icons/toolwindow/` 目录下添加 SVG 图标文件
2. 在 `ModernIconLoader.kt` 的 `getIconPathForToolWindow` 方法中添加工具窗口 ID 映射

## 图标设计规范

- **尺寸**：16x16 像素（基础），32x32（高DPI）
- **格式**：SVG（矢量图）
- **风格**：扁平化、简约、彩色
- **颜色**：使用 Material Design 调色板
- **一致性**：保持图标风格统一

## 性能优化

- **图标缓存**：避免重复加载图标文件
- **懒加载**：仅在需要时加载图标资源
- **内存管理**：及时释放不再使用的图标

## 兼容性

- **支持 IDE**：IntelliJ IDEA、PyCharm、WebStorm、Android Studio 等
- **最低版本**：2022.3+
- **依赖**：仅依赖 IntelliJ Platform 核心模块

## 许可证

本项目采用 MIT 许可证。详见 LICENSE 文件。

## 贡献指南

1. Fork 本项目
2. 创建功能分支
3. 提交更改
4. 推送分支并创建 Pull Request

## 问题反馈

如果您遇到任何问题或有改进建议，请通过以下方式反馈：
- 在 GitHub 仓库创建 Issue
- 发送邮件至 support@example.com

---

*项目版本：1.0.0*
*最后更新：2025-03-24*