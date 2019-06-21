import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {TaskService} from '../services/task.service';
import {Task} from '../models/task';
import {MatSnackBar} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  templateUrl: '../views/task.delete.dialog.html',
})
export class DeleteTaskDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
}

@Component({
    selector: 'default',
    templateUrl: '../views/default.html',
    providers: [UserService, TaskService]
})
export class DefaultComponent implements OnInit {
    public title: string;
    public identity;
    public token;
    public tasks: Array<Task>;
    public status_task;
    public pages;
    public pagesPrev;
    public pagesNext;
    public loading = 'show';
    public task: Task;
    public priority = 2;
    public filter = 2;
    public order = 1;
    public searchString: string;
    public totalItemsCount = 0;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _taskService: TaskService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog
    ) {
        this.title = '';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.loading = 'show';
    }

    openDialog(id: string): void {
        let dialogRef = this.dialog.open(DeleteTaskDialog, {
            width: '280px',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.deleteTask(id);
            }
        });
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, null, {
            duration: 2000,
        });
    }

    ngOnInit() {
        this.search();
        this.task = new Task(0, '', '', 0, 'null', 'null');
    }

    createTask() {
        this._taskService.create(this.token, this.task).subscribe(
            response => {
                this.openSnackBar('Tarea creada exitosamente.');
                this.task = new Task(0, '', '', 0, 'null', 'null');
                this.search();
            },
            error => {
                console.log(<any> error);
                this.openSnackBar('¡Ups! Ocurrió un error al crear la tarea.');
            }
        );
    }

    search() {
        this.loading = 'show';
        this._route.params.forEach((params: Params) => {
            if (!this.searchString || this.searchString.trim().length === 0) {
                this.searchString = null;
            }
            let page = +params['page'];
            if (!page) {
                page = 1;
            }
            this._taskService.search(this.token, this.searchString, this.filter, this.order, this.priority, page).subscribe(
                response => {
//                    console.log(response);
//                    console.log(response.stats);
                    this.tasks = response.message;
                    this.totalItemsCount = response.totalItemsCount;
                    this.loading = 'hide';
                    this.pages = [];
                    for (let i = 0; i < response.totalPages; i++) {
                        this.pages.push(i);
                    }
                    if (page >= 2) {
                        this.pagesPrev = (page - 1);
                    } else {
                        this.pagesPrev = page;
                    }
                    if (page < response.totalPages || page === 1) {
                        this.pagesNext = (page + 1);
                    } else {
                        this.pagesNext = page;
                    }
                },
                error => {
                    console.log(<any> error);
                    console.log(error.status);
                    console.log(error.statusText);
                    if (error.status === 403 && error.statusText === 'Forbidden' ) {
                        this._router.navigate(['/login/1']);
                    }
                }
            );
        });
    }

    updateStatus(id: string, task: Task) {
        this._taskService.updateStatus(this.token, id, task).subscribe(
            response => {
                this.playSound();
                this.search();
            },
            error => {
                console.log(<any> error);
            }
        );
    }

    updatePriority(id: string) {
        this._taskService.updatePriority(this.token, id).subscribe(
            response => {
                this.search();
            },
            error => {
                console.log(<any> error);
            }
        );
    }

    updateTask(task: Task) {
        this._taskService.update(this.token, task, task.id).subscribe(
            response => {
                this.status_task = response.status;
                this.task = response.data;
                this.search();
            },
            error => {
                console.log(<any> error);
            }
        );
    }

    deleteTask(id: string) {
        this._taskService.deleteTask(this.token, id).subscribe(
            response => {
                this.openSnackBar('Tarea eliminada exitosamente.');
                this.search();
            },
            error => {
                console.log(<any> error);
            }
        );
    }

    playSound(){
        let audio = new Audio();
        audio.src = "../../assets/sound/level.mp3";
        audio.load();
        audio.play();
    }
}
