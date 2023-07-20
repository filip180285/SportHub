import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  uri = 'http://localhost:4000/users';

  /**
   * Injects the HTTP client.
   * @param client HTTP client to inject
   */
  constructor(private http: HttpClient) { }

  /**
   * Slanje POST zahteva za prijavu i autentifikaciju.
   * @param {string} username - korisnicko ime
   * @param {string} password - lozinka
   * @returns {Observable<Object>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a."
   */
  login(username: string, password: string): Observable<Object> {
    const data = {
      username: username,
      password: password
    }
    return this.http.post(`${this.uri}/login`, data);
  }

  /**
 * Slanje POST zahteva za registraciju novog korisnika.
 * @param {any} data - objekat sa poljima sa informacijama novog korisnika
 * @returns {Observable<Object>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a."
 */
  register(data: any): Observable<Object> {
    return this.http.post(`${this.uri}/register`, data);
  }

  /**
   * Slanje POST zahteva za dodavanje profilne slike novog korisnika pri registraciji.
   * @param {formData} FormData - FormData objekat koji sadrzi sliku koja se salje na backend.
   * @returns {Observable<Object>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a."
   */
  addPicture(formData: FormData): Observable<Object> {
    return this.http.post(`${this.uri}/addPicture`, formData);
  }

  //test
  test(): Observable<Object> {
    return this.http.post(`${this.uri}/test`, {});
  }
}
