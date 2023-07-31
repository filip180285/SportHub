import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-ucesnik-azuriranje',
  templateUrl: './ucesnik-azuriranje.component.html',
  styleUrls: ['./ucesnik-azuriranje.component.css']
})
export class UcesnikAzuriranjeComponent implements OnInit {

  /**
       * Injects the API service and Angular Router.
       * @param userService API service to inject
       * @param router Angular Router to inject
       * @param toastr Toastr ToastrService to inject
       */
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  loggedIn: User;
  username: string = "";
  email: string = "";
  phone: string = "";

  picture: File = null;

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
      this.email = this.loggedIn.email;
      this.phone = this.loggedIn.phone;
      this.username = this.loggedIn.username;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Obrada dogadjaja select-ovanja fajla.
   * @param {event} Event - event objekat koji predstavlja dogadjaj biranja fajla
   */
  selectImage(event: Event): void {
    if ((event.target as HTMLInputElement).files?.length > 0) {
      const file = (event.target as HTMLInputElement).files[0];
      this.picture = file;
      // provera ispravnosti tipa
      this.validateFileType();
    }
  }

  /**
   * Provera tipa slike
   */
  validateFileType(): void {
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];

    const fileExtension = this.picture.name.slice(this.picture.name.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      this.toastr.error("", "Izaberite fajl sa validnom ekstenzijom (.png, .jpg, .jpeg).");
      this.picture = null;
    }
  }

  checkInputValues(): boolean {
    // provera da li je broj telefona u trazenom formatu
    if (/^\+381 \d{2} \d{7}$/.test(this.phone) == false) {
      this.toastr.error("", "Broj telefona nije u dobrom formatu!");
      return false;
    }

    // provera da li je mejl u dobrom formatu
    if (/^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/.test(this.email) == false) {
      this.toastr.error("", "Mejl nije u dobrom formatu!");
      return false;
    }

    return true;
  }

  /**
  * Obrada submit-a forme za azuriranje korisnickih podataka.
  */
  async updateUserInfo(): Promise<void> {
    // provera da li su sve unete vrednosti validne
    if (this.checkInputValues() == false) { return; }
    // podaci za slanje na backend
    const data = {
      username: this.username,
      email: this.email,
      phone: this.phone
    };

    try {
      const token: string = sessionStorage.getItem("token");
      const response = await lastValueFrom(this.userService.updateUser(data, token));
      if (this.picture != null) {
        const formData = new FormData();
        formData.append('file', this.picture);
        formData.append('username', this.username);
        const responsePicture = await lastValueFrom(this.userService.addPicture(formData));
      }

      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });
      // preusmeravanje na stranicu sa pregledom profila
      this.router.navigate(["ucesnikProfil"]);
    } catch (error: any) {
      console.log(error);
      this.toastr.error("", error.error.message);
      this.router.navigate([""]);
    }
  }
}
