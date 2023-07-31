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

  loggedIn: User;
  sports: Sport[];

  sport: string = "";
  pollDeadline: number;
  minParticipants: number;
  maxParticipants: number;
  date: string = "";
  dateTimeMS: number;
  time: string;
  location: string = "";
  eventPrice: number;

  /**
   * Postavljanje datuma u formi na sutrasnji.
   */
  getMinDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.formatDate(tomorrow);
  }

  /**
   * Postavljanje maksimalnog datuma koji se moze izabrati na 3 nedelje u buducnosti.
   */
  getMaxDate(): string {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 21);
    return this.formatDate(maxDate);
  }

  /**
   * Formatiranje datuma.
   */
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  /**
   * Provera ulaznih vrednosti.
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

    if (isNaN(this.eventPrice)) {
      this.toastr.error("", "Niste izabrali validan broj za cenu!");
      return false;
    }

    return true;
  }


  /**
   * Poziva se pri ucitavanju komponente.
   */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token != null) {
      try {
        const decodedToken: any = jwt_decode(token);
        const data: Object = { username: decodedToken.username };
        // dohvatanje ulogovanog korisnika
        const response: any = await lastValueFrom(this.userService.getUser(data, token));
        this.loggedIn = response;
        // dohvatanje sportova
        const responseSport: any = await lastValueFrom(this.sportService.getAllSports(token));
        this.sports = responseSport;
      } catch (error) {
        console.log(error);
      }
    }
  }

  /**
  * Obrada submit-a forme za dodavanje novog dogadjaja.
  */
  async newEvent(): Promise<void> {
    //if (this.checkInputValues() == false) { return; }

    alert(new Date(1690902000000));
    return;

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
        sport: this.sport,
        pollDeadline: this.pollDeadline,
        minParticipants: this.minParticipants,
        maxParticipants: this.maxParticipants,
        dateTime: this.dateTimeMS,
        location: this.location,
        eventPrice: this.eventPrice
      };
      const response = await lastValueFrom(this.eventService.newEvent(data, token));
      console.log("ovedededededed")
      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });
      this.router.navigate(["organizator"]);
    } catch (error) {
      this.toastr.error("", error.error.message);
      this.router.navigate([""]);
    }

  }

}
