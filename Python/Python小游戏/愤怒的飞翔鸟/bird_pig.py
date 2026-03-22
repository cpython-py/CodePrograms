import pygame
from random import randint

class Bird(pygame.sprite.Sprite):
    """定义小鸟类"""

    def __init__(self):
        """控制模块,控制鸟的上下移动"""
        pygame.sprite.Sprite.__init__(self)
        position = 100, 100
        self.image = pygame.image.load("愤怒的小鸟里的小鸟.png")
        self.rect = self.image.get_rect()
        self.rect.center = position

    # 小鸟移动方法
    def move_left(self):
        self.speed = [-5, 0]
        if self.rect.left <= 0:
            self.rect.left = 0
        else:
            self.rect = self.rect.move(self.speed)

    def move_right(self):
        self.speed = [5, 0]
        if self.rect.right >= 1000:
            self.rect.right = 1000
        else:
            self.rect = self.rect.move(self.speed)

    def move_up(self):
        self.speed = [0, -5]
        if self.rect.top <= 0:
            self.rect.top = 0
        else:
            self.rect = self.rect.move(self.speed)

    def move_down(self):
        self.speed = [0, 5]
        if self.rect.bottom >= 600:
            self.rect.bottom = 600
        else:
            self.rect = self.rect.move(self.speed)

class Pig(pygame.sprite.Sprite):
    """定义小猪类"""
    def __init__(self):
        pygame.sprite.Sprite.__init__(self)
        y = randint(0, 570)
        position = 1000, y
        self.image = pygame.image.load("愤怒的小鸟里的小猪.png")
        self.rect = self.image.get_rect()
        self.rect.center = position
        self.speed = [-4, 0]

    def move(self):
        self.rect = self.rect.move(self.speed)