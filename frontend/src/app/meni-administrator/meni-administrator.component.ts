import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meni-administrator',
  templateUrl: './meni-administrator.component.html',
  styleUrls: ['./meni-administrator.component.css']
})
export class MeniAdministratorComponent implements OnInit {

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
