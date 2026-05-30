import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-page.html',
})
export class AuthPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginMode = true;
  errorMessage = '';
  successMessage = '';

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.reset();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isLoginMode) {
      this.authService.login({ username, password }).subscribe({
        next: () => this.router.navigate(['/tours']),
        error: () => this.errorMessage = 'Invalid username or password.',
      });
    } else {
      this.authService.register({ username, password }).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Please log in.';
          this.isLoginMode = true;
          this.form.reset();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message ?? 'Registration failed.';
        },
      });
    }
  }

  get usernameControl() { return this.form.controls.username; }
  get passwordControl() { return this.form.controls.password; }
}