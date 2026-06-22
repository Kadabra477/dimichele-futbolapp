export interface Partido {
  id: number;
  local: string;
  visitante: string;
  golesLocal: number | null;
  golesVisitante: number | null;
  estado: 'Final' | 'Vivo' | string; // Ej: "22:00"
  detallesLocal?: string;
  detallesVisitante?: string;
}

export interface CompetenciaDestacada {
  id: string;
  nombre: string;
  categoria: 'DESTACADO' | 'ARGENTINA' | 'INTERNACIONAL' | 'INGLATERRA' | 'ESPAÑA' | 'ITALIA' | 'ALEMANIA';
  partidos: Partido[];
}