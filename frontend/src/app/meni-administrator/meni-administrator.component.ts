import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import jwt_decode from "jwt-decode";
import { User } from 'src/models/user';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-meni-administrator',
  templateUrl: './meni-administrator.component.html',
  styleUrls: ['./meni-administrator.component.css']
})
export class MeniAdministratorComponent implements OnInit {

  loggedIn: User;

  /**
   * Injects the API service and Angular Router.
   * @param userService API service to inject
   * @param router Angular Router to inject
   * @param toastr Toastr ToastrService to inject
   */
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  /**
   * Poziva se pri ucitavanju komponente.
   */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token != null) {
      try {
        const decodedToken: any = jwt_decode(token);
        // provera da li ucesnik pristupa stranici i preusmeravanje
        // na odgovarajacu pocetnu stranu ako to nije slucaj
        if (decodedToken.role != "administrator") {
          this.router.navigate([`/${decodedToken.role}`]);
        }
        else {
          const data: Object = { username: decodedToken.username };
          const response: any = await lastValueFrom(this.userService.getUser(data, token));
          this.loggedIn = response;
        }
      } catch (error) {
        console.log(error);
        //this.toastr.error("", error.error["message"], { positionClass: "toast-top-center" });
        //this.router.navigate([""]);
      }
    }
  }

  /**
* Odlazak na pocetnu stranicu za administratora.
*/
  administrator(): void {
    this.router.navigate(["administrator"]);
  }

  /**
* Odlazak na stranicu sa pregledom organizatora.
*/
  organizatori(): void {
    this.router.navigate(["adminOrganizatori"]);
  }

  /**
  * Odlazak na stranicu sa prikazom profila.
  */
  profil(): void {
    this.router.navigate(["adminProfil"]);
  }

  /**
  * Brisanje tokena iz session storage i preusmeravanje na stranicu za prijavu.
  */
  logout(): void {
    sessionStorage.clear();
    this.router.navigate([""]);
  }

}
