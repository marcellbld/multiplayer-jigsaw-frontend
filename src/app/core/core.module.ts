import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule, RouterModule, HttpClientModule,
    SharedModule
  ],
  exports: [NavBarComponent]
})
export class CoreModule { }
