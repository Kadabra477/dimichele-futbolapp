export interface PartidoFormateado {
  id: number;
  local: string;
  visitante: string;
  escudo_local: string;
  escudo_visitante: string;
  goles_local: number | null;
  goles_visitante: number | null;
  estado: string;
  liga: string;
  pais: string;
  tipo: 'Copa' | 'Liga' | 'Mundial';
}

export interface LigaAgrupada {
  nombreLiga: string;
  paisZona: string;
  partidos: PartidoFormateado[];
}