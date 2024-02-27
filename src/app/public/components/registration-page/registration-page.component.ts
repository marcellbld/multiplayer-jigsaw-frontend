import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRequest } from 'src/app/core/auth/models/auth-request.model';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.authService
      .registration(new AuthRequest(this.username.value, this.password.value))
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }
}
