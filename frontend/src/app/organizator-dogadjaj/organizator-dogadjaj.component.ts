import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { User } from 'src/models/user';
import { Event as MyEvent } from 'src/models/event'; // Use the "as" keyword to import your custom Event class
import { EventService } from 'src/services/event.service';
import { SportService } from 'src/services/sport.service';
import { UserService } from 'src/services/user.service';

import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-organizator-dogadjaj',
  templateUrl: './organizator-dogadjaj.component.html',
  styleUrls: ['./organizator-dogadjaj.component.css']
})
export class OrganizatorDogadjajComponent implements OnInit {

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

  loggedIn: User;
  id: number;
  event: MyEvent;
  participants: User[];

  newComment = "";

  /**
    * Poziva se pri ucitavanju komponente.
    */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token == null) return;

    try {
      const decodedToken: any = jwt_decode(token);
      const data: Object = { username: decodedToken.username };
      // dohvatanje ulogovanog korisnika
      const response: any = await lastValueFrom(this.userService.getUser(data, token));
      this.loggedIn = response;
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
    } catch (error) {
      console.log(error);
    }
  }

  map: google.maps.Map;

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
*/
  convertToDate(numOfMs: number) {
    return new Date(numOfMs);
  }

  /**
* Otkazivanje dogadjaja.
*/
  async cancelEvent(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    const data: Object = {
      organiser: this.loggedIn.username,
      eventId: this.id
    }
    try {
      const response = await lastValueFrom(this.eventService.cancelEvent(data, token));
      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });
      this.event.status = "otkazan";
    } catch (error) {
      console.log(error);
      this.toastr.error("", error.error["message"], { positionClass: "toast-top-center" });
    }
  }

  /**
   * Stikliranje polja za placanje.
   */
  paymentUpdate(username: string, event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const isChecked: boolean = target.checked;
    if (isChecked) {
      this.event.paid.push(username);
    } else {
      const index = this.event.paid.indexOf(username);
      if (index != -1) {
        this.event.paid.splice(index, 1);
      }
    }
  }

  /*
    Cuvanje stikliranih placanja
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
      this.toastr.error("", error.error["message"], { positionClass: "toast-top-center" });
    }
  }


    /**
     * Slanje komentara o dogadjaju.
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
      this.toastr.error("", error.error["message"], { positionClass: "toast-top-center" });
    }
  }


}
