import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{


  errorMessage: any;

  public loginFormGroup! : FormGroup;
  constructor(private fb : FormBuilder,
              private authService : AuthService,
              private router : Router) {
  }
  ngOnInit() {
    this.loginFormGroup = this.fb.group({
      username : this.fb.control(''),
      password : this.fb.control('')
    });
  }

  login() {
    let username = this.loginFormGroup.value.username;
    let password = this.loginFormGroup.value.password;
    this.authService.login(username, password).subscribe(auth => {
      if(auth){
        console.log(auth);
        this.router.navigateByUrl("/admin/home").then(success => {
          if (!success) {
            console.log('Navigation failed');
          }
        });      }
    });
  }

  public handleLogin() {
    let username = this.loginFormGroup.value.username;
    let password = this.loginFormGroup.value.password;
    this.authService.login(username, password).subscribe({
      next: (appUser) => {
        this.authService.authenticateUser(appUser).subscribe({
          next: (data) => {
            this.router.navigateByUrl('/admin/dashboard');
          },
          error: (err) => {
            this.errorMessage = err;
          }
        });
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

