# JetBrains 现代化图标插件项目结构

## 总体结构

```
modern-icons-plugin/
├── build.gradle.kts                    # Gradle 构建脚本 (Kotlin DSL)
├── settings.gradle.kts                 # Gradle 设置文件
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar          # Gradle Wrapper JAR
│       └── gradle-wrapper.properties   # Gradle Wrapper 配置
├── gradlew                             # Unix/Linux 启动脚本
├── gradlew.bat                         # Windows 启动脚本
├── src/
│   ├── main/
│   │   ├── kotlin/                     # Kotlin 源代码
│   │   │   └── com/example/modernicons/
│   │   │       ├── icon/               # 图标提供者相关类
│   │   │       │   ├── FileIconProvider.kt
│   │   │       │   ├── FolderIconProvider.kt
│   │   │       │   └── IconLoader.kt
│   │   │       ├── decorator/          # 项目视图装饰器
│   │   │       │   └── FolderIconDecorator.kt
│   │   │       ├── toolwindow/         # 工具窗口图标替换
│   │   │       │   └── ToolWindowIconReplacer.kt
│   │   │       ├── config/             # 配置管理
│   │   │       │   ├── ModernIconsConfigurable.kt
│   │   │       │   ├── ModernIconsSettings.kt
│   │   │       │   └── IconMapping.kt
│   │   │       └── cache/              # 图标缓存
│   │   │           └── IconCache.kt
│   │   └── resources/
│   │       ├── META-INF/
│   │       │   └── plugin.xml          # 插件配置文件
│   │       └── icons/                  # 图标资源文件
│   │           ├── file/               # 文件图标
│   │           │   ├── java.svg
│   │           │   ├── kotlin.svg
│   │           │   ├── javascript.svg
│   │           │   ├── typescript.svg
│   │           │   ├── python.svg
│   │           │   ├── xml.svg
│   │           │   ├── json.svg
│   │           │   ├── yaml.svg
│   │           │   └── ...
│   │           ├── folder/             # 文件夹图标
│   │           │   ├── default.svg
│   │           │   ├── src.svg
│   │           │   ├── test.svg
│   │           │   ├── resources.svg
│   │           │   ├── config.svg
│   │           │   ├── docs.svg
│   │           │   └── ...
│   │           └── toolwindow/         # 工具窗口图标
│   │               ├── project.svg
│   │               ├── structure.svg
│   │               ├── commit.svg
│   │               ├── terminal.svg
│   │               └── ...
│   └── test/
│       ├── kotlin/                     # 单元测试
│       │   └── com/example/modernicons/
│       │       ├── icon/
│       │       │   └── FileIconProviderTest.kt
│       │       └── config/
│       │           └── ModernIconsSettingsTest.kt
│       └── resources/                  # 测试资源
└── .run/                               # IntelliJ 运行配置
    └── Run Plugin.run.xml
```

## 文件详细说明

### 1. 构建配置文件

#### `build.gradle.kts`
- Gradle Kotlin DSL 构建脚本
- 配置 IntelliJ 插件开发相关插件和依赖
- 定义插件版本、兼容性范围
- 配置发布到 JetBrains 市场的任务

#### `settings.gradle.kts`
- 定义项目名称和模块结构
- 插件管理仓库配置

#### `gradle/wrapper/`
- Gradle Wrapper 文件，确保团队使用一致的 Gradle 版本

### 2. 源代码结构

#### `src/main/kotlin/com/example/modernicons/`
- **`icon/`** - 图标提供者核心逻辑
  - `FileIconProvider.kt` - 实现 `IconProvider` 接口，为文件提供图标
  - `FolderIconProvider.kt` - 为文件夹提供图标（可选，可通过装饰器实现）
  - `IconLoader.kt` - 图标资源加载器，支持缓存和多分辨率

- **`decorator/`** - 项目视图装饰器
  - `FolderIconDecorator.kt` - 实现 `ProjectViewNodeDecorator`，替换文件夹图标

- **`toolwindow/`** - 工具窗口图标替换
  - `ToolWindowIconReplacer.kt` - 替换工具窗口图标，通过扩展点或直接修改

- **`config/`** - 配置管理
  - `ModernIconsConfigurable.kt` - 实现 `Configurable` 接口，提供设置界面
  - `ModernIconsSettings.kt` - 插件设置持久化管理
  - `IconMapping.kt` - 定义文件扩展名/文件夹名到图标资源的映射

- **`cache/`** - 图标缓存
  - `IconCache.kt` - 图标缓存实现，提高性能

#### `src/main/resources/`
- **`META-INF/plugin.xml`** - 插件元数据文件
  - 定义插件 ID、名称、描述
  - 声明扩展点和依赖
  - 配置兼容的 IDE 版本

- **`icons/`** - 图标资源目录
  - `file/` - 文件图标，按文件扩展名命名
  - `folder/` - 文件夹图标，按文件夹名称命名
  - `toolwindow/` - 工具窗口图标
  - 支持 SVG（推荐）和 PNG 格式
  - 多分辨率：`icon.svg`，`icon@2x.svg`

### 3. 测试代码

#### `src/test/kotlin/`
- 单元测试，确保图标提供逻辑正确
- 配置管理测试
- 图标缓存测试

### 4. 开发配置

#### `.run/`
- IntelliJ IDEA 运行配置
- 方便调试插件

## 图标资源设计原则

### 文件图标
- **尺寸**：16x16（基础），32x32（高DPI）
- **风格**：扁平化、简约、彩色
- **命名**：`{file-extension}.svg`（如 `java.svg`）
- **特殊文件**：`Dockerfile.svg`，`gitignore.svg`

### 文件夹图标
- **基础图标**：`default.svg`
- **匹配规则**：
  - `src/`，`source/` → `src.svg`
  - `test/`，`tests/` → `test.svg`
  - `resources/`，`assets/` → `resources.svg`
  - `config/`，`conf/` → `config.svg`
  - `docs/` → `docs.svg`
  - `build/`，`target/` → `build.svg`

### 工具窗口图标
- **尺寸**：13x13（工具窗口默认尺寸）
- **匹配**：`project.svg`，`structure.svg` 等
- **主题适配**：亮色/暗色主题版本

## 构建和开发流程

1. **环境准备**：安装 JDK 17+，IntelliJ IDEA
2. **导入项目**：打开 `modern-icons-plugin` 目录
3. **运行插件**：使用 Gradle 任务 `runIde` 或 IntelliJ 运行配置
4. **测试**：运行单元测试，手动测试图标显示
5. **打包**：使用 `buildPlugin` 任务生成 `*.zip` 分发文件
6. **发布**：配置证书后使用 `publishPlugin` 发布到市场

## 扩展点说明

插件主要使用以下 IntelliJ Platform 扩展点：

1. **`com.intellij.iconProvider`** - 文件图标提供者
2. **`com.intellij.projectViewNodeDecorator`** - 项目视图节点装饰器
3. **`com.intellij.toolWindowFactory`** - 工具窗口工厂（可选）
4. **`com.intellij.applicationConfigurable`** - 设置界面配置

## 性能考虑

- **图标缓存**：避免重复加载图标文件
- **懒加载**：仅在需要时加载图标资源
- **内存管理**：及时释放不再使用的图标
- **异步加载**：避免阻塞 UI 线程

---

*文档版本：1.0*
*最后更新：2025-03-24*