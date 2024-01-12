/**
 * Interface representing Request Body for User Registration.
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  username: string;
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
  name: string;
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
