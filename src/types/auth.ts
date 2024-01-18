/**
 * Interface representing Request Body for User Registration.
 */

// "first_name": "Vinicius",
// "last_name": "Fachini",
// "email": "vinicius.fachini01@gmail.com",
// "password": "123",
// "username": "Admin",
// "phone_number": "+55 (18) 99624-8348",
// "date_of_birth": "2001-01-27",
// "role": "admin",
// "cpf": "471.672.838-27",
// "rg": "57.751.232-04"
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  username: string;
  date_of_birth: string;
  cpf: string;
  rg: string;
  role?: string;
  imagePath?: string;
}

/**
 * Interface representing Response Message after User Registration.
 */
export interface RegisterResponse {
  message: string;
}

/**
 * Interface representing Request Body for User Login.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Interface representing User Data returned after successful login.
 */
export interface UserData {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  user_image: string | null;
}

/**
 * Interface representing Response after User Login.
 */
export interface LoginResponse {
  token: string;
  userData: UserData;
  expiresIn: number;
}

/**
 * Interface representing Error Response for Authentication.
 */
export interface AuthErrorResponse {
  error: string;
}
