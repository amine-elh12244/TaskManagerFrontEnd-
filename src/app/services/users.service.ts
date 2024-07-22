import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = "http://localhost:8081/api/users";

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  updateUser(user: any): Observable<any> {
    // Extract the user ID from the user object
    const userId = user.idUsers;
    // Use the extracted user ID in the URL path
    return this.http.put<any>(`${this.apiUrl}/${userId}`, user);
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('http://localhost:8081/api/image/upload', formData, {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      }),
      responseType: 'text'
    });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createUserWithImage(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
