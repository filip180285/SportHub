import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TestRouteComponent } from './test-route/test-route.component';
import { UcesnikComponent } from './ucesnik/ucesnik.component';
import { OrganizatorComponent } from './organizator/organizator.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { AdminOrganizatoriComponent } from './admin-organizatori/admin-organizatori.component';
import { AdminProfilComponent } from './admin-profil/admin-profil.component';
import { AdminAzuriranjeComponent } from './admin-azuriranje/admin-azuriranje.component';
import { AdminPrikazProfilaComponent } from './admin-prikaz-profila/admin-prikaz-profila.component';

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "test", component: TestRouteComponent },
  { path: "registracija", component: RegisterComponent },
  { path: "ucesnik", component: UcesnikComponent },
  { path: "organizator", component: OrganizatorComponent },
  { path: "administrator", component: AdministratorComponent },
  { path: "adminOrganizatori", component: AdminOrganizatoriComponent },
  { path: "adminProfil", component: AdminProfilComponent },
  { path: "adminAzuriranje", component: AdminAzuriranjeComponent },
  { path: "prikazProfila/:username", component: AdminPrikazProfilaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
