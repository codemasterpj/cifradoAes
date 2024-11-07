import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private apiUrl = 'http://localhost:8080/api/encryption';

  constructor(private http: HttpClient) {}

  encrypt(data: string, password: string): Observable<string> {
    const params = new HttpParams().set('data', data).set('password', password);
    return this.http.post(`${this.apiUrl}/encrypt`, null, { params, responseType: 'text' });
  }
  
  decrypt(encryptedData: string, password: string): Observable<string> {
    const params = new HttpParams().set('encryptedData', encryptedData).set('password', password);
    return this.http.post(`${this.apiUrl}/decrypt`, null, { params, responseType: 'text' });
  }

   // Método para cifrar un archivo
   encryptFile(file: File, password: string): Observable<HttpResponse<Blob>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    return this.http.post(`${this.apiUrl}/encrypt-file`, formData, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  decryptFile(encryptedFile: File, password: string): Observable<HttpResponse<Blob>> {
    const formData = new FormData();
    formData.append('file', encryptedFile);
    formData.append('password', password);
    return this.http.post(`${this.apiUrl}/decrypt-file`, formData, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  generateKeys(passphrase: string, identity: string): Observable<{ publicKey: string; privateKey: string }> {
    const params = new HttpParams().set('passphrase', passphrase).set('identity', identity);
    return this.http.post<{ publicKey: string; privateKey: string }>(`${this.apiUrl}/generate-keys`, null, { params });
  }
  
  
}
