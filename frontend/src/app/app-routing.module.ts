import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TestRouteComponent } from './test-route/test-route.component';
import { UcesnikComponent } from './ucesnik/ucesnik.component';
import { OrganizatorComponent } from './organizator/organizator.component';
import { AdministratorComponent } from './administrator/administrator.component';

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "ucesnik", component: UcesnikComponent },
  { path: "organizator", component: OrganizatorComponent },
  { path: "administrator", component: AdministratorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
