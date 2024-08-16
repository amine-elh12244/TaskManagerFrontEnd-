import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private baseUrl = 'http://localhost:8081/api/tache';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getAllTaches(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getTacheById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createTache(tache: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, tache, { headers: this.getAuthHeaders() });
  }

  updateTache(tache: any): Observable<any> {
    return this.http.put<any>(this.baseUrl, tache, { headers: this.getAuthHeaders() });
  }

  deleteTache(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
