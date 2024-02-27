import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRequest } from 'src/app/core/auth/models/auth-request.model';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required]),
  });

  loginError: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.authService
      .login(new AuthRequest(this.username.value, this.password.value))
      .subscribe({
        next: (res) => {
          this.router.navigate(['/lobby']);
        },
        error: (error) => {
          console.log(error);

          this.loginError = true;
        },
      });
  }

  onInputChange() {
    this.loginError = false;
  }

  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }
}
