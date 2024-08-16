import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AppUser } from '../../model/Appuser';

@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent implements OnInit {
  authenticated = false;
  authenticatedUser: AppUser | undefined;

  constructor(public authService: AuthService, private router: Router) {}


  ngOnInit() {
    this.authenticated = this.authService.isAuthenticated();
    if (this.authenticated) {
      this.authService.getAuthenticatedUser().subscribe({
        next: user => this.authenticatedUser = user,
        error: err => {
          console.error('Error fetching authenticated user', err);
          this.authenticatedUser = undefined;
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
