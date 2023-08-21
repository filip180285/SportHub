import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

import jwt_decode from "jwt-decode";
import { User } from 'src/models/user';
import { Event } from 'src/models/event';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EventService } from 'src/services/event.service';
import { SportService } from 'src/services/sport.service';

@Component({
  selector: 'app-ucesnik',
  templateUrl: './ucesnik.component.html',
  styleUrls: ['./ucesnik.component.css']
})
export class UcesnikComponent implements OnInit {

  /**
 * Injects the API service and Angular Router.
 * @param userService API service to inject
 * @param eventService API service to inject
 * @param sportService API service to inject
 * @param router Angular Router to inject
 * @param toastr Toastr ToastrService to inject
 */
  constructor(private userService: UserService, private eventService: EventService,
    private sportService: SportService, private router: Router, private toastr: ToastrService) {
  }

  // ulogovani korisnik
  loggedIn: User;
  // aktuelni dogadjaji
  activeEvents: Event[] = [];
  allActiveEvents: Event[] = [];

  /**
   * Poziva se pri ucitavanju komponente.
   * @returns {Promise<void>} Promise objekat koji se izvrsava kada je komponenta ucitana.
   */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token == null) return;

    try {
      const decodedToken: any = jwt_decode(token);
      const data = { username: decodedToken.username };
      // dohvatanje ulogovanog korisnika
      const response: any = await lastValueFrom(this.userService.getUser(data, token));
      this.loggedIn = response;
      // dohvatanje aktuelnih dogadjaja
      const responseActive: any = await lastValueFrom(this.eventService.getAllActiveEvents(token));
      this.activeEvents = responseActive;
      this.allActiveEvents = this.activeEvents;

      //this.getCurrentLocation(); // dohvati sve dogadjaje
    } catch (error) {
      console.log(error);
    }
  }

  selectedRadius: number = -1; // Default vrednost

  /**
 * Dohvatanje trenutne lokacije korisnika.
 * @returns {void}
 */
  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(pos);
        // filtriranje dogadjaja u krugu od maxDistance km ako je pozvana metoda
        // za filtriranje
        if (this.selectedRadius == -1) {
          this.activeEvents = [...this.allActiveEvents];
          return;
        }
        else {
          this.filterEvents(pos);
        }
      });
    } else {
      console.error("Geolocation not supported by this browser.");
    }
  }

  /**
 * Konvretovanje adrese u koordinate latitude i longitude.
 * @param address Adresa od koje treba dobiti koordniate.
 * @returns {Promise<{lat: number; lng: number }>} Promise objekat sa latitudom i longitudom adrese zadate u vidu stringa.
 */
  getLatLngFromAddress(address: string): Promise<{ lat: number; lng: number }> {
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          resolve({ lat, lng });
        } else {
          reject('Geocode was not successful for the following reason: ' + status);
        }
      });
    });
  }

  /**
   * Filtriranje dogadjaja u krugu od 30 kilometara.
   * @param {Object} pos Trenutna lokacija korisnika.
   * @returns {Promise<void>}
   */
  async filterEvents(pos: { lat: number; lng: number }) {
    const geocodePromises: Promise<{ lat: number; lng: number }>[] = this.allActiveEvents.map(event => this.getLatLngFromAddress(event.location));

    const eventLocations = await Promise.all(geocodePromises);

    const filteredEvents = this.allActiveEvents.filter((event, index) => {
      const distance = this.getDistance(pos, eventLocations[index]);
      return distance <= this.selectedRadius * 1000;
    });

    this.activeEvents = filteredEvents;
  }


  /**
 * Racunanje udaljenosti dve lokacije pomocu Haversine formule.
 * @param {Object} location1 Latituda i longituda prve lokacije.
 * @param {Object} location2 Latituda i longituda druge lokacije.
 * @returns {number} Vraca udaljenost izmedju dve lokacije u metrima.
 */
  getDistance(location1: { lat: number; lng: number }, location2: { lat: number; lng: number }): number {
    const rad = (x: number): number => (x * Math.PI) / 180;

    const R = 6378137;
    const dLat = rad(location2.lat - location1.lat);
    const dLng = rad(location2.lng - location1.lng);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(location1.lat)) * Math.cos(rad(location2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  /**
   * Konvertuje milisekunde u datum i vreme radi prikaza na stranici.
   * @param {number} numOfMs - Datum i vreme u milisekundama
   * @returns {Date} Datum i vreme kao objekat tipa Date
   */
  convertToDate(numOfMs: number): Date {
    return new Date(numOfMs);
  }

}
