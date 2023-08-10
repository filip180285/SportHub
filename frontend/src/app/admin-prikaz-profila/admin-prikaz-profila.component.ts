import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { User } from 'src/models/user';
import { Event } from 'src/models/event';
import { UserService } from 'src/services/user.service';
import { EventService } from 'src/services/event.service';

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
  constructor(private userService: UserService, private eventService: EventService, private router: Router, private toastr: ToastrService, private route: ActivatedRoute) { }

  // korisnikovi podaci i prethodna ucesca
  user: User;
  username: string;
  events: Event[] = [];
  totalOwing: number = 0;

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
      if (this.user.type == "ucesnik") {
        const responseEvents: any = await lastValueFrom(this.eventService.getAllPreviousEventsForParticipant(data, token));
        this.events = responseEvents;
        this.totalOwing = this.events.reduce((total, event) => {
          if (!event.paid.includes(this.user.username)) {
            total += event.pricePerUser;
          }
          return total;
        }, 0);
      }
      else if (this.user.type == "organizator") {
        const responseEvents: any = await lastValueFrom(this.eventService.getAllPreviousEventsForOrganiser(data, token));
        this.events = responseEvents;
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Poziva se kliku na dugme za brisanje korisnika.
   * @returns {Promise<void>} Promise objekat koji se izvršava kada je komponenta ucitana.
   */
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
    } catch (error) {
      console.log(error);
      if (error.status == 403) {
        this.toastr.info("", error.error["message"], { positionClass: "toast-top-center" });
        this.router.navigate([""]);
      } else {
        this.toastr.error("", error.error["message"]);
      }
    }
  }

  /**
   * Konvertuje milisekunde u datum i vreme radi prikaza na stranici.
   * @param {number} numOfMs - Datum i vreme u milisekundama
   * @returns {Date} Datum i vreme kao objekat tipa Date
    */
  convertToDate(numOfMs: number): Date {
    return new Date(numOfMs);
  }

}
