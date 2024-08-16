import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FUserService {
  private apiUrl = "http://localhost:8081/api/fuser";

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getAllFUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getFUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createFUser(fUser: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, fUser, { headers: this.getAuthHeaders() });
  }

  updateFUser(fUser: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, fUser, { headers: this.getAuthHeaders() });
  }

  deleteFUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
