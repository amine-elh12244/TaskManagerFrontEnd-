import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HEntTacheService {
  private baseUrl = 'http://localhost:8081/api/henttache';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  createHEntTache(hEntTache: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, hEntTache, { headers: this.getAuthHeaders() });
  }

  getAllHEntTaches(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getHEntTacheById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateHEntTache(id: string, hEntTache: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, hEntTache, { headers: this.getAuthHeaders() });
  }

  deleteHEntTache(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  deleteHEntTacheAndAssociatedDetails(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
