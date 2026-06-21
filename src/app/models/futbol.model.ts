export interface EquipoPosicion {
  posicion: number;
  nombre: string;
  escudo: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  pts: number;
}

export interface Competicion {
  id: string;      // Cambiado a string para soportar 'arg_1', 'eng_1', etc.
  nombre: string;
  codigo: string;
  pais: string;    // Agregado para el filtro de Promiedos
  tipo: 'Liga' | 'Copa'; // Agregado para discriminar el formato
  logo: string;
  tabla: EquipoPosicion[]; // Agregado para renderizar las posiciones
}