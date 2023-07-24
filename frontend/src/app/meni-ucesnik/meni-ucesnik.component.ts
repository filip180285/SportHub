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

  loggedIn: User;

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token == null) { // ako korisnik nije ulogovan, vrati ga na pocetnu stranu
      this.router.navigate([""]);
    }
    else {
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
        this.toastr.error("", error.error["message"], { positionClass: "toast-top-center" });
        this.router.navigate([""]);
      }
    }
  }

  /**
 * Brisanje tokena iz session storage i preusmeravanje na stranicu za prijavu.
 */
  logout(): void {
    sessionStorage.clear();
    this.router.navigate([""]);
  }



}
