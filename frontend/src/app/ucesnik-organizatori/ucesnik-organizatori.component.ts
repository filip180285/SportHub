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
      console.log(this.following);
      console.log(this.organisers)
    } catch (error) {
      console.log(error);
    }
  }

  async subscribe(organiser: User): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    const data = {
      username: this.loggedIn.username,
      orgUsername: organiser.username
    };
    try {
      const response = await lastValueFrom(this.userService.subscribe(data, token));
      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });

      // Find the index of the organiser in the organisers array
      const organiserIndex = this.organisers.findIndex((o) => o.username == organiser.username);
      const [removedOrganiser] = this.organisers.splice(organiserIndex, 1);
      this.following.push(removedOrganiser);
    } catch (error) {
      console.log(error);
      this.toastr.error("", error.error["message"]);
    }
  }

  async unsubscribe(organiser: User): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    const data = {
      username: this.loggedIn.username,
      orgUsername: organiser.username
    };
    try {
      const response = await lastValueFrom(this.userService.unsubscribe(data, token));
      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });

      // Find the index of the organiser in the organisers array
      const organiserIndex = this.following.findIndex((o) => o.username == organiser.username);
      const [removedOrganiser] = this.following.splice(organiserIndex, 1);
      this.organisers.push(removedOrganiser);
    } catch (error) {
      console.log(error);
      this.toastr.error("", error.error["message"]);
    }
  }

}
