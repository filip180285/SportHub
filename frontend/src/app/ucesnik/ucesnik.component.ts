import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

import jwt_decode from "jwt-decode";
import { User } from 'src/models/user';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ucesnik',
  templateUrl: './ucesnik.component.html',
  styleUrls: ['./ucesnik.component.css']
})
export class UcesnikComponent implements OnInit {

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
    if (token != null) {
      try {
        const decodedToken: any = jwt_decode(token);
        const data: Object = { username: decodedToken.username };
        const response: any = await lastValueFrom(this.userService.getUser(data, token));
        this.loggedIn = response;
      } catch (error) {
        console.log(error);
      }
    }
  }

}
