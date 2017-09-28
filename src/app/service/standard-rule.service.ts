import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';
import { StandardRulesContext } from '../models/standard-rules-context';

@Injectable()
export class StandardRuleService {
  private baseUrl: string = 'http://localhost:34351/api';
  constructor(private http: Http) { }

  getAllStandardRules(BusinessObjectName: string, ProfileNum: string): Observable<StandardRulesContext> {
    return this.http.get(`${this.baseUrl}/StandardRules/GetAllStandardRules`, 
    { params: { 'BusinessObjectName': BusinessObjectName, 'ProfileNum': ProfileNum } })
      .map(this.extractContext)
      .catch(this.handleError);
  }

  saveStandardRulesDetails(standardRulesRequest: StandardRulesContext): Observable<StandardRulesContext>{
    return this.http.post(`${this.baseUrl}/StandardRules` + '/SaveStandardRules', standardRulesRequest)
    .map(this.extractContext)
    .catch(this.handleError);
  }

  private extractContext(res:Response) {
    let body = res.json();
    console.log(body.context);
    return body.context || {};
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
