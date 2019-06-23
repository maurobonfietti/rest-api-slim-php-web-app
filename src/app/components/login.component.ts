import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
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
    templateUrl: '../views/login.html',
    providers: [UserService]
})
export class LoginComponent implements OnInit {

    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);

    matcher = new errorStateMatcher();

    public title: string;
    public user;
    public identity;
    public token;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        public snackBar: MatSnackBar
    ) {
        this.title = 'LOGIN';
        this.user = {
            'email': '',
            'password': '',
            'getData': true
        };
    }

    openSnackBar(message: string) {
      this.snackBar.open(message, null, {
        duration: 3000,
      });
    }

    ngOnInit() {
        this.logout();
        this.redirectIfIdentity();
    }

    logout() {
        this._route.params.forEach((params: Params) => {
            let logout = +params['id'];
            if (logout == 1) {
                localStorage.removeItem('identity');
                localStorage.removeItem('token');
                this.identity = null;
                this.token = null;
                window.location.href = '/login';
            }
        });
    }

    redirectIfIdentity() {
        let identity = this._userService.getIdentity();
        if (identity != null && identity.sub) {
            this._router.navigate(['/index/1']);
        }
    }

    onSubmit() {
        this._userService.login(this.user).subscribe(
            response => {
//                console.log(response.message.Authorization);
                this.identity = response.message.Authorization;
                localStorage.setItem('identity', JSON.stringify(this.identity));
                //
                this.token = response.message.Authorization;
                localStorage.setItem('token', JSON.stringify(this.token));
                this.openSnackBar('¡Te has identificado correctamente!');
                window.location.href = '/index/1';
                //
//                this.user.getData = false;
//                this._userService.login(this.user).subscribe(
//                    response => {
//                        this.token = response;
//                        localStorage.setItem('token', JSON.stringify(this.token));
//                        this.openSnackBar('¡Te has identificado correctamente!');
//                        window.location.href = '/index/1';
//                    },
//                    error => {
//                        console.log(<any> error);
//                    }
//                );
            },
            error => {
                console.log(<any> error);
                this.openSnackBar('El email y contraseña ingresados son incorrectos.');
            }
        );
    }
}
