#include<stdio.h>
#include<stdlib.h>
#define MAX 5
int queue[MAX];
int front =-1;
int rear =-1;
void enqueue(int value){
    if(front>0){
        for(int i=front;i<=rear;i++){
            queue[i-front]=queue[i];
        }
        rear=rear-front;
        front=0;
    }
    else if(rear==MAX-1){
        printf("queue is overflow\n");
        return;
    }
    if(front==-1){
        front++;
    }
    rear++;
    queue[rear]=value;
}
void dequeue(){
 if(front==-1){
    printf("queue is empty \n");
    return;
 }
 printf("the dequeued element is %d", queue[front]);
 if(front == rear){
    front=rear=-1;
 }
 else{
    front++;
 }
 }
void peek(){
    if(front==-1){
        printf("queue is empty\n");
        return;
    }
    printf("the front element is %d\n", queue[front]);
}
void display(){
    if (front==-1){
        printf("queue is empty\n");
    }
    for(int i=front; i<=rear;i++){
        printf("%d", queue[i]);
    }
    printf("\n");
}

int main(){
    int choice,value;
    printf("====QUEUES USING ARRAYS====\n");
    printf("1.enqueue, 2.dequeue, 3.peek ,4.dislay, 5.exit\n");
    while(1){
        printf("enter a choice\n");
        scanf("%d", &choice);
        switch(choice){
            case 1:
              printf("enter the value:\n");
              scanf("%d", &value);
              enqueue(value);
            case 2:
               dequeue();
               break;
            case 3:
               peek();
               break;
            case 4:
               display();
                break;
            case 5:
              exit(0);
            default:
              printf("invalid choice..\n");
        }
    }
}