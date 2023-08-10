import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import jwt_decode from "jwt-decode";
import { User } from 'src/models/user';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-meni-ucesnik',
  templateUrl: './meni-ucesnik.component.html',
  styleUrls: ['./meni-ucesnik.component.css']
})
export class MeniUcesnikComponent implements OnInit {

  /**
 * Injects the API service and Angular Router.
 * @param userService API service to inject
 * @param router Angular Router to inject
 * @param toastr Toastr ToastrService to inject
 */
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  // ulogovani korisnik
  loggedIn: User;

  /**
  * Poziva se pri ucitavanju komponente.
  * @returns {Promise<void>} Promise objekat koji se izvršava kada je komponenta ucitana.
  */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token == null) return;

    try {
      const decodedToken: any = jwt_decode(token);
      // provera da li ucesnik pristupa stranici i preusmeravanje
      // na odgovarajacu pocetnu stranu ako to nije slucaj
      if (decodedToken.role != "ucesnik") {
        this.router.navigate([`/${decodedToken.role}`]);
      }
      else {
        const data: Object = { username: decodedToken.username };
        const response: any = await lastValueFrom(this.userService.getUser(data, token));
        this.loggedIn = response;
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Odlazak na stranicu sa profilom ucesnika.
  * @returns {void}
  */
  profil(): void {
    this.router.navigate(["ucesnikProfil"]);
  }

  /**
  * Odlazak na stranicu za pregled organizatora.
  * @returns {void}
  */
  organizatori(): void {
    this.router.navigate(["ucesnikOrganizatori"]);
  }

  /**
  * Odlazak na stranicu za pregled organizatora.
  * @returns {void}
  */
  ucesnik(): void {
    this.router.navigate(["ucesnik"]);
  }

  /**
   * Brisanje tokena iz session storage i preusmeravanje na stranicu za prijavu.
   * @returns {void}
   */
  logout(): void {
    sessionStorage.clear();
    this.router.navigate([""]);
  }

}
