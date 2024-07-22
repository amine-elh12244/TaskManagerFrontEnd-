import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent implements OnInit{
  authenticated = false;


  constructor(public authService : AuthService , private router : Router) {
  }
  ngOnInit() {
    this.authenticated = this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');  // Correction ici : utiliser un tableau pour spécifier le chemin

  }
}
