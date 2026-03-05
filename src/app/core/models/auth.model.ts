export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  username: string;
}
