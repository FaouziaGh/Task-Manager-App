import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task_model';
import { TaskServiceService } from 'src/app/task-service.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskService: TaskServiceService, private route: ActivatedRoute, private router: Router){}
  listId: string;
  
  ngOnInit(){
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId'];
    })
  }

  createTask(title: string){
    this.taskService.createTask(title, this.listId).subscribe((newTask: any)=>{
      this.router.navigate(['../'], { relativeTo: this.route});
    })
  }

}
