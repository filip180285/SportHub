import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-admin-organizatori',
  templateUrl: './admin-organizatori.component.html',
  styleUrls: ['./admin-organizatori.component.css']
})
export class AdminOrganizatoriComponent implements OnInit {

    /**
   * Injects the API service and Angular Router.
   * @param userService API service to inject
   * @param router Angular Router to inject
   * @param toastr Toastr ToastrService to inject
   */
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  // svi organizatori u sistemu
  organisers: User[] = [];

  /**
   * Poziva se pri ucitavanju komponente.
   * @returns {Promise<void>} Promise objekat koji se izvršava kada je komponenta ucitana.
   */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token == null) return;
    
      try {
        const response: any = await lastValueFrom(this.userService.getAllOrganisers(token));
        this.organisers = response;
      } catch (error) {
        console.log(error);
        this.toastr.info("", error.error["message"], { positionClass: "toast-top-center" });
        this.router.navigate([""]);
      }
  }
}
