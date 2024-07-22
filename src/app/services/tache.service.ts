import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TacheService  {
  private baseUrl = 'http://localhost:8081/api'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  getAllTaches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tache`);
  }

  getTacheById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/tache/${id}`);
  }

  createTache(tache: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/tache`, tache);
  }

  updateTache(tache: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/tache`, tache);
  }

  deleteTache(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tache/${id}`);
  }
}
