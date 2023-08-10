import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventService } from 'src/services/event.service';
import { SportService } from 'src/services/sport.service';
import { UserService } from 'src/services/user.service';

import jwt_decode from "jwt-decode";
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { User } from 'src/models/user';
import { Event } from 'src/models/event';

@Component({
  selector: 'app-ucesnik-dogadjaj',
  templateUrl: './ucesnik-dogadjaj.component.html',
  styleUrls: ['./ucesnik-dogadjaj.component.css']
})
export class UcesnikDogadjajComponent implements OnInit {

  /**
 * Injects the API service and Angular Router.
 * @param userService API service to inject
 * @param eventService API service to inject
 * @param sportService API service to inject
 * @param router Angular Router to inject
 * @param toastr Toastr ToastrService to inject
 */
  constructor(private userService: UserService, private eventService: EventService,
    private sportService: SportService, private router: Router, private toastr: ToastrService,
    private route: ActivatedRoute) {
  }

  // ulogovani korisnik
  loggedIn: User;
  // dogadjaj
  id: number;
  event: Event;

  newComment = "";

  /**
   * Poziva se pri ucitavanju komponente.
   * @returns {Promise<void>} Promise objekat koji se izvršava kada je komponenta ucitana.
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
      const params = await firstValueFrom(this.route.params);
      this.id = params['id'];
      const dataEvent = { eventId: this.id };
      const responseEvent: any = await lastValueFrom(this.eventService.getEvent(dataEvent, token));
      this.event = responseEvent;
      console.log(this.event);
      // inicijalizovanje mape
      this.initMap(this.event.location);
    } catch (error) {
      console.log(error);
    }
  }

  // mapa
  map: google.maps.Map;

  /** 
  * Inicijalizacija Google mape
  * @param {string} address - Adresa za prikaz na mapi.
  * @returns {Promise<void>} Promise objekat koji se izvrsava kada je operacija zavrsena.
  */
  async initMap(address: string): Promise<void> {
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    // geocoder pronalazi lat i lng adrese date u vidu stringa
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        // koordinate
        const position = { lat, lng };
        // mapa
        this.map = new Map(
          document.getElementById('map') as HTMLElement,
          {
            zoom: 16,
            center: position,
            mapId: 'DEMO_MAP_ID',
          }
        );
        // marker
        const marker = new AdvancedMarkerElement({
          map: this.map,
          position: position,
          title: 'Lokacija'
        });
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  /**
   * Konvertuje milisekunde u datum i vreme radi prikaza na stranici.
   * @param {number} numOfMs - Datum i vreme u milisekundama
   * @returns {Date} Datum i vreme kao objekat tipa Date
  */
  convertToDate(numOfMs: number) {
    return new Date(numOfMs);
  }

  /**
  * Prijavljivanje za dogadjaj.
  * @returns {Promise<void>} Promise objekat koji se izvršava kada je operacija zavrsena.
  */
  async applyForEvent(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    // novi komentar
    const data: Object = {
      username: this.loggedIn.username,
      eventId: this.id
    }
    try {
      const response = await lastValueFrom(this.eventService.applyForEvent(data, token));
      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });
      this.event.participants.push(this.loggedIn.username);
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

  /**
  * Ponistavanje prijave za dogadjaj.
  * @returns {Promise<void>} Promise objekat koji se izvršava kada je operacija zavrsena.
  */
  async cancelApplication(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    // novi komentar
    const data: Object = {
      username: this.loggedIn.username,
      eventId: this.id
    }
    try {
      const response = await lastValueFrom(this.eventService.cancelApplication(data, token));
      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });
      const index = this.event.participants.indexOf(this.loggedIn.username);
      if (index != -1) {
        this.event.participants.splice(index, 1);
      }
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

  /**
   * Slanje komentara o dogadjaju.
   * @returns {Promise<void>} Promise objekat koji se izvršava kada je operacija zavrsena.
   */
  async sendComment(): Promise<void> {
    if (this.newComment == "") {
      this.toastr.error("", "Ne možete poslati prazan komentar!", { positionClass: "toast-bottom-center" });
      return;
    }
    const token: string = sessionStorage.getItem("token");
    // novi komentar
    const data: Object = {
      username: this.loggedIn.username,
      eventId: this.id,
      name: this.loggedIn.name,
      lastname: this.loggedIn.lastname,
      text: this.newComment,
      datetime: Date.now()
    }
    try {
      const response = await lastValueFrom(this.eventService.addComment(data, token));
      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });

      this.event.comments.push(response["newComment"]);
      this.newComment = "";
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
