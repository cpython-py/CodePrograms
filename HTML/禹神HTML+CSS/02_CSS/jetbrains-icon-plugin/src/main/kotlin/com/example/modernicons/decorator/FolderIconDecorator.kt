package com.example.modernicons.decorator

import com.example.modernicons.config.ModernIconsSettings
import com.example.modernicons.icon.ModernIconLoader
import com.intellij.ide.projectView.PresentationData
import com.intellij.ide.projectView.ProjectViewNode
import com.intellij.ide.projectView.ProjectViewNodeDecorator
import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.packageDependencies.ui.PackageDependenciesNode
import com.intellij.ui.ColoredTreeCellRenderer

/**
 * 文件夹图标装饰器
 *
 * 在项目视图中替换文件夹图标为现代化图标。
 */
class FolderIconDecorator : ProjectViewNodeDecorator {

    private val settings = ModernIconsSettings.getInstance()

    /**
     * 装饰项目视图节点
     */
    override fun decorate(node: ProjectViewNode<*>, data: PresentationData) {
        // 如果文件夹图标替换被禁用，直接返回
        if (!settings.enableFolderIcons) {
            return
        }

        val project = node.project ?: return
        val virtualFile = node.virtualFile ?: return

        // 只处理文件夹
        if (!virtualFile.isDirectory) {
            return
        }

        // 获取文件夹名称
        val folderName = virtualFile.name

        // 获取现代化图标
        val modernIcon = ModernIconLoader.getIconForFolder(folderName)

        // 如果找到了现代化图标，则替换
        if (modernIcon != null) {
            data.setIcon(modernIcon)
        }
    }

    /**
     * 装饰树形渲染器（可选实现）
     */
    override fun decorate(node: PackageDependenciesNode, cellRenderer: ColoredTreeCellRenderer) {
        // 包依赖节点不需要处理
    }
}
