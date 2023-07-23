import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meni-organizator',
  templateUrl: './meni-organizator.component.html',
  styleUrls: ['./meni-organizator.component.css']
})
export class MeniOrganizatorComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  /**
  * Brisanje tokena iz session storage i preusmeravanje na stranicu za prijavu.
  */
  logout(): void {
    sessionStorage.clear();
    this.router.navigate([""]);
  }

}
