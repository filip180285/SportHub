import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-admin-organizatori',
  templateUrl: './admin-organizatori.component.html',
  styleUrls: ['./admin-organizatori.component.css']
})
export class AdminOrganizatoriComponent implements OnInit {

  organisers: User[] = [];

    /**
   * Injects the API service and Angular Router.
   * @param userService API service to inject
   * @param router Angular Router to inject
   */
  constructor(private userService: UserService, private router: Router) { }

  /**
   * Poziva se pri ucitavanju komponente.
   */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token == null) return;
    
      try {
        const response: any = await lastValueFrom(this.userService.getAllOrganisers(token));
        this.organisers = response;
      } catch (error) {
        console.log(error);
      }
  }
}
