import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/services/user.service';

import jwt_decode from "jwt-decode";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /**
   * Injects the API service and Angular Router.
   * @param userService API service to inject
   * @param router Angular Router to inject
   * @param toastr Toastr ToastrService to inject
   */
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  /**
   * Poziva se pri ucitavanju komponente, cisti session storage.
   */
  ngOnInit(): void {
    sessionStorage.clear();
  }

  username: string = "";
  password: string = "";

  /**
   * Obrada submit-a forme za prijavu.
   */
  async login(): Promise<void> {
    if (this.username == "" || this.password == "") {
      this.toastr.error("", "Unesite kredencijale!");
      return;
    }
    // poziv ka backend-u sa kredencijalima
    try {
      const data = {
        username: this.username,
        password: this.password
      };
      const response = await lastValueFrom(this.userService.login(data));
      sessionStorage.setItem('token', response["token"]);
      const decodedToken: any = jwt_decode(response["token"]);
      this.router.navigate([`/${decodedToken.role}`]);
    } catch (error) {
      this.toastr.error("", error.error["message"]);
    }
  }


}
