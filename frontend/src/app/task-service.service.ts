import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Task } from './models/task_model';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(private webReqService: WebRequestService) { }
  createList(title: string){
    // we want to send a webrequest to create a list
    return this.webReqService.post('lists', { title });
  }
  
  getLists(){
    return this.webReqService.get('lists');
  }

  getTasks(listId: string){
    return this.webReqService.get(`lists/${listId}/tasks`);
  }
  createTask(title: string, listId: string){
    // we want to send a webrequest to create a task
    return this.webReqService.post(`lists/${listId}/tasks`, { title });
  }

  complete(task: Task){
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    })
  }
}
