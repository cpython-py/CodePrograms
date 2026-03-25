package com.example.modernicons.icon

import com.example.modernicons.config.ModernIconsSettings
import com.intellij.ide.FileIconProvider
import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.psi.PsiElement
import javax.swing.Icon

/**
 * 提供现代化文件图标的 IconProvider 实现
 *
 * 根据文件扩展名和类型返回相应的现代化图标。
 * 如果找不到对应图标，则返回 null，让其他 IconProvider 处理。
 */
class FileIconProvider : FileIconProvider {

    private val settings = ModernIconsSettings.getInstance()

    /**
     * 获取文件图标
     *
     * @param file 虚拟文件
     * @param flags 图标标志
     * @param project 当前项目
     * @return 对应的图标，如果没有则返回 null
     */
    override fun getIcon(file: VirtualFile, flags: Int, project: Project?): Icon? {
        // 如果文件图标替换被禁用，返回 null
        if (!settings.enableFileIcons) {
            return null
        }

        // 如果是文件夹，返回 null（由 FolderIconDecorator 处理）
        if (file.isDirectory) {
            return null
        }

        // 获取文件扩展名
        val extension = file.extension?.lowercase() ?: return null

        // 查找对应的图标
        return ModernIconLoader.getIconForExtension(extension)
    }

    /**
     * 获取 PSI 元素图标（可选实现）
     */
    override fun getIcon(element: PsiElement, flags: Int): Icon? {
        // 默认使用文件图标
        val virtualFile = element.containingFile?.virtualFile ?: return null
        return getIcon(virtualFile, flags, element.project)
    }
}
