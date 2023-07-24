import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

import jwt_decode from "jwt-decode";
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header-logged',
  templateUrl: './header-logged.component.html',
  styleUrls: ['./header-logged.component.css']
})
export class HeaderLoggedComponent implements OnInit {

  /**
   * Injects the API service and Angular Router.
   * @param userService API service to inject
   * @param router Angular Router to inject
   * @param toastr Toastr ToastrService to inject
   */
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  loggedIn: User;

  /**
   * Poziva se pri ucitavanju komponente.
   */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token == null) { // ako korisnik nije ulogovan, vrati ga na pocetnu stranu
      this.router.navigate([""]);
    }
    else {
      try {
        const decodedToken: any = jwt_decode(token);
        const data: Object = { username: decodedToken.username };
        const response: any = await lastValueFrom(this.userService.getUser(data, token));
        this.loggedIn = response;
      } catch (error) {
        this.toastr.info("", error.error["message"], { positionClass: "toast-top-center" });
        this.router.navigate([""]);
      }
    }
  }

}
