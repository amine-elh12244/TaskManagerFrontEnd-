import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HDetTacheService {
  private baseUrl = 'http://localhost:8081/api/hdettache';

  constructor(private http: HttpClient) { }

  createHDetTache(hDetTache: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, hDetTache);
  }

  getAllHDetTaches(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getHDetTacheById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  updateHDetTache(id: string, hDetTache: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, hDetTache);
  }

  deleteHDetTache(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  findByHEntTacheId(idHEntTache: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/byHEntTacheId/${idHEntTache}`);
  }
}
