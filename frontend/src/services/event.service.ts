import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EventService {
  uri = environment.eventsURI;
  //private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJ1c2VybmFtZSI6Im5vdmkiLCJuYW1lIjoibm92aSIsImxhc3RuYW1lIjoibm92aSIsInVzZXJUeXBlIjoib3JnYW5pemF0b3IiLCJpYXQiOjE2ODk5NjgwMjgsImV4cCI6MTY4OTk3MTYyOH0.VYEvnNvPwOoJAAaCFGrRCTw5dtfGFQnsOUHrO7sxd3s';

  /**
   * Injects the HTTP client.
   * @param client HTTP client to inject
   */
  constructor(private http: HttpClient) { }

  /**
   * Slanje POST zahteva za dohvatanje dogadjaja.
   * @param {Object} data - Objekat sa id dogadjaja
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Event>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  getEvent(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/getEvent`, data, { headers });
  }

  /**
   * Slanje GET zahteva za dohvatanje aktuelnih dogadjaja.
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Event[]>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  getAllActiveEvents(token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get(`${this.uri}/getAllActiveEvents`, { headers });
  }

  /**
   * Slanje POST zahteva za dohvatanje prethodnih dogadjaja za ucesnika.
   * @param {Object} data - Objekat sa korisnickim imenom ucesnika
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Event[]>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  getAllPreviousEventsForParticipant(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/getAllPreviousEventsForParticipant`, data, { headers });
  }

  /**
   * Slanje POST zahteva za dohvatanje aktulenih dogadjaja za organizatora.
   * @param {Object} data - Objekat sa korisnickim imenom organizatora
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Event[]>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  getAllActiveEventsForOrganiser(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/getAllActiveEventsForOrganiser`, data, { headers });
  }

  /**
   * Slanje POST zahteva za dohvatanje prethodnih dogadjaja za organizatora.
   * @param {Object} data - Objekat sa korisnickim imenom organizatora
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Event[]>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  getAllPreviousEventsForOrganiser(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/getAllPreviousEventsForOrganiser`, data, { headers });
  }

  /**
    * Slanje POST zahteva za dohvatanje ucesnika dogadjaja.
    * @param {Object} data - Objekat sa id dogadjaja
    * @param {string} token - Token korisnika za autorizaciju
    * @returns {Observable<Event[]>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
    */
  getEventParticipants(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/getEventParticipants`, data, { headers });
  }


  /**
   * Slanje POST zahteva za kreiranje novog dogadjaja.
   * @param {Object} data - Objekat sa podacima o novom dogadjaju
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Object>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  newEvent(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/newEvent`, data, { headers });
  }

  /**
   * Slanje POST zahteva za otkazivanje dogadjaja.
   * @param {Object} data - Objekat sa id dogadjaja
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Object>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  cancelEvent(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/cancelEvent`, data, { headers });
  }

  /**
   * Slanje POST zahteva za prijavu na dogadjaj.
   * @param {Object} data - Objekat sa id dogadjaja i korisnickim imenom korisnika
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Object>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  applyForEvent(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/applyForEvent`, data, { headers });
  }

  /**
   * Slanje POST zahteva za otkazivanje prijave na dogadjaj.
   * @param {Object} data - Objekat sa id dogadjaja i korisnickim imenom korisnika
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Object>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  cancelApplication(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/cancelApplication`, data, { headers });
  }

  /**
   * Slanje POST zahteva za dodavanje komentara.
   * @param {Object} data - Objekat sa korisnickim imenom korisnika i podacima za komentar
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Object>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  addComment(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/addComment`, data, { headers });
  }

  /**
   * Slanje POST zahteva za dohvatanje dogadjaja za koje je ucesnik duzan.
   * @param {Object} data - Objekat sa korisnickim imenom korisnika
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Event[]>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  findOwingEventsForParticipant(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/findOwingEventsForParticipant`, data, { headers });
  }

  /**
   * Slanje POST zahteva za dohvatanje dogadjaja za koje ucesnici duguju organizatoru.
   * @param {Object} data - Objekat sa korisnickim imenom organizatora
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Event[]>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  findOwingEventsForOrganiser(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/findOwingEventsForOrganiser`, data, { headers });
  }

  /**
   * Slanje POST zahteva za azuriranje placanja.
   * @param {Object} data - Objekat sa id dogadjaja i nizom korisnickih imena
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Object>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  updatePayments(data: Object, token: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/updatePayments`, data, { headers });
  }

}
