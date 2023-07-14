import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskServiceService } from 'src/app/task-service.service';
/*  import { TaskService}  from 'src/app/task-service.service';*/
import { List } from 'src/app/models/list_model';
import { Task } from '../../models/task_model';
@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: any[] = [];

  tasks: any=[];
  task: Task;

  constructor(private taskService: TaskServiceService, private route: ActivatedRoute){}

  ngOnInit() {
    this.taskService.getLists().subscribe((lists: any = []) =>{
      //console.log(lists);
      this.lists = lists;
    });

    this.route.params.subscribe((params: Params) => {
      //console.log(params);
      if(params['listId']){
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
}