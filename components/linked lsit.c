#include<stdio.h>
#include<stdlib.h>
struct node{
       int data;
       struct node *next;
};
struct node *head = NULL;

void insertatbeg(int value)
{
                     struct node *newNode = (struct node *)malloc(sizeof(struct node));
                     newNode -> data = value;
                     newNode -> next = head;
                     head = newNode;
              }
void insertatend(int value)
{
 }
void insertatpos(int value,int pos)
{                                   
}
void delatbeg()
{
               }
void delatend()
{
               }
void delatpos()
{
               }
void display()
{
              struct node *temp = head;
              if(temp==NULL)
              {
                            printf("LIST IS EMPTY\n");
                            return;
                            }
                            while(temp!=NULL)
                            {
                                             printf("%d ->", temp -> data);
                                             temp=temp->next;
                                             }
                                             printf("NULL\n");
                                             }
                                          
int main()
{
          int choice, value, pos;
          printf("====linked list menu====\n");
          printf("1.insert at beg\n");
          printf("2.insert at end\n");
          printf("3.insert at pos\n");
          printf("4.del at beg\n");
          printf("5.del at end\n");
          printf("6.del at pos\n");
          printf("7.display\n");
          printf("8.exit\n");
          while(1)
          {
                  printf("enter the choice:");
                  scanf("%d", &choice);
                  switch(choice)
                  {
                                case 1:
                                       printf("enter the value");
                                       scanf("%d", &value);
                                       insertatbeg(value);
                                       break;
                                case 2:
                                       printf("enter the value");
                                       scanf("%d", &value);
                                       insertatend(value);
                                       break;
                                case 3:
                                       printf("enter the value,pos");
                                       scanf("%d%d", &value,&pos);
                                       insertatpos(value,pos);
                                       break;
                                case 4:
                                       delatbeg();   
                                       break;
                                 case 5:
                                        delatend();
                                        break;
                                 case 6:
                                        printf("enter the pos:");
                                        scanf("%d", &pos);
                                        delatpos(pos);
                                        break;
                                case 7:
                                       display();
                                       break;
                                case 8:
                                       exit(0);
                                       break;
                                default:
                                        printf("invalid choice");
                                        break;
                                 }
                            }
                       }
                                           
                                                 
                                       
                                              
