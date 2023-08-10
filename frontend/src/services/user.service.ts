import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  uri = environment.usersURI;
  //private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJ1c2VybmFtZSI6Im5vdmkiLCJuYW1lIjoibm92aSIsImxhc3RuYW1lIjoibm92aSIsInVzZXJUeXBlIjoib3JnYW5pemF0b3IiLCJpYXQiOjE2ODk5NjgwMjgsImV4cCI6MTY4OTk3MTYyOH0.VYEvnNvPwOoJAAaCFGrRCTw5dtfGFQnsOUHrO7sxd3s';

  /**
   * Injects the HTTP client.
   * @param client HTTP client to inject
   */
  constructor(private http: HttpClient) { }

  /**
   * Slanje POST zahteva za prijavu i autentifikaciju.
   * @param {Object} data - Objekat sa kredencijalima korisnika
   * @returns {Observable<Object>} Observable koji emituje parsirani JSON odgovor.
   */
  login(data: Object): Observable<Object> {
    return this.http.post(`${this.uri}/login`, data);
  }

  /**
  * Slanje POST zahteva za registraciju novog korisnika.
  * @param {Object} data - Objekat sa poljima sa informacijama novog korisnika
  * @returns {Observable<Object>} Observable koji emituje parsirani JSON odgovor.
  */
  register(data: Object): Observable<Object> {
    return this.http.post(`${this.uri}/register`, data);
  }

  /**
  * Slanje POST zahteva za prijavu korisnika sa Google nalogom.
  * @param {Object} data - Objekat sa poljima sa Google tokenom
  * @returns {Observable<Object>} Observable koji emituje parsirani JSON odgovor.
  */
  googleSignIn(data: Object): Observable<Object> {
    return this.http.post(`${this.uri}/googleSignIn`, data);
  }

  /**
  * Slanje POST zahteva za dopunu korisnickog profila nakon prijave sa Google nalogom.
  * @param {Object} data - Objekat sa poljima sa Google tokenom
  * @returns {Observable<Object>} Observable koji emituje parsirani JSON odgovor.
  */
  finishGoogleSignIn(data: Object): Observable<Object> {
    return this.http.post(`${this.uri}/finishGoogleSignIn`, data);
  }

  /**
   * Slanje POST zahteva za dodavanje profilne slike novog korisnika pri registraciji.
   * @param {formData} FormData - FormData objekat koji sadrzi sliku koja se salje na backend.
   * @returns {Observable<Object>} Observable koji emituje parsirani JSON odgovor.
   */
  addPicture(formData: FormData): Observable<Object> {
    return this.http.post(`${this.uri}/addPicture`, formData);
  }

  /**
* Slanje POST zahteva za dohvatanje korisnika.
* @param {Object} data - Objekat sa poljima sa korisnickim imenom
* @param {string} token - Token korisnika za autorizaciju
* @returns {Observable<User>} Observable korisnika, sa telom kao objektom parsiranim iz JSON-a."
*/
  getUser(data: Object, token: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/getUser`, data, { headers });
  }

  /**
  * Slanje GET zahteva za dohvatanje svih ucesnika.
  * @param {string} token - Token korisnika za autorizaciju
  * @returns {Observable<User[]>} Observable niza korisnika, sa telom kao objektom parsiranim iz JSON-a."
  */
  getAllParticipants(token: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get(`${this.uri}/getAllParticipants`, { headers });
  }

  /**
  * Slanje GET zahteva za dohvatanje svih organizatora.
  * @param {string} token - Token korisnika za autorizaciju
  * @returns {Observable<User[]>} Observable niza korisnika, sa telom kao objektom parsiranim iz JSON-a."
  */
  getAllOrganisers(token: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get(`${this.uri}/getAllOrganisers`, { headers });
  }

  /**
 * Slanje GET zahteva za dohvatanje svih aktivnih organizatora.
 * @param {string} token - Token korisnika za autorizaciju
 * @returns {Observable<User[]>} Observable niza korisnika, sa telom kao objektom parsiranim iz JSON-a."
 */
  getAllActiveOrganisers(token: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get(`${this.uri}/getAllActiveOrganisers`, { headers });
  }

  /**
   * Slanje POST zahteva za brisanje korisnika.
   * @param {Object} data - Objekat sa poljima sa korisnickim imenom
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Object>} Observable koji emituje parsirani JSON odgovor."
  */
  deleteUser(data: Object, token: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/deleteUser`, data, { headers });
  }

  /**
   * Slanje POST zahteva za azuriranje informacija korisnika.
   * @param {Object} data - Objekat sa poljima sa novim informacijama korisnika
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Object>} Observable koji emituje parsirani JSON odgovor."
  */
  updateUser(data: Object, token: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/updateUser`, data, { headers });
  }

  /**
   * Slanje POST zahteva za subscribe-ovanje na organizatora.
   * @param {Object} data - Objekat sa korsnickim imenima korisnika i organizatora
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Object>} Observable koji emituje parsirani JSON odgovor."
  */
  subscribe(data: Object, token: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/subscribe`, data, { headers });
  }

  /**
   * Slanje POST zahteva za unsubscribe-ovanje na organizatora.
   * @param {Object} data - Objekat sa korsnickim imenima korisnika i organizatora
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Object>} Observable koji emituje parsirani JSON odgovor."
  */
  unsubscribe(data: Object, token: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/unsubscribe`, data, { headers });
  }



  //test
  test(): Observable<Object> {
    return this.http.post(`${this.uri}/test`, {});
  }

  /*testJWT(): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
    return this.http.post(`${this.uri}/testJWT`, {}, { headers });
  }*/
}
