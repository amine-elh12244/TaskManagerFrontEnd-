import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:8081/api/image/upload'; // Adjust URL as per your backend

  constructor(private http: HttpClient) {}

  uploadImage(formData: FormData): Observable<string> {
    return this.http.post<string>(this.apiUrl, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    });
  }
}
