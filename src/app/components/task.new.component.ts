import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {TaskService} from '../services/task.service';
import {Task} from '../models/task';

@Component({
    selector: 'task-new',
    templateUrl: '../views/task.html',
    providers: [UserService, TaskService]
})
export class TaskNewComponent implements OnInit {
    public page_title: string;
    public btn_title: string;
    public identity;
    public token;
    public task: Task;
    public status_task;
    public loading;

    constructor(
        private _router: Router,
        private _userService: UserService,
        private _taskService: TaskService
    ) {
        this.page_title = 'CREATE TASK';
        this.btn_title = 'SAVE';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }

    ngOnInit() {
        if (this.identity == null && !this.identity.sub) {
            this._router.navigate(['/login']);
        } else {
            this.task = new Task(0, '', '', 0, 'null', 'null');
        }
    }

    onSubmit() {
        this._taskService.create(this.token, this.task).subscribe(
            response => {
                this.task = response.data;
                this._router.navigate(['/']);
            },
            error => {
                console.log(<any> error);
            }
        );
    }
}
