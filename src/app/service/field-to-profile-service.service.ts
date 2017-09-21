import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';
import { ProfileContext } from '../models/profile-context';

@Injectable()
export class FieldToProfileServiceService {

  private baseUrl: string = 'http://localhost:34351/api';
  constructor(private http: Http) { }

  getFields(BusinessObjectName:string,ProfileNum: string): Observable<any[]>{
    return this.http.get(`${this.baseUrl}/Field`,{params:{'BusinessObjectName':BusinessObjectName,'ProfileNum':ProfileNum}})
    .map(this.extractData)
    .catch(this.handleError);
    //return {cols:["ADDR_ID","COUNTRY_CD","STATE_CD","ADDR_ZIP","ADDR_CITY","ADDR_6","ADDR_5","ADDR_4","ADDR_3","ADDR_2","ADDR_1"]};
  }
  private extractData(res: Response) {
    let body = res.json();
    //console.log(body.context.list);
    return body.context.list || { };
  }
  setFieldsToProfile(data :any[]){
    console.log(JSON.stringify(data));
  }

  handleError (error: Response | any) {
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
