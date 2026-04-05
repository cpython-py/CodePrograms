import sys
import os
from PyQt5.QtWidgets import QApplication, QWidget

# 设置 Qt 插件路径
plugin_path = r"D:\编程类\Python解释器\python3.8\Lib\site-packages\PyQt5\Qt5\plugins"
os.environ['QT_QPA_PLATFORM_PLUGIN_PATH'] = plugin_path

if __name__ == "__main__":
    # NOTE - 创建QApplication实例
    app = QApplication(sys.argv)
    # 创建一个窗口
    w = QWidget()
    # 设置窗口大小
    w.resize(300, 150)
    # 窗口移动
    w.move(300, 300)
    # 窗口标题
    w.setWindowTitle("第一个基于PyQt5的桌面应用")
    # 显示窗口
    w.show()
    
    # 进入程序主循环,确保安全结束
    sys.exit(app.exec_())
