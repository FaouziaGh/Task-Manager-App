import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { List } from '../../models/list_model';
import { TaskServiceService } from 'src/app/task-service.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {
  constructor(private taskService: TaskServiceService, private router: Router) {}

  ngOnInit() {
    
  }

  createList(title: string){
    this.taskService.createList(title).subscribe((list: any) => {
      console.log(list);
      // Now we navigate to /list/response._id
      this.router.navigate(['/lists', list._id]);

  })
  }
}
