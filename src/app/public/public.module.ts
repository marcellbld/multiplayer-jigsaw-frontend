import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';



@NgModule({
  declarations: [
    LoginPageComponent,
    RegistrationPageComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule
  ]
})
export class PublicModule { }
