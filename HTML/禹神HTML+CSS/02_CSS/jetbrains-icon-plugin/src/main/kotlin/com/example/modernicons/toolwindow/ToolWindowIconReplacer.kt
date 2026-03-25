package com.example.modernicons.toolwindow

import com.example.modernicons.config.ModernIconsSettings
import com.example.modernicons.icon.ModernIconLoader
import com.intellij.openapi.project.Project
import com.intellij.openapi.startup.StartupActivity
import com.intellij.openapi.wm.ToolWindowManager
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.application.ModalityState

/**
 * 工具窗口图标替换器
 *
 * 在项目启动后替换工具窗口的图标为现代化图标。
 */
class ToolWindowIconReplacer : StartupActivity.DumbAware {

    private val settings = ModernIconsSettings.getInstance()

    /**
     * 项目打开时执行
     */
    override fun runActivity(project: Project) {
        // 如果工具窗口图标替换被禁用，直接返回
        if (!settings.enableToolWindowIcons) {
            return
        }

        // 在 IDE 初始化完成后延迟执行
        ApplicationManager.getApplication().invokeLater({
            replaceToolWindowIcons(project)
        }, ModalityState.any())
    }

    /**
     * 替换所有工具窗口的图标
     */
    private fun replaceToolWindowIcons(project: Project) {
        val toolWindowManager = ToolWindowManager.getInstance(project)
        val toolWindowIds = toolWindowManager.toolWindowIds

        for (toolWindowId in toolWindowIds) {
            replaceToolWindowIcon(project, toolWindowId)
        }
    }

    /**
     * 替换单个工具窗口的图标
     */
    private fun replaceToolWindowIcon(project: Project, toolWindowId: String) {
        val toolWindowManager = ToolWindowManager.getInstance(project)
        val toolWindow = toolWindowManager.getToolWindow(toolWindowId) ?: return

        // 获取现代化图标
        val modernIcon = ModernIconLoader.getIconForToolWindow(toolWindowId) ?: return

        // 设置新图标
        toolWindow.setIcon(modernIcon)
    }
}
