import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /**
   * Injects the API service and Angular Router.
   * @param api API service to inject
   * @param router Angular Router to inject
   */
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  username: string = "";
  password: string = "";
  message: string = "";

  /**
   * Obrada submit-a forme za prijavu.
   */
  login(): void {
    if (this.username == "" || this.password == "") {
      alert('Niste uneli podatke!');
      return;
    }
    this.userService.login(this.username, this.password).subscribe((user: User) => {
      if (!user) {
        alert('Neispravni kredencijali!');
        return;
      }
      else {
        //alert(korisnik.lozinkaTrajeDo)
        if (user.type == "administrator") {
          // alert('Pogrešan tip!');
          // return;
        }
        localStorage.setItem('ulogovan', JSON.stringify(user));
        if (user.type == "ucesnik") {
          //this.ruter.navigate(['ucesnik']);
        }
        else if (user.type == "organizator") {
          //this.ruter.navigate(['organizator']);
        }
      }
    })
  }


}
