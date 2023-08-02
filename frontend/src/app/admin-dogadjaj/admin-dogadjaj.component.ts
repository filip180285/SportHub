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
    } catch (error) {
      console.log(error);
    }
  }

  /**
* Konvertuje milisekunde u datum i vreme radi prikaza na stranici.
*/
  convertToDate(numOfMs: number) {
    return new Date(numOfMs);
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


}
