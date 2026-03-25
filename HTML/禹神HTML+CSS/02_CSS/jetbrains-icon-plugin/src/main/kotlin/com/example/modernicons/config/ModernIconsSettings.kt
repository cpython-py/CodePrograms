package com.example.modernicons.config

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.PersistentStateComponent
import com.intellij.openapi.components.State
import com.intellij.openapi.components.Storage
import com.intellij.util.xmlb.XmlSerializerUtil

/**
 * 现代化图标插件设置
 *
 * 使用 PersistentStateComponent 持久化用户配置。
 */
@State(
    name = "ModernIconsSettings",
    storages = [Storage("modern-icons-settings.xml")]
)
class ModernIconsSettings : PersistentStateComponent<ModernIconsSettings> {

    // 是否启用文件图标替换
    var enableFileIcons: Boolean = true

    // 是否启用文件夹图标替换
    var enableFolderIcons: Boolean = true

    // 是否启用工具窗口图标替换
    var enableToolWindowIcons: Boolean = true

    // 图标主题（预留）
    var iconTheme: String = "default"

    // 图标饱和度（0.0 - 2.0）
    var iconSaturation: Double = 1.0

    // 自定义文件夹映射（预留）
    var customFolderMappings: Map<String, String> = emptyMap()

    /**
     * 获取设置实例
     */
    companion object {
        fun getInstance(): ModernIconsSettings {
            return ApplicationManager.getApplication().getService(ModernIconsSettings::class.java)
        }
    }

    /**
     * 获取状态（用于持久化）
     */
    override fun getState(): ModernIconsSettings {
        return this
    }

    /**
     * 加载状态（从持久化存储）
     */
    override fun loadState(state: ModernIconsSettings) {
        XmlSerializerUtil.copyBean(state, this)
    }

    /**
     * 检查是否有任何图标替换被启用
     */
    fun isAnyIconEnabled(): Boolean {
        return enableFileIcons || enableFolderIcons || enableToolWindowIcons
    }
}
