import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-admin-prikaz-profila',
  templateUrl: './admin-prikaz-profila.component.html',
  styleUrls: ['./admin-prikaz-profila.component.css']
})
export class AdminPrikazProfilaComponent implements OnInit {

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
   */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token != null) {
      try {
        const params = await firstValueFrom(this.route.params);
        this.username = params['username'];
        const data: Object = { username: this.username };
        const response: any = await lastValueFrom(this.userService.getUser(data, token));
        this.user = response;
      } catch (error) {
      }
    }
  }

  async deleteUser(): Promise<void> {
    const data = {
      username: this.username
    };

    try {
      const token: string = sessionStorage.getItem("token");
      const response = await lastValueFrom(this.userService.deleteUser(data, token));

      this.toastr.success("", response["message"], { positionClass: "toast-top-center" });
      // preusmeravanje na stranicu sa pregledom profila
      if (this.user.type == "ucesnik") {
        this.router.navigate(["administrator"]);
      }
      else {
        this.router.navigate(["adminOrganizatori"]);
      }
    } catch (error: any) {
      this.toastr.error("", error.error.message);
      this.router.navigate([""]);
    }
  }

}
