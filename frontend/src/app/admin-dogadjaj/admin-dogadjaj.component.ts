import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom, firstValueFrom } from 'rxjs';
import { User } from 'src/models/user';
import { Event as MyEvent } from 'src/models/event';
import { EventService } from 'src/services/event.service';
import { SportService } from 'src/services/sport.service';
import { UserService } from 'src/services/user.service';

import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-admin-dogadjaj',
  templateUrl: './admin-dogadjaj.component.html',
  styleUrls: ['./admin-dogadjaj.component.css']
})
export class AdminDogadjajComponent implements OnInit {

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

  // podaci o dogadjaju
  id: number;
  event: MyEvent;
  participants: User[];

  // novi komentar i dug prema organizatoru
  newComment = "";
  totalOwing: number = 0;

  /**
   * Poziva se pri ucitavanju komponente.
   * @returns {Promise<void>} Promise objekat koji se izvršava kada je komponenta ucitana.
   */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token == null) return;

    try {
      const decodedToken: any = jwt_decode(token);
      const data: Object = { username: decodedToken.username };
      const params = await firstValueFrom(this.route.params);
      this.id = params['id'];
      const dataEvent: Object = { eventId: this.id };
      // dohvatanje dogadjaja i ucesnika
      const responseEvent: any = await lastValueFrom(this.eventService.getEvent(dataEvent, token));
      this.event = responseEvent;
      const dataUsers: Object = { eventId: this.id };
      // dohvatanje dogadjaja i ucesnika
      const responseParticipants: any = await lastValueFrom(this.eventService.getEventParticipants(dataEvent, token));
      this.participants = responseParticipants;
      console.log(this.participants)
      // inicijalizovanje mape
      this.initMap(this.event.location);
      // racunanje duga
      this.totalOwing = (this.event.participants.length - this.event.paid.length) * this.event.pricePerUser
    } catch (error) {
      console.log(error);
    }
  }

  // mapa
  map: google.maps.Map;

  /** 
  * Inicijalizacija Google mape
  * @param {string} address - Adresa za prikaz na mapi.
  * @returns {Promise<void>} Promise objekat koji se izvršava kada je operacija zavrsena.
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
  convertToDate(numOfMs: number): Date {
    return new Date(numOfMs);
  }

  /**
   * Stikliranje ucesnika koji su platili.
   * @param {string} username - Korisnicko ime ucesnika
   * @param {Event} event Event objekat koji predstavlja stikliranje checkbox-a
   * @returns {void}
  */
  paymentUpdate(username: string, event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const isChecked: boolean = target.checked;
    if (isChecked) {
      this.event.paid.push(username);
      this.totalOwing -= this.event.pricePerUser;
    } else {
      const index = this.event.paid.indexOf(username);
      if (index != -1) {
        this.event.paid.splice(index, 1);
      }
      this.totalOwing += this.event.pricePerUser;
    }
  }

  /**
    Cuvanje stikliranih placanja.
    @returns {Promise<void>} Promise objekat koji se izvršava kada je operacija zavrsena.
  */
  async savePayments(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    const data: Object = {
      eventId: this.id,
      paid: this.event.paid
    }
    try {
      const response = await lastValueFrom(this.eventService.updatePayments(data, token));
      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });
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
