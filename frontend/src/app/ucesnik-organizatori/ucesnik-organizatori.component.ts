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

  // ulogovani korisnik
  loggedIn: User;
  // organizatori
  organisers: User[] = [];
  // pracenja
  following: User[] = [];

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

  /**
  * Invertovanje flega za prikaz punog opisa organizatora
  * @param {User} organiser - Organizator ciji se fleg menja.
  * @returns {void} 
  */
  invertDescFlag(organiser: User): void {
    organiser.showFullDesc = !organiser.showFullDesc;
  }

  /**
    * Pracenje organizatora od strane korisnika
    * @param {User} organiser - Organizator koga korisnik zapracuje.
    * @returns {Promise<void>} Promise objekat koji se izvršava kada je operacija zavrsena.
    */
  async subscribe(organiser: User): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    const data = {
      username: this.loggedIn.username,
      orgUsername: organiser.username
    };
    try {
      const response = await lastValueFrom(this.userService.subscribe(data, token));
      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });

      // dodaj u niz following, ukloni iz niza organizatora
      const organiserIndex = this.organisers.findIndex((o) => o.username == organiser.username);
      const [removedOrganiser] = this.organisers.splice(organiserIndex, 1);
      removedOrganiser.showFullDesc = false;
      this.following.push(removedOrganiser);
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
  * Pracenje organizatora od strane korisnika
  * @param {User} organiser - Organizator koga korisnik otpracuje.
  * @returns {Promise<void>} Promise objekat koji se izvršava kada je operacija zavrsena.
  */
  async unsubscribe(organiser: User): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    const data = {
      username: this.loggedIn.username,
      orgUsername: organiser.username
    };
    try {
      const response = await lastValueFrom(this.userService.unsubscribe(data, token));
      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });
      // dodaj u niz organizatora, ukloni iz niza following
      const organiserIndex = this.following.findIndex((o) => o.username == organiser.username);
      const [removedOrganiser] = this.following.splice(organiserIndex, 1);
      removedOrganiser.showFullDesc = false;
      this.organisers.push(removedOrganiser);
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
