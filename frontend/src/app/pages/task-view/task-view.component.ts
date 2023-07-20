import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskServiceService } from 'src/app/task-service.service';
/*  import { TaskService}  from 'src/app/task-service.service';*/
import { List } from 'src/app/models/list_model';
import { Task } from '../../models/task_model';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: any[] = [];

  tasks: any=[];
  task: Task;
  selectedListId: string

  constructor(private taskService: TaskServiceService, private route: ActivatedRoute, private router: Router, private authService: AuthService){}

  ngOnInit() {
    this.taskService.getLists().subscribe((lists: any = []) =>{
      //console.log(lists);
      this.lists = lists;
    });

    this.route.params.subscribe((params: Params) => {
      //console.log(params);
      if(params['listId']){
        this.selectedListId = params['listId']
        this.taskService.getTasks(params['listId']).subscribe((tasks: any = [])=>{
          this.tasks = tasks;
        })
      }else {
        this.tasks = undefined;
      }
      
    }) 

  }
  onTaskClick(task: Task) {
    //we want to set the task to completed state
    this.taskService.complete(task).subscribe(() => {
      console.log("completed successfully");
      // the task has been set to completed successfully
      task.completed = !task.completed;
    })
  }

  onDeleteList(){
    this.taskService.deleteList(this.selectedListId).subscribe((res: any)=>{
      this.router.navigate(['/lists'])
      console.log(res);
      
    })
  }
  onTaskDelete(id: string){
    this.taskService.deleteTask(this.selectedListId, id).subscribe((res: any)=>{
      this.tasks = this.tasks.filter((val: { _id: string; }) => val._id !== id) 
      console.log(res);
      
    })
  }
  logout(){
    this.authService.logout()
  }
}
