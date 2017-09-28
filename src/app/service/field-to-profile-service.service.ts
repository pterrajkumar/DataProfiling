import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';

import { FieldsToProfileContext } from "./../models/fields-to-profile-context";

@Injectable()
export class FieldToProfileServiceService {

  private baseUrl: string = 'http://localhost:34351/api';
  constructor(private http: Http) { }

  getFieldsToProfile(BusinessObjectName: string, ProfileNum: string): Observable<FieldsToProfileContext> {
    return this.http.get(`${this.baseUrl}/Field/GetFieldsToProfile`, 
    { params: { 'BusinessObjectName': BusinessObjectName, 'ProfileNum': ProfileNum } })
      .map(this.extractDataDetails)
      .catch(this.handleError);
  }
  
  private extractData(res: Response) {
    let body = res.json();
    //console.log(body.context.list);
    return body.context.list || {};
  }
  
  private extractDataDetails(res: Response) {
    let body = res.json(); 
    console.log(body);   
    return body.context || { };
  }
  handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      if (error.status === 401 && error.statusText === 'Unauthorized') {
        console.log('error');
      }
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
