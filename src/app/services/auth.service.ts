import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppUser } from '../model/Appuser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public host: string = "http://localhost:8081/api/auth";
  private token: string | null = null;
  private authenticatedUser: AppUser | undefined;

  constructor(private http: HttpClient) {}


  public register(user: AppUser): Observable<string> {
    return this.http.post<string>(`${this.host}/register`, user, { responseType: 'text' as 'json' }).pipe(
      catchError(error => {
        return throwError(() => new Error('Registration failed'));
      })
    );
  }


  public login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.host}/login`, { email, password }).pipe(
      map(response => {
        this.token = response.accessToken;
        if (this.token != null) {
          localStorage.setItem('authToken', this.token);
        }
        // Set the authenticated user
        this.authenticatedUser = response.user;
        localStorage.setItem('authUser', JSON.stringify(this.authenticatedUser));
        return response;
      }),
      catchError(error => {
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  public logout(): void {
    this.token = null;
    this.authenticatedUser = undefined;
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }

  public getToken(): string | null {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return this.token != null;
  }

  public getAuthHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
  }


  public getAuthenticatedUser(): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.host}/me`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching authenticated user', error);
        return throwError(() => new Error('Failed to fetch user data'));
      })
    );
  }

}
