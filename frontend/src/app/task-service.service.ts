import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Task } from './models/task_model';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(private webReqService: WebRequestService) { }
  
  
  getLists(){
    return this.webReqService.get('lists');
  }

  createList(title: string){
    // we want to send a webrequest to create a list
    return this.webReqService.post('lists', { title });
  }
  updateList(listId: string, title: string){
    // we want to send a webrequest to create a list
    return this.webReqService.patch(`lists/${listId}`, { title });
  }
  deleteList(listId: string){
    return this.webReqService.delete(`lists/${listId}`)
  }

  getTasks(listId: string){
    return this.webReqService.get(`lists/${listId}/tasks`);
  }
  createTask(title: string, listId: string){
    // we want to send a webrequest to create a task
    return this.webReqService.post(`lists/${listId}/tasks`, { title });
  }

  updateTask(listId: string, taskId: string,title: string){
    // we want to send a webrequest to create a list
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, { title });
  }
  deleteTask(listId: string, taskId: string){
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`)
  }

  complete(task: Task){
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    }) 
  }
}
