import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class DataService {
  isError = false;
  private urlCase = environment.urlCase;
  private urlVax = environment.urlVax;
  private urlMaps = window.location.origin + environment.baseHref + '/assets/maps/IDN_adm1.topo.json';

  constructor(private http: HttpClient) {}

  getCase$ = (): Observable<any> => {
    return this.http.get<any>(this.urlCase);
  }
  getMap$ = (): Observable<any> => {
    console.log('urlMap', this.urlMaps);
    return this.http.get<any>(this.urlMaps);
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
      this.isError = true;
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
  getAll$(): Observable<any> {
    const resCase = this.http.get<any>(this.urlCase);
    const resMaps = this.http.get<any>(this.urlMaps);
    const resVax = this.http.get<any>(this.urlVax);
    return forkJoin([resCase, resMaps, resVax]).pipe(
      retry(3),
      catchError(this.handleError)
      );
  }
}
