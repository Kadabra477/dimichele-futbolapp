export interface PartidoReal {
  id: number;
  liga: string;
  pais: string;
  logo_liga: string;
  local: string;
  visitante: string;
  escudo_local: string;
  escudo_visitante: string;
  goles_local: number | null;
  goles_visitante: number | null;
  estado: string;
  detalles_goles?: string;
}

export interface RespuestaPublica {
  partidos: PartidoReal[];
}