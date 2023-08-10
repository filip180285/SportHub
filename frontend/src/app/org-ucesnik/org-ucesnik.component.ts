import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-org-ucesnik',
  templateUrl: './org-ucesnik.component.html',
  styleUrls: ['./org-ucesnik.component.css']
})
export class OrgUcesnikComponent implements OnInit {

  /**
   * Injects the API service and Angular Router.
   * @param userService API service to inject
   * @param router Angular Router to inject
   * @param toastr Toastr ToastrService to inject
   * @param route ActivatedRoute to inject
   */
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService, private route: ActivatedRoute) { }


  user: User;
  username: string

  /**
   * Poziva se pri ucitavanju komponente.
   * @returns {Promise<void>} Promise objekat koji se izvršava kada je komponenta ucitana.
   */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token == null) return;

    try {
      const params = await firstValueFrom(this.route.params);
      this.username = params['username'];
      const data = { username: this.username };
      const response: any = await lastValueFrom(this.userService.getUser(data, token));
      this.user = response;
    } catch (error) {
      console.log(error);
    }
  }
}
