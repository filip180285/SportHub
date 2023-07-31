import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

import jwt_decode from "jwt-decode";
import { User } from 'src/models/user';
import { Event } from 'src/models/event';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Sport } from 'src/models/sport';
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

  loggedIn: User;
  sports: Sport[];
  activeEvents: Event[] = [];

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
        // dohvatanje aktuelnih dogadjaja
        const responseActive: any = await lastValueFrom(this.eventService.getAllActiveEvents(token));
        this.activeEvents = responseActive;
      } catch (error) {
        console.log(error);
      }
    }
  }

    /**
   * Konvertuje milisekunde u datum i vreme radi prikaza na stranici.
   */
    convertToDate(numOfMs:number) {
      return new Date(numOfMs);
    }

}
