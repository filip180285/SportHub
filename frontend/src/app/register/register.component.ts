import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
   * @param api API service to inject
   * @param router Angular Router to inject
   */
  constructor(private userService: UserService, private router: Router) { }

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
      alert("Izaberite fajl sa validnom ekstenzijom (.png, .jpg, .jpeg).");
      this.picture = null;
    }
  }

  checkInputValues(): boolean {
    // provera da li su unete sve vrednosti
    if (this.name == "" || this.username == "" || this.password == "" ||
      this.lastname == "" || this.phone == "" || this.email == "" ||
      this.type == "") {
      alert("Obavezna polja su ime, prezime , korisničko ime, lozinka, telefon, tip i mejl!");
      return false;
    }

    // provera da li je broj telefona u trazenom formatu
    if (/^\+381 \d{2} \d{7}$/.test(this.phone) == false) {
      alert("Broj telefona nije u dobrom formatu!");
      return false;
    }

    // provera da li je mejl u dobrom formatu
    if (/^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/.test(this.email) == false) {
      alert("Mejl nije u dobrom formatu!");
      return false;
    }

    // provera da li su ime, prezime, korisnicko ime i lozinka duzine do 20 karaktera
    const MAX_LEN: number = 20;
    if (this.name.length > MAX_LEN || this.lastname.length > MAX_LEN ||
      this.username.length > MAX_LEN || this.password.length > MAX_LEN) {
      alert("Polja ime, prezime, korisničko ime i lozinka moraju biti duzine do 20 karaktera!");
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
      phone: this.phone
    };

    try {
      const response = await lastValueFrom(this.userService.register(data));
      if (this.picture != null) {
        const formData = new FormData();
        formData.append('file', this.picture);
        formData.append('username', this.username);
        const responsePicture = await lastValueFrom(this.userService.addPicture(formData));
      }

      alert(response["message"]);
      // preusmeravanje na stranicu za prijavu
      this.router.navigate([""]);
    } catch (error: any) {
      alert(error.error.message);
    }
  }

  async test() {
    try {
      //const response = await lastValueFrom(this.userService.login({"novi", "321"}));
     // alert(response["message"]);
      // alert(response["message2"]);
      // this.router.navigate(['']);
    } catch (error: any) {
      //alert(error.error.message);
      //alert(error.error.message2);
      const statusCode = error?.status;
      alert(statusCode)
      console.log(error.error.message);
    }
  }

}
