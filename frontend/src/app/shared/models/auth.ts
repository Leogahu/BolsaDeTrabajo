export interface LoginRequest {
  email: string;
  password:  string;
}
export interface AuthResponse {
  token: string;
  role: string;
  email: string;
}
export interface UserSession {
  isLogged: boolean;
  userType: 'postante' | 'reclutador' | null;
  user: {
    id: number;
    nombres: string;
    apellidos: string;
    nombreCompleto: string;
    email: string;
    username: string;
    empresa?: string;
    fotoPerfil?: string;
  } | null;
}