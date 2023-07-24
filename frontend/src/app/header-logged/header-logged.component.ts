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

  constructor(private userService: UserService, private router: Router, private toastr:ToastrService) { }

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
        console.log(this.loggedIn)
      } catch (error) {
        this.toastr.error("", error.error["message"], {positionClass: "toast-top-center"});
        this.router.navigate([""]);
      }
    }
  }

}
