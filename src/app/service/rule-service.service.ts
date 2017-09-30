import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';
import {RuleContext} from '../models/rule-context';
import { Configuration } from '../app.constants';

@Injectable()
export class RuleServiceService {
  private baseUrl: string;
  constructor(private http: Http, private _configuration: Configuration) {
    this.baseUrl = _configuration.ServerWithApiUrl;
  }

  getAllAttributesDetails(): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/Attributes`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllFunctionTypeDetails(): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/FunctionTypes/GetAllFunctionsTypeDetails`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllFuncBasedOnTypeDetails(id: number): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/FunctionTypes/GetAllFunctionsDetailsBasedOnType/${id}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  callValidationService(masterContext: RuleContext): Observable<RuleContext> {
    return this.http.post(`${this.baseUrl}/FunctionTypes/ValidateRuleOrFilter`, masterContext)
        .map(this.extractPostData)
        .catch(this.handleError);
  }
  private extractData(res: Response) {
    const body = res.json();
    return body.context.list || {};
  }
  private extractPostData(res: Response) {
    const body = res.json();
    return body.context || {};
  }
  private extractDataDO(res: Response) {
    const body = res.json();
    return body.context.rulesTrendListDO || {};
  }
  postRuleData(ruleContext: RuleContext): Observable<RuleContext> {
    return this.http.post(`${this.baseUrl}/FunctionTypes/PostRuleData`, ruleContext)
        .map(this.extractPostData)
        .catch(this.handleError);
  }
  updateRuleData(id: number, ruleContext: RuleContext): Observable<RuleContext> {
    return this.http.put(`${this.baseUrl}/FunctionTypes/UpdateRuleData/${id}`, ruleContext)
        .map(this.extractPostData)
        .catch(this.handleError);
  }
  getAllRules(businessName: string, profileNo: string): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/FunctionTypes/GetAllRules/${businessName}/${profileNo}`)
    .map(this.extractDataDO)
    .catch(this.handleError);
  }
  getAllSyntaxBasedOnFunctionDetails(id: number): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/FunctionTypes/GetAllSyntaxDetailsBasedOnFunction/${id}`)
      .map(this.extractData)
      .catch(this.handleError);
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
