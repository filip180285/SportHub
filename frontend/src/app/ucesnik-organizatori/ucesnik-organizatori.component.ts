import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/models/user';
import { EventService } from 'src/services/event.service';
import { SportService } from 'src/services/sport.service';
import { UserService } from 'src/services/user.service';

import jwt_decode from "jwt-decode";
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-ucesnik-organizatori',
  templateUrl: './ucesnik-organizatori.component.html',
  styleUrls: ['./ucesnik-organizatori.component.css']
})
export class UcesnikOrganizatoriComponent implements OnInit {

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
  organisers: User[] = [];
  following: User[] = [];

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
      // dohvatanje akitvnih organizatora
      const responseOrganisers: any = await lastValueFrom(this.userService.getAllActiveOrganisers(token));
      this.organisers = responseOrganisers;

      // razdvajanje organizatora na one koji su vec praceni od strane 
      // ucesnika i preostale
      this.following = this.organisers.filter((organiser) => {
        return this.loggedIn.subscriptions.includes(organiser.username);
      });

      this.organisers = this.organisers.filter((organiser) => {
        return !this.loggedIn.subscriptions.includes(organiser.username);
      });
    } catch (error) {
      console.log(error);
    }
  }

}
