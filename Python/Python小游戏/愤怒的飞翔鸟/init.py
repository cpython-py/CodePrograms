import pygame
# 初始化pygame
pygame.init()
pygame.mixer.init()  # 初始化音频
pygame.mixer.music.load("背景音乐.mp3")  # 加载背景音乐
pygame.mixer.music.set_volume(0.2)  # 设置音量大小
pygame.mixer.music.play(loops=-1)  # 设置循环播放

bg = pygame.image.load("愤怒的小鸟背景图2.jpg")
bg_position = bg.get_rect()

# 设置窗口宽和高
size = width, height = 1000, 570
screen = pygame.display.set_mode(size)
# 设置窗口标题
pygame.display.set_caption("愤怒的飞翔鸟")