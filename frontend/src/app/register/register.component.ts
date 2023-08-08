import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, lastValueFrom } from 'rxjs';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  /**
 * Injects the API service and Angular Router.
 * @param userService API service to inject
 * @param router Angular Router to inject
 * @param toastr Toastr ToastrService to inject
 */
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  /**
   * Poziva se pri ucitavanju komponente.
   */
  ngOnInit(): void {
    sessionStorage.clear();
    // poruka pri ucitavanju stranice za registraciju
    setTimeout(() => {
      alert("Sva polja osim izbora profilne slike(Choose file polje) su obavezna!" + "\n"
        + "Polja ime, prezime, korisničko ime i lozinka moraju biti duzine do 20 karaktera!");
    }, 100);
  }

  username: string = "";
  password: string = "";
  name: string = "";
  lastname: string = "";
  email: string = "";
  phone: string = "";
  type: string = "";
  description: string = "";

  picture: File = null;

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
    // provera da li su unete sve vrednosti
    if (this.name == "" || this.username == "" || this.password == "" ||
      this.lastname == "" || this.phone == "" || this.email == "" ||
      this.type == "") {
      this.toastr.error("", "Obavezna polja su ime, prezime , korisničko ime, lozinka, telefon, tip i mejl!");
      return false;
    }
    
    if(this.type == "organizator" && this.description == "") {
      this.toastr.error("", "Popunite polje za opis profila!");
      return false;
    } 

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

    // provera da li su ime, prezime, korisnicko ime i lozinka duzine do 20 karaktera
    const MAX_LEN: number = 20;
    if (this.name.length > MAX_LEN || this.lastname.length > MAX_LEN ||
      this.username.length > MAX_LEN || this.password.length > MAX_LEN) {
      this.toastr.error("", "Polja ime, prezime, korisničko ime i lozinka moraju biti dužine do 20 karaktera!");
      return false;
    }
    return true;
  }

  /**
  * Obrada submit-a forme za registraciju.
  */
  async sendRegistrationRequest(): Promise<void> {
    // provera da li su sve unete vrednosti validne
    if (this.checkInputValues() == false) { return; }
    // podaci za slanje na backend
    const data = {
      name: this.name,
      lastname: this.lastname,
      username: this.username,
      password: this.password,
      email: this.email,
      type: this.type,
      phone: this.phone,
      description: this.description
    };

    try {
      const response = await lastValueFrom(this.userService.register(data));
      if (this.picture != null) {
        const formData = new FormData();
        formData.append('file', this.picture);
        formData.append('username', this.username);
        const responsePicture = await lastValueFrom(this.userService.addPicture(formData));
      }

      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });
      // preusmeravanje na stranicu za prijavu
      this.router.navigate([""]);
    } catch (error) {
      console.log(error);
      this.toastr.error("", error.error.message);
    }
  }

}
