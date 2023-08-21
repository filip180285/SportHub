import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import jwt_decode from "jwt-decode";
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Sport } from 'src/models/sport';
import { User } from 'src/models/user';
import { EventService } from 'src/services/event.service';
import { SportService } from 'src/services/sport.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-organizator-novi-dogadjaj',
  templateUrl: './organizator-novi-dogadjaj.component.html',
  styleUrls: ['./organizator-novi-dogadjaj.component.css']
})
export class OrganizatorNoviDogadjajComponent implements OnInit {

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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.date = this.formatDate(tomorrow);
    this.time = '17:00';
  }

  // ulogovani korisnik
  loggedIn: User;
  // sportovi
  sports: Sport[];

  // podaci o novom dogadjaju
  sport: string = "";
  pollDeadline: number;
  minParticipants: number;
  maxParticipants: number;
  date: string = "";
  dateTimeMS: number;
  time: string;
  location: string = "";
  eventPrice: number;

  // Google autocomplete
  autocomplete: google.maps.places.Autocomplete;


  /**
   * Postavljanje datuma u formi na sutrasnji.
   * @returns {string} Datum
   */
  getMinDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.formatDate(tomorrow);
  }

  /**
   * Postavljanje maksimalnog datuma koji se moze izabrati na 3 nedelje u buducnosti.
   * @returns {string} Datum
   */
  getMaxDate(): string {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 21);
    return this.formatDate(maxDate);
  }

  /**
   * Formatiranje datuma.
   * @param {Date} date - Datum za formatiranje
   * @returns {string} Formatiran datum
   */
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  /**
   * Provera ulaznih vrednosti.
   * @returns {boolean}
   */
  checkInputValues(): boolean {
    if (this.sport == "") {
      this.toastr.error("", "Niste izabrali sport!");
      return false;
    }

    if (this.minParticipants == null || this.minParticipants == undefined || isNaN(this.minParticipants)) {
      this.toastr.error("", "Niste izabrali validan broj za minimalan broj učesnika!");
      return false;
    }

    if (this.maxParticipants == null || this.maxParticipants == undefined || isNaN(this.maxParticipants)) {
      this.toastr.error("", "Niste izabrali validan broj za maksimalan broj učesnika!");
      return false;
    }

    if (this.minParticipants > this.maxParticipants) {
      this.toastr.error("", "Maksimalan broj učesnika mora biti veći od minimalnog!");
      return false;
    }

    if (this.minParticipants > 10 || this.minParticipants < 2 ||
      this.maxParticipants > 50 || this.maxParticipants < 2) {
      this.toastr.error("", "Brojevi učesnika nisu u validnom opsegu!");
      return false;
    }

    if (this.location == "") {
      this.toastr.error("", "Niste uneli lokaciju!");
      return false;
    }

    if (isNaN(this.eventPrice) || this.eventPrice < 0) {
      this.toastr.error("", "Niste izabrali validan broj za cenu!");
      return false;
    }

    return true;
  }


  /**
   * Poziva se pri ucitavanju komponente.
   * @returns {Promise<void>} Promise objekat koji se izvrsava kada je komponenta ucitana.
   */
  async ngOnInit(): Promise<void> {

    /*const datumString:string = "2023-08-29";
    const datum: Date = new Date(datumString);

    const rok: number = datum.setHours(0,0); // rok za prijavu
    const rokMS = rok.valueOf();
    console.log("rok: " + rokMS);

    const termin: number = datum.setHours(17,0); // datum i vreme termina
    const terminMS = termin.valueOf();
    console.log("termin: " + terminMS);

    const testRok = new Date(rokMS);
    console.log("rok datum i vreme: " + testRok);

    const testTermin = new Date(terminMS);
    console.log("termin datum i vreme: " + testTermin);*/

    const token: string = sessionStorage.getItem("token");
    if (token == null) return;

    try {
      const decodedToken: any = jwt_decode(token);
      const data = { username: decodedToken.username };
      // dohvatanje ulogovanog korisnika
      const response: any = await lastValueFrom(this.userService.getUser(data, token));
      this.loggedIn = response;
      // dohvatanje sportova
      const responseSport: any = await lastValueFrom(this.sportService.getAllSports(token));
      this.sports = responseSport;
      // inizijalizacija autocomplete za polje lokacija
      this.initAutocomplete();
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Inicijalizacija autocomplete pri dodavanju lokacije.
  * @returns {void}
  */
  initAutocomplete(): void {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("location") as HTMLInputElement, {
      types: [],
      componentRestrictions: { "country": ["RS"] },
      fields: ["place_id", "geometry", "name", "formatted_address"]
    });
  }

  /**
  * Obrada submit-a forme za dodavanje novog dogadjaja.
  * @returns {Promise<void>} Promise objekat koji se izvrsava kada je operacija zavrsena.
  */
  async newEvent(): Promise<void> {
    if (this.checkInputValues() == false) { return; }

    try {
      const token: string = sessionStorage.getItem("token");
      // rok za prijavu
      const deadline = new Date(this.date);
      deadline.setHours(0, 0);
      this.pollDeadline = deadline.valueOf();
      // vreme dogadjaja
      const dt = new Date(this.date);
      const [hours, minutes] = this.time.split(':').map(Number);
      dt.setHours(hours, minutes);
      this.dateTimeMS = dt.valueOf();
      // podaci
      const data = {
        organiser: this.loggedIn.username,
        name: this.loggedIn.name,
        lastname: this.loggedIn.lastname,
        now: Date.now(),
        sport: this.sport,
        pollDeadline: this.pollDeadline,
        minParticipants: this.minParticipants,
        maxParticipants: this.maxParticipants,
        dateTime: this.dateTimeMS,
        location: this.location,
        eventPrice: this.eventPrice
      };
      const response = await lastValueFrom(this.eventService.newEvent(data, token));
      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });
      this.router.navigate(["organizator"]);
    } catch (error) {
      console.log(error);
      if (error.status == 403) {
        this.toastr.info("", error.error["message"], { positionClass: "toast-top-center" });
        this.router.navigate([""]);
      } else {
        this.toastr.error("", error.error["message"]);
      }
    }
  }

}
