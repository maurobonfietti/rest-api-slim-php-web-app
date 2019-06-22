import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import {environment} from '../../environments/environment';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class TaskService {
    public url: string;

    constructor(private _http: Http) {
        this.url = environment.apiUrl;
    }

    create(token, task): Observable<any> {
        let headers = new Headers({'Content-Type': "application/json"});
        headers.append('Authorization', token);

        return this._http
            .post(this.url + '/api/v1/tasks', task, {headers: headers})
            .map(res => res.json())
            .catch(this.errorHandler);
    }

    errorHandler(error: HttpErrorResponse) {
        console.log(error);
        return Observable.throw(error.message || "Internal Server Error...");
    }

    search(token, search = null, filter = null, order = null, priority = null, page = null) {
        let url: string;
        let params = '&filter=' + filter + '&order=' + order + '&priority=' + priority;
        let headers = new Headers({'Content-Type': "application/json"});
        headers.append('Authorization', token);

        if (search === null) {
            url = this.url + '/api/v1/tasks';
        } else {
            url = this.url + '/api/v1/tasks/search/' + search;
        }

        return this._http
            .get(url + '?' + params, {headers: headers})
            .map(res => res.json());
    }

    getTask(token, id) {
        let headers = new Headers({'Authorization': token});

        return this._http
            .get(this.url + '/api/v1/tasks/' + id, {headers: headers})
            .map(res => res.json());
    }

    update(token, task, id) {
        let headers = new Headers({'Content-Type': "application/json"});
        headers.append('Authorization', token);

        return this._http
            .put(this.url + '/api/v1/tasks/' + id, task, {headers: headers})
            .map(res => res.json());
    }

    updateStatus(token, id, task) {
        let headers = new Headers({'Content-Type': "application/json"});
        headers.append('Authorization', token);

        if (task.status == 1) {
            task.status = 0;
        } else {
            task.status = 1;
        }

        return this._http
            .put(this.url + '/api/v1/tasks/' + id, task, {headers: headers})
            .map(res => res.json());
    }

    updatePriority(token, id) {
        let headers = new Headers();
        headers.append('Authorization', token);

        return this._http
            .patch(this.url + '/task/priority/' + id, null, {headers: headers})
            .map(res => res.json());
    }

    deleteTask(token, id) {
        let headers = new Headers({'Content-Type': "application/json"});
        headers.append('Authorization', token);

        return this._http
            .delete(this.url + '/api/v1/tasks/' + id, {headers: headers})
            .map(res => res.json());
    }
}