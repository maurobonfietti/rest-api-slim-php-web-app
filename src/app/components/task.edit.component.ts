import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {TaskService} from '../services/task.service';
import {Task} from '../models/task';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'task-edit',
    templateUrl: '../views/task.html',
    providers: [UserService, TaskService]
})
export class TaskEditComponent implements OnInit {
    public page_title: string;
    public btn_title: string;
    public identity;
    public token;
    public task: Task;
    public status_task;
    public loading;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _taskService: TaskService,
        public snackBar: MatSnackBar
    ) {
        this.page_title = 'EDITAR TAREA';
        this.btn_title = 'GUARDAR';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, null, {
           duration: 2000,
        });
    }

    ngOnInit() {
        if (this.identity == null && !this.identity.sub) {
            this._router.navigate(['/login']);
        } else {
            this.getTask();
        }
    }

    getTask() {
        this.loading = 'show';
        this._route.params.forEach((params: Params) => {
            let id = +params['id'];
            this._taskService.getTask(this.token, id).subscribe(
                response => {
//                    if (response.task.user.id !== this.identity.sub) {
//                        this._router.navigate(['/index/1']);
//                    }
//                    console.log(response);
                    this.task = response.message;
                    this.loading = 'hide';
                },
                error => {
                    console.log(<any> error);
                    this.openSnackBar('¡Ups! Ocurrió un error al cargar la tarea.');
                }
            );
        });
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let id = +params['id'];
            this._taskService.update(this.token, this.task, id).subscribe(
                response => {
                    this.task = response.data;
                    this._router.navigate(['/index/1']);
                },
                error => {
                    console.log(<any> error);
                    this.openSnackBar('¡Ups! Ocurrió un error al guardar la tarea.');
                }
            );
        });
    }

    deleteTask(id: string) {
        this._taskService.deleteTask(this.token, id).subscribe(
            response => {
                this.openSnackBar('Tarea eliminada exitosamente.');
                this._router.navigate(['/index/1']);
            },
            error => {
                console.log(<any> error);
            }
        );
    }
}
