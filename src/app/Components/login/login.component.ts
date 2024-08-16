import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginFormGroup!: FormGroup;
  errorMessage: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginFormGroup = this.fb.group({
      username: this.fb.control(''),
      password: this.fb.control(''),
      rememberMe: this.fb.control(false)
    });
  }

  handleLogin() {
    let username = this.loginFormGroup.value.username;
    let password = this.loginFormGroup.value.password;
    this.authService.login(username, password).subscribe({
      next: (appUser) => {
        this.router.navigateByUrl('/admin/dashboard');
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
