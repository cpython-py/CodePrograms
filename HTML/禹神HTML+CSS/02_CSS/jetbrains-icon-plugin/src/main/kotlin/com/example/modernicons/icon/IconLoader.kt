package com.example.modernicons.icon

import com.intellij.openapi.util.IconLoader
import javax.swing.Icon
import java.util.concurrent.ConcurrentHashMap

/**
 * 现代化图标加载器
 *
 * 负责加载和管理图标资源，提供缓存机制以提高性能。
 */
object ModernIconLoader {

    private val iconCache = ConcurrentHashMap<String, Icon>()

    /**
     * 根据文件扩展名获取图标
     *
     * @param extension 文件扩展名（不包含点）
     * @return 对应的图标，如果未找到则返回 null
     */
    fun getIconForExtension(extension: String): Icon? {
        // 检查缓存
        val cached = iconCache[extension]
        if (cached != null) {
            return cached
        }

        // 确定图标路径
        val iconPath = getIconPathForExtension(extension) ?: return null

        // 加载图标
        val icon = loadIcon(iconPath) ?: return null

        // 缓存图标
        iconCache[extension] = icon
        return icon
    }

    /**
     * 根据文件夹名称获取图标
     *
     * @param folderName 文件夹名称
     * @return 对应的图标，如果未找到则返回默认文件夹图标
     */
    fun getIconForFolder(folderName: String): Icon {
        // 标准化文件夹名称
        val normalizedName = folderName.lowercase()

        // 检查缓存
        val cached = iconCache["folder:$normalizedName"]
        if (cached != null) {
            return cached
        }

        // 确定图标路径
        val iconPath = getIconPathForFolder(normalizedName)

        // 加载图标
        val icon = loadIcon(iconPath) ?: loadIcon("/icons/folder/default.svg") ?: return com.intellij.icons.AllIcons.Nodes.Folder

        // 缓存图标
        iconCache["folder:$normalizedName"] = icon
        return icon
    }

    /**
     * 根据工具窗口 ID 获取图标
     *
     * @param toolWindowId 工具窗口 ID
     * @return 对应的图标，如果未找到则返回 null
     */
    fun getIconForToolWindow(toolWindowId: String): Icon? {
        // 检查缓存
        val cached = iconCache["toolwindow:$toolWindowId"]
        if (cached != null) {
            return cached
        }

        // 确定图标路径
        val iconPath = getIconPathForToolWindow(toolWindowId) ?: return null

        // 加载图标
        val icon = loadIcon(iconPath) ?: return null

        // 缓存图标
        iconCache["toolwindow:$toolWindowId"] = icon
        return icon
    }

    /**
     * 清除图标缓存
     */
    fun clearCache() {
        iconCache.clear()
    }

    /**
     * 根据文件扩展名确定图标路径
     */
    private fun getIconPathForExtension(extension: String): String? {
        // 扩展名到图标路径的映射
        val mapping = mapOf(
            // 编程语言
            "java" to "/icons/file/java.svg",
            "kt" to "/icons/file/kotlin.svg",
            "js" to "/icons/file/javascript.svg",
            "ts" to "/icons/file/typescript.svg",
            "py" to "/icons/file/python.svg",
            "go" to "/icons/file/go.svg",
            "rs" to "/icons/file/rust.svg",
            "cpp" to "/icons/file/cpp.svg",
            "c" to "/icons/file/c.svg",
            "h" to "/icons/file/h.svg",
            "swift" to "/icons/file/swift.svg",
            "php" to "/icons/file/php.svg",
            "rb" to "/icons/file/ruby.svg",
            "scala" to "/icons/file/scala.svg",

            // 配置文件
            "xml" to "/icons/file/xml.svg",
            "json" to "/icons/file/json.svg",
            "yaml" to "/icons/file/yaml.svg",
            "yml" to "/icons/file/yaml.svg",
            "properties" to "/icons/file/properties.svg",
            "ini" to "/icons/file/ini.svg",
            "toml" to "/icons/file/toml.svg",

            // 构建文件
            "gradle" to "/icons/file/gradle.svg",
            "pom" to "/icons/file/maven.svg",

            // 资源文件
            "html" to "/icons/file/html.svg",
            "htm" to "/icons/file/html.svg",
            "css" to "/icons/file/css.svg",
            "scss" to "/icons/file/scss.svg",
            "sass" to "/icons/file/sass.svg",
            "less" to "/icons/file/less.svg",
            "svg" to "/icons/file/svg.svg",
            "png" to "/icons/file/png.svg",
            "jpg" to "/icons/file/jpg.svg",
            "jpeg" to "/icons/file/jpg.svg",
            "gif" to "/icons/file/gif.svg",

            // 文档文件
            "md" to "/icons/file/markdown.svg",
            "txt" to "/icons/file/text.svg",
            "pdf" to "/icons/file/pdf.svg",

            // 特殊文件
            "dockerfile" to "/icons/file/docker.svg",
            "gitignore" to "/icons/file/git.svg",
            "env" to "/icons/file/env.svg",
        )

        return mapping[extension]
    }

    /**
     * 根据文件夹名称确定图标路径
     */
    private fun getIconPathForFolder(folderName: String): String {
        // 文件夹名称到图标路径的映射
        val mapping = mapOf(
            "src" to "/icons/folder/src.svg",
            "source" to "/icons/folder/src.svg",
            "sources" to "/icons/folder/src.svg",
            "test" to "/icons/folder/test.svg",
            "tests" to "/icons/folder/test.svg",
            "__test__" to "/icons/folder/test.svg",
            "resources" to "/icons/folder/resources.svg",
            "assets" to "/icons/folder/resources.svg",
            "static" to "/icons/folder/resources.svg",
            "config" to "/icons/folder/config.svg",
            "configuration" to "/icons/folder/config.svg",
            "conf" to "/icons/folder/config.svg",
            "docs" to "/icons/folder/docs.svg",
            "documentation" to "/icons/folder/docs.svg",
            "build" to "/icons/folder/build.svg",
            "target" to "/icons/folder/build.svg",
            "dist" to "/icons/folder/build.svg",
            "out" to "/icons/folder/build.svg",
            "bin" to "/icons/folder/bin.svg",
            "scripts" to "/icons/folder/bin.svg",
            "node_modules" to "/icons/folder/node_modules.svg",
        )

        return mapping[folderName] ?: "/icons/folder/default.svg"
    }

    /**
     * 根据工具窗口 ID 确定图标路径
     */
    private fun getIconPathForToolWindow(toolWindowId: String): String? {
        // 工具窗口 ID 到图标路径的映射
        val mapping = mapOf(
            "Project" to "/icons/toolwindow/project.svg",
            "Structure" to "/icons/toolwindow/structure.svg",
            "Commit" to "/icons/toolwindow/commit.svg",
            "TODO" to "/icons/toolwindow/todo.svg",
            "Terminal" to "/icons/toolwindow/terminal.svg",
            "Run" to "/icons/toolwindow/run.svg",
            "Debug" to "/icons/toolwindow/debug.svg",
            "Services" to "/icons/toolwindow/services.svg",
            "Database" to "/icons/toolwindow/database.svg",
        )

        return mapping[toolWindowId]
    }

    /**
     * 加载图标资源
     *
     * @param path 图标路径（相对于 classpath）
     * @return 加载的图标，如果加载失败则返回 null
     */
    private fun loadIcon(path: String): Icon? {
        return try {
            IconLoader.getIcon(path, ModernIconLoader::class.java)
        } catch (e: Exception) {
            // 记录日志（在实际项目中应使用日志框架）
            // println("Failed to load icon: $path, error: ${e.message}")
            null
        }
    }
}
