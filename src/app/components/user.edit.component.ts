import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../models/user';
import {UserService} from '../services/user.service';

import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export class errorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user.edit.html',
    providers: [UserService]
})
export class UserEditComponent implements OnInit {
    public title: string;
    public user: User;
    public status;
    public identity;
    public token;

    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);

    matcher = new errorStateMatcher();

    constructor(
        private _router: Router,
        private _userService: UserService
    ) {
        this.title = 'Editar mis datos';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }

    ngOnInit() {
        if (this.identity == null) {
            this._router.navigate(['/login']);
        } else {
            this.user = new User(
                this.identity.sub,
                this.identity.role,
                this.identity.name,
                this.identity.surname,
                this.identity.email,
                this.identity.password
            );
        }
    }

    onSubmit() {
        this._userService.updateUser(this.user).subscribe(
            response => {
                this.status = response.status;
                localStorage.setItem('identity', JSON.stringify(this.user));
            },
            error => {
                console.log(<any> error);
                this.status = 'error';
            }
        );
    }
}
