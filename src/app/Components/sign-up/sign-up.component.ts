import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpFormGroup: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signUpFormGroup = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  handleSignUp() {
    if (this.signUpFormGroup.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez corriger les erreurs dans le formulaire',
        confirmButtonText: 'OK'
      });
      return;
    }

    const newUser: any = this.signUpFormGroup.value;
    this.authService.register(newUser).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response, // Display the plain text response
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Une erreur s\'est produite. Veuillez réessayer.',
          confirmButtonText: 'Réessayer'
        });
        console.error(err);
      }
    });
  }
}
