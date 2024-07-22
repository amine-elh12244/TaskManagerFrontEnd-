import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HEntTacheService {
  private baseUrl = 'http://localhost:8081/api/henttache';

  constructor(private http: HttpClient) { }

  createHEntTache(hEntTache: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, hEntTache);
  }

  getAllHEntTaches(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getHEntTacheById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  updateHEntTache(id: string, hEntTache: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, hEntTache);
  }

  deleteHEntTache(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // New method to delete HEntTache and its associated HDetTache
  deleteHEntTacheAndAssociatedDetails(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
