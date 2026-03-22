import pygame
import sys

def pause():
    bg_go = pygame.image.load("愤怒的小鸟gameover图.jpg")
    bg_go_pos = bg_go.get_rect()
    size = width, height = 1000, 570
    screen = pygame.display.set_mode(size)
    pygame.display.set_caption("GameOver")

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                sys.exit()
        img_src = pygame.image.load("重玩按钮.jpg")
        img_src_pos = img_src.get_rect()
        mouse_press = pygame.mouse.get_pressed()
        mouse_pos = pygame.mouse.get_pos()

        left = img_src_pos.left
        right = img_src_pos.right
        top = img_src_pos.top
        bottom = img_src_pos.bottom

        if left + 100 < mouse_pos[0] < right + 100 and top + 185 < mouse_pos[1] < bottom + 185:
            img_src = pygame.image.load("重玩按钮2.jpg")
            if mouse_press[0]:
                main()

        img_src_pos = img_src.get_rect().center = 100, 185
        screen.blit(bg_go, bg_go_pos)
        screen.blit(img_src, img_src_pos)
        pygame.display.flip()