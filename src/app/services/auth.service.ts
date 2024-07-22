import { Injectable } from '@angular/core';
import { AppUser } from '../model/Appuser';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public host: string = "http://localhost:8081/api";
  users: AppUser[] = [];
  authenticatedUser: AppUser | undefined;

  private _authenticatedUserId: string | undefined;

  set authenticatedUserId(id: string) {
    this._authenticatedUserId = id;
  }

  get authenticatedUserId(): string {
    return <string>this._authenticatedUserId;
  }

  constructor(private http: HttpClient) {
    this.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  public getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.host}/admin/all`);
  }

  public login(email: string, password: string): Observable<AppUser> {
    let appUser = this.users.find(u => u.email == email);
    if (!appUser) return throwError(() => new Error("User Not Found !"));
    console.log('Input password:', password);
    console.log('Stored password:', appUser.password);
    if (appUser.password != password) return throwError(() => new Error("Wrong Password !"));

    this.authenticatedUserId = appUser.id.toString(); // set the authenticated user's ID
    return of(appUser);
  }

  public authenticateUser(appUser: AppUser): Observable<boolean> {
    this.authenticatedUser = appUser;
    localStorage.setItem("authUser", JSON.stringify({ id: appUser.id, email: appUser.email, jwt: "WT_TOKEN" }));
    console.log(appUser.email);
    return of(true);
  }

  public isAuthenticated(): boolean {
    return this.authenticatedUser != undefined;
  }

  public logout(): Observable<boolean> {
    this.authenticatedUser = undefined;
    localStorage.removeItem("authUser");
    return of(true);
  }

  public register(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.host}/admin/register`, user);
  }
}
