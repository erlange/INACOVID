import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, throwError, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, retry, timeout, delay } from 'rxjs/operators';

@Injectable(
  {providedIn: 'root'}
)
export class DataService {
  isError = false;
  // private isErrorSubject$ = new BehaviorSubject<boolean>(false);
  // isError$ = this.isErrorSubject$.asObservable();
  private urlCase = environment.urlCase;
  private urlVax = environment.urlVax;
  private urlCatg = environment.urlCatg;
  private urlCatgProv = environment.urlCatgProv;
  private urlHosp = environment.urlHosp;
  private urlMaps = window.location.origin + environment.baseHref + '/assets/maps/IDN_adm1.topo.json';
  private urlLatestUpd = environment.urlLatestUpd;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {

    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Error occurred. Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
  getCase$(): Observable<any> {
    const resCase = this.http.get<any>(this.urlCase);
    const resMaps = this.http.get<any>(this.urlMaps);
    return forkJoin([resCase, resMaps]).pipe(
      retry(3),
      catchError(this.handleError).bind(this)
      );
  }

  getVax$(): Observable<any>  {
    return this.http.get<any>(this.urlVax).pipe(
      retry(3),
      catchError(this.handleError).bind(this)
      );
  }

  getCatg$(): Observable<any>  {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    const resCatg = this.http.get<string>(this.urlCatg, {headers, responseType: 'text' as 'json'});
    const resCatgProv = this.http.get<string>(this.urlCatgProv, {headers, responseType: 'text' as 'json'});
    return forkJoin([resCatg, resCatgProv]).pipe(
      retry(3),
      catchError(this.handleError).bind(this)
      );
  }

  // getRest$(): Observable<any>  {
  //   const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
  //   const resVax = this.http.get<any>(this.urlVax);
  //   const resCatg = this.http.get<string>(this.urlCatg, {headers, responseType: 'text' as 'json'});
  //   const resCatgProv = this.http.get<string>(this.urlCatgProv, {headers, responseType: 'text' as 'json'});
  //   return forkJoin([resVax, resCatg, resCatgProv]).pipe(
  //     retry(3),
  //     catchError(this.handleError).bind(this)
  //     );
  // }

  getHospitals$(): Observable<any> {
    return this.http.get<any>(this.urlHosp).pipe(
      retry(3),
      catchError(this.handleError).bind(this)
      );
  }

  getLatestUpd$(): Observable<any> {
    return this.http.get<any>(this.urlLatestUpd);
  }
}
