export interface PostanteProfile {
  id: number;
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  descripcion?: string;
  carrera?: string;
  institucion?: string;
  egresado?: boolean;
  telefono?: string;
  cvPath?: string;
  fotoPerfil?: string;
}

export interface PostulacionEstado {
  id: number;
  estado: string;
  fechaPostulacion?: string;
  fechaActualizacion?: string;
  motivo?: string;
  postulacion?: {
    id: number;
    titulo: string;
    ubicacion?: string;
    empresa?: string | { nombre?: string };
  };
  postante?: {
    id: number;
    nombres: string;
    apellidos: string;
    email?: string;
    carrera?: string;
    cvPath?: string;
    fotoPerfil?: string;
  };
}

export interface Certificado {
  id: number;
  nombreCurso: string;
  institucionEmisora?: string;
  fechaEmision?: string;
}

export interface Habilidad {
  id: number;
  nombre: string;
  verificada?: boolean;
}
