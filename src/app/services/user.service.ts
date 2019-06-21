import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {User} from '../models/user';
import "rxjs/add/operator/map";
import {environment} from '../../environments/environment';

@Injectable()
export class UserService {

    public url: string;
    public identity;
    public token;

    constructor(private _http: Http) {
        this.url = environment.apiUrl;
        console.log('Prod: ' + environment.production + '. Url: ' + this.url);
    }

    login(user: string) {
        let headers = new Headers({'Content-Type': "application/json"});

        return this._http
            .post(this.url + '/login', user, {headers: headers})
            .map(res => res.json());
    }

    register(user) {
        let headers = new Headers({'Content-Type': "application/json"});

        return this._http
            .post(this.url + '/api/v1/users', user, {headers: headers})
            .map(res => res.json());
    }

    updateUser(user: User) {
        let json = JSON.stringify(user);
        let params = "json=" + json + '&authorization=' + this.getToken();
        let headers = new Headers({'Content-Type': "application/x-www-form-urlencoded"});
        headers.append('Authorization', this.getToken());

        return this._http
            .patch(this.url + '/user', params, {headers: headers})
            .map(res => res.json());
    }

    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));
        if (identity != 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }

        return this.identity;
    }

    getToken() {
        let token = JSON.parse(localStorage.getItem('token'));
        if (token != 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }
}