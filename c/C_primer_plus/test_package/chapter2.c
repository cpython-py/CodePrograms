//
// Created by Administrator on 2026/3/1.
//
#include <stdio.h>

int question1(void);
int question2(void);
int question3(void);
int question4(void);int jolly(void);int deny(void);
int question5(void);int br(void);int ic(void);
int question6(void);
int question7(void);int smile(void);
int question8(void);int one_three(void);int two(void);

int main(void){
        question1();
        question2();
        question3();
        question4();
        question5();
        question6();
        question7();
        printf("Starting now:\n");
        question8();
        printf("done!\n");
}

int question1(void){
    printf("Gustav Mahler\n");
    printf("Gustav\n");
    printf("Mahler\n");
    printf("Gustav ");
    printf("Mahler\n");

    return 0;
}

int question2(void){
    printf("Yuanhang Liu, Henan Province, Kaifeng Shi ,Tongxuxian\n");

    return 0;
}

int question3(void){
    int age = 17;
    int days = age * 365;
    printf("days: %d\n", days);

    return 0;
}

int question4(void){
    jolly();jolly();jolly();
    deny();

    return 0;
}

int jolly(void) {
    printf("For he's a jolly good fellow!\n");

    return 0;
}

int deny(void){
    printf("Which nobody can deny!\n");

    return 0;
}

int question5(void){
    br();printf(",");ic();printf("\n");
    ic();printf("\n");
    br();printf("\n");

    return 0;
}

int br(void){
    printf("Brazil, Russia");

    return 0;
}

int ic(void){
    printf("India, China");

    return 0;
}

int question6(void){
    int toes, toes_twice, toes_square;
    toes = 10;
    toes_twice = toes * 2;
    toes_square = toes * toes;

    printf("toes: %d, toes_twice: %d, toes_square: %d\n", toes, toes_twice, toes_square);

    return 0;
}

int question7(void){
    smile();smile();smile();printf("\n");
    smile();smile();printf("\n");
    smile();printf("\n");

    return 0;
}

int smile(void){
    printf("Smile!");

    return 0;
}

int question8(void){
    one_three();

    return 0;
}

int one_three(){
    printf("one\n");
    two();
    printf("three\n");

    return 0;
}

int two(void){
    printf("two\n");

    return  0;
}