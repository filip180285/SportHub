import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './register/register.component';
import { TestRouteComponent } from './test-route/test-route.component';
import { UcesnikComponent } from './ucesnik/ucesnik.component';
import { OrganizatorComponent } from './organizator/organizator.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { HeaderLoggedComponent } from './header-logged/header-logged.component';
import { MeniUcesnikComponent } from './meni-ucesnik/meni-ucesnik.component';
import { MeniOrganizatorComponent } from './meni-organizator/meni-organizator.component';
import { MeniAdministratorComponent } from './meni-administrator/meni-administrator.component';
import { AdminOrganizatoriComponent } from './admin-organizatori/admin-organizatori.component';
import { AdminProfilComponent } from './admin-profil/admin-profil.component';
import { AdminAzuriranjeComponent } from './admin-azuriranje/admin-azuriranje.component';
import { AdminPrikazProfilaComponent } from './admin-prikaz-profila/admin-prikaz-profila.component';
import { UcesnikProfilComponent } from './ucesnik-profil/ucesnik-profil.component';
import { OrganizatorProfilComponent } from './organizator-profil/organizator-profil.component';
import { UcesnikAzuriranjeComponent } from './ucesnik-azuriranje/ucesnik-azuriranje.component';
import { OrganizatorAzuriranjeComponent } from './organizator-azuriranje/organizator-azuriranje.component';
import { OrganizatorNoviDogadjajComponent } from './organizator-novi-dogadjaj/organizator-novi-dogadjaj.component';
import { UcesnikOrganizatoriComponent } from './ucesnik-organizatori/ucesnik-organizatori.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    TestRouteComponent,
    UcesnikComponent,
    OrganizatorComponent,
    AdministratorComponent,
    HeaderLoggedComponent,
    MeniUcesnikComponent,
    MeniOrganizatorComponent,
    MeniAdministratorComponent,
    AdminOrganizatoriComponent,
    AdminProfilComponent,
    AdminAzuriranjeComponent,
    AdminPrikazProfilaComponent,
    UcesnikProfilComponent,
    OrganizatorProfilComponent,
    UcesnikAzuriranjeComponent,
    OrganizatorAzuriranjeComponent,
    OrganizatorNoviDogadjajComponent,
    UcesnikOrganizatoriComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass:"toast-bottom-center",
      preventDuplicates: true,
      timeOut:3000,
      closeButton:true   
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
