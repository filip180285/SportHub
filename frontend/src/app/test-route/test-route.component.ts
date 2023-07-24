import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-test-route',
  templateUrl: './test-route.component.html',
  styleUrls: ['./test-route.component.css']
})
export class TestRouteComponent implements OnInit {

  constructor(private toastr:ToastrService,  private router: Router) { }

  ngOnInit(): void {
    //alert("aas")
    //sessionStorage.clear();
  }

  prikazi(){
    this.toastr.error("", "Uspeh")
    //this.router.navigate([""]);
  }
}
