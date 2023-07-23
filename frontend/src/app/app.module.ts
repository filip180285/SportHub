import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    MeniAdministratorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
