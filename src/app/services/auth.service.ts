import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private loggedIn$ = new BehaviorSubject<boolean>(false);
private user$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }
//login
login(email:string,password:string):Observable<any>{
  return this.http.post('http://localhost:3000/api/auth/login',{email,password},{withCredentials:true})
  .pipe(tap(()=>{
    this.loggedIn$.next(true);
    this.user$.next({email});
  }));
}
  // Logout
  logout(): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.loggedIn$.next(false);
          this.user$.next(null);
        })
      );
  }

// Check Auth on reload
  checkAuth(): Observable<any> {
    return this.http.get('http://localhost:3000/api/auth/check-auth', { withCredentials: true })
      .pipe(
        tap((res: any) => {
          this.loggedIn$.next(res.isAuthenticated);
          this.user$.next(res.isAuthenticated ? res.user : null);
        })
      );
  }


  // Observables for components
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  get user(): Observable<any> {
    return this.user$.asObservable();
  }



}
