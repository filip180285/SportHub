import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

import jwt_decode from "jwt-decode";
import { User } from 'src/models/user';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-ucesnik',
  templateUrl: './ucesnik.component.html',
  styleUrls: ['./ucesnik.component.css']
})
export class UcesnikComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  loggedIn: User;

  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token == null) { // ako korisnik nije ulogovan, vrati ga na pocetnu stranu
      this.router.navigate([""]);
    }
    else {
      try {
        const decodedToken: any = jwt_decode(token);
        const data:Object = { username: decodedToken.username };
        const response:any = await lastValueFrom(this.userService.getUser(data, token));
        this.loggedIn = response;
      } catch (error) {
        alert(error.error["message"]);
        this.router.navigate([""]);
      }
    }
  }

}
