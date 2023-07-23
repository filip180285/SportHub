import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meni-ucesnik',
  templateUrl: './meni-ucesnik.component.html',
  styleUrls: ['./meni-ucesnik.component.css']
})
export class MeniUcesnikComponent implements OnInit {

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
