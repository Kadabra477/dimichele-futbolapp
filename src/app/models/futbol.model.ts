export interface Region {
  id: number;
  nombre: string;
  codigo: string;
  bandera: string | null;
}

export interface Competicion {
  id: number;
  region: Region;
  nombre: string;
  codigo: string;
  emblema: string | null;
  plan: string;
  temporadasDisponibles: number;
  ultimaActualizacion: string;
}

export interface RespuestaFutbol {
  cantidad: number;
  filtros: any;
  competiciones: Competicion[];
}