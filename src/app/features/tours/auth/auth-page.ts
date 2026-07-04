import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

function passwordsMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

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

  form = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
    },
    { validators: [] as ValidatorFn[] }
  );

  constructor() {
    this.applyModeValidators();
  }

  private applyModeValidators(): void {
    const emailControl = this.form.controls.email;
    const confirmPasswordControl = this.form.controls.confirmPassword;

    if (this.isLoginMode) {
      emailControl.clearValidators();
      confirmPasswordControl.clearValidators();
      this.form.setValidators([]);
    } else {
      emailControl.setValidators([Validators.required, Validators.email]);
      confirmPasswordControl.setValidators([Validators.required]);
      this.form.setValidators([passwordsMatchValidator()]);
    }

    emailControl.updateValueAndValidity();
    confirmPasswordControl.updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.reset();
    this.applyModeValidators();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, email, password, confirmPassword } = this.form.getRawValue();
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isLoginMode) {
      this.authService.login({ username, password }).subscribe({
        next: () => this.router.navigate(['/tours']),
        error: () => this.errorMessage = 'Invalid username or password.',
      });
    } else {
      this.authService.register({ username, email, password, confirmPassword }).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Please log in.';
          this.isLoginMode = true;
          this.form.reset();
          this.applyModeValidators();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message ?? 'Registration failed.';
        },
      });
    }
  }

  get usernameControl() { return this.form.controls.username; }
  get emailControl() { return this.form.controls.email; }
  get passwordControl() { return this.form.controls.password; }
  get confirmPasswordControl() { return this.form.controls.confirmPassword; }
  get passwordMismatch(): boolean {
    return this.form.hasError('passwordMismatch') && this.confirmPasswordControl.touched;
  }
}