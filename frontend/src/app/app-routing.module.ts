import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UcesnikComponent } from './ucesnik/ucesnik.component';
import { OrganizatorComponent } from './organizator/organizator.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { AdminOrganizatoriComponent } from './admin-organizatori/admin-organizatori.component';
import { AdminProfilComponent } from './admin-profil/admin-profil.component';
import { AdminAzuriranjeComponent } from './admin-azuriranje/admin-azuriranje.component';
import { AdminPrikazProfilaComponent } from './admin-prikaz-profila/admin-prikaz-profila.component';
import { UcesnikProfilComponent } from './ucesnik-profil/ucesnik-profil.component';
import { UcesnikAzuriranjeComponent } from './ucesnik-azuriranje/ucesnik-azuriranje.component';
import { OrganizatorProfilComponent } from './organizator-profil/organizator-profil.component';
import { OrganizatorAzuriranjeComponent } from './organizator-azuriranje/organizator-azuriranje.component';
import { OrganizatorNoviDogadjajComponent } from './organizator-novi-dogadjaj/organizator-novi-dogadjaj.component';
import { UcesnikOrganizatoriComponent } from './ucesnik-organizatori/ucesnik-organizatori.component';
import { UcesnikDogadjajComponent } from './ucesnik-dogadjaj/ucesnik-dogadjaj.component';
import { OrganizatorDogadjajComponent } from './organizator-dogadjaj/organizator-dogadjaj.component';
import { OrgUcesnikComponent } from './org-ucesnik/org-ucesnik.component';
import { AdminDogadjajComponent } from './admin-dogadjaj/admin-dogadjaj.component';
import { DopunaProfilComponent } from './dopuna-profil/dopuna-profil.component';

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "registracija", component: RegisterComponent },
  { path: "ucesnik", component: UcesnikComponent },
  { path: "organizator", component: OrganizatorComponent },
  { path: "administrator", component: AdministratorComponent },
  { path: "adminOrganizatori", component: AdminOrganizatoriComponent },
  { path: "adminProfil", component: AdminProfilComponent },
  { path: "adminAzuriranje", component: AdminAzuriranjeComponent },
  { path: "prikazProfila/:username", component: AdminPrikazProfilaComponent },
  { path: "ucesnikProfil", component: UcesnikProfilComponent },
  { path: "ucesnikAzuriranje", component: UcesnikAzuriranjeComponent },
  { path: "organizatorProfil", component: OrganizatorProfilComponent },
  { path: "organizatorAzuriranje", component: OrganizatorAzuriranjeComponent },
  { path: "organizatorNoviDogadjaj", component: OrganizatorNoviDogadjajComponent },
  { path: "ucesnikOrganizatori", component: UcesnikOrganizatoriComponent },
  { path: "ucesnikDogadjaj/:id", component: UcesnikDogadjajComponent },
  { path: "organizatorDogadjaj/:id", component: OrganizatorDogadjajComponent },
  { path: "adminDogadjaj/:id", component: AdminDogadjajComponent },
  { path: "dopunaProfil/:id", component: DopunaProfilComponent },
  { path: "orgUcesnik/:username", component: OrgUcesnikComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
