package com.example.modernicons.config

import com.intellij.openapi.options.Configurable
import com.intellij.openapi.options.ConfigurationException
import com.intellij.ui.components.JBCheckBox
import com.intellij.ui.components.JBLabel
import com.intellij.ui.components.JBPanel
import com.intellij.ui.components.JBSlider
import com.intellij.util.ui.FormBuilder
import javax.swing.JComponent
import javax.swing.JPanel

/**
 * 现代化图标插件配置界面
 */
class ModernIconsConfigurable : Configurable {

    private lateinit var enableFileIconsCheckBox: JBCheckBox
    private lateinit var enableFolderIconsCheckBox: JBCheckBox
    private lateinit var enableToolWindowIconsCheckBox: JBCheckBox
    private lateinit var iconSaturationSlider: JBSlider

    private var settings: ModernIconsSettings = ModernIconsSettings.getInstance()

    /**
     * 配置显示名称
     */
    override fun getDisplayName(): String {
        return "Modern Icons"
    }

    /**
     * 创建配置面板
     */
    override fun createComponent(): JComponent {
        // 初始化组件
        enableFileIconsCheckBox = JBCheckBox("Enable file icons", settings.enableFileIcons)
        enableFolderIconsCheckBox = JBCheckBox("Enable folder icons", settings.enableFolderIcons)
        enableToolWindowIconsCheckBox = JBCheckBox("Enable tool window icons", settings.enableToolWindowIcons)

        // 饱和度滑块 (0-200 对应 0.0-2.0)
        iconSaturationSlider = JBSlider(0, 200, (settings.iconSaturation * 100).toInt())
        iconSaturationSlider.paintTicks = true
        iconSaturationSlider.majorTickSpacing = 50
        iconSaturationSlider.minorTickSpacing = 10
        iconSaturationSlider.paintLabels = true

        // 构建表单
        return FormBuilder.createFormBuilder()
            .addComponent(enableFileIconsCheckBox)
            .addComponent(enableFolderIconsCheckBox)
            .addComponent(enableToolWindowIconsCheckBox)
            .addLabeledComponent("Icon saturation:", iconSaturationSlider)
            .addComponentFillVertically(JBPanel(), 0)
            .panel
    }

    /**
     * 检查配置是否已修改
     */
    override fun isModified(): Boolean {
        return enableFileIconsCheckBox.isSelected != settings.enableFileIcons ||
                enableFolderIconsCheckBox.isSelected != settings.enableFolderIcons ||
                enableToolWindowIconsCheckBox.isSelected != settings.enableToolWindowIcons ||
                (iconSaturationSlider.value / 100.0) != settings.iconSaturation
    }

    /**
     * 应用配置
     */
    @Throws(ConfigurationException::class)
    override fun apply() {
        settings.enableFileIcons = enableFileIconsCheckBox.isSelected
        settings.enableFolderIcons = enableFolderIconsCheckBox.isSelected
        settings.enableToolWindowIcons = enableToolWindowIconsCheckBox.isSelected
        settings.iconSaturation = iconSaturationSlider.value / 100.0

        // 通知图标加载器清除缓存（如果需要）
        // ModernIconLoader.clearCache()

        // 可以在这里触发图标重载
        // 实际实现中可能需要重新加载项目视图
    }

    /**
     * 重置配置为默认值
     */
    override fun reset() {
        enableFileIconsCheckBox.isSelected = settings.enableFileIcons
        enableFolderIconsCheckBox.isSelected = settings.enableFolderIcons
        enableToolWindowIconsCheckBox.isSelected = settings.enableToolWindowIcons
        iconSaturationSlider.value = (settings.iconSaturation * 100).toInt()
    }

    /**
     * 配置取消时调用（可选）
     */
    override fun cancel() {
        // 不需要特殊处理
    }
}
