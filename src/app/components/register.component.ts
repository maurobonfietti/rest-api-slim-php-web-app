import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSnackBar} from '@angular/material';

export class errorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    templateUrl: '../views/register.ok.html',
})
export class SnackBarRegisterOk {
    constructor(public snackBar: MatSnackBar) {}
}

@Component({
    templateUrl: '../views/register.error.html',
})
export class SnackBarRegisterError {
    constructor(public snackBar: MatSnackBar) {}
}

@Component({
    selector: 'register',
    templateUrl: '../views/register.html',
    providers: [UserService]
})
export class RegisterComponent implements OnInit {
    public title: string;
    public user;
    public status;
    public identity;
    public token;

    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);

    matcher = new errorStateMatcher();

    constructor(
        private _userService: UserService,
        public snackBar: MatSnackBar
    ) {
        this.title = 'REGISTRATE';
        this.user = {
            'email': '',
            'password': '',
            'getData': true
        };
    }

    openSnackBarOk() {
        this.snackBar.openFromComponent(SnackBarRegisterOk, {
            duration: 3000,
        });
    }

    openSnackBarError() {
        this.snackBar.openFromComponent(SnackBarRegisterError, {
            duration: 3000,
        });
    }

    ngOnInit() {
    }

    onSubmit() {
        this._userService.register(this.user).subscribe(
            response => {
                this.status = response.status;
                this.status = 'success';
                this.openSnackBarOk();
                localStorage.removeItem('identity');
                localStorage.removeItem('token');
                this.identity = null;
                this.token = null;
                this._userService.login(this.user).subscribe(
                    response => {
                        this.identity = response.message.Authorization;
                        localStorage.setItem('identity', JSON.stringify(this.identity));
                        //
                        this.token = response.message.Authorization;
                        localStorage.setItem('token', JSON.stringify(this.token));
//                        this.openSnackBar('¡Te has identificado correctamente!');
                        this.openSnackBarOk();
                        window.location.href = '/index/1';
                        //
//                        this.identity = response;
//                        localStorage.setItem('identity', JSON.stringify(this.identity));
//                        this.user.getData = false;
//                        this._userService.login(this.user).subscribe(
//                            response => {
//                                this.token = response;
//                                localStorage.setItem('token', JSON.stringify(this.token));
//                                this.openSnackBarOk();
//                                window.location.href = '/index/1';
//                            },
//                            error => {
//                                console.log(<any> error);
//                            }
//                        );
                    },
                    error => {
                        console.log(<any> error);
                        this.openSnackBarError();
                    }
                );
            },
            error => {
                console.log(<any> error);
                this.status = 'error';
                this.openSnackBarError();
            }
        );
    }
}
