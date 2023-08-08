declare var google: any;

import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/services/user.service';

import { accounts } from 'google-one-tap';
import { environment } from 'src/environments/environment';

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
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService, private ngZone: NgZone) { }

  /**
   * Poziva se pri ucitavanju komponente, cisti session storage.
   */
  ngOnInit(): void {
    // cisti storage
    sessionStorage.clear();
    // inicijalizacija google sign in
    const gAccounts: accounts = google.accounts;
    gAccounts.id.initialize({
      client_id: environment.googleClientId,
      ux_mode: 'popup',
      auto_select: false,
      cancel_on_tap_outside: true,
      callback: ({ credential }) => {
        this.ngZone.run(() => {
          this.googleSignIn(credential);
        });
      },
    });

    setTimeout(() => {
      gAccounts.id.renderButton(document.getElementById('gbtn') as HTMLElement, {
        size: 'large',
        width: 270,
        shape: "pill",
        theme: "filled_blue"
      });
    }, 200);
  }

  /**
  * Obrada prijave preko Google naloga.
  */
  async googleSignIn(token: string): Promise<void> {
    try {
      const data = { token: token };
      const response: any = await lastValueFrom(this.userService.googleSignIn(data));
      console.log(response)

      if (response["token"]) {
        sessionStorage.setItem('token', response["token"]);
        const decodedToken: any = jwt_decode(response["token"]);
        console.log(decodedToken)
        this.router.navigate([`/${decodedToken.role}`]);
      } else if (response.id) {
        this.router.navigate(["dopunaProfil", response.id]);
      }
    } catch (error) {
      console.error(error);
      this.toastr.error("", error.error["message"]);
    }
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
      console.log(error);
      this.toastr.error("", error.error["message"]);
    }
  }


}
