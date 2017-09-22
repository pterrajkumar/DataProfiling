import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';
import { FieldsContext } from '../models/fields-context';

@Injectable()
export class FieldServiceService {

  private baseUrl: string = 'http://localhost:34351/api';
  constructor(private http: Http) { }

  getAllFields(BusinessObjectName: string, ProfileNum: string): Observable<FieldsContext> {
    return this.http.get(`${this.baseUrl}/Field/GetAllFields`, 
    { params: { 'BusinessObjectName': BusinessObjectName, 'ProfileNum': ProfileNum } })
      .map(this.extractContext)
      .catch(this.handleError);
  }





  getFieldsToProfile(BusinessObjectName: string, ProfileNum: string): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/Field/GetFieldsToProfile`, 
    { params: { 'BusinessObjectName': BusinessObjectName, 'ProfileNum': ProfileNum } })
      .map(this.extractData)
      .catch(this.handleError);
  }
  getKeyFields(BusinessObjectName: string, ProfileNum: string): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/Field/GetKeyFields`, 
    { params: { 'BusinessObjectName': BusinessObjectName, 'ProfileNum': ProfileNum } })
      .map(this.extractData)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    let body = res.json();
    //console.log(body.context.list);
    return body.context.list || {};
  }

  private extractContext(res:Response) {
    let body = res.json();
    console.log(body.context);
    return body.context || {};
  }

  setFieldsToProfile(data: any[],BusinessObjectName: string, ProfileNum: string) {
    console.log(JSON.stringify(data));
    let input = new FormData();
    //console.log(JSON.stringify(data));
    input.append("colNames", JSON.stringify(data));
    input.append("BusinessObjectName",BusinessObjectName);
    input.append("ProfileNum",ProfileNum);
    return this.http.post(`${this.baseUrl}/Field/SetFieldsToProfile`, input)
        .map(this.extractDataDetails)
        //.do(data => console.log('uploadedFiles: ' + JSON.stringify(data)))
        .catch(this.handleError);
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
