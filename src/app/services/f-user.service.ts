import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FUserService {
  private apiUrl = "http://localhost:8081/api/fuser";

  constructor(private http: HttpClient) { }

  getAllFUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getFUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createFUser(fUser: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, fUser);
  }

  updateFUser(fUser: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, fUser);
  }

  deleteFUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
