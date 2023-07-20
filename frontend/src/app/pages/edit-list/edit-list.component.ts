import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskServiceService } from 'src/app/task-service.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit{

  constructor(private route: ActivatedRoute, private taskService: TaskServiceService, private router: Router){}

  listId : string;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId']
    })
  }

  updateList(title: string){
    this.taskService.updateList(this.listId, title).subscribe(()=>{
      this.router.navigate(['/lists', this.listId])
    })
  }
}
