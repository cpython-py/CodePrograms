//
// Created by Administrator on 2026/3/1.
// 多个函数 一个文件中包含两个函数
#include <stdio.h>
void butler(void);  // 函数原型
int main(void){
    printf("I will summon the butler function.\n");
    butler();
    printf("Yes. Bring me some tea and writeable DVDs.\n");

    return 0;
}

// 函数开始定义
void butler(void){
    printf("You rang, sir?\n");
}