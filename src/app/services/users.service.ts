import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = "http://localhost:8081/api/users";

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user, { headers: this.getAuthHeaders() });
  }

  updateUser(user: any): Observable<any> {
    const userId = user.idUsers;
    return this.http.put<any>(`${this.apiUrl}/${userId}`, user, { headers: this.getAuthHeaders() });
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('http://localhost:8081/api/image/upload', formData, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createUserWithImage(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, { headers: this.getAuthHeaders() });
  }
}
