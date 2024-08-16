import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HDetTacheService {
  private baseUrl = 'http://localhost:8081/api/hdettache';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  createHDetTache(hDetTache: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, hDetTache, { headers: this.getAuthHeaders() });
  }

  getAllHDetTaches(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getHDetTacheById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateHDetTache(id: string, hDetTache: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, hDetTache, { headers: this.getAuthHeaders() });
  }

  deleteHDetTache(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  findByHEntTacheId(idHEntTache: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/byHEntTacheId/${idHEntTache}`, { headers: this.getAuthHeaders() });
  }
}
