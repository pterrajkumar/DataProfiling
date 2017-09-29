import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';
import { ProfileContext } from "../models/profile-context";
import { Configuration } from '../app.constants';

@Injectable()

export class ProfileServiceService {

  private baseUrl: string;
  constructor(private http: Http, private _configuration: Configuration) { 
    this.baseUrl = _configuration.ServerWithApiUrl;
  }

  /* REGION SERVICE METHODS */
  /* Not used */
  async uploadFile(uploadedFile: any): Promise<void> {
    try {
      let input = new FormData();
      input.append("file", uploadedFile);
      const url = `${this.baseUrl}/ImportFiles`;
      await this.http
        .post(url, input)
        .map(this.extractDataDetails)
        .toPromise();
    } catch (error) {
      await this.handleError(error);
    }
  }

  uploadFileRequest(uploadedFile: any, profileName: string): Observable<ProfileContext> {
    let input = new FormData();
    input.append("file", uploadedFile, profileName);    
    return this.http.post(`${this.baseUrl}/ImportFiles/UploadFile`, input)
        .map(this.extractDataDetails)
        //.do(data => console.log('uploadedFiles: ' + JSON.stringify(data)))
        .catch(this.handleError);
  }

  callCopyMetaDataService(masterContext: ProfileContext): Observable<ProfileContext> {
    return this.http.post(`${this.baseUrl}/ImportFiles/CopyMetaDataFromHistProfile`, masterContext)
        .map(this.extractDataDetails)
        .catch(this.handleError);
  }

  /* async getAllProfileDetails(): Promise<ProfileContext>{
    try {
      const url = `${this.baseUrl}/ImportFiles`;
      return await this.http
        .get(url)
        .map(this.extractData)
        .toPromise();
    } catch (error) {
      await this.handleError(error);
    }
  } */

  getAllProfileDetails(): Observable<ProfileContext>{
    return this.http.get(`${this.baseUrl}/ImportFiles`)
    .map(this.extractDataDetails)
    .catch(this.handleError);
  }

  private extractDataDetails(res: Response) {
    let body = res.json(); 
    console.log(body.context);   
    return body.context || { };
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.context.List || { };
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
