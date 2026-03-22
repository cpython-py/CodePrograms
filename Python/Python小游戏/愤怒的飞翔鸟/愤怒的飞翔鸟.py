import pygame  #导入一些模块如pygame
import sys
from pygame.locals import *
from random import randint

pygame.init()  #初始化
pygame.mixer.init()
pygame.mixer.music.load('背景音乐.mp3')
pygame.mixer.music.set_volume(0.2)
pygame.mixer.music.play(loops=-1)

bg = pygame.image.load('愤怒的小鸟背景图2.jpg')   #加载背景图片
bg_position = bg.get_rect()  #获取图片位置

size = width, height = 1000, 570
screen = pygame.display.set_mode(size)  #设置一个窗口
pygame.display.set_caption('愤怒的小鸟！')  #设置窗口的标题
  #两种方法
def main():  #main方法
    class Bird(pygame.sprite.Sprite):  #调用鸟类
        def __init__(self):  #控制模块，控制鸟的上下左右移动
            pygame.sprite.Sprite.__init__(self)
            position=100,100
            self.image=pygame.image.load('愤怒的小鸟里的小鸟.png')
            self.rect=self.image.get_rect()
            self.rect.center=position
        def move_left(self):
            self.speed=[-5,0]
            if self.rect.left<=0:
                self.rect.left=0
            else:
                self.rect=self.rect.move(self.speed)
        def move_right(self):
            self.speed=[5,0]
            if self.rect.right>=1000:
                self.rect.right=1000
            else:
                self.rect=self.rect.move(self.speed)
        def move_up(self):
            self.speed=[0,-5]
            if self.rect.top<=0:
                self.rect.top=0
            else:
                self.rect=self.rect.move(self.speed)
        def move_down(self):
            self.speed=[0,5]
            if self.rect.bottom>=570:
                self.rect.bottom=570
            else:
                self.rect=self.rect.move(self.speed)

    class Pig(pygame.sprite.Sprite):  #调用猪类
        def __init__(self):  #使小猪随机出现
            pygame.sprite.Sprite.__init__(self)
            y=randint(0,570)
            position=[1000,y]

            self.image=pygame.image.load('愤怒的小鸟里的小猪.png')  #加载小猪图片
            self.rect=self.image.get_rect()
            self.rect.center=position

            self.speed=[-4,0]

        def move(self):
            self.rect=self.rect.move(self.speed)


    bird=Bird()

    i=0
    group=pygame.sprite.Group()

    state=True  #一开始等于true

    while state:  #while true的循环
        for event in pygame.event.get():  #使用pygame里的功能
            if event.type == pygame.QUIT:
                sys.exit()

        key=pygame.key.get_pressed()  #获取键盘的输入，控制鸟的上下左右移动
        if key[K_LEFT]:
            bird.move_left()
        if key[K_RIGHT]:
            bird.move_right()
        if key[K_UP]:
            bird.move_up()
        if key[K_DOWN]:
            bird.move_down()

        screen.blit(bg, bg_position)  #屏幕刷新
        screen.blit(bird.image,bird.rect)

        i=i+1  #识别化小猪
        if i%10==0:
            pig=Pig()
            group.add(pig)  #把猪加入组进行循环
        for p in group.sprites():
            p.move()
            screen.blit(p.image,p.rect)
            if pygame.sprite.collide_mask(bird,p):  #如果发生碰撞，如下就会改为false
                state=False  #经过某些判断变为false（发生碰撞时）
                pause()  #改为false后调用pause方法

        pygame.display.flip()
        pygame.time.Clock().tick(60)


def pause():
    bg_go = pygame.image.load('愤怒的小鸟gameover图.jpg')  #把结束图片加载出来了
    bg_go_pos = bg_go.get_rect()
    size = width, height = 1000, 570
    screen = pygame.display.set_mode(size)
    pygame.display.set_caption('GameOver!')
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                sys.exit()
        img_src=pygame.image.load('重玩按钮.jpg')  #设置一个重玩按钮
        img_src_pos=img_src.get_rect()

        mouse_press=pygame.mouse.get_pressed()
        mouse_pos=pygame.mouse.get_pos()

        left=img_src_pos.left
        right=img_src_pos.right
        top=img_src_pos.top
        bottom=img_src_pos.bottom

        if left+100<mouse_pos[0]<right+100 and top+185<mouse_pos[1]<bottom+185:
            img_src=pygame.image.load('重玩按钮2.jpg')   #如果点击重玩按钮则从新调用main方法
            if mouse_press[0]:
                main()

        img_src_pos = img_src.get_rect().center = 100, 185
        screen.blit(bg_go, bg_go_pos)
        screen.blit(img_src,img_src_pos)
        pygame.display.flip()

main()