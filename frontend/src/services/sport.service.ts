import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SportService {

  uri = 'http://localhost:4000/sports';
  //private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJ1c2VybmFtZSI6Im5vdmkiLCJuYW1lIjoibm92aSIsImxhc3RuYW1lIjoibm92aSIsInVzZXJUeXBlIjoib3JnYW5pemF0b3IiLCJpYXQiOjE2ODk5NjgwMjgsImV4cCI6MTY4OTk3MTYyOH0.VYEvnNvPwOoJAAaCFGrRCTw5dtfGFQnsOUHrO7sxd3s';

  /**
   * Injects the HTTP client.
   * @param client HTTP client to inject
   */
  constructor(private http: HttpClient) { }

  /**
   * Slanje GET zahteva za dohvatanje sportova.
   * @param {string} token - Token korisnika za autorizaciju
   * @returns {Observable<Sport[]>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  getAllSports(token: string): Observable<Object>  {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get(`${this.uri}/getAllSports`, { headers });
  }
  
}
