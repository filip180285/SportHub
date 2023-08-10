import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { EventService } from 'src/services/event.service';
import { SportService } from 'src/services/sport.service';
import { UserService } from 'src/services/user.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-dopuna-profil',
  templateUrl: './dopuna-profil.component.html',
  styleUrls: ['./dopuna-profil.component.css']
})
export class DopunaProfilComponent implements OnInit {

  /**
    * Injects the API service and Angular Router.
    * @param userService API service to inject
    * @param eventService API service to inject
    * @param sportService API service to inject
    * @param router Angular Router to inject
    * @param toastr Toastr ToastrService to inject
    */
  constructor(private userService: UserService, private eventService: EventService,
    private sportService: SportService, private router: Router, private toastr: ToastrService,
    private route: ActivatedRoute) {
  }

  /**
   * Poziva se pri ucitavanju komponente.
   * @returns {Promise<void>} Promise objekat koji se izvršava kada je komponenta ucitana.
   */
  async ngOnInit(): Promise<void> {
    setTimeout(() => {
      alert("Dopunite profil popunjavanjem preostalih polja!");
    }, 100);

    const params = await firstValueFrom(this.route.params);
    this.id = params['id'];
  }

  // podaci
  id: number;
  phone: string = "";
  type: string = "";
  description: string = "";

  /**
   * Provera unetih podataka
   * @returns {boolean}
   */
  checkInputValues(): boolean {
    // provera da li su unete sve vrednosti
    if (this.phone == "" || this.type == "") {
      this.toastr.error("", "Popunite preostala polja!");
      return false;
    }

    if (this.type == "organizator" && this.description == "") {
      this.toastr.error("", "Popunite polje za opis profila!");
      return false;
    }

    // provera da li je broj telefona u trazenom formatu
    if (/^\+381 \d{2} \d{7}$/.test(this.phone) == false) {
      this.toastr.error("", "Broj telefona nije u dobrom formatu!");
      return false;
    }

    return true;
  }

  /**
  * Obrada submit-a forme za dopunu korisnickog profila.
  * @returns {Promise<void>} Promise objekat koji se izvršava kada je operacija završena.
  */
  async finishGoogleSignIn(): Promise<void> {
    // provera da li su sve unete vrednosti validne
    if (this.checkInputValues() == false) { return; }
    // podaci za slanje na backend
    const data = {
      id: this.id,
      type: this.type,
      phone: this.phone,
      description: this.description
    };

    try {
      const response = await lastValueFrom(this.userService.finishGoogleSignIn(data));

      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });
      sessionStorage.setItem('token', response["token"]);
      const decodedToken: any = jwt_decode(response["token"]);
      this.router.navigate([`/${decodedToken.role}`]);
    } catch (error) {
      console.log(error);
      this.toastr.error("", error.error.message);
    }
  }
}
