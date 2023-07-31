import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/models/user';

import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-admin-profil',
  templateUrl: './admin-profil.component.html',
  styleUrls: ['./admin-profil.component.css']
})
export class AdminProfilComponent implements OnInit {

  /**
 * Injects the API service and Angular Router.
 * @param userService API service to inject
 * @param router Angular Router to inject
 */
  constructor(private userService: UserService, private router: Router) { }

  loggedIn: User;

  /**
   * Poziva se pri ucitavanju komponente.
   */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token == null) return;
    
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
